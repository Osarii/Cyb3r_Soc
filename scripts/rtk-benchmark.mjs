import { spawn } from 'node:child_process';
import process from 'node:process';

function run(command, args) {
  return new Promise(resolve => {
    const started = performance.now();
    const child = spawn(command, args, {
      cwd: process.cwd(),
      windowsHide: true,
      shell: false,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', error => resolve({ code: 127, output: error.message, ms: performance.now() - started }));
    child.on('close', code => resolve({
      code: code ?? 127,
      output: `${stdout}${stderr}`,
      ms: performance.now() - started,
    }));
  });
}

function stats(output) {
  const bytes = Buffer.byteLength(output, 'utf8');
  const lines = output ? output.split(/\r?\n/).filter(Boolean).length : 0;
  return { bytes, lines, estimatedTokens: Math.ceil(bytes / 4) };
}

function reduction(raw, rtk) {
  if (raw.bytes === 0) return 0;
  return (1 - rtk.bytes / raw.bytes) * 100;
}

function printRow(name, rawResult, rtkResult) {
  const raw = stats(rawResult.output);
  const filtered = stats(rtkResult.output);
  const saved = reduction(raw, filtered);
  console.log(`${name}: raw=${raw.bytes}B/${raw.lines}L/~${raw.estimatedTokens}t | rtk=${filtered.bytes}B/${filtered.lines}L/~${filtered.estimatedTokens}t | saved=${saved.toFixed(1)}%`);
}

if (process.argv.includes('--self-test')) {
  const raw = stats('a'.repeat(1000));
  const filtered = stats('b'.repeat(400));
  const saved = reduction(raw, filtered);
  if (Math.abs(saved - 60) > 0.01) throw new Error(`Unexpected reduction ${saved}`);
  console.log('rtk-benchmark self-test: PASS');
  process.exit(0);
}

const version = await run('rtk', ['--version']);
if (version.code !== 0) {
  console.error('RTK not found in PATH. Run: rtk --version');
  process.exit(2);
}

console.log(`RTK: ${version.output.trim()}`);
console.log('Representative local benchmark (same working tree, sequential runs):');

const rawStatus = await run('git', ['status']);
const rtkStatus = await run('rtk', ['git', 'status']);
printRow('git status', rawStatus, rtkStatus);

const rawDiff = await run('git', ['diff', '--stat']);
const rtkDiff = await run('rtk', ['git', 'diff', '--stat']);
printRow('git diff --stat', rawDiff, rtkDiff);

if (process.argv.includes('--include-build')) {
  console.log('Build benchmark requested. This runs the build twice.');
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const rawBuild = await run(npm, ['run', 'build']);
  const rtkBuild = await run('rtk', ['npm', 'run', 'build']);
  printRow('npm run build', rawBuild, rtkBuild);
  if (rawBuild.code !== rtkBuild.code) {
    console.log(`WARNING: exit-code mismatch raw=${rawBuild.code} rtk=${rtkBuild.code}`);
  }
}

console.log('POLICY: do NOT wrap visual:* with RTK; visual-check output is intentionally tiny.');
console.log('TIP: use `rtk gain` separately for RTK\'s cumulative history.');
