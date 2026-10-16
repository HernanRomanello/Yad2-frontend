import { randomUUID } from 'node:crypto';
import { test, expect, APIResponse } from '@playwright/test';
import {
  apiBaseURL,
  hasDatabaseDisclosure,
  localHTTPSException,
  mutationsAllowed,
  registrationPassword,
  sqlProbes,
  uniqueEmail,
} from '../utils/registration';

const syntheticPassword = () =>
  'Aa1!' + randomUUID().replace(/-/g, '').slice(0, 8);
const signupPath = '/api/Users/signup';

// test.use({
//   baseURL: apiBaseURL,
//   ignoreHTTPSErrors: localHTTPSException,
//   trace: 'off',
// });
test.use({
  baseURL: apiBaseURL,
  ignoreHTTPSErrors: true,
  trace: 'off',
});
test.describe('Registration API', () => {
  // Requests reach the real database. Gate even negative cases on shared targets.
  test.skip(!mutationsAllowed, 'Shared targets require ALLOW_MUTATIONS=true.');

  async function assertModelError(response: APIResponse, key: string) {
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.status).toBe(400);
    expect(Array.isArray(body.errors?.[key])).toBe(true);
    expect(body.errors[key].length).toBeGreaterThan(0);
    expect(await hasDatabaseDisclosure(response)).toBe(false);
  }

  test.describe('Model validation', () => {
    for (const scenario of [
      { name: 'missing email', field: 'Email', value: undefined, key: 'Email' },
      { name: 'empty email', field: 'Email', value: '', key: 'Email' },
      {
        name: 'malformed email',
        field: 'Email',
        value: 'invalid-email',
        key: 'Email',
      },
      {
        name: 'missing password',
        field: 'Password',
        value: undefined,
        key: 'Password',
      },
      { name: 'empty password', field: 'Password', value: '', key: 'Password' },
      {
        name: 'missing confirmation',
        field: 'ConfirmPassword',
        value: undefined,
        key: 'Password',
      },
      {
        name: 'mismatched confirmation',
        field: 'ConfirmPassword',
        value: 'different',
        key: 'Password',
      },
    ]) {
      test('rejects ' + scenario.name, async ({ playwright }) => {
        const password = syntheticPassword();

        const data: Record<string, string | undefined> = {
          Email: uniqueEmail(),
          Password: password,
          ConfirmPassword: password,
        };

        data[scenario.field] = scenario.value;

        const request = await playwright.request.newContext({
          ignoreHTTPSErrors: true,
        });

        try {
          const response = await request.post(signupPath, { data });
          await assertModelError(response, scenario.key);
        } finally {
          await request.dispose();
        }
      });
    }
  });

  test.describe('Identity password rules', () => {
    for (const rule of [
      'uppercase',
      'lowercase',
      'digit',
      'special character',
      'minimum length',
    ]) {
      test('rejects password without ' + rule, async ({ request }) => {
        const valid = syntheticPassword();
        const password =
          rule === 'uppercase'
            ? valid.toLowerCase()
            : rule === 'lowercase'
              ? valid.toUpperCase()
              : rule === 'digit'
                ? valid.replace(/[0-9]/g, 'a')
                : rule === 'special character'
                  ? valid.replace(/[^a-zA-Z0-9]/g, 'a')
                  : valid.slice(0, 7);
        const response = await request.post(signupPath, {
          data: {
            Email: uniqueEmail(),
            Password: password,
            ConfirmPassword: password,
          },
        });
        expect(response.status()).toBe(401);
        expect(await response.json()).toMatchObject({
          status: 401,
          title: 'Unauthorized',
        });
        expect(await hasDatabaseDisclosure(response)).toBe(false);
      });
    }
  });

  test('rejects duplicate registration using its own disposable account @mutation', async ({
    request,
  }) => {
    const password = registrationPassword();
    const data = {
      Email: uniqueEmail(),
      Password: password,
      ConfirmPassword: password,
    };
    const first = await request.post(signupPath, { data });
    expect(first.status()).toBe(200);
    expect(await first.json()).toBe(true);
    const duplicate = await request.post(signupPath, { data });
    expect(duplicate.status()).toBe(401);
    expect(await duplicate.json()).toMatchObject({
      status: 401,
      title: 'Unauthorized',
    });
  });

  test.describe('SQL injection input handling', () => {
    for (const [index, probe] of sqlProbes.entries()) {
      test(
        'rejects malformed SQL-shaped email probe ' + (index + 1),
        async ({ request }) => {
          const password = syntheticPassword();
          await assertModelError(
            await request.post(signupPath, {
              data: {
                Email: probe,
                Password: password,
                ConfirmPassword: password,
              },
            }),
            'Email',
          );
          const anonymous = await request.get('/api/Users/User');
          expect(anonymous.status()).toBe(401);
        },
      );
      test(
        'rejects SQL-shaped mismatched confirmation probe ' + (index + 1),
        async ({ request }) => {
          const password = syntheticPassword();
          await assertModelError(
            await request.post(signupPath, {
              data: {
                Email: uniqueEmail(),
                Password: password,
                ConfirmPassword: password + probe,
              },
            }),
            'Password',
          );
          const anonymous = await request.get('/api/Users/User');
          expect(anonymous.status()).toBe(401);
        },
      );
    }

    test('treats SQL-looking password as data and registration stays operational @mutation', async ({
      request,
    }) => {
      const password = registrationPassword();
      // Each test owns its records; no order dependency on the other probe tests.
      await assertModelError(
        await request.post(signupPath, {
          data: {
            Email: sqlProbes[0],
            Password: password,
            ConfirmPassword: password,
          },
        }),
        'Email',
      );
      const sqlPassword = password + sqlProbes[0];
      const response = await request.post(signupPath, {
        data: {
          Email: uniqueEmail(),
          Password: sqlPassword,
          ConfirmPassword: sqlPassword,
        },
      });
      expect(response.status()).toBe(200);
      expect(await response.json()).toBe(true);
      expect(await hasDatabaseDisclosure(response)).toBe(false);
      // Signup alone must not authenticate; Angular explicitly logs in afterwards.
      expect((await request.get('/api/Users/User')).status()).toBe(401);
      const control = await request.post(signupPath, {
        data: {
          Email: uniqueEmail(),
          Password: password,
          ConfirmPassword: password,
        },
      });
      expect(control.status()).toBe(200);
      expect(await control.json()).toBe(true);
    });
  });
});
