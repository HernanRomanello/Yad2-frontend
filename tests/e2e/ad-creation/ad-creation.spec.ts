import { test, expect } from '../../fixtures/ad-creation.fixture';

test.beforeEach(async ({ ad }) => { await ad.open(); });

test('completes the rental flow and submits entered values to the simulated API', async ({ ad, state, page }) => {
  await ad.toImages();
  await ad.image(); await expect(ad.previews).toHaveCount(1);
  await ad.next(5); await expect(ad.field('contactName')).toHaveValue('QA');
  await ad.consent(); await ad.next(6);
  await expect(ad.section(7)).toBeVisible();
  expect(state.submissions).toEqual([]);
  await ad.publishFree();
  await expect.poll(() => state.submissions.length).toBe(1);
  expect(state.submissions[0]).toMatchObject({ city: 'עיר בדיקה', street: 'רחוב בדיקה', number: 12, floor: 2, totalFloors: 5,
    tradeType: 'השכרה', assetType: 'דירה', rooms: '3', totalSquareMeters: 80, price: 4800,
    description: 'דירת בדיקה QA בלבד', contactName: 'QA', contactPhone: '0501234567', standardizationAccepted: true });
  expect(state.submissions[0].pictures).toEqual([expect.stringContaining('/assets/images/ad1.jpg')]);
  await expect(page).toHaveURL(/confirmation-modal$/);
  await expect(page.getByText('תודה שבחרתם בלוח יד 2')).toBeVisible();
});

for (const field of ['floor', 'totalFloors']) {
  for (const value of ['', ' ', '-1', '1.5', 'abc', ' 2 ']) {
    test(`address rejects ${field}=${JSON.stringify(value)} and clears error after correction`, async ({ ad, state }) => {
      await ad.address(); await ad.field(field).fill(value); await ad.next(2);
      await expect(ad.section(2)).toBeVisible(); await expect(ad.error(field)).toBeVisible();
      expect(state.submissions).toEqual([]);
      await ad.field(field).fill('2'); await ad.next(2); await expect(ad.section(3)).toBeVisible();
      await ad.back(3); await expect(ad.error(field)).toBeHidden();
    });
  }
}

test('empty address shows required errors without progressing', async ({ ad, state }) => {
  await ad.next(2);
  for (const field of ['city', 'street', 'floor', 'totalFloors', 'assetType', 'assetState']) await expect(ad.error(field)).toBeVisible();
  await expect(ad.section(3)).toHaveCount(0); expect(state.submissions).toEqual([]);
});

for (const phone of ['', ' ', '123456789', '12345678901', '050-1234567', '+972501234567', 'abcdefghij', ' 0501234567 ']) {
  test(`contact rejects phone ${JSON.stringify(phone)}`, async ({ ad, state }) => {
    await ad.toContacts(); await ad.consent(); await ad.field('contactPhone').fill(phone); await ad.next(6);
    await expect(ad.error('contactPhone')).toBeVisible(); await expect(ad.section(6)).toBeVisible();
    expect(state.submissions).toEqual([]);
    await ad.field('contactPhone').fill('0501234567'); await ad.next(6);
    await ad.publishFree();
    await expect.poll(() => state.submissions.length).toBe(1);
  });
}

for (const value of ['', '-1', '1.5', 'abc', ' ']) {
  test(`area rejects ${JSON.stringify(value)}`, async ({ ad }) => {
    await ad.toPayment(); await ad.payment(); await ad.field('totalSquareMeters').fill(value); await ad.next(4);
    await expect(ad.error('totalSquareMeters')).toBeVisible(); await expect(ad.section(4)).toBeVisible();
  });
}

test('required rooms, date, area and payments prevent progression', async ({ ad }) => {
  await ad.toDetails(); await ad.next(3); await expect(ad.error('rooms')).toBeVisible();
  await ad.choose(3, 'rooms', '3'); await ad.next(3); await ad.next(4);
  for (const field of ['entryDate', 'totalSquareMeters', 'numberOfPayments']) await expect(ad.error(field)).toBeVisible();
});

