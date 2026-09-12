import { expect, test } from '@playwright/test';

test.use({ reducedMotion: 'no-preference' });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('cyb3r_soc_initialized', 'true'));
});

test('official logo is centered in boot and uses a static asset for reduced motion', async ({ page }) => {
  await page.goto('/boot-preview');
  const logo = page.locator('.ss-loader-one .cybersoc-logo-asset');
  await expect(logo).toBeVisible();
  const mark = await logo.boundingBox();
  const orbit = await page.locator('.ss-boot-orbits').boundingBox();
  expect(mark).not.toBeNull();
  expect(orbit).not.toBeNull();
  expect(Math.abs(mark!.x + mark!.width / 2 - orbit!.x - orbit!.width / 2)).toBeLessThan(.1);
  expect(Math.abs(mark!.y + mark!.height / 2 - orbit!.y - orbit!.height / 2)).toBeLessThan(.1);
  await expect(logo).toHaveJSProperty('tagName', 'VIDEO');
  expect(await logo.getAttribute('src')).toContain('cybersoc-logo-loop');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => logo.getAttribute('src')).toContain('cybersoc-logo-static');
});

test('official mitigation, cube and CyberAI assets render', async ({ page }) => {
  await page.goto('/incidents/INC-2024-7781/mitigation');
  await expect(page.locator('.ddos-interceptor-asset')).toBeVisible();
  await expect(page.locator('.cyber-ai-orb-asset video')).toHaveAttribute('src', /cyberai-idle/);
  await page.goto('/offline');
  await expect(page.locator('.server-status-cube-asset')).toBeVisible();
});
