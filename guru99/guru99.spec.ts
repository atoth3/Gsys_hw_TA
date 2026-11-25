import { test, expect } from '@playwright/test';

test.skip(!!process.env.CI, 'Blocked by Cloudflare bot protection – see README');

test('Case 4 – iFrame and tab handling', async ({ page }) => {
  await page.goto('', { waitUntil: 'commit' });

  const adFrame = page.frameLocator('iframe[src="ads.html"]');
  const adLink = adFrame.getByRole('link');
  const popupPromise = page.waitForEvent('popup');

  // Click on the iFrame
  await expect(adLink).toHaveAttribute('href', /live-selenium-project/);
  await adLink.click();

  // New page opened
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  await expect(popup).toHaveTitle('Selenium Live Project for Practice');

  // The "Testing" dropdown opens on click, not on hover – see README
  const nav = popup.getByRole('navigation').first();
  await nav.locator('.nav-drop-title-wrap').filter({ hasText: /^Testing/ }).click();
  await nav.getByRole('link', { name: 'Selenium' }).click();

  await expect(popup.getByRole('button', { name: 'Submit' })).toBeVisible();

  // Back to the original page
  await popup.close();
  await page.bringToFront();
});
