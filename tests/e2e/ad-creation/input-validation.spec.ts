import { test, expect } from '../../fixtures/ad-creation.fixture';

test.beforeEach(async ({ ad }) => { await ad.open(); });

for (const field of ['price', 'houseCommitteePayment', 'municipalityMonthlyPropertyTax', 'builtSquareMeters', 'gardenSquareMeters', 'totalSquareMeters']) {
  for (const value of ['-12', '1.5', 'abc', ' ', '9007199254740992']) {
    test(field + ' rejects and preserves ' + JSON.stringify(value), async ({ ad, state }) => {
      await ad.toPayment(); await ad.payment();
      await ad.field(field).fill(value);
      await expect(ad.field(field)).toHaveValue(value);
      await expect(ad.error(field)).toBeVisible();
      await ad.next(4);
      await expect(ad.section(4)).toBeVisible();
      expect(state.submissions).toEqual([]);
      expect(state.uploads).toBe(0);
      await ad.field(field).fill('100'); await ad.next(4);
      await expect(ad.section(5)).toBeVisible();
    });
  }
}

test('typed invalid number remains unchanged and blocks native submit', async ({ ad, page, state }) => {
  await ad.address();
  await ad.field('number').fill('');
  await ad.field('number').pressSequentially('-1.5');
  await expect(ad.field('number')).toHaveValue('-1.5');
  await expect(ad.error('number')).toBeVisible();
  await ad.field('number').press('Enter');
  await expect(ad.section(2)).toBeVisible();
  expect(state.submissions).toEqual([]); expect(state.uploads).toBe(0);
});

test('pasted fractional area is preserved and rejected', async ({ ad, page, context, state }) => {
  await ad.toPayment(); await ad.payment();
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate(() => navigator.clipboard.writeText('1.5'));
  await ad.field('totalSquareMeters').focus();
  await ad.field('totalSquareMeters').press('ControlOrMeta+A');
  await ad.field('totalSquareMeters').press('ControlOrMeta+V');
  await expect(ad.field('totalSquareMeters')).toHaveValue('1.5');
  await expect(ad.error('totalSquareMeters')).toBeVisible();
  await ad.next(4); await expect(ad.section(4)).toBeVisible();
  expect(state.submissions).toEqual([]);
});

for (const phone of ['abcdefghij', '1234567890', '050123456', '05012345678', '050-1234567']) {
  test('second contact rejects ' + phone, async ({ ad, state }) => {
    await ad.toContacts();
    await ad.root.locator('.remove-add-contact').click();
    await ad.field('secondContactName').fill('QA second');
    await ad.field('secondContactPhone').fill(phone);
    await ad.consent(); await ad.next(6);
    await expect(ad.error('secondContactPhone')).toBeVisible();
    await expect(ad.field('secondContactPhone')).toHaveValue(phone);
    expect(state.submissions).toEqual([]);
  });
}

for (const [field, value] of [['price', '99'], ['totalSquareMeters', '0']]) {
  test(field + ' enforces its minimum', async ({ ad, state }) => {
    await ad.toPayment(); await ad.payment(); await ad.field(field).fill(value);
    await ad.next(4); await expect(ad.error(field)).toBeVisible();
    await expect(ad.field(field)).toHaveValue(value);
    await expect(ad.section(4)).toBeVisible(); expect(state.submissions).toEqual([]);
  });
}

test('second contact requires a nonblank name', async ({ ad, state }) => {
  await ad.toContacts(); await ad.root.locator('.remove-add-contact').click();
  await ad.field('secondContactName').fill('   ');
  await ad.field('secondContactPhone').fill('0501234567');
  await ad.consent(); await ad.next(6);
  await expect(ad.error('secondContactName')).toBeVisible();
  await expect(ad.section(6)).toBeVisible(); expect(state.submissions).toEqual([]);
});
