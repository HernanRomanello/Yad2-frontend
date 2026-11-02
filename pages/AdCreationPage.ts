import { expect, Page } from '@playwright/test';
import { validAd } from '../tests/utils/ad-data';

export class AdCreationPage {
  constructor(readonly page: Page) {}
  get root() { return this.page.locator('app-create-new-advertisement'); }
  section(step: number) { return this.root.locator(`#Selection-${step}`); }
  field(id: string) { return this.root.locator(`#${id}`); }
  error(id: string) { return this.root.locator(`#${id}-error`); }
  async open(category = 'השכרה') {
    // Bootstrap authentication on a public route before entering the guarded route.
    await this.page.goto('/');
    await expect(this.page.locator('button.user-name').first()).toContainText('QA');
    const menu = this.page.getByRole('button', { name: 'תפריט', exact: true });
    if (await menu.isVisible()) {
      await menu.click();
      await this.page.locator('app-sidebar').getByRole('button', { name: /פרסום מודעה/ }).click();
    } else {
      await this.page.getByRole('button', { name: /פרסום הודעה/ }).click();
    }
    await this.section(1).getByRole('button').filter({ has: this.page.getByText(category, { exact: true }) }).click();
  }
  async next(step: number) { await this.section(step).getByRole('button', { name: 'המשך לשלב הבא', exact: true }).click(); }
  async back(step: number) { await this.section(step).getByRole('button', { name: 'חזרה', exact: true }).click(); }
  async choose(step: number, field: string, option: string) {
    await this.field(field).click();
    await this.section(step).getByRole('listitem').filter({ hasText: new RegExp(`^\\s*${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`) }).click();
  }
  async address() {
    const data = validAd();
    await this.field('city').fill(data.city);
    await this.root.locator('#city-option').filter({ hasText: 'עיר בדיקה' }).click();
    await this.field('street').fill('רחוב בדיקה');
    await this.root.locator('#street-option').filter({ hasText: 'רחוב בדיקה' }).click();
    for (const field of ['number', 'floor', 'totalFloors'] as const) await this.field(field).fill(data[field]);
    await this.choose(2, 'assetType', 'דירה');
    await this.choose(2, 'assetState', 'חדש (נכס בן עד 10 שנים)');
  }
  async toDetails() { await this.address(); await this.next(2); }
  async toPayment() { await this.toDetails(); await this.choose(3, 'rooms', validAd().rooms); await this.field('description').fill(validAd().description); await this.next(3); }
  async payment() {
    await this.choose(4, 'numberOfPayments', '12');
    const data = validAd();
    for (const field of ['totalSquareMeters', 'price', 'entryDate'] as const) await this.field(field).fill(data[field]);
  }
  async toImages() { await this.toPayment(); await this.payment(); await this.next(4); }
  async toContacts() { await this.toImages(); await this.next(5); }
  async consent() {
    const checkbox = this.root.getByRole('checkbox', { name: /אני מאשר\/ת/ });
    await checkbox.focus();
    if (!(await checkbox.isChecked())) await checkbox.press('Space');
  }
  async toPlan() { await this.toContacts(); await this.consent(); await this.next(6); }
  get previews() { return this.root.locator('img[src^="blob:"]'); }
  async image(name = 'qa.png', mimeType = 'image/png', buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64')) {
    // Initial upload input has neither a label nor an ID.
    await this.section(5).locator('input[type=file]:not(#video)').setInputFiles({ name, mimeType, buffer });
  }
  async removeImage(index: number) { await this.section(5).getByAltText('bin').nth(index).click(); }
  freeButton() {
    return this.section(7).locator('.course-to-post').filter({ has: this.page.locator('img[src$="basic-course.JPG"]') }).getByRole('button');
  }
  async publishFree() {
    const mobile = this.section(7).locator('.plan-card').filter({ has: this.page.getByRole('heading', { name: 'בסיסי', exact: true }) });
    if (await mobile.isVisible()) await mobile.getByRole('button').click();
    else await this.freeButton().click();
  }
}
