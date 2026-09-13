import path from 'node:path';
import process from 'node:process';
import {
  acceptedBaselinesPath,
  parseArgs,
  percent,
  readMetric,
  resolveScreen,
  visualTempRoot,
  writeAcceptedBaseline,
} from './visual-utils.mjs';

const args = parseArgs(process.argv.slice(2));
const alias = args.positional[0];
if (!alias) {
  console.error('Usage: node scripts/visual-baseline.mjs <dashboard|boot|threat|ddos|offline> --from-last');
  process.exit(2);
}

let screen;
try { screen = resolveScreen(alias); } catch (error) {
  console.error(error.message);
  process.exit(2);
}

if (!args['from-last']) {
  console.log(`BASELINE: ${screen.label}`);
  console.log('STATUS: REFUSED');
  console.log('ACTION: run a clean-state visual check, then use --from-last explicitly');
  process.exit(2);
}

const root = process.cwd();
const tempMetricsPath = path.join(visualTempRoot(alias), 'diffs', 'metrics.json');
let metric;
try {
  metric = await readMetric(tempMetricsPath, screen.file);
  if (!metric) throw new Error('last trial metric not found');
} catch (error) {
  console.log(`BASELINE: ${screen.label}`);
  console.log('STATUS: MISSING_LAST_TRIAL');
  console.log(`DETAIL: ${error.message}`);
  console.log(`ACTION: npm run visual:${alias}`);
  process.exit(2);
}

const baselinePath = await writeAcceptedBaseline(root, screen.file, metric);
console.log(`BASELINE: ${screen.label}`);
console.log(`VALUE: ${percent(metric).toFixed(3)}%`);
console.log('STATUS: SEEDED_FROM_LAST_TRIAL');
console.log(`FILE: ${path.relative(root, baselinePath)}`);
