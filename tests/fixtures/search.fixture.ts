import { test as base, expect } from '@playwright/test';
import { SearchAdsPage } from '../../pages/SearchAdsPage';
import { defaultAds } from './search-data';
import type { SearchFixtureData } from './search-data';
import { isLoopback } from '../utils/registration';

interface SearchFixtures {
  searchPage: SearchAdsPage;
  searchData: SearchFixtureData;
  network: void;
}

export const test = base.extend<SearchFixtures>({
  searchData: [{ ads: defaultAds }, { option: true }],
  network: [async ({ context, baseURL, searchData }, use, testInfo) => {
    const searchAds = searchData.ads;
    if (!baseURL || !isLoopback(baseURL)) throw new Error('Search suite requires a local frontend.');
    const unexpected: string[] = [];
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      const path = url.pathname.toLowerCase();
      if (path === '/api/advertisement/getadvertisements' && request.method() === 'GET') {
        return route.fulfill({ json: searchAds });
      }
      if (/^\/api\/advertisement\/getadvertisement\/\d+$/.test(path) && request.method() === 'GET') {
        const ad = searchAds.find(item => item.id === Number(path.split('/').pop()));
        return route.fulfill({ status: ad ? 200 : 404, json: ad || {} });
      }
      if (path === '/api/users/user/addlastsearch' && request.method() === 'POST') {
        return route.fulfill({ status: 200, json: {} });
      }
      if (path === '/api/users/user/getlastsearches' && request.method() === 'GET') {
        return route.fulfill({ json: [] });
      }
      if (path === '/api/users/user' && request.method() === 'GET') {
        return route.fulfill({ status: 401, json: {} });
      }
      if (path === '/assets/json/citylists.txt') {
        return route.fulfill({ json: ['חיפה', 'תל אביב יפו', 'באר שבע', 'ירושלים', 'עכו', 'אילת'].map(city_name_he => ({ city_name_he })) });
      }
      if (path === '/assets/json/streetlists.txt') {
        return route.fulfill({ json: [{ City_Name: 'חיפה', Street_Name: 'הדר', Street_Code: 1 },
          { City_Name: 'חיפה', Street_Name: 'כרמל', Street_Code: 2 },
          { City_Name: 'חיפה', Street_Name: 'QA Search 101', Street_Code: 3 }] });
      }
      if (path.startsWith('/api/') || !['GET', 'HEAD'].includes(request.method())) {
        unexpected.push(`${request.method()} ${url.pathname}`);
        return route.abort('blockedbyclient');
      }
      if (url.origin !== new URL(baseURL).origin) return route.abort('blockedbyclient');
      return route.continue();
    });
    await use();
    await testInfo.attach('search-fixture-data', { body: JSON.stringify(searchAds), contentType: 'application/json' });
    expect(unexpected, 'No unhandled API calls or real mutations').toEqual([]);
  }, { auto: true }],
  searchPage: async ({ page, network, searchData }, use) => { await use(new SearchAdsPage(page, searchData.ads)); },
});
export { expect } from '@playwright/test';
