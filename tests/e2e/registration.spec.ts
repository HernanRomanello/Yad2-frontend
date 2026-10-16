import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';
import {
  apiBaseURL,
  guardSignup,
  isAPIRequest,
  localHTTPSException,
  mutationsAllowed,
  registrationPassword,
  sqlProbes,
  uniqueEmail,
} from '../utils/registration';

// Synthetic, non-secret values; successful account credentials come from the environment.
const candidate = (length = 12) =>
  ('Aa1!' + randomUUID().replace(/-/g, '')).slice(0, length);
const messages = {
  emailRequired: 'לא לשכוח את המייל',
  emailInvalid: '?@ משהו לא תקין במייל, אולי התפספס',
  passwordRequired: 'לא לשכוח להזין סיסמה',
  composition: 'נבקש שהסיסמה תכלול אותיות באנגלית וספרות',
  length: 'נבקש סיסמה באורך 8-20 תווים',
  mismatch: 'הסיסמאות אינן תואמות',
};

// Do not record registration credentials or authenticated cookies in traces.
test.use({ trace: 'off', screenshot: 'off' });

test.describe('Registration', () => {
  test.beforeEach(async ({ page }) => {
    // Prevent uncontrolled third-party data.gov.il calls on the landing page.
    await page.route('https://data.gov.il/**', (route) =>
      route.abort('blockedbyclient'),
    );
  });

  test.describe('Successful registration @mutation', () => {
    test.skip(
      !mutationsAllowed,
      'Shared targets require ALLOW_MUTATIONS=true.',
    );
    test.use({ ignoreHTTPSErrors: localHTTPSException });
    test('signup logs in the new user and preserves the session after reload', async ({
      page,
    }) => {
      const password = registrationPassword();
      const email = uniqueEmail();
      const registration = new RegistrationPage(page);
      await registration.goto();
      await registration.fillForm({
        email,
        password,
        confirmPassword: password,
      });
      const signup = page.waitForResponse(
        (r) =>
          r.request().method() === 'POST' &&
          isAPIRequest(r.url(), '/api/Users/signup'),
      );
      const login = page.waitForResponse(
        (r) =>
          r.request().method() === 'POST' &&
          isAPIRequest(r.url(), '/api/Users/login'),
      );
      await registration.submit();
      const signupResponse = await signup;
      expect(signupResponse.status()).toBe(200);
      expect(await signupResponse.json()).toBe(true);
      expect((await login).status()).toBe(200);
      await expect(page).toHaveURL(new URL('/', page.url()).href);
      // const user = await page.request.get(apiBaseURL + '/api/Users/User');
      const user = await page.request.get(apiBaseURL + '/api/Users/User', {
        ignoreHTTPSErrors: new URL(apiBaseURL).hostname === 'localhost',
      });

      expect(user.status()).toBe(200);
      expect((await user.json()).email).toBe(email);
      const restored = page.waitForResponse(
        (r) =>
          r.request().method() === 'GET' &&
          isAPIRequest(r.url(), '/api/Users/User'),
      );
      await page.reload();
      const restoredResponse = await restored;
      expect(restoredResponse.status()).toBe(200);
      expect((await restoredResponse.json()).email).toBe(email);
    });
  });

  test.describe('Client validation — no account creation', () => {
    const cases = [
      {
        name: 'requires email',
        email: '',
        kind: 'email',
        message: messages.emailRequired,
      },
      {
        name: 'rejects malformed email',
        email: 'invalid-email',
        kind: 'email',
        message: messages.emailInvalid,
      },
      {
        name: 'requires password',
        password: '',
        kind: 'password',
        message: messages.passwordRequired,
      },
      {
        name: 'requires confirmation',
        confirmation: '',
        kind: 'password',
        message: messages.mismatch,
      },
      {
        name: 'rejects mismatched confirmation',
        confirmation: 'different',
        kind: 'password',
        message: messages.mismatch,
      },
      {
        name: 'requires English letters',
        password: '123456789',
        kind: 'password',
        message: messages.composition,
      },
      {
        name: 'requires digits',
        password: 'abcdefghij',
        kind: 'password',
        message: messages.composition,
      },
      {
        name: 'rejects seven characters',
        length: 7,
        kind: 'password',
        message: messages.length,
      },
      {
        name: 'rejects twenty-one characters',
        length: 21,
        kind: 'password',
        message: messages.length,
      },
    ];
    for (const scenario of cases) {
      test(scenario.name, async ({ page }) => {
        const registration = new RegistrationPage(page);
        const attempts = await guardSignup(page);
        const password = scenario.password ?? candidate(scenario.length);
        await registration.goto();
        await registration.fillForm({
          email: scenario.email ?? uniqueEmail(),
          password,
          confirmPassword: scenario.confirmation ?? password,
        });
        await registration.submit();
        await expect
          .soft(
            scenario.kind === 'email'
              ? registration.emailError
              : registration.passwordError,
          )

          .toHaveText(scenario.message);
        expect(attempts, 'Client validation must block signup').toEqual([]);
        await expect(page).toHaveURL(/\/register$/);
      });
    }
    for (const length of [8, 20]) {
      test(
        'accepts the ' +
          length +
          '-character password boundary before mismatch rejection',
        async ({ page }) => {
          const registration = new RegistrationPage(page);
          const attempts = await guardSignup(page);
          await registration.goto();

          await registration.fillForm({
            email: uniqueEmail(),
            password: candidate(length),
            confirmPassword: 'different',
          });

          await registration.submit();

          // Debug: check whether the mismatch message exists
          console.log(
            'Password length:',
            length,
            'Mismatch message count:',
            await page
              .getByText('הסיסמאות אינן תואמות', {
                exact: true,
              })
              .count(),
          );

          // Debug: inspect visible registration form text
          console.log(
            'Registration text:',
            await page.locator('app-registration-form').innerText(),
          );

          await expect.soft(registration.mismatchError).toBeVisible();
          await expect(
            page
              .locator('app-registration-form form')
              .getByText(messages.length, { exact: true }),
          ).toBeHidden();
          expect(attempts).toEqual([]);
        },
      );
    }
  });

  test.describe('Password visibility', () => {
    for (const control of ['password', 'confirmation'] as const) {
      test(
        control + ' control toggles both fields without changing their values',
        async ({ page }) => {
          const registration = new RegistrationPage(page);
          const value = candidate();
          await registration.goto();
          await registration.fillForm({
            email: uniqueEmail(),
            password: value,
            confirmPassword: value,
          });
          const toggle = () =>
            control === 'password'
              ? registration.togglePasswordVisibility()
              : registration.toggleConfirmationVisibility();
          for (const [index, type] of [
            'password',
            'text',
            'password',
          ].entries()) {
            if (index > 0) await toggle();
            await expect(registration.password).toHaveAttribute('type', type);
            await expect(registration.confirmPassword).toHaveAttribute(
              'type',
              type,
            );
            // Use boolean comparisons so failure output never includes password values.
            expect((await registration.password.inputValue()) === value).toBe(
              true,
            );
            expect(
              (await registration.confirmPassword.inputValue()) === value,
            ).toBe(true);
          }
        },
      );
    }
  });

  test.describe('SQL injection input handling — no account creation', () => {
    for (const probe of sqlProbes) {
      test('rejects malformed SQL-shaped email: ' + probe, async ({ page }) => {
        const registration = new RegistrationPage(page);
        const attempts = await guardSignup(page);
        const password = candidate();
        await registration.goto();
        await registration.fillForm({
          email: probe,
          password,
          confirmPassword: password,
        });
        await registration.submit();
        await expect
          .soft(registration.emailError)
          .toHaveText(messages.emailInvalid);
        expect(
          attempts,
          'SQL-shaped invalid email must not reach signup',
        ).toEqual([]);
        await expect(page).toHaveURL(/\/register$/);
      });
    }
  });
});
