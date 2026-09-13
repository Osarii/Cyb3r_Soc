import { readFile, writeFile, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export const SCREENS = {
  dashboard: { file: '01-dashboard.png', label: 'DASHBOARD' },
  boot: { file: '02-boot-screen.png', label: 'BOOT' },
  threat: { file: '03-threat-map.png', label: 'THREAT' },
  ddos: { file: '04-ddos-mitigation.png', label: 'DDOS' },
  offline: { file: '05-server-offline.png', label: 'OFFLINE' },
};

export function resolveScreen(alias) {
  const screen = SCREENS[alias];
  if (!screen) throw new Error(`Unknown screen "${alias}". Use: ${Object.keys(SCREENS).join(', ')}`);
  return screen;
}

export function parseArgs(argv) {
  const args = { positional: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      args.positional.push(token);
      continue;
    }
    const [rawKey, inlineValue] = token.slice(2).split('=', 2);
    if (inlineValue !== undefined) {
      args[rawKey] = inlineValue;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      args[rawKey] = next;
      i += 1;
    } else {
      args[rawKey] = true;
    }
  }
  return args;
}

export function visualTempRoot(alias) {
  return path.join(os.tmpdir(), 'cyb3r-soc-visual-check', alias);
}

export function acceptedBaselinesPath(root = process.cwd()) {
  return path.join(root, 'tests', 'visual', 'accepted-baselines.json');
}

export async function readMetric(metricsPath, screenFile) {
  const parsed = JSON.parse(await readFile(metricsPath, 'utf8'));
  return parsed.screens?.find(metric => metric.screen === screenFile) ?? null;
}

export async function readAcceptedBaseline(root, screenFile) {
  const baselinePath = acceptedBaselinesPath(root);
  try {
    const parsed = JSON.parse(await readFile(baselinePath, 'utf8'));
    return parsed.screens?.[screenFile] ?? null;
  } catch {
    return null;
  }
}

export async function writeAcceptedBaseline(root, screenFile, metric) {
  const baselinePath = acceptedBaselinesPath(root);
  await mkdir(path.dirname(baselinePath), { recursive: true });
  let parsed = { version: 1, screens: {} };
  try {
    parsed = JSON.parse(await readFile(baselinePath, 'utf8'));
  } catch {}
  if (!parsed || typeof parsed !== 'object') parsed = { version: 1, screens: {} };
  if (!parsed.screens || typeof parsed.screens !== 'object' || Array.isArray(parsed.screens)) parsed.screens = {};
  parsed.version = 1;
  parsed.screens[screenFile] = {
    diffRatio: metric.diffRatio,
    differentPixels: metric.differentPixels,
    totalPixels: metric.totalPixels,
    pixelThreshold: metric.pixelThreshold,
  };
  await writeFile(baselinePath, `${JSON.stringify(parsed, null, 2)}\n`);
  return baselinePath;
}

export function percent(metric) {
  return Number(metric.diffRatio) * 100;
}

export function comparePercent(current, baseline, epsilon = 0.0005) {
  const delta = current - baseline;
  if (delta < -epsilon) return { result: 'IMPROVED', delta, exitCode: 0 };
  if (Math.abs(delta) <= epsilon) return { result: 'UNCHANGED', delta: 0, exitCode: 1 };
  return { result: 'REGRESSED', delta, exitCode: 1 };
}

export function formatSigned(value) {
  const normalized = Math.abs(value) < 0.0005 ? 0 : value;
  return `${normalized > 0 ? '+' : ''}${normalized.toFixed(3)}pp`;
}

export function compactError(text, maxLines = 6, maxChars = 1200) {
  const lines = String(text ?? '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .slice(-maxLines);
  const joined = lines.join(' | ');
  return joined.length > maxChars ? `${joined.slice(0, maxChars)}…` : joined;
}
