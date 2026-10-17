import { expect, Page } from '@playwright/test';
import { authResponse } from '../tests/utils/auth';

export class HomePage {
  constructor(readonly page: Page) {}
  // Existing desktop menu has no accessible trigger or test id. Scope to its
  // existing class and child button, matching the registration suite convention.
  get accountMenu() {
    return this.page
      .locator('app-header .menu-container')
      .filter({ has: this.page.locator('button.user-name') });
  }
  get logoutButton() {
    return this.accountMenu.getByRole('button', { name: /התנתקות/ });
  }
  get profileButton() {
    return this.accountMenu.getByRole('button', {
      name: 'אזור אישי',
      exact: true,
    });
  }
  get myAds() {
    return this.page.getByRole('link', { name: 'המודעות שלי', exact: true });
  }

  async expectAuthenticated() {
    await expect(this.page).toHaveURL(new URL('/', this.page.url()).href);
    await this.accountMenu.hover();
    await expect(this.logoutButton).toBeVisible();
    await expect(this.profileButton).toBeVisible();
  }
  async openProfile() {
    await this.accountMenu.hover();
    await this.profileButton.click();
    await expect(this.page).toHaveURL(/\/profile\/user-advertisement$/);
    await expect(this.myAds).toBeVisible();
  }
  async logout() {
    await this.accountMenu.hover();
    const [response] = await Promise.all([
      authResponse(this.page, 'POST', '/api/Users/logout'),
      this.logoutButton.click(),
    ]);
    expect(response.ok(), 'Logout endpoint succeeds').toBe(true);
    await this.expectLoggedOut();
  }
  async expectLoggedOut() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.logoutButton).toHaveCount(0);
    await expect(this.profileButton).toHaveCount(0);
    await expect(this.myAds).toHaveCount(0);
  }
  async visitProtected(path = '/profile') {
    await this.page.goto(path);
  }
  async reload() {
    await this.page.reload();
  }
  async back() {
    await this.page.goBack();
  }
}
