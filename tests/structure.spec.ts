/**
 * Selfie PullAI - Project Structure & UI Tests
 * Tests for Features 1-3: Structure, CSS Variables, Responsive Layout
 * 
 * TDD Verification: These tests verify the core HTML structure,
 * CSS variables, and responsive layout are correctly implemented.
 */

import { test, expect } from '@playwright/test';

test.describe('Feature 1: Project Structure & Entry Point', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main HTML page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Selfie PullAI - Celebrity Selfie Generator');
  });

  test('should have semantic HTML structure with header, main, footer', async ({ page }) => {
    await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="app-main"]')).toBeVisible();
    await expect(page.locator('[data-testid="app-footer"]')).toBeVisible();
  });

  test('should have app title in header', async ({ page }) => {
    const title = page.locator('[data-testid="app-title"]');
    await expect(title).toHaveText('Selfie PullAI');
  });

  test('should load CSS stylesheet', async ({ page }) => {
    const linkElement = page.locator('link[rel="stylesheet"][href="css/style.css"]');
    await expect(linkElement).toHaveCount(1);
  });

  test('should load JavaScript module', async ({ page }) => {
    const scriptElement = page.locator('script[type="module"][src="js/app.js"]');
    await expect(scriptElement).toHaveCount(1);
  });

  test('should have proper meta viewport for mobile', async ({ page }) => {
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', 'width=device-width, initial-scale=1.0');
  });
});

test.describe('Feature 2: CSS Variables & Reset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have CSS variables defined on root', async ({ page }) => {
    const primaryColor = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim()
    );
    expect(primaryColor).toBeTruthy();
  });

  test('should apply box-sizing border-box to all elements', async ({ page }) => {
    const boxSizing = await page.evaluate(() => 
      getComputedStyle(document.body).boxSizing
    );
    expect(boxSizing).toBe('border-box');
  });

  test('should have no default margins on body', async ({ page }) => {
    const margin = await page.evaluate(() => 
      getComputedStyle(document.body).margin
    );
    expect(margin).toBe('0px');
  });

  test('should use system font stack', async ({ page }) => {
    const fontFamily = await page.evaluate(() => 
      getComputedStyle(document.body).fontFamily
    );
    // Check for common system font stack components
    expect(fontFamily).toMatch(/(-apple-system|system-ui|Segoe UI|Roboto|sans-serif)/);
  });
});

test.describe('Feature 3: Responsive Layout', () => {
  test('should display correctly on mobile (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    
    await expect(page.locator('[data-testid="app-main"]')).toBeVisible();
    await expect(page.locator('[data-testid="upload-section"]')).toBeVisible();
  });

  test('should display correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await expect(page.locator('[data-testid="app-main"]')).toBeVisible();
  });

  test('should display correctly on desktop (1024px)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    
    await expect(page.locator('[data-testid="app-main"]')).toBeVisible();
  });

  test('should have visible header at all viewport sizes', async ({ page }) => {
    for (const width of [320, 768, 1024]) {
      await page.setViewportSize({ width, height: 600 });
      await page.goto('/');
      await expect(page.locator('[data-testid="app-header"]')).toBeVisible();
    }
  });
});
