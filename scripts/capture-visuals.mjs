import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.CYB3R_SOC_BASE_URL ?? 'http://127.0.0.1:4173';
const outputDir = process.env.CYB3R_SOC_SCREENSHOT_DIR ?? 'tests/visual/current';
const repeatDir = process.env.CYB3R_SOC_REPEAT_DIR ?? 'tests/visual/repeat';
const diffDir = process.env.CYB3R_SOC_DIFF_DIR ?? 'tests/visual/diffs';
const targetDir = process.env.CYB3R_SOC_TARGET_DIR ?? 'Cyb3r_Soc_References_1to1';
const pixelThreshold = Number(process.env.CYB3R_SOC_PIXEL_THRESHOLD ?? 0.1);

const allScreens = [
  { name: '01-dashboard.png', path: '/dashboard?visualTest=true' },
  { name: '02-boot-screen.png', path: '/boot-preview?visualTest=true' },
  { name: '03-threat-map.png', path: '/threat-map?visualTest=true' },
  { name: '04-ddos-mitigation.png', path: '/incidents/INC-2024-7781/mitigation?visualTest=true' },
  { name: '05-server-offline.png', path: '/offline?visualTest=true' },
];
const requestedScreens = process.env.CYB3R_SOC_SCREENS?.split(',').map(value => value.trim()).filter(Boolean);
const screens = requestedScreens?.length ? allScreens.filter(screen => requestedScreens.includes(screen.name)) : allScreens;
if (!screens.length) throw new Error('No visual screens selected. Use exact PNG filenames in CYB3R_SOC_SCREENS.');

await mkdir(outputDir, { recursive: true });
await mkdir(repeatDir, { recursive: true });
await mkdir(diffDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1672, height: 941 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  reducedMotion: 'reduce',
  locale: 'es-CR',
  timezoneId: 'America/Costa_Rica',
});

await context.addInitScript(() => {
  window.sessionStorage.setItem('cyb3r_soc_initialized', 'true');
  const fixedNow = new Date('2024-04-23T10:24:17Z').valueOf();
  Date.now = () => fixedNow;
  Math.random = () => 0.4172;
});

const metricsPath = path.join(diffDir, 'metrics.json');
const previousMetrics = await readFile(metricsPath, 'utf8').then(JSON.parse).catch(() => ({ screens: [] }));
const metricsByScreen = new Map(previousMetrics.screens?.map(metric => [metric.screen, metric]) ?? []);

for (const screen of screens) {
  const page = await context.newPage();
  await page.goto(`${baseURL}${screen.path}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete));
  await page.addStyleTag({
    content: '*,:before,:after{animation-play-state:paused!important;transition:none!important}',
  });
  await page.screenshot({
    path: path.join(outputDir, screen.name),
    animations: 'disabled',
    fullPage: false,
  });
  const repeatPath = path.join(repeatDir, screen.name);
  await page.screenshot({ path: repeatPath, animations: 'disabled', fullPage: false });
  const [first, second] = await Promise.all([readFile(path.join(outputDir, screen.name)), readFile(repeatPath)]);
  if (!first.equals(second)) throw new Error(`Non-deterministic visual capture: ${screen.name}`);
  const targetImage = await readFile(path.join(targetDir, screen.name));
  const diffPath = path.join(diffDir, `${screen.name.replace(/^\d+-/, '').replace('.png', '')}-diff.png`);
  const comparison = await page.evaluate(async ({ targetUrl, currentUrl, threshold }) => {
    const load = src => new Promise((resolveImage, rejectImage) => {
      const image = new Image();
      image.onload = () => resolveImage(image);
      image.onerror = () => rejectImage(new Error(`Could not load ${src}`));
      image.src = src;
    });
    const [target, current] = await Promise.all([load(targetUrl), load(currentUrl)]);
    if (target.width !== current.width || target.height !== current.height) throw new Error(`Dimension mismatch: ${target.width}x${target.height} vs ${current.width}x${current.height}`);
    const canvas = document.createElement('canvas');
    canvas.width = target.width;
    canvas.height = target.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(target, 0, 0);
    const targetPixels = context.getImageData(0, 0, canvas.width, canvas.height);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(current, 0, 0);
    const currentPixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const diffPixels = context.createImageData(canvas.width, canvas.height);
    let differentPixels = 0;
    for (let index = 0; index < targetPixels.data.length; index += 4) {
      const channelDelta = Math.max(
        Math.abs(targetPixels.data[index] - currentPixels.data[index]),
        Math.abs(targetPixels.data[index + 1] - currentPixels.data[index + 1]),
        Math.abs(targetPixels.data[index + 2] - currentPixels.data[index + 2]),
        Math.abs(targetPixels.data[index + 3] - currentPixels.data[index + 3]),
      ) / 255;
      if (channelDelta > threshold) {
        differentPixels += 1;
        diffPixels.data[index] = 255;
        diffPixels.data[index + 1] = Math.round(36 * (1 - Math.min(channelDelta, 1)));
        diffPixels.data[index + 2] = 62;
        diffPixels.data[index + 3] = 255;
      } else {
        const luminance = Math.round((targetPixels.data[index] * .2126 + targetPixels.data[index + 1] * .7152 + targetPixels.data[index + 2] * .0722) * .22);
        diffPixels.data[index] = luminance;
        diffPixels.data[index + 1] = luminance;
        diffPixels.data[index + 2] = luminance;
        diffPixels.data[index + 3] = 255;
      }
    }
    context.putImageData(diffPixels, 0, 0);
    const blob = await new Promise(resolveBlob => canvas.toBlob(resolveBlob, 'image/png'));
    const buffer = await blob.arrayBuffer();
    return { width: canvas.width, height: canvas.height, totalPixels: canvas.width * canvas.height, differentPixels, diffRatio: differentPixels / (canvas.width * canvas.height), png: Array.from(new Uint8Array(buffer)) };
  }, {
    targetUrl: `data:image/png;base64,${targetImage.toString('base64')}`,
    currentUrl: `data:image/png;base64,${first.toString('base64')}`,
    threshold: pixelThreshold,
  });
  await writeFile(diffPath, Buffer.from(comparison.png));
  metricsByScreen.set(screen.name, { screen: screen.name, width: comparison.width, height: comparison.height, totalPixels: comparison.totalPixels, differentPixels: comparison.differentPixels, diffRatio: comparison.diffRatio, pixelThreshold, target: path.join(targetDir, screen.name), current: path.join(outputDir, screen.name), repeat: repeatPath, diff: diffPath });
  await page.close();
}

await browser.close();
const allMetrics = allScreens.map(screen => metricsByScreen.get(screen.name)).filter(Boolean);
await writeFile(metricsPath, `${JSON.stringify({ targetDir, outputDir, repeatDir, diffDir, pixelThreshold, screens: allMetrics }, null, 2)}\n`);
for (const metric of screens.map(screen => metricsByScreen.get(screen.name))) console.log(`${metric.screen}: ${metric.differentPixels}/${metric.totalPixels} pixels (${(metric.diffRatio * 100).toFixed(3)}%)`);
