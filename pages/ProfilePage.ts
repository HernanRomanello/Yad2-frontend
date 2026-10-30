import type { Page } from '@playwright/test';
import { HomePage } from './HomePage';

export type ProfileField = 'name' | 'lastName' | 'phoneNumber' | 'email' | 'birthDate' | 'city' | 'street' | 'houseNumber';
export class ProfilePage {
  constructor(readonly page: Page) {}
  get root() { return this.page.locator('app-edit-details'); }
  // Template labels lack matching input IDs. Keep formControlName fallbacks here.
  field(name: ProfileField) {
    return name === 'birthDate' ? this.root.getByLabel('תאריך לידה') : this.root.locator(`[formControlName="${name}"]`);
  }
  errors(name: ProfileField) { return this.field(name).locator('..').locator('.error-message'); }
  get success() { return this.root.locator('.success-modal'); }
  get imageModal() { return this.root.locator('app-upload-profile-image'); }
  get image() { return this.root.locator('#profile-img'); }
  async open() {
    await this.page.goto('/');
    await new HomePage(this.page).openProfile();
    await this.openEdit();
  }
  async openEdit() { await this.page.getByRole('link', { name: 'עדכון פרטים', exact: true }).click(); }
  async update(name: ProfileField, value: string) { await this.field(name).fill(value); }
  async value(name: ProfileField) { return this.field(name).inputValue(); }
  async save() { await this.root.getByRole('button', { name: 'שמירה', exact: true }).click(); }
  async cancel() { await this.root.locator('form').getByRole('button', { name: 'ביטול', exact: true }).click(); }
  async away() { await this.page.getByRole('link', { name: 'המודעות שלי', exact: true }).click(); }
  async refresh() { await this.page.reload(); }
  async selectCity(value: string) { await this.update('city', value); await this.root.locator('#city-option').getByText(value, { exact: true }).click(); }
  async selectStreet(value: string) { await this.update('street', value); await this.root.locator('#street-option').getByText(value, { exact: true }).click(); }
  async openDeleteImage() { await this.root.locator('#pencil-image').click(); await this.root.locator('#delete-img').click(); }
  async confirmDeleteImage() { await this.imageModal.getByRole('button', { name: 'מחיקה', exact: true }).click(); }
  async openImage() { await this.root.locator('#pencil-image').click(); await this.root.locator('#edit-img').click(); }
  async chooseImage(name: string, mimeType: string, buffer: Buffer) { await this.imageModal.locator('input[type=file]').setInputFiles({ name, mimeType, buffer }); }
  async confirmImage() { await this.imageModal.getByRole('button', { name: 'עדכון', exact: true }).click(); }
  async cancelImage() { await this.imageModal.getByRole('button', { name: 'ביטול', exact: true }).click(); }
}
