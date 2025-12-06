/**
 * Selfie PullAI - Canvas & Editor Tests
 * Tests for Features 9-10: Canvas rendering and Gemini API integration
 * 
 * TDD Verification: These tests verify the canvas element is present
 * and ready for image composition.
 * 
 * Note: Editor section is hidden by default and only shows after image generation.
 * Preview section shows first with side-by-side template + user image.
 */

import { test, expect } from '@playwright/test';

test.describe('Feature 9: Canvas & Drawing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have canvas element in DOM (hidden initially)', async ({ page }) => {
    // Canvas exists but is hidden until image is generated
    const canvas = page.locator('[data-testid="preview-canvas"]');
    await expect(canvas).toHaveCount(1);
  });

  test('canvas should have accessible label', async ({ page }) => {
    const canvas = page.locator('[data-testid="preview-canvas"]');
    const ariaLabel = await canvas.getAttribute('aria-label');
    expect(ariaLabel).toContain('selfie');
  });

  test('should have canvas container in DOM', async ({ page }) => {
    const container = page.locator('[data-testid="canvas-container"]');
    await expect(container).toHaveCount(1);
  });

  test('should have editor controls container in DOM', async ({ page }) => {
    const controls = page.locator('[data-testid="editor-controls"]');
    await expect(controls).toHaveCount(1);
  });

  test('canvas should be within editor section', async ({ page }) => {
    const editorSection = page.locator('[data-testid="editor-section"]');
    const canvas = editorSection.locator('[data-testid="preview-canvas"]');
    await expect(canvas).toHaveCount(1);
  });
  
  test('editor section should be hidden initially', async ({ page }) => {
    const editorSection = page.locator('[data-testid="editor-section"]');
    await expect(editorSection).toHaveClass(/hidden/);
  });
});

test.describe('Preview Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have preview section in DOM', async ({ page }) => {
    await expect(page.locator('[data-testid="preview-section"]')).toHaveCount(1);
  });

  test('preview section should be hidden initially', async ({ page }) => {
    await expect(page.locator('[data-testid="preview-section"]')).toHaveClass(/hidden/);
  });

  test('should have template preview image element', async ({ page }) => {
    await expect(page.locator('[data-testid="template-preview-img"]')).toHaveCount(1);
  });

  test('should have user preview image element', async ({ page }) => {
    await expect(page.locator('[data-testid="user-preview-img"]')).toHaveCount(1);
  });

  test('should have generate button', async ({ page }) => {
    await expect(page.locator('[data-testid="generate-btn"]')).toHaveCount(1);
  });

  test('generate button should have proper text', async ({ page }) => {
    const btn = page.locator('[data-testid="generate-btn"]');
    await expect(btn).toContainText('Generate');
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
