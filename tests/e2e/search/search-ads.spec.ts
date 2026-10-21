import { test, expect } from '../../fixtures/search.fixture';
import { booleanFilters, makeAd, propertyTypes, saleIds } from '../../fixtures/search-data';
import type { SearchAdsPage } from '../../../pages/SearchAdsPage';

async function expectResults(search: SearchAdsPage, ids: number[]) {
  await expect(search.titles).toHaveText(ids.map(id => `QA Search ${id} 1`));
  if (ids.length) await expect(search.results.getByText(`${ids.length} תוצאות`, { exact: false })).toBeVisible();
  else await expect(search.results.getByText('שחיפשת לא נמצא', { exact: true })).toBeVisible();
}

test.describe('Search defaults and trade type', () => {
  test('initial search shows only sale ads in date order', async ({ searchPage }) => {
    await searchPage.open();
    await expectResults(searchPage, saleIds);
  });
  test('empty search preserves all sale results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.submit();
    await expectResults(searchPage, saleIds);
  });
  test('switching between rent and sale replaces results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.trade('השכרה');
    await expectResults(searchPage, [105]);
    await searchPage.trade('מכירה');
    await expectResults(searchPage, saleIds);
  });
});

for (const assetType of propertyTypes) {
  test.describe(`Property type: ${assetType}`, () => {
    test.use({ searchData: { ads: [makeAd(1, { assetType }), makeAd(2, { assetType: assetType === 'כללי' ? 'דירה' : 'כללי' }), makeAd(3, { assetType, tradeType: 'השכרה' })] } });
    test('includes matching type and excludes other types and rental ads', async ({ searchPage }) => {
      await searchPage.open();
      await searchPage.properties([assetType]);
      await expectResults(searchPage, [1]);
    });
  });
}

test.describe('Property multi-selection and clearing', () => {
  test('multiple property types use OR semantics', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.properties(['דירה', 'דירת גן']);
    await expectResults(searchPage, saleIds);
  });
  for (const group of ['apartments', 'houses'] as const) {
    test.describe(`All ${group}`, () => {
      const types = group === 'apartments' ? propertyTypes.slice(0, 11) : propertyTypes.slice(11, 15);
      test.use({ searchData: { ads: [
        ...types.map((assetType, index) => makeAd(index + 1, { assetType })),
        makeAd(90, { assetType: 'כללי' }),
        makeAd(91, { assetType: types[0], tradeType: 'השכרה' }),
      ] } });
      test(`select all ${group} includes every type in that group`, async ({ searchPage }) => {
        await searchPage.open();
        await searchPage.propertyGroup(group);
        await expectResults(searchPage, types.map((_, index) => index + 1).reverse());
      });
    });
  }
  test('deselecting the last property restores all sale results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.properties(['דירת גן']);
    await expectResults(searchPage, [102]);
    await searchPage.toggleProperty('דירת גן');
    await expectResults(searchPage, saleIds);
  });
});

for (const filter of booleanFilters) {
  test.describe(`Additional filter: ${filter[0]}`, () => {
    test.use({ searchData: { ads: [makeAd(1, { [filter[1]]: true }), makeAd(2), makeAd(3, { [filter[1]]: true, tradeType: 'השכרה' })] } });
    test('keeps only matching sale ads', async ({ searchPage }) => {
      await searchPage.open();
      await searchPage.openAdditional();
      await searchPage.additional.toggle(filter);
      await searchPage.additional.apply();
      await searchPage.submit();
      await expectResults(searchPage, [1]);
    });
  });
}

