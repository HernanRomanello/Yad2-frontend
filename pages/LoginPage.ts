import { expect, Page } from '@playwright/test';
import { authResponse } from '../tests/utils/auth';

export class LoginPage {
  constructor(readonly page: Page) {}
  // The template uses divs rather than labels; placeholders are the accessible fallback.
  get email() { return this.page.getByPlaceholder('yourmail@email.co.il', { exact: true }); }
  get password() { return this.page.getByPlaceholder('הקלדת סיסמה', { exact: true }); }
  get submitButton() { return this.page.getByRole('button', { name: 'התחברות', exact: true }); }
  get emailRequired() { return this.page.getByText('לא לשכוח את המייל', { exact: true }); }
  get passwordRequired() { return this.page.getByText('לא לשכוח להזין סיסמה', { exact: true }); }
  get invalidCredentials() { return this.page.getByText('אימייל או סיסמה אינם תקינים', { exact: true }); }

  async goto() {
    const [response] = await Promise.all([
      authResponse(this.page, 'GET', '/api/Users/User'),
      this.page.goto('/login'),
    ]);
    expect(response.status(), 'Fresh context is anonymous').toBe(401);
    await this.expectVisible();
  }
  async fill(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
  }
  async submit() { await this.submitButton.click(); }
  async expectVisible() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.submitButton).toBeVisible();
  }
}
