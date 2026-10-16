import { Locator, Page } from '@playwright/test';

export interface RegistrationFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export class RegistrationPage {
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly submitButton: Locator;
  readonly passwordVisibility: Locator;
  readonly confirmationVisibility: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly mismatchError: Locator;

  constructor(readonly page: Page) {
    const form = page.locator('app-registration-form form');
    this.email = form.getByPlaceholder('yourmail@email.co.il', { exact: true });
    // Existing labels are divs and visibility controls have no accessible names.
    this.password = form.locator('#password');
    this.confirmPassword = form.locator('#confirmPassword');
    this.submitButton = form.getByRole('button', { name: 'המשך', exact: true });
    this.passwordVisibility = form.locator('.input.password').filter({ has: page.locator('#password') }).locator('.password-exposed-btn-container img');
    this.confirmationVisibility = form.locator('.input.password').filter({ has: page.locator('#confirmPassword') }).locator('.password-exposed-btn-container img');
    this.emailError = form.locator('.input').filter({ has: page.locator('#email') }).locator('.error-message');
    this.passwordError = form.locator('.error-message').filter({ hasText: /סיסמה|סיסמאות/ });
    this.mismatchError = form.getByText('הסיסמאות אינן תואמות', { exact: true });
  }

  async goto() { await this.page.goto('/register'); }
  async fillEmail(value: string) { await this.email.fill(value); }
  async fillPassword(value: string) { await this.password.fill(value); }
  async fillConfirmation(value: string) { await this.confirmPassword.fill(value); }
  async fillForm(data: RegistrationFormData) {
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    await this.fillConfirmation(data.confirmPassword);
  }
  async submit() { await this.submitButton.click(); }
  async togglePasswordVisibility() { await this.passwordVisibility.click(); }
  async toggleConfirmationVisibility() { await this.confirmationVisibility.click(); }
}
