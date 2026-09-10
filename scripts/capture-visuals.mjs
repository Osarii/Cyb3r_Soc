import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.CYB3R_SOC_BASE_URL ?? 'http://127.0.0.1:4173';
const outputDir = process.env.CYB3R_SOC_SCREENSHOT_DIR ?? 'docs/visual-current';

const screens = [
  { name: '01-dashboard.png', path: '/dashboard?visualTest=true' },
  { name: '02-boot-screen.png', path: '/boot-preview?visualTest=true' },
  { name: '03-threat-map.png', path: '/threat-map?visualTest=true' },
  { name: '04-ddos-mitigation.png', path: '/incidents/INC-2024-7781/mitigation?visualTest=true' },
  { name: '05-server-offline.png', path: '/offline?visualTest=true' },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1672, height: 941 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  reducedMotion: 'reduce',
});

await context.addInitScript(() => {
  window.sessionStorage.setItem('cyb3r_soc_initialized', 'true');
  const fixedNow = new Date('2024-04-23T10:24:17Z').valueOf();
  Date.now = () => fixedNow;
  Math.random = () => 0.4172;
});

for (const screen of screens) {
  const page = await context.newPage();
  await page.goto(`${baseURL}${screen.path}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: '*,:before,:after{animation-play-state:paused!important;transition:none!important}',
  });
  await page.screenshot({
    path: path.join(outputDir, screen.name),
    animations: 'disabled',
    fullPage: false,
  });
  await page.close();
}

await browser.close();
