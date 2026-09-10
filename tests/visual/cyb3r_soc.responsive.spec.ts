import { expect, test, type Page } from '@playwright/test';

const routes = [
  ['/dashboard?visualTest=true', 'Bienvenido a Cyb3r_Soc'],
  ['/threat-map?visualTest=true', 'Mapa de amenazas en tiempo real'],
  ['/incidents/INC-2024-7781/mitigation?visualTest=true', 'Mitigando ataque DDoS'],
  ['/offline?visualTest=true', 'Servidor no disponible'],
  ['/boot-preview?visualTest=true', 'Inicializando Cyb3r_Soc'],
] as const;

async function expectNoHorizontalDocumentOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(sizes.document, JSON.stringify(sizes)).toBeLessThanOrEqual(sizes.viewport + 1);
  expect(sizes.body, JSON.stringify(sizes)).toBeLessThanOrEqual(sizes.viewport + 1);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.sessionStorage.setItem('cyb3r_soc_initialized', 'true'));
});

for (const viewport of [
  { name: 'tablet', width: 1024, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
] as const) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const [path, readyText] of routes) {
      test(`${path} fits the viewport`, async ({ page }) => {
        await page.goto(path, { waitUntil: 'networkidle' });
        await expect(page.getByText(readyText, { exact: false }).first()).toBeVisible();
        await expectNoHorizontalDocumentOverflow(page);
      });
    }
  });
}

test('primary simulation and recovery controls work', async ({ page }) => {
  await page.goto('/dashboard?visualTest=true', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Iniciar simulación' }).click();
  await expect(page.getByRole('button', { name: 'Simulación iniciada' })).toBeVisible();

  await page.goto('/offline?visualTest=true', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Reintentar' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
});

test('mitigation pause freezes progress and cancel returns to the map', async ({ page }) => {
  await page.goto('/incidents/INC-2024-7781/mitigation', { waitUntil: 'networkidle' });
  const progress = page.locator('.ss-mitigation-progress > strong');
  await expect(progress).toBeVisible();
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Pausar mitigación' }).click();
  await expect(page.getByRole('button', { name: 'Reanudar mitigación' })).toBeVisible();
  await page.waitForTimeout(150);
  const pausedAt = await progress.textContent();
  await page.waitForTimeout(300);
  await expect(progress).toHaveText(pausedAt ?? '');
  await page.getByRole('button', { name: 'Cancelar proceso' }).click();
  await expect(page).toHaveURL(/\/threat-map$/);
});

test('boot screen appears once per browser session', async ({ browser }) => {
  const context = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const page = await context.newPage();

  await page.goto('/dashboard', { waitUntil: 'networkidle' });
  await expect(page.getByText('Inicializando Cyb3r_Soc', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'OMITIR INTRO' }).click();
  await expect(page.getByText('Bienvenido a Cyb3r_Soc', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('cyb3r_soc_initialized'))).toBe('true');

  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByText('Bienvenido a Cyb3r_Soc', { exact: true })).toBeVisible();
  await expect(page.getByText('Inicializando Cyb3r_Soc', { exact: true })).toHaveCount(0);
  await context.close();
});

test('a simulated DDoS keeps its incident linked through mitigation', async ({ page }) => {
  await page.goto('/threat-map', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Iniciar ataque simulado' }).click();
  await expect(page.locator('.map-kpi').first().locator('b')).toHaveText('248');

  await page.getByRole('link', { name: /Limpieza/ }).click();
  await expect(page).toHaveURL(/\/incidents\/INC-\d+\/mitigation$/);
  await expect(page.locator('.ss-mitigation-progress > strong')).toHaveText('100%', { timeout: 15_000 });
  await expect(page.getByText('Amenaza neutralizada', { exact: true })).toBeVisible();
});