for (const text of ['', 'a', 'עברית English 😀 !@#', '  spaces  ', '<b>plain text</b>', "' OR '1'='1", 'א'.repeat(399), 'a'.repeat(400), 'a'.repeat(401)]) {
  test(`description handles literal text length ${text.length}: ${text.slice(0, 25)}`, async ({ ad }) => {
    await ad.toDetails(); await ad.field('description').fill(text);
    await expect(ad.field('description')).toHaveValue(text.slice(0, 400));
    await ad.choose(3, 'rooms', '3'); await ad.next(3); await ad.back(4);
    await expect(ad.field('description')).toHaveValue(text.slice(0, 400));
    await expect(ad.root.locator('script')).toHaveCount(0);
  });
}

test('back and forward preserve address and pricing values', async ({ ad }) => {
  await ad.toImages(); await ad.back(5);
  await expect(ad.field('price')).toHaveValue('4800'); await expect(ad.field('totalSquareMeters')).toHaveValue('80');
  await ad.back(4); await expect(ad.field('rooms')).toContainText('3');
  await ad.back(3); await expect(ad.field('city')).toHaveValue('עיר בדיקה');
  await expect(ad.field('assetType')).toContainText('דירה');
  await ad.next(2); await ad.next(3); await ad.next(4); await expect(ad.section(5)).toBeVisible();
});

test('refresh resets the unsaved draft without submitting', async ({ ad, page, state }) => {
  await ad.toPayment(); await page.reload(); await expect(ad.section(1)).toBeVisible(); expect(state.submissions).toEqual([]);
});

test('ten image limit and removal allow a replacement without uploading early', async ({ ad, state }) => {
  await ad.toImages();
  for (let i = 0; i < 11; i++) await ad.image(`qa-${i}.png`);
  await expect(ad.previews).toHaveCount(10); expect(state.uploads).toBe(0);
  await ad.removeImage(0); await expect(ad.previews).toHaveCount(9);
  await ad.image('replacement.png'); await expect(ad.previews).toHaveCount(10);
});

test('address inputs have accessible labels and accept keyboard focus', async ({ ad }) => {
  const city = ad.root.getByRole('textbox', { name: 'ישוב*', exact: true });
  await city.focus(); await expect(city).toBeFocused(); await city.press('Tab');
  await expect(ad.field('street')).toBeFocused();
});

for (const failure of ['500', 'network'] as const) {
  test(`failed submission preserves data and can be retried: ${failure}`, async ({ ad, state, page }) => {
    state.failure = failure; await ad.toPlan(); await ad.publishFree();
    await expect.poll(() => state.submissions.length).toBe(1);
    await expect(page).not.toHaveURL(/confirmation-modal$/);
    await ad.back(7); await expect(ad.field('contactName')).toHaveValue('QA');
    state.failure = undefined; await ad.next(6); await ad.publishFree();
    await expect(page).toHaveURL(/confirmation-modal$/);
  });
}

test('interrupted image upload does not create an ad and permits retry', async ({ ad, state, page }) => {
  state.uploadFailure = true; await ad.toImages(); await ad.image(); await ad.next(5); await ad.consent(); await ad.next(6); await ad.publishFree();
  await expect.poll(() => state.uploads).toBe(1); expect(state.submissions).toEqual([]);
  await expect(page).not.toHaveURL(/confirmation-modal$/);
  state.uploadFailure = false; await ad.publishFree(); await expect(page).toHaveURL(/confirmation-modal$/);
});

// These are ordinary failing regression tests, not skips or expected failures.
test('regression: contact Continue must not publish before plan confirmation', async ({ ad, state, page }) => {
  await ad.toPlan();
  await page.reload(); expect(state.submissions, 'Only explicit final confirmation may publish').toEqual([]);
});

test('consent is required before advancing', async ({ ad, state }) => {
  await ad.toContacts(); await ad.next(6); await expect(ad.error('standardizationAccepted')).toBeVisible();
  await expect(ad.section(6)).toBeVisible(); expect(state.submissions).toEqual([]);
});

for (const value of ['0', '1', '5']) {
  test(`floor digit-only boundary ${value} is retained on back navigation`, async ({ ad }) => {
    await ad.address(); await ad.field('floor').fill(value); await ad.next(2);
    await expect(ad.section(3)).toBeVisible(); await ad.back(3); await expect(ad.field('floor')).toHaveValue(value);
  });
}

