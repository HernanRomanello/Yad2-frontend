import { randomUUID } from 'node:crypto';
import { APIResponse, Page } from '@playwright/test';

export const apiBaseURL = process.env.API_BASE_URL || 'https://localhost:7211';
export const sqlProbes = ["' OR '1'='1' --", "' OR 1=1 #"];
export const uniqueEmail = () => 'qa-registration-' + randomUUID() + '@example.com';
export const isLoopback = (url: string) => ['localhost', '127.0.0.1', '[::1]'].includes(new URL(url).hostname);
export const mutationsAllowed = (isLoopback(apiBaseURL) && isLoopback(process.env.BASE_URL || 'http://localhost:4200')) || process.env.ALLOW_MUTATIONS === 'true';
export const localHTTPSException = process.env.LOCAL_IGNORE_HTTPS_ERRORS === 'true' && isLoopback(apiBaseURL) && isLoopback(process.env.BASE_URL || 'http://localhost:4200');

export function registrationPassword(): string {
  const value = process.env.REGISTRATION_TEST_PASSWORD;
  if (!value || value.length < 8 || value.length > 20 || !/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value) || !/[^a-zA-Z0-9]/.test(value)) {
    throw new Error('Set REGISTRATION_TEST_PASSWORD to 8–20 characters including uppercase, lowercase, a digit, and a special character.');
  }
  return value;
}

export function isAPIRequest(url: string, pathname: string): boolean {
  const actual = new URL(url);
  return actual.origin === new URL(apiBaseURL).origin && actual.pathname.toLowerCase() === pathname.toLowerCase();
}

// Invalid-form tests must never create accounts, even when client validation fails.
export async function guardSignup(page: Page) {
  const attempts: string[] = [];
  // Block signup even if Angular's configured backend differs from API_BASE_URL.
  const isSignup = (url: string) => new URL(url).pathname.toLowerCase() === '/api/users/signup';
  page.on('request', request => {
    if (request.method() === 'POST' && isSignup(request.url())) attempts.push('POST signup');
  });
  await page.route(url => isSignup(url.href), async route => {
    if (route.request().method() === 'POST') {
      await route.abort('blockedbyclient');
    } else {
      await route.continue();
    }
  });
  return attempts;
}

export async function hasDatabaseDisclosure(response: APIResponse): Promise<boolean> {
  const text = await response.text();
  return /SQLSTATE|MySqlException|MySqlConnector|Microsoft\.EntityFrameworkCore|System\.Data\.| at Yad2\.|You have an error in your SQL syntax/i.test(text);
}
