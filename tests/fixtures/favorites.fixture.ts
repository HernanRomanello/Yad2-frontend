import { test as base, expect } from '@playwright/test';
import { FavoritesPage } from '../../pages/FavoritesPage';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { makeAd } from './search-data';
import { isLoopback } from '../utils/registration';

export const favoriteAds = [101, 102, 103].map(id => makeAd(id, {
  mainPicture: '/assets/images/image_placeholder_.svg',
  pictures: [{ id, advertisementId: id, url: '/assets/images/image_placeholder_.svg' }], video: '',
  assetState: 'חדש',
}));
export interface FavoritesState {
  authenticated: boolean;
  ids: Set<number>;
  updates: number[];
  failure?: '500' | 'network' | '401';
}
export const test = base.extend<{
  favoritesPage: FavoritesPage; loginPage: LoginPage; homePage: HomePage;
  favoritesState: FavoritesState; network: void;
}>({
  favoritesState: async ({}, use) => {
    await use({ authenticated: true, ids: new Set(), updates: [] });
  },
  network: [async ({ context, page, baseURL, favoritesState: state }, use, testInfo) => {
    if (!baseURL || !isLoopback(baseURL)) throw new Error('Mock Favorites tests require a local frontend.');
    const unexpected: string[] = [];
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      const path = url.pathname.toLowerCase();
      const json = (body: unknown, status = 200) => route.fulfill({ status, json: body });
      if (path === '/api/users/user' && request.method() === 'GET') {
        return state.authenticated ? json({ name: 'QA Favorites', email: 'favorites@example.invalid' }) : json({}, 401);
      }
      if (path === '/api/users/login' && request.method() === 'POST') {
        state.authenticated = true;
        return route.fulfill({ status: 200, body: 'Logged in' });
      }
      if (path === '/api/users/logout' && request.method() === 'POST') {
        state.authenticated = false;
        return json({});
      }
      if (path === '/api/users/getfavorites' && request.method() === 'GET') {
        return state.authenticated ? json(favoriteAds.filter(ad => state.ids.has(ad.id))) : json({}, 401);
      }
      const update = path.match(/^\/api\/users\/user\/updatefavorite\/(\d+)$/);
      if (update && request.method() === 'POST') {
        const id = Number(update[1]);
        state.updates.push(id);
        if (!state.authenticated || state.failure === '401') { state.authenticated = false; return json({}, 401); }
        if (state.failure === '500') return json({}, 500);
        if (state.failure === 'network') return route.abort('failed');
        const ad = favoriteAds.find(item => item.id === id);
        if (!ad) return json({}, 500);
        state.ids.has(id) ? state.ids.delete(id) : state.ids.add(id);
        return json(ad);
      }
      if (path === '/api/advertisement/getadvertisements' && request.method() === 'GET') return json(favoriteAds);
      const detail = path.match(/^\/api\/advertisement\/getadvertisement\/(\d+)$/);
      if (detail && request.method() === 'GET') return json(favoriteAds.find(ad => ad.id === Number(detail[1])));
      if (request.method() === 'GET' && [
        '/api/users/getadvertisements', '/api/users/user/getlastsearches', '/api/users/user/getnotes',
      ].includes(path)) return json([]);
      if (path === '/api/users/user/userstatistics' && request.method() === 'GET') return json({});
      if (path.startsWith('/api/') || !['GET', 'HEAD'].includes(request.method())) {
        unexpected.push(`${request.method()} ${path}`);
        return route.abort('blockedbyclient');
      }
      if (url.origin !== new URL(baseURL).origin) return route.abort('blockedbyclient');
      return route.continue();
    });
    await use();
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('synthetic-favorites-state', { contentType: 'application/json',
        body: JSON.stringify({ ids: [...state.ids], updates: state.updates, errors }) });
    }
    expect(unexpected, 'All API traffic must be explicitly controlled; no real mutations').toEqual([]);
  }, { auto: true }],
  favoritesPage: async ({ page, network }, use) => { await use(new FavoritesPage(page)); },
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  homePage: async ({ page }, use) => { await use(new HomePage(page)); },
});
export { expect } from '@playwright/test';
