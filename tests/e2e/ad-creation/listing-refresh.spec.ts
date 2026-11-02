import { test, expect } from '../../fixtures/ad-creation.fixture';
import { makeAd } from '../../fixtures/search-data';
import { SearchAdsPage } from '../../../pages/SearchAdsPage';

test('new ad appears in public results after creation without reloading', async ({ ad, page, state }) => {
  const savedAd = makeAd(991, { street: 'QA Newly Created', tradeType: 'מכירה' });
  await page.route('**/api/Advertisement/GetAdvertisements', route =>
    route.fulfill({ json: state.submissions.length ? [savedAd] : [] }));
  await ad.open('מכירה');
  await ad.toPayment();
  await ad.payment();
  await ad.field('price').fill('10000');
  await ad.next(4);
  await ad.next(5);
  await ad.consent();
  await ad.next(6);
  await ad.publishFree();
  await expect(page).toHaveURL(/confirmation-modal$/);
  await page.locator('app-post-ad-confirmation-modal').getByRole('button', { name: 'נדל"ן', exact: true }).click();
  const search = new SearchAdsPage(page);
  await expect(search.titles).toHaveText(['QA Newly Created 1']);
  expect(state.submissions).toHaveLength(1);
});

test('failed creation does not refresh public listings or show confirmation', async ({ ad, page, state }) => {
  let listingRequests = 0;
  await page.route('**/api/Advertisement/GetAdvertisements', route => {
    listingRequests++;
    return route.fulfill({ json: [] });
  });
  await ad.open();
  await ad.toPlan();
  const requestsBeforeSubmit = listingRequests;
  expect(requestsBeforeSubmit).toBeGreaterThan(0);
  state.failure = '500';
  const response = page.waitForResponse(response =>
    response.url().endsWith('/api/Users/CreateAdvertisement') && response.status() === 500);
  await ad.publishFree();
  await response;
  await expect(ad.section(7)).toBeVisible();
  await expect(page).not.toHaveURL(/confirmation-modal$/);
  expect(state.submissions).toHaveLength(1);
  expect(listingRequests).toBe(requestsBeforeSubmit);
});
