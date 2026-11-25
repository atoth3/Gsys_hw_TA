import { defineConfig, devices } from '@playwright/test';

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
  retries: process.env.CI ? 2 : 0,
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
        ...devices['Desktop Chrome'],
        baseURL: 'https://www.saucedemo.com',
        /* SauceDemo uses data-test="..." attributes */
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'onlinehtmleditor',
      testDir: './onlinehtmleditor',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://onlinehtmleditor.dev',
      },
    },
  ],
});
