import { test } from '../../fixtures/auth.fixture';
import { expectDenied, hasCredentials } from '../../utils/auth';

test.describe('Logout with dedicated account', () => {
  test.skip(!hasCredentials(), 'Supply E2E_TEST_EMAIL and E2E_TEST_PASSWORD for an existing dedicated test account.');

  test('UI logout removes authenticated functionality and denies protected resources', async ({ signedIn, page, homePage, loginPage }) => {
    await homePage.logout();
    await loginPage.expectVisible();
    await expectDenied(page);
  });

  test('logout remains effective after reload and protected-route navigation', async ({ signedIn, page, homePage, loginPage }) => {
    await homePage.logout();
    await homePage.reload();
    await loginPage.expectVisible();
    await homePage.expectLoggedOut();
    await expectDenied(page);
    for (const path of ['/profile', '/favorites']) {
      await homePage.visitProtected(path);
      await loginPage.expectVisible();
      await homePage.expectLoggedOut();
    }
  });

  test('back navigation cannot reopen protected functionality after logout', async ({ signedIn, page, homePage, loginPage }) => {
    await homePage.openProfile();
    // Retain the protected page in history, then use the desktop header logout.
    await page.goto('/');
    await homePage.expectAuthenticated();
    await homePage.logout();
    await homePage.back();
    await homePage.back();
    await loginPage.expectVisible();
    await homePage.expectLoggedOut();
    await expectDenied(page);
  });
});
