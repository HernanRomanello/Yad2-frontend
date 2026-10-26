import { test, expect, APIRequestContext } from '@playwright/test';
import { apiBaseURL, isLoopback } from '../utils/registration';

// No accounts, listings or database records are created or modified.
test.describe('Favorites real local API authorization', () => {
  test.beforeEach(async () => {
    test.skip(process.env.RUN_FAVORITES_API !== 'true', 'Set RUN_FAVORITES_API=true when the local ASP.NET API is available.');
    expect(isLoopback(apiBaseURL), 'Only local API is authorized').toBe(true);
  });
  for (const operation of ['read', 'toggle'] as const) {
    test(`FAV-AUTH-${operation} rejects a request without an authentication cookie`, async ({ playwright }) => {
      const api = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: isLoopback(apiBaseURL) });
      try {
        const response = operation === 'read'
          ? await api.get('/api/Users/GetFavorites')
          : await api.post('/api/Users/user/updateFavorite/0');
        expect(response.status()).toBe(401);
        expect(await response.text()).toBe('');
      } finally { await api.dispose(); }
    });
  }
});

test.describe('Favorites real backend integration — explicit dedicated data opt-in', () => {
  // Run this group sequentially without making later tests depend on earlier results.
  test.describe.configure({ mode: 'default' });
  test.beforeEach(() => {
    test.skip(process.env.RUN_FAVORITES_API !== 'true' || process.env.ALLOW_MUTATIONS !== 'true' ||
      process.env.FAVORITES_TEST_DATA_CONFIRMED !== 'true' || !process.env.FAVORITES_TEST_EMAIL ||
      !process.env.FAVORITES_TEST_PASSWORD || !process.env.FAVORITES_PROPERTY_ID,
    'Requires RUN_FAVORITES_API, ALLOW_MUTATIONS, FAVORITES_TEST_DATA_CONFIRMED=true and dedicated FAVORITES_TEST_EMAIL/PASSWORD/PROPERTY_ID.');
    expect(isLoopback(apiBaseURL), 'Only local API is authorized').toBe(true);
  });

  async function signIn(api: APIRequestContext, second = false) {
    const response = await api.post('/api/Users/login', { data: {
      email: process.env[second ? 'FAVORITES_SECOND_EMAIL' : 'FAVORITES_TEST_EMAIL'],
      password: process.env[second ? 'FAVORITES_SECOND_PASSWORD' : 'FAVORITES_TEST_PASSWORD'],
    } });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ message: 'Login successful' });
    expect((await api.storageState()).cookies.some(cookie => cookie.name === 'access_token' && cookie.httpOnly)).toBe(true);
  }
  async function ids(api: APIRequestContext): Promise<number[]> {
    const response = await api.get('/api/Users/GetFavorites');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    for (const ad of body) expect(ad).toEqual(expect.objectContaining({ id: expect.any(Number), pictures: expect.any(Array) }));
    return body.map((ad: { id: number }) => ad.id).sort((a: number, b: number) => a - b);
  }
  async function toggle(api: APIRequestContext, id: number) {
    const response = await api.post(`/api/Users/user/updateFavorite/${id}`);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ id }));
  }

  test('FAV-API-001 add, repeat toggle, re-login persistence and scoped removal', async ({ playwright }) => {
    const api = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: true });
    const id = Number(process.env.FAVORITES_PROPERTY_ID);
    expect(Number.isSafeInteger(id) && id > 0).toBe(true);
    let ownsAddedFavorite = false;
    try {
      await signIn(api);
      const original = await ids(api);
      test.skip(original.includes(id), 'Configured property is already saved; refusing to remove pre-existing data.');
      ownsAddedFavorite = true;
      await toggle(api, id);
      expect(await ids(api)).toEqual([...original, id].sort((a, b) => a - b));
      expect((await api.post('/api/Users/logout', { data: {} })).status()).toBe(200);
      expect((await api.get('/api/Users/GetFavorites')).status()).toBe(401);
      expect((await api.post(`/api/Users/user/updateFavorite/${id}`)).status()).toBe(401);
      await signIn(api);
      expect((await ids(api)).filter(value => value === id)).toHaveLength(1);
      await toggle(api, id);
      expect(await ids(api)).toEqual(original);
      ownsAddedFavorite = false;
    } finally {
      try {
        if (ownsAddedFavorite) {
          await signIn(api);
          if ((await ids(api)).includes(id)) await toggle(api, id);
          expect((await ids(api)).includes(id)).toBe(false);
        }
      } finally { await api.dispose(); }
    }
  });

  test('FAV-011 invalid route identifier returns validation error and preserves data', async ({ playwright }) => {
    const api = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: true });
    try {
      await signIn(api);
      const original = await ids(api);
      const response = await api.post('/api/Users/user/updateFavorite/not-an-integer');
      expect(response.status()).toBe(400);
      expect(await response.json()).toEqual(expect.objectContaining({ status: 400, errors: expect.any(Object) }));
      expect(await ids(api)).toEqual(original);
    } finally { await api.dispose(); }
  });

  test('FAV-AUTH-ISOLATION modifying account A leaves account B unchanged', async ({ playwright }) => {
    test.skip(!process.env.FAVORITES_SECOND_EMAIL || !process.env.FAVORITES_SECOND_PASSWORD,
      'Requires a second dedicated authorized account.');
    expect(process.env.FAVORITES_SECOND_EMAIL?.toLowerCase() !== process.env.FAVORITES_TEST_EMAIL?.toLowerCase()).toBe(true);
    const a = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: true });
    const b = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: true });
    const id = Number(process.env.FAVORITES_PROPERTY_ID);
    expect(Number.isSafeInteger(id) && id > 0).toBe(true);
    let ownsAddedFavorite = false;
    try {
      await signIn(a);
      await signIn(b, true);
      const beforeA = await ids(a);
      const beforeB = await ids(b);
      test.skip(beforeA.includes(id), 'Property already saved in account A; preserving pre-existing data.');
      ownsAddedFavorite = true;
      await toggle(a, id);
      expect(await ids(a)).toEqual([...beforeA, id].sort((x, y) => x - y));
      expect(await ids(b)).toEqual(beforeB);
      await toggle(a, id);
      ownsAddedFavorite = false;
      expect(await ids(a)).toEqual(beforeA);
      expect(await ids(b)).toEqual(beforeB);
    } finally {
      try {
        if (ownsAddedFavorite && (await ids(a)).includes(id)) await toggle(a, id);
      } finally { await a.dispose(); await b.dispose(); }
    }
  });
});
