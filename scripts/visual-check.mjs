import { spawn } from 'node:child_process';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  comparePercent,
  compactError,
  formatSigned,
  parseArgs,
  percent,
  readAcceptedBaseline,
  readMetric,
  resolveScreen,
  visualTempRoot,
} from './visual-utils.mjs';

const args = parseArgs(process.argv.slice(2));

if (args['self-test']) {
  const cases = [
    [12.000, 12.615, 'IMPROVED'],
    [12.615, 12.615, 'UNCHANGED'],
    [15.867, 12.615, 'REGRESSED'],
  ];
  for (const [current, baseline, expected] of cases) {
    const actual = comparePercent(current, baseline).result;
    if (actual !== expected) throw new Error(`Self-test failed: ${current} vs ${baseline}: ${actual} != ${expected}`);
  }
  console.log('visual-check self-test: PASS');
  process.exit(0);
}

const alias = args.positional[0];
if (!alias) {
  console.error('Usage: node scripts/visual-check.mjs <dashboard|boot|threat|ddos|offline> [--baseline=12.615]');
  process.exit(2);
}

let screen;
try { screen = resolveScreen(alias); } catch (error) {
  console.error(error.message);
  process.exit(2);
}

const root = process.cwd();
const baseURL = String(args['base-url'] ?? process.env.CYB3R_SOC_BASE_URL ?? 'http://127.0.0.1:4173');
const targetDir = process.env.CYB3R_SOC_TARGET_DIR ?? 'Cyb3r_Soc_References_1to1';
const tempRoot = visualTempRoot(alias);
const tempCurrent = path.join(tempRoot, 'current');
const tempRepeat = path.join(tempRoot, 'repeat');
const tempDiff = path.join(tempRoot, 'diffs');

let baselinePct = null;
if (args.baseline !== undefined) {
  baselinePct = Number(args.baseline);
  if (!Number.isFinite(baselinePct)) {
    console.error(`Invalid --baseline value: ${args.baseline}`);
    process.exit(2);
  }
} else {
  const accepted = await readAcceptedBaseline(root, screen.file);
  if (accepted) baselinePct = percent(accepted);
}

if (!args['skip-server-check']) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(args['server-timeout'] ?? 2500));
  try { await fetch(baseURL, { method: 'GET', signal: controller.signal }); }
  catch {
    clearTimeout(timeout);
    console.log(`VISUAL: ${screen.label}`);
    console.log('STATUS: SERVER_UNAVAILABLE');
    console.log(`URL: ${baseURL}`);
    console.log('ACTION: npm run visual:dev');
    process.exit(2);
  }
  clearTimeout(timeout);
}

await rm(tempRoot, { recursive: true, force: true });
await Promise.all([
  mkdir(tempCurrent, { recursive: true }),
  mkdir(tempRepeat, { recursive: true }),
  mkdir(tempDiff, { recursive: true }),
]);

const captureScript = path.join(root, 'scripts', 'capture-visuals.mjs');
const childEnv = {
  ...process.env,
  CYB3R_SOC_BASE_URL: baseURL,
  CYB3R_SOC_SCREENS: screen.file,
  CYB3R_SOC_SCREENSHOT_DIR: tempCurrent,
  CYB3R_SOC_REPEAT_DIR: tempRepeat,
  CYB3R_SOC_DIFF_DIR: tempDiff,
  CYB3R_SOC_TARGET_DIR: targetDir,
};

const childResult = await new Promise(resolve => {
  const child = spawn(process.execPath, [captureScript], { cwd: root, env: childEnv, windowsHide: true });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', chunk => { stdout += chunk.toString(); });
  child.stderr.on('data', chunk => { stderr += chunk.toString(); });
  child.on('error', error => resolve({ code: 2, stdout, stderr: `${stderr}\n${error.message}` }));
  child.on('close', code => resolve({ code: code ?? 2, stdout, stderr }));
});

if (childResult.code !== 0) {
  console.log(`VISUAL: ${screen.label}`);
  console.log('STATUS: CAPTURE_ERROR');
  const detail = compactError(`${childResult.stderr}\n${childResult.stdout}`);
  if (detail) console.log(`DETAIL: ${detail}`);
  process.exit(2);
}

const tempMetricsPath = path.join(tempDiff, 'metrics.json');
let currentMetric;
try {
  currentMetric = await readMetric(tempMetricsPath, screen.file);
  if (!currentMetric) throw new Error('metric missing after capture');
} catch (error) {
  console.log(`VISUAL: ${screen.label}`);
  console.log('STATUS: METRIC_ERROR');
  console.log(`DETAIL: ${compactError(error.message)}`);
  process.exit(2);
}

const currentPct = percent(currentMetric);
console.log(`VISUAL: ${screen.label}`);

if (baselinePct === null) {
  console.log('STATUS: BASELINE_MISSING');
  console.log(`CURRENT: ${currentPct.toFixed(3)}%`);
  console.log('ACTION: npm run visual:baseline -- ' + alias + ' --from-last');
  process.exit(3);
}

const comparison = comparePercent(currentPct, baselinePct);
console.log(`BASELINE: ${baselinePct.toFixed(3)}%`);
console.log(`CURRENT: ${currentPct.toFixed(3)}%`);
console.log(`DELTA: ${formatSigned(comparison.delta)}`);
console.log(`RESULT: ${comparison.result}`);
if (comparison.result === 'IMPROVED') console.log(`CURRENT_FILE: ${path.join(tempCurrent, screen.file)}`);
process.exit(comparison.exitCode);
