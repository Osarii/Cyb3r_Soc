import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  snapshotPathTemplate: '{testDir}/../../Cyb3r_Soc_References_1to1/{arg}{ext}',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixels: Number(process.env.CYB3R_SOC_MAX_DIFF_PIXELS ?? 23600),
      maxDiffPixelRatio: Number(process.env.CYB3R_SOC_MAX_DIFF ?? 0.015),
      threshold: Number(process.env.CYB3R_SOC_PIXEL_THRESHOLD ?? 0.1),
    },
  },
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4173',
    viewport: { width: 1672, height: 941 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'es-CR',
    timezoneId: 'America/Costa_Rica',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
