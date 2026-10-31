import { test, expect, originalProfile } from '../../fixtures/profile.fixture';
import type { ProfilePage, ProfileField } from '../../../pages/ProfilePage';

async function submitInvalid(ui: ProfilePage) {
  await expect(ui.root.getByRole('button', { name: '\u05e9\u05de\u05d9\u05e8\u05d4', exact: true })).toBeDisabled();
  await ui.field('name').press('Enter');
  // Exercise the submit handler even though the disabled button blocks normal submission.
  await ui.root.locator('form').dispatchEvent('submit');
}

// Every test receives a fresh synthetic account; no real profile is changed.
test.describe('Profile UI — isolated stateful API simulation', () => {
  test('opens Edit Profile and populates all existing values', async ({ profilePage: ui }) => {
    await ui.open();
    await expect(ui.root).toBeVisible();
    for (const [field, value] of Object.entries(originalProfile)) {
      if (field === 'picture') continue;
      await expect(ui.field(field as ProfileField)).toHaveValue(field === 'birthDate' ? '1990-01-15' : field === 'phoneNumber' ? '050-1234567' : String(value));
    }
  });

  const validCases: { field: Exclude<ProfileField, 'email'>; value: string; saved?: string | number; title: string }[] = [
    { field: 'name', value: 'א', title: 'first name minimum nonempty length' },
    { field: 'name', value: "  QA אנה-Marie O’Neil  ", title: 'first name Unicode punctuation and preserved spaces' },
    { field: 'lastName', value: 'ב', title: 'last name minimum nonempty length' },
    { field: 'lastName', value: "  לוי O’Neil-Smith  ", title: 'last name Unicode punctuation and preserved spaces' },
    { field: 'phoneNumber', value: '052-7654321', saved: '0527654321', title: 'phone hyphen normalization' },
    { field: 'birthDate', value: '2000-02-29', title: 'birth date leap day' },
    { field: 'street', value: 'רחוב נוסף', title: 'street from current city' },
    { field: 'houseNumber', value: '1', saved: 1, title: 'house number minimum positive integer' },
    { field: 'houseNumber', value: '2147483647', saved: 2147483647, title: 'house number Int32 maximum' },
  ];
  for (const { field, value, saved = value, title } of validCases) {
    test(`saves ${title} and preserves it after refresh and navigation`, async ({ profilePage: ui, profileState: state }) => {
      await ui.open();
      await ui.update(field, value);
      await ui.save();
      await expect.poll(() => state.updates.length).toBe(1);
      await expect(ui.success).toBeVisible();
      expect(state.user[field]).toBe(saved);
      await ui.refresh();
      await ui.openEdit();
      await expect(ui.field(field)).toHaveValue(field === 'phoneNumber' ? '052-7654321' : value);
      await ui.away();
      await ui.openEdit();
      await expect(ui.field(field)).toHaveValue(field === 'phoneNumber' ? '052-7654321' : value);
    });
  }

  test('updates city, dependent street, house number and names together', async ({ profilePage: ui, profileState: state }) => {
    await ui.open();
    await ui.selectCity('עיר נוספת');
    await ui.selectStreet('רחוב אחר');
    await ui.update('houseNumber', '23');
    await ui.update('name', 'QA Updated');
    await ui.update('lastName', 'Test Updated');
    await ui.save();
    await expect.poll(() => state.user.city).toBe('עיר נוספת');
    expect(state.user).toMatchObject({ street: 'רחוב אחר', houseNumber: 23, name: 'QA Updated', lastName: 'Test Updated' });
    await ui.open();
    await expect(ui.field('city')).toHaveValue('עיר נוספת');
    await expect(ui.field('street')).toHaveValue('רחוב אחר');
  });

  test('saves unchanged values successfully', async ({ profilePage: ui, profileState: state }) => {
    await ui.open(); await ui.save();
    await expect.poll(() => state.updates.length).toBe(1);
    await expect(ui.success).toBeVisible();
    expect(state.user).toEqual(originalProfile);
  });

  for (const field of ['name', 'lastName', 'phoneNumber'] as const) {
    test(`rejects empty required ${field} without sending an update`, async ({ profilePage: ui, profileState: state }) => {
      await ui.open(); await ui.update(field, '');
      await expect(ui.errors(field)).toBeVisible();
      await expect(ui.errors(field)).toContainText(field === 'phoneNumber' ? 'תקין' : 'חובה');
      await submitInvalid(ui);
      await ui.away(); // Completed UI action provides a deterministic checkpoint, without sleeps.
      expect(state.updates).toEqual([]);
      expect(state.user).toEqual(originalProfile);
    });
  }
  test('phone input enforces its actual 11-character HTML limit', async ({ profilePage: ui }) => {
    await ui.open();
    await expect(ui.field('phoneNumber')).toHaveAttribute('maxlength', '11');
    await ui.field('phoneNumber').clear();
    await ui.field('phoneNumber').pressSequentially('052-765432199');
    await expect(ui.field('phoneNumber')).toHaveValue('052-7654321');
  });
  // Only required is implemented for phone; no invented mobile-number regex expectations.
  for (const value of ['1', 'abcdefghijk']) {
    test(`characterizes phone required-only validation: ${value}`, async ({ profilePage: ui }) => {
      await ui.open(); await ui.update('phoneNumber', value);
      await expect(ui.errors('phoneNumber')).toHaveCount(0);
    });
  }
  for (const value of ['', '0', '-1', 'abc']) {
    test(`rejects nonpositive or nonnumeric house number ${JSON.stringify(value)}`, async ({ profilePage: ui, profileState: state }) => {
      await ui.open(); await ui.update('houseNumber', value);
      await expect(ui.errors('houseNumber')).toContainText('חובה');
      await submitInvalid(ui); await ui.away(); expect(state.updates).toEqual([]);
    });
  }
  for (const field of ['city', 'street'] as const) {
    for (const value of ['', 'Unknown QA address', ` ${originalProfile[field]} `]) {
      test(`rejects ${field} outside the exact address catalogue: ${JSON.stringify(value)}`, async ({ profilePage: ui, profileState: state }) => {
        await ui.open(); await ui.update(field, value); await submitInvalid(ui); await ui.away();
        expect(state.updates).toEqual([]);
        expect(state.user).toEqual(originalProfile);
      });
    }
  }
  test('cancel discards edits without submitting', async ({ profilePage: ui, profileState: state }) => {
    await ui.open();
    await ui.update('name', 'Unsaved QA');
    await ui.update('lastName', 'Unsaved Family');
    await ui.update('phoneNumber', '052-7654321');
    await ui.update('birthDate', '2000-02-29');
    await ui.update('houseNumber', '23');
    await ui.openImage();
    await ui.chooseImage('qa.png', 'image/png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64'));
    await ui.confirmImage();
    await expect(ui.image).toHaveAttribute('src', /^blob:/);
    await ui.cancel();
    await expect(ui.page).toHaveURL(/\/profile\/user-advertisement$/);
    await expect(ui.root).toHaveCount(0);
    expect(state.updates).toEqual([]);
    expect(state.uploads).toBe(0);
    expect(state.user).toEqual(originalProfile);
    await ui.openEdit();
    for (const [field, value] of Object.entries(originalProfile)) {
      if (field === 'picture') continue;
      await expect(ui.field(field as ProfileField)).toHaveValue(field === 'birthDate' ? '1990-01-15' : field === 'phoneNumber' ? '050-1234567' : String(value));
    }
    await expect(ui.image).toHaveCount(0);
    expect(state.updates).toEqual([]);
    expect(state.uploads).toBe(0);
    expect(state.user).toEqual(originalProfile);
  });
  test('allows clearing optional birthday in the UI', async ({ profilePage: ui, profileState: state }) => {
    await ui.open(); await ui.update('birthDate', '');
    await expect(ui.field('birthDate')).toHaveValue('');
    await ui.save(); await expect.poll(() => state.updates.length).toBe(1);
    expect(state.updates[0].birthDate).toBe('');
    // Real API cannot deserialize empty string into nonnullable DateTime; see PROFILE.md.
  });
  for (const failure of ['500', 'network', '401'] as const) {
    test(`does not announce success when update fails: ${failure}`, async ({ profilePage: ui, profileState: state }) => {
      state.failure = failure;
      await ui.open(); await ui.update('name', 'Failed QA'); await ui.save();
      await expect.poll(() => state.updates.length).toBe(1);
      expect(state.user).toEqual(originalProfile);
      await expect(ui.success).toHaveCount(0);
    });
  }
  test('anonymous user cannot open Edit Profile', async ({ profilePage: ui, profileState: state, page }) => {
    state.authenticated = false;
    await page.goto('/profile/edit-details');
    await expect(page).toHaveURL(/\/login$/); await expect(ui.root).toHaveCount(0);
    expect(state.updates).toEqual([]);
  });
  test('selects and previews a PNG, then saves through the upload endpoint', async ({ profilePage: ui, profileState: state, page }) => {
    const imageUrl = '/assets/images/image_placeholder_.svg?uploaded=first';
    let release!: () => void;
    const held = new Promise<void>(resolve => { release = resolve; });
    let uploads = 0;
    await page.route('**/api/ImageUpload/UploadImage', async route => {
      uploads++;
      expect(route.request().postDataBuffer()?.toString()).toContain('filename="qa.png"');
      await held;
      await route.fulfill({ json: { fileUrl: imageUrl } });
    });
    await ui.open(); await ui.openImage();
    await ui.chooseImage('qa.png', 'image/png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64'));
    await expect(ui.imageModal.locator('.profile-image-frame img')).toHaveAttribute('src', /^blob:/);
    await ui.confirmImage(); await expect(ui.image).toHaveAttribute('src', /^blob:/);
    await ui.save(); await expect.poll(() => uploads).toBe(1);
    await expect(ui.root.locator('button[type=submit]')).toBeDisabled();
    expect(state.updates).toEqual([]);
    release();
    await expect(ui.success).toBeVisible();
    expect(state.updates).toHaveLength(1);
    expect(state.updates[0].picture).toBe(imageUrl);
    expect(state.user.picture).toBe(imageUrl);
    await expect(ui.image).toHaveAttribute('src', imageUrl);
    await expect.poll(() => ui.image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    await ui.refresh(); await expect(ui.image).toHaveAttribute('src', imageUrl);
    await ui.update('name', 'QA Uploaded'); await ui.save();
    await expect.poll(() => state.updates.length).toBe(2);
    expect(state.updates[1].picture).toBe(imageUrl);
    expect(uploads).toBe(1);
  });
  test('cancels image selection without uploading', async ({ profilePage: ui, profileState: state }) => {
    await ui.open(); await ui.openImage(); await ui.chooseImage('qa.txt', 'text/plain', Buffer.from('synthetic'));
    await ui.cancelImage(); await expect(ui.imageModal).toHaveCount(0);
    expect(state.uploads).toBe(0); await expect(ui.image).toHaveCount(0);
  });
  test('preserves an existing image when saving another field', async ({ profilePage: ui, profileState: state }) => {
    state.user.picture = '/assets/images/image_placeholder_.svg';
    await ui.open(); await ui.update('name', 'QA Picture'); await ui.save();
    await expect.poll(() => state.updates.length).toBe(1);
    expect(state.updates[0].picture).toBe('/assets/images/image_placeholder_.svg');
    expect(state.user.picture).toBe('/assets/images/image_placeholder_.svg');
    expect(state.uploads).toBe(0);
    await expect(ui.image).toHaveAttribute('src', state.user.picture);
    await ui.refresh(); await expect(ui.image).toHaveAttribute('src', state.user.picture);
  });
});

