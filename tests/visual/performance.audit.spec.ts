import { expect, test } from '@playwright/test';

declare global { interface Window { __cyb3rLongTasks?: number[] } }

test.use({ reducedMotion: 'no-preference' });

for (const [name, route] of [
  ['dashboard', '/dashboard'],
  ['threat-map', '/threat-map'],
  ['mitigation', '/incidents/INC-2024-7781/mitigation'],
] as const) {
  test(`performance audit: ${name}`, async ({ page }) => {
    await page.addInitScript(() => {
      window.__cyb3rLongTasks = [];
      new PerformanceObserver(list => list.getEntries().forEach(entry => window.__cyb3rLongTasks?.push(entry.duration))).observe({ type: 'longtask', buffered: true });
    });
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(350);
    await page.evaluate(() => { window.__cyb3rLongTasks = []; });
    for (const zoom of [1.1, 1.25, 1.5]) {
      await page.evaluate(value => { document.body.style.zoom = String(value); }, zoom);
      await page.waitForTimeout(250);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeGreaterThan(0);
    }
    const metrics = await cdp.send('Performance.getMetrics') as { metrics: Array<{ name: string; value: number }> };
    const longTasks = await page.evaluate(() => window.__cyb3rLongTasks ?? []);
    const metric = (name: string) => metrics.metrics.find(value => value.name === name)?.value ?? 0;
    expect(metric('Nodes')).toBeLessThan(3000);
    expect(longTasks.filter(duration => duration > 100)).toEqual([]);
  });
}
