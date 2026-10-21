import { test, expect } from '../../fixtures/search.fixture';

test('exported sale listings show the expected addresses in date order', async ({ searchPage }) => {
  await searchPage.open();
  await expect(searchPage.titles).toHaveText([
    'וילנה 1', 'נחל פארן 1', 'אביר יעקב 5', 'מלון ויסטה 6', 'בתי לוינסון 1',
    'ליטאני 6', 'הר ארגמן 5', 'לוי אשכול 6', 'ויצמן 7', 'הכנסת 5',
  ]);
  await expect(searchPage.cards.filter({ hasText: 'וילנה 1' })).toContainText('900,000');
  await expect(searchPage.cards.filter({ hasText: 'ליטאני 6' })).toContainText('600,000');
  await expect(searchPage.cards.filter({ hasText: 'לוי אשכול 6' })).toContainText('לא צוין מחיר');
});
