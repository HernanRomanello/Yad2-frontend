import { expect, Page, Response } from '@playwright/test';
import { apiBaseURL, isAPIRequest } from './registration';

export const credentials = () => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  if (!email || !password)
    throw new Error(
      'Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD for a dedicated existing account.',
    );
  return { email, password };
};
export const hasCredentials = () =>
  !!process.env.E2E_TEST_EMAIL && !!process.env.E2E_TEST_PASSWORD;

export function authResponse(page: Page, method: string, path: string) {
  return page.waitForResponse(
    (r) => r.request().method() === method && isAPIRequest(r.url(), path),
  );
}

export async function expectUser(response: Response) {
  expect(response.status()).toBe(200);
  // Boolean assertion prevents the account's email appearing in failure output.
  expect(
    (await response.json()).email?.toLowerCase() ===
      credentials().email.toLowerCase(),
    'Protected user endpoint returns the dedicated account',
  ).toBe(true);
}

export async function expectDenied(page: Page) {
  // The context shares browser cookies, without exposing cookie/token values.
  const response = await page.request.get(`${apiBaseURL}/api/Users/User`, {
    ignoreHTTPSErrors: true,
  });
  expect(
    response.status(),
    'Protected user endpoint denies anonymous access',
  ).toBe(401);
}
