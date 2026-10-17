import { defineConfig } from '@playwright/test';
import config from './playwright.config';
import { isLoopback } from './tests/utils/registration';

const baseURL = process.env.E2E_BASE_URL || process.env.BASE_URL || 'http://localhost:4200';
const apiURL = process.env.API_BASE_URL || 'https://localhost:7211';
if (!isLoopback(baseURL) || !isLoopback(apiURL)) throw new Error('Auth tests require local frontend and API URLs.');

export default defineConfig({
  ...config,
  testDir: './tests/e2e/auth',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  use: {
    ...config.use,
    baseURL,
    ignoreHTTPSErrors: process.env.LOCAL_IGNORE_HTTPS_ERRORS === 'true',
    // Network traces and screenshots can expose credentials or account data.
    // The fixture attaches sanitized endpoint statuses on failure instead.
    trace: 'off', screenshot: 'off', video: 'off',
  },
  webServer: {
    command: `npm exec -- ng serve --configuration development --host ${new URL(baseURL).hostname} --port ${new URL(baseURL).port || '4200'}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
