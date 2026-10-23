import { test, expect } from '../../fixtures/search.fixture';
import { booleanFilters, makeAd, saleIds } from '../../fixtures/search-data';

test.describe('Multiple locations', () => {
  test('selected cities are combined with OR', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.chooseLocation('חיפה');
    await searchPage.addLocation('תל אביב יפו');
    await expect(searchPage.titles).toHaveText([103, 102, 101].map(id => `QA Search ${id} 1`));
  });
  test('duplicate city is not added twice', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.chooseLocation('חיפה');
    await searchPage.addLocation('חיפה');
    await searchPage.showSelectedLocations();
    await expect(searchPage.location.locator('.location-list')).toHaveCount(1);
    await expect(searchPage.titles).toHaveText([103, 101].map(id => `QA Search ${id} 1`));
  });
  test('removing one city preserves the other selection', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.chooseLocation('חיפה');
    await searchPage.addLocation('תל אביב יפו');
    await searchPage.removeLocation('חיפה');
    await expect(searchPage.location.locator('.location-list')).toHaveText(['תל אביב יפו']);
    await searchPage.confirmLocations();
    await expect(searchPage.titles).toHaveText(['QA Search 102 1']);
  });
  test('at most five distinct locations can be selected', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.chooseLocation('חיפה');
    for (const city of ['תל אביב יפו', 'באר שבע', 'ירושלים', 'עכו', 'אילת']) {
      await searchPage.addLocation(city);
    }
    await searchPage.showSelectedLocations();
    await expect(searchPage.location.locator('.location-list')).toHaveCount(5);
    await expect(searchPage.location.locator('.location-list').filter({ hasText: 'אילת' })).toHaveCount(0);
    await expect(searchPage.titles).toHaveText(saleIds.map(id => `QA Search ${id} 1`));
  });
});

test.describe('Range keyboard interactions', () => {
  test('price slider updates the minimum and filters results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.increaseMinimumPrice();
    await expect(searchPage.titles).toHaveText([103, 102, 101].map(id => `QA Search ${id} 1`));
  });
  test('floor slider at its maximum includes the top floor only', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.setMinimumFloorToTop();
    await searchPage.additional.apply();
    await searchPage.submit();
    await expect(searchPage.titles).toHaveText(['QA Search 103 1']);
  });
});

test.describe('Date sort with nonsequential creation dates', () => {
  test.use({ searchData: { ads: [
    makeAd(1, { creationDate: '2026-10-01T00:00:00Z' }),
    makeAd(2, { creationDate: '2026-01-01T00:00:00Z' }),
    makeAd(3, { creationDate: '2026-06-01T00:00:00Z' }),
  ] } });
  test('date sort orders by creation date instead of ID', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.sort('תאריך');
    await expect(searchPage.titles).toHaveText([1, 3, 2].map(id => `QA Search ${id} 1`));
  });
});

test.describe('Additional filter draft changes', () => {
  test('closing an unapplied amenity selection leaves results unchanged', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[6]);
    await searchPage.additional.close();
    await searchPage.submit();
    await expect(searchPage.titles).toHaveText(saleIds.map(id => `QA Search ${id} 1`));
  });
  test('closing an edit retains previously applied amenities', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[6]);
    await searchPage.additional.apply();
    await searchPage.submit();
    await expect(searchPage.titles).toHaveText([103, 102].map(id => `QA Search ${id} 1`));
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[7]);
    await searchPage.additional.close();
    await searchPage.submit();
    await expect(searchPage.titles).toHaveText([103, 102].map(id => `QA Search ${id} 1`));
  });
});

test.describe('Mobile search controls', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('mobile property selection filters results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openMobileFilters();
    await searchPage.mobileProperty('דירת גן');
    await searchPage.applyMobileFilters();
    await expect(searchPage.titles).toHaveText(['QA Search 102 1']);
  });
  test('clearing the last mobile property restores sale results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openMobileFilters();
    await searchPage.mobileProperty('דירת גן');
    await searchPage.applyMobileFilters();
    await expect(searchPage.titles).toHaveText(['QA Search 102 1']);
    await searchPage.openMobileFilters();
    await searchPage.mobileProperty('דירת גן');
    await searchPage.applyMobileFilters();
    await expect(searchPage.titles).toHaveText([104, 103, 102, 101].map(id => `QA Search ${id} 1`));
  });
  test('mobile room selection filters fractional rooms', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openMobileFilters();
    await searchPage.mobileRooms(['3.5']);
    await searchPage.applyMobileFilters();
    await expect(searchPage.titles).toHaveText(['QA Search 102 1']);
  });
  test('mobile rent selection excludes sale ads', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openMobileFilters();
    await searchPage.mobileTrade('השכרה');
    await searchPage.applyMobileFilters();
    await expect(searchPage.titles).toHaveText(['QA Search 105 1']);
  });
  test('mobile price range includes both endpoints', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openMobileFilters();
    await searchPage.mobilePrice('1000000', '2000000');
    await searchPage.applyMobileFilters();
    await expect(searchPage.titles).toHaveText([102, 101].map(id => `QA Search ${id} 1`));
  });
  test('mobile city and room criteria intersect', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openMobileFilters();
    await searchPage.mobileLocation('חיפה');
    await searchPage.mobileRooms(['+6']);
    await searchPage.applyMobileFilters();
    await expect(searchPage.titles).toHaveText(['QA Search 103 1']);
  });
});
