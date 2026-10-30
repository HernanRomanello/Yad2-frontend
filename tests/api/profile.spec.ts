import { test, expect, APIRequestContext } from '@playwright/test';
import { apiBaseURL, isLoopback } from '../utils/registration';
import { credentials, hasCredentials } from '../utils/auth';

// Real account requests may contain credentials and Identity fields; keep API artifacts sanitized.
test.use({ trace: 'off', screenshot: 'off', video: 'off' });

const updatePath = '/api/Users/user/update';
const editable = ['name', 'lastName', 'phoneNumber', 'birthDate', 'city', 'street', 'houseNumber', 'picture'] as const;
async function signIn(api: APIRequestContext, second = false) {
  const data = second ? { email: process.env.PROFILE_SECOND_EMAIL, password: process.env.PROFILE_SECOND_PASSWORD } : credentials();
  const response = await api.post('/api/Users/login', { data });
  expect(response.status(), 'Dedicated account login').toBe(200);
  expect(await response.json()).toEqual({ message: 'Login successful' });
}
async function read(api: APIRequestContext) {
  const response = await api.get('/api/Users/User');
  expect(response.status()).toBe(200);
  const body = await response.json();
  // Avoid printing full IdentityUser responses or personal information.
  expect(typeof body.name === 'string' && typeof body.email === 'string', 'Profile response has name and email').toBe(true);
  return body;
}
function payload(user: Record<string, unknown>) { return Object.fromEntries(editable.map(key => [key, user[key]])); }

test.describe('Profile real local API', () => {
  test.beforeEach(() => {
    test.skip(process.env.RUN_PROFILE_API !== 'true', 'Set RUN_PROFILE_API=true for the local API.');
    expect(isLoopback(apiBaseURL), 'Profile API suite is restricted to local services').toBe(true);
  });
  test('anonymous profile read and update are rejected by backend', async ({ playwright }) => {
    const api = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: isLoopback(apiBaseURL) });
    try {
      for (const response of [await api.get('/api/Users/User'), await api.put(updatePath, { data: { name: 'Unauthorized QA' } })]) {
        expect(response.status()).toBe(401); expect(await response.text()).toBe('');
      }
    } finally { await api.dispose(); }
  });
  test('authenticated profile response excludes Identity secrets', async ({ playwright }) => {
    test.skip(!hasCredentials(), 'Requires dedicated E2E_TEST_EMAIL/PASSWORD.');
    const api = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: isLoopback(apiBaseURL) });
    try {
      await signIn(api);
      const user = await read(api);
      for (const key of ['passwordHash', 'securityStamp', 'concurrencyStamp']) {
        expect(user[key] == null, `${key} must not be exposed`).toBe(true);
      }
    } finally { await api.dispose(); }
  });
});

test.describe('Profile real API — dedicated account mutations with restoration', () => {
  test.describe.configure({ mode: 'default' });
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.config.workers !== 1, 'Use playwright.profile.config.ts to serialize all profile mutations.');
    test.skip(process.env.RUN_PROFILE_API !== 'true' || process.env.ALLOW_MUTATIONS !== 'true' ||
      process.env.PROFILE_TEST_DATA_CONFIRMED !== 'true' || !hasCredentials(),
    'Requires RUN_PROFILE_API, ALLOW_MUTATIONS, PROFILE_TEST_DATA_CONFIRMED=true and dedicated E2E_TEST_EMAIL/PASSWORD.');
    expect(isLoopback(apiBaseURL)).toBe(true);
  });
  const cases = [
    { title: 'valid update persists across re-login', patch: { name: 'QA Profile א', lastName: 'Automation-Test', phoneNumber: '0527654321' }, status: 200 },
    { title: 'invalid date is rejected', patch: { birthDate: 'not-a-date' }, status: 400 },
    { title: 'empty optional UI date is rejected by nonnullable API date', patch: { birthDate: '' }, status: 400 },
    { title: 'Int32 maximum plus one is rejected', patch: { houseNumber: 2147483648 }, status: 400 },
    { title: 'fractional house number is rejected', patch: { houseNumber: 1.5 }, status: 400 },
  ];
  for (const { title, patch, status } of cases) {
    test(title, async ({ playwright }) => {
      const api = await playwright.request.newContext({ baseURL: apiBaseURL, ignoreHTTPSErrors: isLoopback(apiBaseURL) });
      let original: Record<string, unknown> | undefined;
      try {
        await signIn(api);
        const current = payload(await read(api));
        test.skip(['name', 'lastName', 'phoneNumber'].some(key => !current[key]), 'Original editable strings must be nonempty so the repository can restore them.');
        original = current;
        const response = await api.put(updatePath, { data: { ...original, ...patch } });
        expect(response.status()).toBe(status);
        if (status === 200) {
          const body = await response.json();
          expect(Object.entries(patch).every(([key, value]) => body[key] === value), 'Update response returns changed values').toBe(true);
          await signIn(api);
          const persisted = await read(api);
          expect(Object.entries(patch).every(([key, value]) => persisted[key] === value), 'Saved values survive re-login').toBe(true);
        } else {
          const body = await response.json();
          expect(body.status).toBe(400); expect(typeof body.errors).toBe('object');
          expect(JSON.stringify(payload(await read(api))) === JSON.stringify(original), 'Invalid input leaves profile unchanged').toBe(true);
        }
      } finally {
        try {
          if (original) {
            const restored = await api.put(updatePath, { data: original });
            expect(restored.status(), 'Restore dedicated profile').toBe(200);
            expect(JSON.stringify(payload(await read(api))) === JSON.stringify(original), 'Original profile restored').toBe(true);
          }
        } finally { await api.dispose(); }
      }
    });
  }
  test('spoofed body identity cannot modify a second user', async ({ playwright }) => {
    test.skip(!process.env.PROFILE_SECOND_EMAIL || !process.env.PROFILE_SECOND_PASSWORD, 'Requires a second dedicated PROFILE_SECOND_EMAIL/PASSWORD.');
    const options = { baseURL: apiBaseURL, ignoreHTTPSErrors: isLoopback(apiBaseURL) };
    const api = await playwright.request.newContext(options);
    const second = await playwright.request.newContext(options);
    let original: Record<string, unknown> | undefined;
    try {
      await signIn(api); await signIn(second, true);
      const first = await read(api); const other = await read(second);
      expect(first.email !== other.email, 'Accounts must be distinct').toBe(true);
      original = payload(first);
      const response = await api.put(updatePath, { data: { ...original, name: 'QA Owner Only', id: other.id, userId: other.id, email: other.email } });
      expect(response.status()).toBe(200);
      expect((await response.json()).name).toBe('QA Owner Only');
      expect((await read(api)).name === 'QA Owner Only', 'Cookie owner receives update').toBe(true);
      expect(JSON.stringify(payload(await read(second))) === JSON.stringify(payload(other)), 'Second user remains unchanged').toBe(true);
    } finally {
      try { if (original) expect((await api.put(updatePath, { data: original })).status(), 'Restore cookie owner').toBe(200); }
      finally { await api.dispose(); await second.dispose(); }
    }
  });
});
