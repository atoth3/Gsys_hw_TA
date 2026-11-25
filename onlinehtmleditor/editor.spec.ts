import { test, expect } from '@playwright/test';

test('Case 3 – Rich text editor', async ({ page }) => {
  const setFormat = (format: string) =>
    page.getByRole('button', { name: format, exact: true }).click();
  const textbox = page.getByRole('textbox');

  await page.goto('/');
  await textbox.clear();

  await setFormat('Bold');
  await textbox.pressSequentially('Automation ');
  await setFormat('Bold');

  await setFormat('Underline');
  await textbox.pressSequentially('Test');
  await setFormat('Underline');

  await textbox.pressSequentially(' Example');

  await expect(textbox.locator('strong')).toHaveText('Automation');
  await expect(textbox.locator('u')).toHaveText('Test');
  // CKEditor inserts invisible word joiners (U+2060) at formatting boundaries – strip them before comparing
  await expect
    .poll(async () => (await textbox.innerText()).replace(/⁠/g, ''))
    .toBe('Automation Test Example');
});
