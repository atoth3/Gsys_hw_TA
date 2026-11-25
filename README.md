# Playwright + TypeScript Homework

UI and REST API test automation for the five homework cases, written with [Playwright Test](https://playwright.dev) in TypeScript.

| Case | Site | Test |
|---|---|---|
| 1 – Automate purchase process | saucedemo.com | [saucedemo/tests/smoke.spec.ts](saucedemo/tests/smoke.spec.ts) |
| 2 – Error messages for mandatory fields | saucedemo.com | [saucedemo/tests/smoke.spec.ts](saucedemo/tests/smoke.spec.ts) |
| 3 – Rich text editor | onlinehtmleditor.dev | [onlinehtmleditor/editor.spec.ts](onlinehtmleditor/editor.spec.ts) |
| 4 – iFrame and tab handling | demo.guru99.com | [guru99/guru99.spec.ts](guru99/guru99.spec.ts) |
| 5 – REST API testing | jsonplaceholder.typicode.com | [jsonplaceholder/api.spec.ts](jsonplaceholder/api.spec.ts) |

## Prerequisites

- Node.js 18 or newer
- Playwright **1.39.0** (pinned in `package.json`)
- macOS only: Google Chrome installed (see [Notes](#notes))

## Setup and run

```bash
npm ci
npx playwright install chromium

npm test                  # all cases
npm run test:saucedemo    # Case 1 + 2
npm run test:editor       # Case 3
npm run test:guru99       # Case 4
npm run test:api          # Case 5

npx playwright show-report   # open the HTML report
```

Tests also run on GitHub Actions on every push / pull request to `main` ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)); the HTML report is attached to each run.

## Project structure

```
playwright.config.ts        one config, one Playwright project per site
saucedemo/
  tests/smoke.spec.ts       Case 1 and Case 2
  tests/resources/credential.json
  pages/                    page objects (login, inventory, cart, checkout)
  components/               shared header (cart icon) and footer
  fixtures/pages.ts         injects page objects/components into tests
  utils/credentials.ts      parses credential.json
onlinehtmleditor/           Case 3
guru99/                     Case 4
jsonplaceholder/            Case 5
```

## Notes

- **Playwright 1.39.0 on macOS** – the Chromium build bundled with 1.39 (v119) crashes on start on current macOS versions. On macOS the config therefore uses the locally installed Google Chrome (`channel: 'chrome'`); on Linux/CI the bundled Chromium is used. The CI runner is pinned to `ubuntu-22.04`, because Playwright 1.39 predates Ubuntu 24.04 support.
- **Credentials in the repository** – `credential.json` is committed on purpose: the task asks for the file, and these are SauceDemo's public demo credentials. Real credentials would come from environment variables / CI secrets instead.
- **Locators** – SauceDemo exposes `data-test` attributes, so `getByTestId` is used there (`testIdAttribute: 'data-test'`). The other sites use role-based locators (`getByRole`).

## Differences between the task and the live sites

Checked on 2026-11-25.

### Case 1 – Automate purchase process

- **Step 1** – The task's start URL is `/inventory.html`. Opening it without being logged in shows the login form with an error already displayed ("Epic sadface: You can only access '/inventory.html' when you are logged in."), so the test opens the login page (`/`) directly.

### Case 3 – Rich text editor

- **Step 5** – The editor (CKEditor 5) inserts invisible *word joiner* characters (U+2060) where a formatting (bold/underline) ends. The visible text is "Automation Test Example", but the raw text contains these characters, so an exact text comparison fails. The test strips them before comparing, and checks the formatting separately via the `<strong>` and `<u>` elements.

### Case 4 – iFrame and tab handling

- **Step 1** – The page never fires the `load` event (the YouTube embed and ads keep loading; still not fired after 20s), so a default `page.goto()` times out. The test uses `waitUntil: 'commit'` and then waits for the iframe itself. The `http://` URL redirects to `https://`.
- **Step 3** – The new tab's title is **"Selenium Live Project for Practice"**, not "Selenium Live Project: FREE Real Time Project for Practice". The tab opens https://www.guru99.com/live-selenium-project.html.
- **Steps 4–5** – The main window (demo.guru99.com) has **no "Testing" menu item**; its top menu is a "Selenium" dropdown of demo pages. The "Testing" menu only exists on www.guru99.com, i.e. in the new tab. Following steps 4 and 5 literally is therefore impossible, so the test does step 5 in the new tab and closes it afterwards.
- **Step 5** – Hovering over "Testing" does **not** open the dropdown (not with `hover()` and not with step-by-step mouse movement). It opens on click, so the test clicks the "Testing" title. The menu item text is "🏅 Selenium" (with an emoji), so it is matched by partial name.
- **Step 6** – There is **no "Join Now" button** on the Selenium tutorial page. The wide red button near the bottom (520px wide, background `rgb(244, 53, 0)`) is labelled **"Submit"**, so the test verifies that button.
- **CI** – www.guru99.com is protected by Cloudflare, which blocks GitHub Actions runners: the new tab shows "Attention Required! | Cloudflare" instead of the real page. Therefore the whole test is **skipped on CI** (with the reason shown in the report) and only runs locally.

### Case 5 – REST API testing

- **Step 1 (REST API library)** – No extra library (e.g. axios) was added. Playwright Test ships its own REST client, `APIRequestContext` (the `request` fixture), which is the recommended way to do API testing in Playwright: it shares the config (`baseURL`, headers), the assertions, the retries and the HTML report with the UI tests, and needs no additional dependency.
