import { test, expect } from '@playwright/test';
import { ProfilePage } from '../../../pages/ProfilePage';
import { apiBaseURL, isLoopback } from '../../utils/registration';
import { authResponse, credentials, hasCredentials } from '../../utils/auth';

// Opt-in end-to-end persistence check with the real UI, cookies and API.
// Keep real credentials / profile values out of traces and screenshots, as in Auth.
test.use({ trace: 'off', screenshot: 'off', video: 'off' });
test('real profile name update persists and original profile is restored', async ({ page, context, playwright, baseURL }, testInfo) => {
  test.skip(testInfo.config.workers !== 1 || testInfo.project.name !== 'chromium', 'Use the single-worker Chromium profile configuration for account isolation.');
  test.skip(process.env.RUN_PROFILE_API !== 'true' || process.env.ALLOW_MUTATIONS !== 'true' ||
    process.env.PROFILE_TEST_DATA_CONFIRMED !== 'true' || !hasCredentials(),
  'Requires explicit profile mutation opt-in and a dedicated E2E account; run only with playwright.profile.config.ts.');
  expect(!!baseURL && isLoopback(baseURL) && isLoopback(apiBaseURL), 'Only local services are authorized').toBe(true);
  const api = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: isLoopback(apiBaseURL) });
  let original: Record<string, unknown> | undefined;
  try {
    const login = await api.post('/api/Users/login', { data: credentials() });
    expect(login.status()).toBe(200);
    const response = await api.get('/api/Users/User');
    expect(response.status()).toBe(200);
    const user = await response.json();
    test.skip(!user.name, 'A nonempty original name is required for reliable restoration.');
    original = Object.fromEntries(['name', 'lastName', 'phoneNumber', 'birthDate', 'city', 'street', 'houseNumber', 'picture'].map(key => [key, user[key]]));
    await context.addCookies((await api.storageState()).cookies);
    await context.route('**/*', async route => {
      const request = route.request(); const url = new URL(request.url());
      if (![new URL(baseURL!).origin, new URL(apiBaseURL).origin].includes(url.origin)) return route.abort('blockedbyclient');
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method()) && !(url.origin === new URL(apiBaseURL).origin &&
        request.method() === 'PUT' && url.pathname.toLowerCase() === '/api/users/user/update')) return route.abort('blockedbyclient');
      return route.continue();
    });
    const ui = new ProfilePage(page);
    await ui.open(); await ui.update('name', 'QA Profile E2E');
    const [update] = await Promise.all([authResponse(page, 'PUT', '/api/Users/user/update'), ui.save()]);
    expect(update.status()).toBe(200);
    expect((await update.json()).name === 'QA Profile E2E', 'Response contains saved test name').toBe(true);
    await expect(ui.success).toBeVisible();
    await ui.refresh(); await ui.openEdit();
    await expect(ui.field('name')).toHaveValue('QA Profile E2E');
    await ui.away(); await ui.openEdit(); await expect(ui.field('name')).toHaveValue('QA Profile E2E');
    expect((await (await api.get('/api/Users/User')).json()).name === 'QA Profile E2E', 'Real API returns persisted name').toBe(true);
  } finally {
    try {
      if (original) {
        expect((await api.put('/api/Users/user/update', { data: original })).status(), 'Restore original profile').toBe(200);
        const restored = await api.get('/api/Users/User');
        expect(restored.status()).toBe(200);
        const body = await restored.json();
        expect(Object.entries(original).every(([key, value]) => body[key] === value), 'All original profile values restored').toBe(true);
      }
    } finally { await api.dispose(); }
  }
});
