import type { Locator, Page } from '@playwright/test';
import type { BooleanFilter } from '../tests/fixtures/search-data';

export class AdditionalSearchFilters {
  constructor(readonly root: Locator) {}
  async toggle(filter: BooleanFilter) {
    const [label, , control] = filter;
    if (control === 'checkbox') await this.root.getByRole('checkbox', { name: label }).click();
    else await this.root.locator('.features').getByText(label, { exact: true }).click();
  }
  async apply() { await this.root.getByRole('button', { name: 'אישור', exact: true }).click(); }
  async reset() { await this.root.getByRole('button', { name: 'איפוס', exact: true }).click(); }
  async close() { await this.root.locator('#x-icon').click(); }
  async floors(min: string, max: string) {
    const inputs = this.root.locator('app-real-estate-price-slider-select').getByRole('combobox');
    await inputs.nth(0).selectOption(max);
    await inputs.nth(1).selectOption(min);
  }
  async size(min: string, max: string) {
    const inputs = this.root.locator('SquareSizeSlider').getByRole('textbox');
    await inputs.nth(1).fill(min);
    await inputs.nth(0).fill(max);
  }
}

export class SearchAdsPage {
  readonly root: Locator;
  readonly results: Locator;
  readonly cards: Locator;
  readonly titles: Locator;
  readonly additional: AdditionalSearchFilters;
  readonly location: Locator;
  constructor(readonly page: Page) {
    this.root = page.locator('app-real-estate-search');
    this.results = this.root.locator('app-real-estate-results');
    // The app has no roles/test IDs for result cards, sort controls, suggestions,
    // or range endpoints. These narrow component/ID selectors reflect the template.
    this.cards = this.results.locator('.advertisement-details');
    this.titles = this.cards.locator('.title');
    this.additional = new AdditionalSearchFilters(this.root.locator('app-real-estate-additional-filters'));
    this.location = this.root.locator('app-sub-search-query-box').last();
  }
  async open() { await this.page.goto('/'); }
  async submit() { await this.root.getByRole('button', { name: 'חיפוש', exact: true }).click(); }
  async openAdditional() { await this.root.getByRole('button', { name: /סינונים נוספים/ }).click(); }
  async trade(type: 'מכירה' | 'השכרה') {
    await this.root.getByRole('button', { name: /^(מכירה|השכרה) keyboard_arrow_down$/ }).click();
    await this.root.locator('#tradeTypeMenu').getByRole('button', { name: type, exact: true }).click();
  }
  async properties(types: readonly string[]) {
    await this.openPropertyMenu();
    for (const type of types) await this.root.locator('#propertyTypeMenu').getByText(type, { exact: true }).click();
    await this.submit();
  }
  async openPropertyMenu() {
    await this.root.getByRole('button').filter({ has: this.page.locator('#propertyTypeArrow') }).click();
  }
  async toggleProperty(type: string) {
    await this.openPropertyMenu();
    await this.root.locator('#propertyTypeMenu').getByText(type, { exact: true }).click();
    await this.submit();
  }
  async propertyGroup(group: 'apartments' | 'houses') {
    await this.root.getByRole('button', { name: /סוג הנכס/ }).click();
    await this.root.locator(`#all-${group}`).last().click();
    await this.submit();
  }
  async rooms(values: readonly string[]) {
    await this.root.locator('#propertyRoomButton').click();
    for (const value of values) await this.root.locator('#propertyRoomMenu').getByRole('button', { name: value, exact: true }).click();
    await this.submit();
  }
  async price(min: string, max: string) {
    await this.root.getByRole('button', { name: /מחיר.*keyboard_arrow_down/ }).click();
    const inputs = this.root.locator('#PriceRangeMenu').getByRole('textbox');
    await inputs.nth(1).fill(min);
    await inputs.nth(0).fill(max);
    await this.submit();
  }
  async sort(label: string) {
    await this.results.getByText('מיון לפי', { exact: true }).click();
    await this.results.locator('.sort-dropdown').getByText(label, { exact: true }).click();
  }
  async chooseLocation(query: string, kind: 'city' | 'neighborhood' | 'area' | 'street' = 'city') {
    const input = this.location.getByRole('textbox');
    await input.fill(query);
    await this.location.locator(`#${kind}-option`).first().click();
    await this.location.getByText('אישור', { exact: true }).click();
    await this.submit();
  }
  async clearLocation() {
    await this.location.locator('#subSearchQuery').click();
    await this.location.getByText('איפוס', { exact: true }).click();
    await this.submit();
  }
  async addLocation(query: string) {
    await this.location.locator('#subSearchQuery').click();
    await this.location.getByPlaceholder('הוספת מיקום').fill(query);
    await this.location.locator('#city-option').filter({ hasText: query }).click();
    await this.location.getByText('אישור', { exact: true }).click();
    await this.submit();
  }
  async removeLocation(city: string) {
    await this.location.locator('#subSearchQuery').click();
    await this.location.locator('.location-list').filter({ hasText: city }).locator('.remove-btn').click();
  }
  async confirmLocations() {
    await this.location.getByText('אישור', { exact: true }).click();
    await this.submit();
  }
  async showSelectedLocations() { await this.location.locator('#subSearchQuery').click(); }
  async typeLocation(value: string) { await this.location.getByRole('textbox').fill(value); }
  async increaseMinimumPrice() {
    await this.root.getByRole('button', { name: /מחיר.*keyboard_arrow_down/ }).click();
    const handle = this.root.locator('#PriceRangeMenu').getByRole('slider').first();
    await handle.focus();
    await handle.press('ArrowRight');
    await this.submit();
  }
  async setMinimumFloorToTop() {
    const handle = this.additional.root.locator('app-real-estate-price-slider-select').getByRole('slider').first();
    await handle.focus();
    await handle.press('End');
  }
  async openMobileFilters() { await this.root.getByRole('button', { name: 'סינון', exact: true }).click(); }
  async applyMobileFilters() { await this.additional.root.getByRole('button', { name: 'חיפוש', exact: true }).click(); }
  async mobileRooms(values: readonly string[]) {
    for (const value of values) await this.additional.root.locator('app-rooms-filter-mobile').getByRole('button', { name: value, exact: true }).click();
  }
  async mobileProperty(type: string) {
    await this.additional.root.locator('app-real-estate-property-type').getByText(type, { exact: true }).click();
  }
  async mobileTrade(type: string) {
    await this.additional.root.locator('.trade-type-tabs').getByText(type, { exact: true }).click();
  }
  async mobilePrice(min: string, max: string) {
    const inputs = this.additional.root.locator('app-real-estate-price-slider').getByRole('textbox');
    await inputs.nth(1).fill(min);
    await inputs.nth(0).fill(max);
  }
  async mobileLocation(query: string) {
    const location = this.additional.root.locator('app-sub-search-query-box');
    await location.getByRole('textbox').fill(query);
    await location.locator('#city-option').filter({ hasText: query }).click();
    await location.getByText('אישור', { exact: true }).click();
  }
  async openResult(id: number) {
    await this.cards.filter({ hasText: `QA Search ${id} 1` }).click();
  }
}
