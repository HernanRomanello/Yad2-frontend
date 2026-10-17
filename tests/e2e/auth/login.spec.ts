import { test, expect } from '../../fixtures/auth.fixture';
import { authResponse, credentials, expectDenied, expectUser, hasCredentials } from '../../utils/auth';

test('empty credentials show required messages and do not submit authentication', async ({ page, loginPage, homePage }) => {
  await loginPage.goto();
  const attempts: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST' && new URL(request.url()).pathname.toLowerCase() === '/api/users/login') attempts.push('login');
  });
  await loginPage.submit();
  await expect(loginPage.emailRequired).toBeVisible();
  await expect(loginPage.passwordRequired).toBeVisible();
  await loginPage.expectVisible();
  await homePage.expectLoggedOut();
  await expectDenied(page);
  expect(attempts, 'Invalid form must not submit credentials').toEqual([]);
});

for (const path of ['/profile', '/favorites']) {
  test(`anonymous access to ${path} redirects to login`, async ({ page, loginPage, homePage }) => {
    await loginPage.goto();
    await homePage.visitProtected(path);
    await loginPage.expectVisible();
    await homePage.expectLoggedOut();
    await expectDenied(page);
  });
}

test.describe('Dedicated account', () => {
  test.skip(!hasCredentials(), 'Supply E2E_TEST_EMAIL and E2E_TEST_PASSWORD for an existing dedicated test account.');

  test('valid credentials enable authenticated account functionality', async ({ signedIn, homePage }) => {
    await homePage.openProfile();
  });

  test('incorrect password shows an error and leaves the user unauthenticated', async ({ page, loginPage, homePage }) => {
    test.skip(!process.env.E2E_TEST_INVALID_PASSWORD, 'Supply a known incorrect E2E_TEST_INVALID_PASSWORD; verify account lockout policy first.');
    const wrongPassword = process.env.E2E_TEST_INVALID_PASSWORD!;
    expect(wrongPassword !== credentials().password, 'Negative password differs from valid password').toBe(true);
    await loginPage.goto();
    await loginPage.fill(credentials().email, wrongPassword);
    const [response] = await Promise.all([
      authResponse(page, 'POST', '/api/Users/login'), loginPage.submit(),
    ]);
    expect(response.status()).toBe(401);
    await expect(loginPage.invalidCredentials).toBeVisible();
    await loginPage.expectVisible();
    await homePage.expectLoggedOut();
    await expectDenied(page);
  });

  test('session is restored after reloading the home page', async ({ signedIn, page, homePage }) => {
    const [response] = await Promise.all([
      authResponse(page, 'GET', '/api/Users/User'), homePage.reload(),
    ]);
    await expectUser(response);
    await homePage.expectAuthenticated();
    await homePage.openProfile();
  });
});
