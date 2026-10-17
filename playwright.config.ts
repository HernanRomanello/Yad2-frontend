import { defineConfig, devices } from '@playwright/test';
import { isLoopback } from './tests/utils/registration';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL || 'http://localhost:4200';
const localFrontend = isLoopback(baseURL);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,

  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL,
    ignoreHTTPSErrors: localFrontend,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: '**/api/**',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: {
        ignoreHTTPSErrors: localFrontend,
      },
    },
  ],

  webServer: localFrontend
    ? {
        command:
          'npm exec -- ng serve --configuration development --host ' +
          new URL(baseURL).hostname +
          ' --port ' +
          (new URL(baseURL).port || '4200'),
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
