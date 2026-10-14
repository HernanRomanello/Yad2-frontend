import { test, expect } from '@playwright/test';

test.describe('Yad2 - Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    // Open the local Angular application
    const response = await page.goto('http://localhost:4200/');

    // Verify the server returned HTTP 200
    expect(response?.status()).toBe(200);

    // Verify the page body is visible
    await expect(page.locator('body')).toBeVisible();
  });
});
