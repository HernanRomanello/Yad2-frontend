import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { authResponse, credentials, expectUser } from '../utils/auth';
import { apiBaseURL, isLoopback } from '../utils/registration';

export const test = base.extend<{ loginPage: LoginPage; homePage: HomePage; signedIn: void; safety: void }>({
  safety: [async ({ context, page, baseURL }, use, testInfo) => {
    if (!baseURL || !isLoopback(baseURL) || !isLoopback(apiBaseURL)) {
      throw new Error('Auth suite is restricted to local services; deployed environments are not authorized.');
    }
    const events: { method: string; path: string; status: number }[] = [];
    const blocked: string[] = [];
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      if (!['http:', 'https:'].includes(url.protocol)) return route.continue();
      if (![new URL(baseURL).origin, new URL(apiBaseURL).origin].includes(url.origin)) return route.abort('blockedbyclient');
      if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method()) &&
          !(url.origin === new URL(apiBaseURL).origin && request.method() === 'POST' && /^\/api\/users\/(login|logout)$/i.test(url.pathname))) {
        blocked.push(request.method() + ' ' + url.pathname);
        return route.abort('blockedbyclient');
      }
      await route.continue();
    });
    context.on('response', response => {
      const url = new URL(response.url());
      if (url.origin === new URL(apiBaseURL).origin && /^\/api\/users\/(login|logout|user)$/i.test(url.pathname)) {
        events.push({ method: response.request().method(), path: url.pathname, status: response.status() });
      }
    });
    await use();
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('sanitized-auth-statuses', { body: JSON.stringify({ events, blocked }), contentType: 'application/json' });
      if (!page.isClosed() && new URL(page.url()).pathname === '/login') {
        await testInfo.attach('login-form-masked', {
          body: await page.locator('app-login form').screenshot({ mask: [page.locator('input')] }),
          contentType: 'image/png',
        });
      }
    }
    expect(blocked, 'No business-data mutation requests').toEqual([]);
  }, { auto: true }],
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
  signedIn: async ({ page, loginPage, homePage }, use) => {
    await loginPage.goto();
    const { email, password } = credentials();
    await loginPage.fill(email, password);
    const [login, user] = await Promise.all([
      authResponse(page, 'POST', '/api/Users/login'),
      authResponse(page, 'GET', '/api/Users/User'),
      loginPage.submit(),
    ]);
    expect(login.status()).toBe(200);
    await expectUser(user);
    expect((await page.context().cookies(apiBaseURL)).some(cookie => cookie.httpOnly), 'Session establishes an HttpOnly cookie').toBe(true);
    await homePage.expectAuthenticated();
    await use();
  },
});
export { expect } from '@playwright/test';
