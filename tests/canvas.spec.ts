/**
 * Selfie PullAI - Canvas & Editor Tests
 * Tests for Features 9-10: Canvas rendering and Gemini API integration
 * 
 * TDD Verification: These tests verify the canvas element is present
 * and ready for image composition.
 */

import { test, expect } from '@playwright/test';

test.describe('Feature 9: Canvas & Drawing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display canvas element', async ({ page }) => {
    await expect(page.locator('[data-testid="preview-canvas"]')).toBeVisible();
  });

  test('canvas should have accessible label', async ({ page }) => {
    const canvas = page.locator('[data-testid="preview-canvas"]');
    const ariaLabel = await canvas.getAttribute('aria-label');
    expect(ariaLabel).toContain('preview');
  });

  test('should have canvas container for responsive sizing', async ({ page }) => {
    await expect(page.locator('[data-testid="canvas-container"]')).toBeVisible();
  });

  test('should have editor controls container', async ({ page }) => {
    await expect(page.locator('[data-testid="editor-controls"]')).toBeVisible();
  });

  test('canvas should be within editor section', async ({ page }) => {
    const editorSection = page.locator('[data-testid="editor-section"]');
    const canvas = editorSection.locator('[data-testid="preview-canvas"]');
    await expect(canvas).toBeVisible();
  });
});

test.describe('Feature 10: Gemini API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have processor module loaded (check no JS errors)', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForTimeout(1000);

    // Filter out expected API unavailable messages
    const criticalErrors = errors.filter(
      (e) => !e.includes('Gemini') && !e.includes('API') && !e.includes('banana')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('app should function in fallback mode when API unavailable', async ({ page }) => {
    // The app should still load and be usable even without Gemini API
    await expect(page.locator('[data-testid="app-main"]')).toBeVisible();
    await expect(page.locator('[data-testid="upload-zone"]')).toBeVisible();
  });
});
