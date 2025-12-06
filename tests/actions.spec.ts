/**
 * Selfie PullAI - Action Buttons & History Tests
 * Tests for Features 11-18: Editor controls, export, share, history
 * 
 * TDD Verification: These tests verify action buttons,
 * download/share functionality, and history panel.
 */

import { test, expect } from '@playwright/test';

test.describe('Feature 14: Action Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display download button', async ({ page }) => {
    await expect(page.locator('[data-testid="download-btn"]')).toBeVisible();
  });

  test('should display share button', async ({ page }) => {
    await expect(page.locator('[data-testid="share-btn"]')).toBeVisible();
  });

  test('should display reset button', async ({ page }) => {
    await expect(page.locator('[data-testid="reset-btn"]')).toBeVisible();
  });

  test('should display history button', async ({ page }) => {
    await expect(page.locator('[data-testid="history-btn"]')).toBeVisible();
  });

  test('download button should be disabled initially', async ({ page }) => {
    await expect(page.locator('[data-testid="download-btn"]')).toBeDisabled();
  });

  test('share button should be disabled initially', async ({ page }) => {
    await expect(page.locator('[data-testid="share-btn"]')).toBeDisabled();
  });

  test('reset button should be disabled initially', async ({ page }) => {
    await expect(page.locator('[data-testid="reset-btn"]')).toBeDisabled();
  });

  test('history button should be enabled', async ({ page }) => {
    await expect(page.locator('[data-testid="history-btn"]')).toBeEnabled();
  });
});

test.describe('Feature 16: History Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('history panel should be hidden initially', async ({ page }) => {
    const historyPanel = page.locator('[data-testid="history-panel"]');
    await expect(historyPanel).toBeHidden();
  });

  test('should show history panel when history button clicked', async ({ page }) => {
    await page.locator('[data-testid="history-btn"]').click();
    
    const historyPanel = page.locator('[data-testid="history-panel"]');
    await expect(historyPanel).toBeVisible();
  });

  test('should have close button in history panel', async ({ page }) => {
    await page.locator('[data-testid="history-btn"]').click();
    
    await expect(page.locator('[data-testid="close-history-btn"]')).toBeVisible();
  });

  test('should hide history panel when close button clicked', async ({ page }) => {
    // Open history
    await page.locator('[data-testid="history-btn"]').click();
    await expect(page.locator('[data-testid="history-panel"]')).toBeVisible();
    
    // Close history
    await page.locator('[data-testid="close-history-btn"]').click();
    await expect(page.locator('[data-testid="history-panel"]')).toBeHidden();
  });

  test('should have history grid container', async ({ page }) => {
    await page.locator('[data-testid="history-btn"]').click();
    
    await expect(page.locator('[data-testid="history-grid"]')).toBeVisible();
  });

  test('close button should have accessible label', async ({ page }) => {
    await page.locator('[data-testid="history-btn"]').click();
    
    const closeBtn = page.locator('[data-testid="close-history-btn"]');
    const ariaLabel = await closeBtn.getAttribute('aria-label');
    expect(ariaLabel).toContain('Close');
  });
});

test.describe('Feature 18: Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Selfie PullAI');
  });

  test('should have lang attribute on html', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('all buttons should have accessible names', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Button should have either text content or aria-label
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('should be navigable via keyboard', async ({ page }) => {
    // Press Tab multiple times and verify focus moves
    await page.keyboard.press('Tab');
    let focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    await page.keyboard.press('Tab');
    focused = page.locator(':focus');
    await expect(focused).toBeVisible();
  });

  test('interactive elements should have visible focus states', async ({ page }) => {
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    const focused = page.locator(':focus');
    const outline = await focused.evaluate((el) => 
      getComputedStyle(el).outline || getComputedStyle(el).boxShadow
    );
    
    // Should have some focus indicator
    expect(outline).not.toBe('none');
  });
});
