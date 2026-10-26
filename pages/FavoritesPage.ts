import type { Page } from '@playwright/test';
import { SearchAdsPage } from './SearchAdsPage';

export class FavoritesPage {
  readonly search: SearchAdsPage;
  constructor(readonly page: Page) { this.search = new SearchAdsPage(page); }
  // These controls are divs with no useful accessible name or test ID.
  // Keep template-specific fallbacks scoped here until the app supplies labels.
  get root() { return this.page.locator('app-favorite-ads'); }
  get cards() { return this.root.locator('.favorites-ad'); }
  card(id: number) { return this.cards.filter({ hasText: `QA Search ${id}` }); }
  result(id: number) {
    return this.search.results.locator('.result-list > .container').filter({ hasText: `QA Search ${id}` });
  }
  favoriteIcon(id: number) { return this.result(id).locator('.like-button mat-icon'); }
  get detailIcon() { return this.page.locator('app-advertisement #favorite-icon-red'); }
  get detailControl() { return this.page.locator('app-advertisement .white-btns .gap').last(); }
  async openSearch() { await this.search.open(); }
  async openFavoritesPage() {
    // SPA navigation preserves the authenticated state used by the route guard.
    if (this.page.viewportSize()!.width < 768) {
      await this.page.getByRole('button', { name: 'תפריט', exact: true }).click();
      await this.page.locator('app-sidebar [routerLink="/favorites"]:visible').first().click();
    } else {
      await this.page.locator('app-header [routerLink="/favorites"]:visible').first().click();
    }
  }
  async visitFavoritesDirectly() { await this.page.goto('/favorites'); }
  async openProperty(id: number) { await this.search.openResult(id); }
  async openSavedProperty(id: number) { await this.card(id).click(); }
  async addToFavorites(id: number) { await this.result(id).locator('.like-button').click(); }
  async removeFromFavorites(id: number) { await this.addToFavorites(id); }
  async toggleFromDetails() { await this.detailControl.click(); }
  async rapidToggle(id: number) { await this.result(id).locator('.like-button').dblclick(); }
  async isPropertyFavorited(id: number) {
    return (await this.favoriteIcon(id).getAttribute('fonticon')) === 'favorite';
  }
  async refresh() { await this.page.reload(); }
}