test.describe('Rooms', () => {
  for (const room of ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '+6']) {
    test.describe(`Room choice ${room}`, () => {
      test.use({ searchData: { ads: [makeAd(1, { rooms: room === '+6' ? '6' : room }), makeAd(2, { rooms: '7' }), makeAd(3, { rooms: '0.5' })] } });
      test('filters exact rooms or the open-ended six-plus boundary', async ({ searchPage }) => {
        await searchPage.open();
        await searchPage.rooms([room]);
        await expectResults(searchPage, room === '+6' ? [2, 1] : [1]);
      });
    });
  }
  for (const range of [['1', '3.5'], ['3.5', '1']]) {
    test(`room range ${range.join(' to ')} includes both boundaries`, async ({ searchPage }) => {
      await searchPage.open();
      await searchPage.rooms(range);
      await expectResults(searchPage, [102, 101]);
    });
  }
  test('third room selection starts a new range', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.rooms(['1', '3.5', '+6']);
    await expectResults(searchPage, [104, 103]);
  });
});

test.describe('Price inputs and boundaries', () => {
  const cases = [
    { name: 'inclusive min and max', min: '1000000', max: '2000000', ids: [102, 101] },
    { name: 'equal endpoints', min: '2000000', max: '2000000', ids: [102] },
    { name: 'zero lower boundary includes unpriced ads', min: '0', max: '1000000', ids: [104, 101] },
    { name: 'full supported range', min: '0', max: '20000000', ids: saleIds },
    { name: 'no matching prices', min: '4000000', max: '5000000', ids: [] },
    { name: 'formatted numeric input', min: '1,000,000', max: '2,000,000', ids: [102, 101] },
  ];
  for (const item of cases) test(item.name, async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.price(item.min, item.max);
    await expectResults(searchPage, item.ids);
  });
  for (const invalid of ['', 'abc', '-100', '20000001']) {
    test(`invalid upper price ${JSON.stringify(invalid)} cannot silently remove all results`, async ({ searchPage }) => {
      await searchPage.open();
      await searchPage.price('0', invalid);
      await expectResults(searchPage, saleIds);
    });
  }
});

test.describe('Sorting and interaction with filters', () => {
  for (const item of [
    { label: 'תאריך', ids: saleIds },
    { label: 'מחיר - מהזול ליקר', ids: [104, 101, 102, 103] },
    { label: 'מחיר - מהיקר לזול', ids: [103, 102, 101, 104] },
  ]) test(item.label, async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.sort(item.label);
    await expectResults(searchPage, item.ids);
  });
  test('near me currently uses ascending listing ID', async ({ searchPage }) => {
    test.info().annotations.push({ type: 'implementation-gap', description: 'No coordinates or geolocation implementation; current near-me sorter uses ascending ID.' });
    await searchPage.open();
    await searchPage.sort('קרוב אלי');
    // Characterize the implemented ordering without claiming geographic accuracy.
    await expectResults(searchPage, [101, 102, 103, 104]);
  });
  test('changing sort repeatedly uses the latest selection', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.sort('מחיר - מהזול ליקר');
    await expectResults(searchPage, [104, 101, 102, 103]);
    await searchPage.sort('מחיר - מהיקר לזול');
    await expectResults(searchPage, [103, 102, 101, 104]);
    await searchPage.sort('תאריך');
    await expectResults(searchPage, saleIds);
  });
  test('active price sort is retained when filtering rooms', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.sort('מחיר - מהזול ליקר');
    await searchPage.rooms(['1', '3.5']);
    await expectResults(searchPage, [101, 102]);
  });
});

test.describe('Location search', () => {
  for (const item of [
    { query: 'חיפה', kind: 'city', ids: [103, 101] },
    { query: 'הדר', kind: 'neighborhood', ids: [101] },
    { query: 'חיפה', kind: 'area', ids: [103, 101] },
    { query: 'QA Search 101', kind: 'street', ids: [101] },
    { query: 'ירושלים', kind: 'city', ids: [] },
  ] as const) test(`${item.kind}: ${item.query}`, async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.chooseLocation(item.query, item.kind);
    await expectResults(searchPage, [...item.ids]);
  });
  for (const input of ['ח', '   ', 'unknown-location-!@#']) {
    test(`unselected input ${JSON.stringify(input)} does not apply a location filter`, async ({ searchPage }) => {
      await searchPage.open();
      await searchPage.typeLocation(input);
      await expect(searchPage.location.locator('#city-option')).toHaveCount(0);
      await searchPage.submit();
      await expectResults(searchPage, saleIds);
    });
  }
  test('clear selected city restores all sale results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.chooseLocation('חיפה');
    await expectResults(searchPage, [103, 101]);
    await searchPage.clearLocation();
    await expectResults(searchPage, saleIds);
  });
});