test('house number must be an integer, not a fraction', async ({ profilePage: ui, profileState: state }) => {
  await ui.open(); await ui.update('houseNumber', '1.5'); await submitInvalid(ui); await ui.away();
  expect(state.updates).toEqual([]);
});
test('image deletion persists when the profile is saved', async ({ profilePage: ui, profileState: state }) => {
  state.user.picture = '/assets/images/image_placeholder_.svg';
  await ui.open(); await ui.openDeleteImage(); await ui.confirmDeleteImage();
  await expect(ui.image).toHaveCount(0);
  await ui.save(); await expect.poll(() => state.updates.length).toBe(1);
  expect(state.user.picture).toBe('');
  await ui.open(); await expect(ui.image).toHaveCount(0);
});

for (const [field, invalid, corrected] of [
  ['name', '', 'QA Corrected'], ['lastName', '', 'Corrected'],
  ['phoneNumber', '', '052-7654321'],
  ['city', 'Unknown', originalProfile.city], ['street', 'Unknown', originalProfile.street],
  ['houseNumber', '1.5', '12'], ['houseNumber', '0', '12'],
] as const) {
  test(`Edit Profile blocks invalid ${field} and saves after correction: ${invalid}`, async ({ profilePage: ui, profileState: state }) => {
    await ui.open();
    await ui.update(field, invalid);
    await expect(ui.errors(field)).toBeVisible();
    await submitInvalid(ui);
    expect(state.updates).toEqual([]);
    await ui.update(field, corrected);
    await expect(ui.errors(field)).toHaveCount(0);
    await expect(ui.root.getByRole('button', { name: '\u05e9\u05de\u05d9\u05e8\u05d4', exact: true })).toBeEnabled();
    await ui.save();
    await expect(ui.success).toBeVisible();
    expect(state.updates).toHaveLength(1);
  });
}

test('Edit Profile disables Save until the update completes and allows retry after failure', async ({ profilePage: ui, page }) => {
  await ui.open();
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  let requests = 0;
  await page.route('**/api/Users/user/update', async route => {
    requests++;
    await held;
    await route.fulfill({ status: 500, json: {} });
  });
  await ui.save();
  const save = ui.root.getByRole('button', { name: '\u05e9\u05de\u05d9\u05e8\u05d4', exact: true });
  await expect(save).toBeDisabled();
  await ui.field('name').press('Enter');
  await ui.root.locator('form').dispatchEvent('submit');
  await expect.poll(() => requests).toBe(1);
  release();
  await expect(save).toBeEnabled();
  await expect(ui.success).toHaveCount(0);
});