test('regression: slow submission is locked against duplicate clicks', async ({ ad, page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  let requests = 0;
  await page.route('**/api/Users/CreateAdvertisement', async route => {
    requests++; await held; await route.fulfill({ status: 500, json: {} });
  });
  try {
    await ad.toPlan(); await ad.publishFree(); await expect.poll(() => requests).toBe(1);
    await expect(page).not.toHaveURL(/confirmation-modal$/);
    await ad.publishFree();
    await expect.poll(() => requests, 'An in-flight submission must not send a second POST').toBe(1);
    const button = page.viewportSize()!.width < 600
      ? ad.section(7).locator('.plan-card').filter({ has: page.getByRole('heading', { name: 'בסיסי', exact: true }) }).getByRole('button') : ad.freeButton();
    await expect(button, 'Submit should be disabled while the response is pending').toBeDisabled();
  } finally { release(); }
});

test('regression: server failure provides a helpful visible message', async ({ ad, state }) => {
  state.failure = '500'; await ad.toPlan(); await ad.publishFree(); await expect.poll(() => state.submissions.length).toBe(1);
  await expect(ad.root.getByRole('alert')).toBeVisible();
});

test('regression: required house number cannot be empty', async ({ ad }) => {
  await ad.address(); await ad.field('number').fill(''); await ad.next(2);
  await expect(ad.section(2)).toBeVisible();
});

test('regression: final step displays entered values for review', async ({ ad, state }) => {
  state.failure = '500'; await ad.toPlan();
  await expect(ad.section(7)).toContainText('עיר בדיקה');
  await expect(ad.section(7)).toContainText('4800');
});

for (const category of ['מכירה', 'מסחרי', 'עסקים למכירה']) {
  test(`selects category ${category} and exposes the address step`, async ({ ad }) => {
    await ad.open(category); await expect(ad.section(2)).toBeVisible();
    await expect(ad.field('assetType')).toBeVisible();
  });
}

test('furniture selection reveals a dependent description and retains it on navigation', async ({ ad }) => {
  await ad.toDetails();
  // Features are clickable divs with no role or test ID in the current template.
  const furniture = ad.section(3).locator('.Feature').filter({ hasText: 'ריהוט' });
  await expect(ad.field('furnituredescription')).toHaveCount(0);
  await furniture.click(); await ad.field('furnituredescription').fill('שולחן QA');
  await ad.choose(3, 'rooms', '3'); await ad.next(3); await ad.back(4);
  await expect(ad.field('furnituredescription')).toHaveValue('שולחן QA');
  await furniture.click(); await expect(ad.field('furnituredescription')).toHaveCount(0);
});

test('immediate entry sets a date and survives navigation', async ({ ad }) => {
  await ad.toPayment(); await ad.payment();
  await ad.section(4).locator('input[formControlName=immediate]').check();
  await expect(ad.field('entryDate')).not.toHaveValue('');
  const date = await ad.field('entryDate').inputValue();
  await ad.next(4); await ad.back(5); await expect(ad.field('entryDate')).toHaveValue(date);
});

for (const invalid of ['Unknown QA', ' ', ' עיר בדיקה ']) {
  test(`rejects city outside catalogue: ${JSON.stringify(invalid)}`, async ({ ad, state }) => {
    await ad.field('city').fill(invalid); await ad.next(2);
    await expect(ad.error('city')).toBeVisible(); await expect(ad.section(2)).toBeVisible();
    expect(state.submissions).toEqual([]);
  });
}

for (const price of ['abc', '-1', '1.5', ' ']) {
  test(`regression: invalid price ${JSON.stringify(price)} blocks the payment step`, async ({ ad }) => {
    await ad.toPayment(); await ad.payment(); await ad.field('price').fill(price); await ad.next(4);
    await expect(ad.section(4)).toBeVisible();
  });
}

test('PNG and JPEG previews can be removed before submission', async ({ ad, state }) => {
  await ad.toImages(); await ad.image();
  await ad.image('qa.jpg', 'image/jpeg', Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGPwJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAAIAAwAAABD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/EH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/EH//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/EH//2Q==', 'base64'));
  await expect(ad.previews).toHaveCount(2);
  await ad.removeImage(1); await ad.removeImage(0); await expect(ad.previews).toHaveCount(0);
  await ad.next(5); await ad.consent(); await ad.next(6); await ad.publishFree();
  await expect.poll(() => state.submissions.length).toBe(1);
  expect(state.submissions[0].pictures).toEqual([]); expect(state.uploads).toBe(0);
});

test('anonymous users cannot enter the guarded creation route', async ({ ad, state, page }) => {
  state.authenticated = false; await page.goto('/create-advertisement');
  await expect(page).toHaveURL(/login$/); await expect(ad.root).toHaveCount(0);
  expect(state.submissions).toEqual([]); expect(state.uploads).toBe(0);
});

test('slow image upload completes before the ad is submitted', async ({ ad, page, state }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  let uploads = 0;
  await page.route('**/api/ImageUpload/UploadImage', async route => {
    uploads++;
    expect(route.request().postDataBuffer()?.toString()).toContain('filename="qa.png"');
    await held; await route.fulfill({ json: { fileUrl: '/assets/images/ad1.jpg' } });
  });
  try {
    await ad.toImages(); await ad.image(); await ad.next(5); await ad.consent(); await ad.next(6); await ad.publishFree();
    await expect.poll(() => uploads).toBe(1);
    expect(state.submissions).toEqual([]); await expect(page).not.toHaveURL(/confirmation-modal$/);
  } finally { release(); }
  await expect(page).toHaveURL(/confirmation-modal$/);
  expect(state.submissions).toHaveLength(1);
  expect(state.submissions[0].pictures).toEqual(['/assets/images/ad1.jpg']);
});

test('regression: whitespace-only contact name is rejected', async ({ ad, state }) => {
  await ad.toContacts(); await ad.field('contactName').fill('   '); await ad.consent(); await ad.next(6);
  await expect(ad.error('contactName')).toBeVisible(); expect(state.submissions).toEqual([]);
});

test('regression: unsupported image type is rejected', async ({ ad, state, page }) => {
  await ad.toImages(); await ad.image('qa.txt', 'text/plain', Buffer.from('synthetic text'));
  await expect(ad.previews, 'Text files must not become image previews').toHaveCount(0);
  await expect(ad.root.getByRole('alert')).toHaveText('ניתן לבחור קובצי תמונה בלבד.');
  await expect(ad.section(5).locator('input[type=file]:not(#video)')).toHaveValue('');
  expect(state.uploads).toBe(0);
  await ad.next(5); await ad.consent(); await ad.next(6); await ad.publishFree();
  await expect(page).toHaveURL(/confirmation-modal$/);
  expect(state.uploads).toBe(0);
  expect(state.submissions).toHaveLength(1);
  expect(state.submissions[0].pictures).toEqual([]);
});

for (const [name, mimeType] of [['qa.pdf', 'application/pdf'], ['qa.mp4', 'video/mp4'], ['qa', '']]) {
  test(`unsupported image selection ${name} preserves existing images and allows correction`, async ({ ad, state, page }) => {
    await ad.toImages(); await ad.image();
    await expect(ad.previews).toHaveCount(1);
    await ad.image(name, mimeType, Buffer.from('synthetic non-image'));
    await expect(ad.previews).toHaveCount(1);
    await expect(ad.root.getByRole('alert')).toHaveText('ניתן לבחור קובצי תמונה בלבד.');
    await expect(ad.field('upload-img-input')).toHaveValue('');
    expect(state.uploads).toBe(0);
    await ad.image('replacement.png');
    await expect(ad.previews).toHaveCount(2);
    await expect(ad.root.getByRole('alert')).toHaveCount(0);
    await ad.next(5); await ad.consent(); await ad.next(6); await ad.publishFree();
    await expect(page).toHaveURL(/confirmation-modal$/);
    expect(state.uploads).toBe(2);
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].pictures).toHaveLength(2);
  });
}

test('regression: visible validation is programmatically associated with the field', async ({ ad }) => {
  await ad.next(2); await expect(ad.error('city')).toBeVisible();
  await expect(ad.field('city')).toHaveAttribute('aria-describedby', /city-error/);
  await expect(ad.field('city')).toHaveAttribute('aria-invalid', 'true');
});

test('regression: consent checkbox is reachable with a pointer', async ({ ad }) => {
  await ad.toContacts();
  const checkbox = ad.root.getByRole('checkbox', { name: /אני מאשר\/ת/ });
  await checkbox.check({ timeout: 5_000 });
  await expect(checkbox).toBeChecked();
});
