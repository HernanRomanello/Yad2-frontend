import { defineConfig, devices } from '@playwright/test';
import config from './playwright.config';

export default defineConfig({
  ...config,
  testMatch: ['**/e2e/favorites/**/*.spec.ts', '**/api/favorites.spec.ts'],
  projects: [
    ...config.projects!.map(project => ({ ...project, testMatch: project.name === 'api'
      ? '**/api/favorites.spec.ts' : '**/e2e/favorites/**/*.spec.ts' })),
    { name: 'mobile-chromium', testMatch: '**/e2e/favorites/**/*.spec.ts', use: { ...devices['Pixel 7'] } },
  ],
  reporter: [
    ['list'], ['html', { outputFolder: 'playwright-report/favorites', open: 'never' }],
    ['json', { outputFile: 'test-results/favorites-results.json' }],
  ],
});
