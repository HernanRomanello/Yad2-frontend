import { test, expect } from '../../fixtures/search.fixture';
import { booleanFilters, makeAd } from '../../fixtures/search-data';

for (const mobile of [false, true]) {
  test.describe(`Additional property filters ${mobile ? 'mobile' : 'desktop'}`, () => {
    if (mobile) test.use({ viewport: { width: 390, height: 844 } });
    for (const filter of booleanFilters) {
      test.describe(filter[1], () => {
        test.use({ searchData: { ads: [makeAd(1, { [filter[1]]: true }), makeAd(2), makeAd(3, { [filter[1]]: true, tradeType: 'השכרה' })] } });
        test('applies immediately, excludes nonmatches, and clearing restores results', async ({ searchPage }) => {
          await searchPage.open();
          const open = () => mobile ? searchPage.openMobileFilters() : searchPage.openAdditional();
          const apply = () => mobile ? searchPage.applyMobileFilters() : searchPage.additional.apply();
          await open();
          await searchPage.additional.toggle(filter);
          await expect(searchPage.titles).toHaveText(['QA Search 2 1', 'QA Search 1 1']);
          await apply();
          await expect(searchPage.titles).toHaveText(['QA Search 1 1']);
          await open();
          await searchPage.additional.toggle(filter);
          await apply();
          await expect(searchPage.titles).toHaveText(['QA Search 2 1', 'QA Search 1 1']);
        });
      });
    }
    test.describe('Independent pets and roommates', () => {
      test.use({ searchData: { ads: [makeAd(1, { petsAllowed: true }), makeAd(2, { forRoommates: true }), makeAd(3, { petsAllowed: true, forRoommates: true }), makeAd(4)] } });
      test('pets and roommates intersect only when both are selected', async ({ searchPage }) => {
        const open = () => mobile ? searchPage.openMobileFilters() : searchPage.openAdditional();
        const apply = () => mobile ? searchPage.applyMobileFilters() : searchPage.additional.apply();
        const pets = booleanFilters.find(f => f[1] === 'petsAllowed')!;
        const roommates = booleanFilters.find(f => f[1] === 'forRoommates')!;
        await searchPage.open();
        await open(); await searchPage.additional.toggle(pets); await apply();
        await expect(searchPage.titles).toHaveText(['QA Search 3 1', 'QA Search 1 1']);
        await open(); await searchPage.additional.toggle(roommates); await apply();
        await expect(searchPage.titles).toHaveText(['QA Search 3 1']);
        await open(); await searchPage.additional.toggle(pets); await apply();
        await expect(searchPage.titles).toHaveText(['QA Search 3 1', 'QA Search 2 1']);
        await open(); await searchPage.additional.reset();
        await expect(searchPage.titles).toHaveText([4, 3, 2, 1].map(id => `QA Search ${id} 1`));
      });
    });
    test('cancel discards ranges; applied ranges survive reopening; reset clears all', async ({ searchPage }) => {
      const open = () => mobile ? searchPage.openMobileFilters() : searchPage.openAdditional();
      const apply = () => mobile ? searchPage.applyMobileFilters() : searchPage.additional.apply();
      await searchPage.open(); await open();
      await searchPage.additional.floors('2', '18');
      await searchPage.additional.size('120', '80');
      await searchPage.additional.close();
      if (!mobile) await searchPage.submit();
      await expect(searchPage.titles).toHaveText([104, 103, 102, 101].map(id => `QA Search ${id} 1`));
      await open(); await searchPage.additional.floors('18', '2'); await searchPage.additional.size('120', '80'); await apply();
      await expect(searchPage.titles).toHaveText([103, 102].map(id => `QA Search ${id} 1`));
      await open(); await searchPage.additional.close();
      await expect(searchPage.titles).toHaveText([103, 102].map(id => `QA Search ${id} 1`));
      await open(); await searchPage.additional.reset();
      await expect(searchPage.titles).toHaveText([104, 103, 102, 101].map(id => `QA Search ${id} 1`));
    });
  });
}

test.describe('Verified listing field mappings', () => {
  test.use({ searchData: { ads: [
    makeAd(1, { airConditioning: true, airConditioner: false, priceDiscount: true }),
    makeAd(2, { airConditioning: false, airConditioner: true, priceDiscount: false }),
  ] } });
  test('general air conditioning uses airConditioning and price reduction uses priceDiscount', async ({ searchPage }) => {
    await searchPage.open(); await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters.find(f => f[1] === 'airConditioning')!);
    await searchPage.additional.toggle(booleanFilters.find(f => f[1] === 'priceDiscount')!);
    await searchPage.additional.apply();
    await expect(searchPage.titles).toHaveText(['QA Search 1 1']);
  });
});

test.describe('Missing backend exclusivity field', () => {
  test.use({ searchData: { ads: [makeAd(1, { exclusivity: undefined }), makeAd(2, { exclusivity: false })] } });
  test('unknown exclusivity never matches and shows the existing no-results state', async ({ searchPage }) => {
    await searchPage.open(); await searchPage.openAdditional();
    await searchPage.additional.toggle(booleanFilters.find(f => f[1] === 'exclusivity')!);
    await searchPage.additional.apply();
    await expect(searchPage.titles).toHaveCount(0);
    await expect(searchPage.results.getByText('שחיפשת לא נמצא', { exact: true })).toBeVisible();
  });
});

