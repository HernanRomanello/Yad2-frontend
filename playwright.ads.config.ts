import { defineConfig, devices } from '@playwright/test';
import config from './playwright.config';
export default defineConfig({
  ...config, retries: 0,
  projects: [
    { name: 'ads-desktop', testMatch: '**/e2e/ad-creation/**/*.spec.ts', use: { ...devices['Desktop Chrome'] } },
    { name: 'ads-mobile', testMatch: '**/e2e/ad-creation/**/*.spec.ts', use: { ...devices['Pixel 7'] } },
  ],
});