test.describe('Ranges, combinations and reset', () => {
  for (const item of [
    { min: '2', max: '18', ids: [103, 102] },
    { min: '2', max: '2', ids: [102] },
    { min: '18', max: '2', ids: [103, 102] },
    { min: 'מרתף', max: 'קרקע', ids: [104, 101] },
  ]) test(`floor ${item.min} to ${item.max}`, async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.floors(item.min, item.max);
    await searchPage.additional.apply();
    await searchPage.submit();
    await expectResults(searchPage, item.ids);
  });
  for (const item of [
    { min: '80', max: '120', ids: [103, 102] },
    { min: '80', max: '80', ids: [102] },
    { min: '0', max: '500', ids: saleIds },
    { min: '200', max: '300', ids: [] },
  ]) test(`square meters ${item.min} to ${item.max}`, async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.size(item.min, item.max);
    await searchPage.additional.apply();
    await searchPage.submit();
    await expectResults(searchPage, item.ids);
  });
  test('city, rooms, price, amenities and sort intersect', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.chooseLocation('חיפה');
    await searchPage.rooms(['3.5', '+6']);
    await searchPage.price('2000000', '3000000');
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[6]);
    await searchPage.additional.toggle(booleanFilters[7]);
    await searchPage.additional.apply();
    await searchPage.submit();
    await searchPage.sort('מחיר - מהזול ליקר');
    await expectResults(searchPage, [103]);
  });
  test('incompatible amenity combination shows no results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[6]);
    await searchPage.additional.toggle(booleanFilters[8]);
    await searchPage.additional.apply();
    await searchPage.submit();
    await expectResults(searchPage, []);
  });
  test('unchecking an amenity restores excluded results', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[6]);
    await searchPage.additional.apply();
    await searchPage.submit();
    await expectResults(searchPage, [103, 102]);
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[6]);
    await searchPage.additional.apply();
    await searchPage.submit();
    await expectResults(searchPage, saleIds);
  });
  test('reset clears amenities', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters[6]);
    await searchPage.additional.apply();
    await searchPage.submit();
    await expectResults(searchPage, [103, 102]);
    await searchPage.openAdditional();
    await searchPage.additional.reset();
    await searchPage.submit();
    await expectResults(searchPage, saleIds);
  });
  test('reset clears numeric ranges too', async ({ searchPage }) => {
    await searchPage.open();
    await searchPage.openAdditional();
    await searchPage.additional.size('80', '120');
    await searchPage.additional.apply();
    await searchPage.submit();
    await expectResults(searchPage, [103, 102]);
    await searchPage.openAdditional();
    await searchPage.additional.reset();
    await searchPage.submit();
    await expectResults(searchPage, saleIds);
  });
});

test.describe('Navigation, refresh and empty data', () => {
  test('result opens its details and back retains service filter state', async ({ searchPage, page }) => {
    await searchPage.open();
    await searchPage.rooms(['3.5']);
    await expectResults(searchPage, [102]);
    await searchPage.openResult(102);
    await expect(page).toHaveURL(/\/advertisement\/102$/);
    await expect(page.locator('app-advertisement')).toContainText('QA Search 102');
    await page.goBack();
    await expectResults(searchPage, [102]);
  });
  test('refresh resets transient filters and leaves URL unchanged', async ({ searchPage, page }) => {
    await searchPage.open();
    await searchPage.rooms(['3.5']);
    await expectResults(searchPage, [102]);
    expect(new URL(page.url()).search).toBe('');
    await page.reload();
    await expectResults(searchPage, saleIds);
  });
  test.describe('Empty API dataset', () => {
    test.use({ searchData: { ads: [] } });
    test('shows no-results message and no cards', async ({ searchPage }) => {
      await searchPage.open();
      await expectResults(searchPage, []);
    });
  });
});
