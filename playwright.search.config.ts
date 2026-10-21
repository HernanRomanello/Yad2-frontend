import { defineConfig } from '@playwright/test';
import config from './playwright.config';

export default defineConfig({
  ...config,
  testMatch: '**/e2e/search/**/*.spec.ts',
  projects: config.projects?.filter(project => project.name !== 'api'),
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/search', open: 'never' }],
    ['json', { outputFile: 'test-results/search-results.json' }],
  ],
});
