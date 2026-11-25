import { test, expect, type Page } from '@playwright/test';

test('online html editor', async ({ page }) => {
  const setFormat = (format: string) =>
    page.getByRole('button', { name: format, exact: true }).click();
  const textbox = page.getByRole('textbox');

  await page.goto('/');

  await setFormat('Bold');
  await textbox.fill('Automation ');
  await setFormat('Bold');

  await setFormat('Underline');
  await textbox.pressSequentially('Test');
  await setFormat('Underline');

  await textbox.pressSequentially(' Example');

  await expect(textbox.locator('strong')).toHaveText('Automation');
  await expect(textbox.locator('u')).toHaveText('Test');
  await expect
    .poll(async () => (await textbox.innerText()).replace(/⁠/g, ''))
    .toBe('Automation Test Example');
});

