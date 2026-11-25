import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 1.39's bundled Chromium (v119) crashes on recent macOS versions, so on macOS the
 * locally installed Google Chrome is used instead. Linux (CI) keeps the bundled Chromium.
 */
const desktopChrome = {
  ...devices['Desktop Chrome'],
  ...(process.platform === 'darwin' ? { channel: 'chrome' } : {}),
};

/**
 * One config, one project per website under test.
 * See https://playwright.dev/docs/test-projects.
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Settings shared by every project */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'saucedemo',
      testDir: './saucedemo/tests',
      /* performance_glitch_user is intentionally slow – give assertions more time */
      expect: { timeout: 15_000 },
      use: {
        ...desktopChrome,
        baseURL: 'https://www.saucedemo.com',
        /* SauceDemo uses data-test="..." attributes */
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'onlinehtmleditor',
      testDir: './onlinehtmleditor',
      use: {
        ...desktopChrome,
        baseURL: 'https://onlinehtmleditor.dev',
      },
    },
    {
      name: 'guru99',
      testDir: './guru99',
      use: {
        ...desktopChrome,
        baseURL: 'https://demo.guru99.com/test/guru99home/',
      },
    },
    {
      /* API tests – uses the `request` fixture, no browser is launched */
      name: 'jsonplaceholder',
      testDir: './jsonplaceholder',
      use: {
        baseURL: 'https://jsonplaceholder.typicode.com',
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
});
