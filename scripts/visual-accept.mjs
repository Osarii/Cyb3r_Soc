import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  comparePercent,
  parseArgs,
  percent,
  readAcceptedBaseline,
  readMetric,
  resolveScreen,
  visualTempRoot,
  writeAcceptedBaseline,
} from './visual-utils.mjs';

const args = parseArgs(process.argv.slice(2));
const alias = args.positional[0];
if (!alias) {
  console.error('Usage: node scripts/visual-accept.mjs <dashboard|boot|threat|ddos|offline>');
  process.exit(2);
}

let screen;
try { screen = resolveScreen(alias); } catch (error) {
  console.error(error.message);
  process.exit(2);
}

const root = process.cwd();
const tempRoot = visualTempRoot(alias);
const tempMetricsPath = path.join(tempRoot, 'diffs', 'metrics.json');
const canonicalCurrentDir = path.join(root, 'tests', 'visual', 'current');
const canonicalRepeatDir = path.join(root, 'tests', 'visual', 'repeat');
const canonicalDiffDir = path.join(root, 'tests', 'visual', 'diffs');
const canonicalMetricsPath = path.join(canonicalDiffDir, 'metrics.json');

let trialMetric;
let baselineMetric;
try {
  trialMetric = await readMetric(tempMetricsPath, screen.file);
  baselineMetric = await readAcceptedBaseline(root, screen.file);
  if (!trialMetric || !baselineMetric) throw new Error('Missing trial or accepted baseline metric');
} catch (error) {
  console.log(`ACCEPT: ${screen.label}`);
  console.log('STATUS: MISSING_METRIC');
  console.log(`DETAIL: ${error.message}`);
  process.exit(2);
}

const trialPct = percent(trialMetric);
const baselinePct = percent(baselineMetric);
const comparison = comparePercent(trialPct, baselinePct);
if (comparison.result !== 'IMPROVED') {
  console.log(`ACCEPT: ${screen.label}`);
  console.log(`STATUS: REFUSED_${comparison.result}`);
  console.log(`BASELINE: ${baselinePct.toFixed(3)}%`);
  console.log(`CURRENT: ${trialPct.toFixed(3)}%`);
  process.exit(1);
}

await Promise.all([
  mkdir(canonicalCurrentDir, { recursive: true }),
  mkdir(canonicalRepeatDir, { recursive: true }),
  mkdir(canonicalDiffDir, { recursive: true }),
]);

const trialCurrent = path.join(tempRoot, 'current', screen.file);
const trialRepeat = path.join(tempRoot, 'repeat', screen.file);
const trialDiff = trialMetric.diff;
const canonicalCurrent = path.join(canonicalCurrentDir, screen.file);
const canonicalRepeat = path.join(canonicalRepeatDir, screen.file);
const canonicalDiff = path.join(canonicalDiffDir, path.basename(trialDiff));

await copyFile(trialCurrent, canonicalCurrent);
await copyFile(trialRepeat, canonicalRepeat);
await copyFile(trialDiff, canonicalDiff);

let canonical = { screens: [] };
try { canonical = JSON.parse(await readFile(canonicalMetricsPath, 'utf8')); } catch {}
const screens = Array.isArray(canonical.screens) ? canonical.screens : [];
const nextMetric = {
  ...trialMetric,
  current: path.relative(root, canonicalCurrent),
  repeat: path.relative(root, canonicalRepeat),
  diff: path.relative(root, canonicalDiff),
};
const index = screens.findIndex(metric => metric.screen === screen.file);
if (index >= 0) screens[index] = nextMetric;
else screens.push(nextMetric);
canonical.screens = screens;
await writeFile(canonicalMetricsPath, `${JSON.stringify(canonical, null, 2)}\n`);
await writeAcceptedBaseline(root, screen.file, nextMetric);

console.log(`ACCEPT: ${screen.label}`);
console.log(`BASELINE: ${baselinePct.toFixed(3)}%`);
console.log(`CURRENT: ${trialPct.toFixed(3)}%`);
console.log('STATUS: ACCEPTED_WITHOUT_RECAPTURE');
