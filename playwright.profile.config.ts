import { defineConfig } from '@playwright/test';
import config from './playwright.config';
export default defineConfig({
  ...config,
  workers: 1,
  projects: config.projects!.filter(project => project.name === 'chromium' || project.name === 'api').map(project => ({
    ...project, testMatch: project.name === 'api' ? '**/api/profile.spec.ts' : '**/e2e/profile/**/*.spec.ts',
  })),
});
