import { expect, test } from '@playwright/test';

const screens = [
  { name: '01-dashboard.png', path: '/dashboard?visualTest=true', ready: 'Bienvenido a Cyb3r_Soc' },
  { name: '02-boot-screen.png', path: '/boot-preview?visualTest=true', ready: 'Inicializando Cyb3r_Soc' },
  { name: '03-threat-map.png', path: '/threat-map?visualTest=true', ready: 'Mapa de amenazas en tiempo real' },
  { name: '04-ddos-mitigation.png', path: '/incidents/INC-2024-7781/mitigation?visualTest=true', ready: 'Mitigando ataque DDoS' },
  { name: '05-server-offline.png', path: '/offline?visualTest=true', ready: 'Servidor no disponible' },
] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('cyb3r_soc_initialized', 'true');
    const fixedNow = new Date('2024-04-23T10:24:17Z').valueOf();
    Date.now = () => fixedNow;
    Math.random = () => 0.4172;
  });
});

for (const screen of screens) {
  test(screen.name, async ({ page }) => {
    await page.goto(screen.path, { waitUntil: 'networkidle' });
    await expect(page.getByText(screen.ready, { exact: false }).first()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(screen.name, { fullPage: false });
  });
}
