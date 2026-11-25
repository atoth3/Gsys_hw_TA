# Code Review – Homework vs. Requirements

Reviewed against `Homework_TypeScript.pdf` (Cases 1–5 + preconditions) on 2026-11-25, at commit `99aa570`.
No code was changed. Severity: **High** = requirement not met / likely reviewer objection, **Medium** = deviation that should be fixed or documented, **Low** = polish.

## Summary

| Area | Status |
|---|---|
| Preconditions | ⚠️ Playwright version not pinned to 1.39.0 |
| Case 1 – Purchase process | ⚠️ Works; start URL and `credential.json` location differ from the task |
| Case 2 – Mandatory field errors | ❌ No scroll step; checks `2026` instead of `2023` (undocumented); split into two tests |
| Case 3 – Rich text editor | ✅ Works; minor cleanups |
| Case 4 – iFrame & tabs | ✅ Works locally; deviations documented in README; skipped on CI |
| Case 5 – REST API | ⚠️ Works; "Add REST API library" step not addressed explicitly |
| Repo / README | ⚠️ README mixes personal notes with docs; no run instructions; Cases 2, 3, 5 missing |

---

## Preconditions

1. **High – Playwright version is not 1.39.0.** `package.json` has `"@playwright/test": "^1.39.0"`, which resolves to **1.65.1** (installed and in the lock file). The task says *Playwright: 1.39.0*. Either pin `"1.39.0"` (and re-check everything still works, e.g. per-project `expect` options and `pressSequentially`), or document in the README why a newer version was used.
2. ✅ Node: CI uses Node 24 (requirement: 18+).
3. ✅ Test runner script exists (`npm test` plus per-project scripts).
4. **Low – `package.json` metadata is stale:** `"description": "Case 1 – Automate Purchase Process"` (the repo now covers all five cases) and `"main": "index.js"` (the file doesn't exist).

## Case 1 – Automate Purchase Process

1. **Medium – Step 1, wrong start URL.** The task says to open `https://www.saucedemo.com/inventory.html`. `LoginPage.goto()` opens `/` ([saucedemo/pages/login.ts:19](saucedemo/pages/login.ts#L19)). Your README notes that `/inventory.html` shows a login error straight away, which is expected behaviour, and the test could open that URL and still log in. Either use the task's URL or document the choice in the README.
2. **Medium – Step 2, file name and location.** The task asks for `credential.json` in a `test/resources` folder. The repo has `saucedemo/credentials.json`: a different name (plural) and a different folder. Rename and move it (e.g. `saucedemo/tests/resources/credential.json`), or document why.
3. **Low – Outdated comment:** [saucedemo/utils/credentials.ts:11](saucedemo/utils/credentials.ts#L11) says "credentials.json in the project root", but the file now lives in `saucedemo/`.
4. ✅ Steps 3–8 are covered: the credentials are parsed, the two items are added, the cart badge count is checked, the checkout is completed, and "Thank you for your order!" is checked.
5. **Low – Missing semicolons:** [smoke.spec.ts:29](saucedemo/tests/smoke.spec.ts#L29) and [inventory.ts:13](saucedemo/pages/inventory.ts#L13).
6. **Low – Unused code:** `CartPage.getItemList()` and `CheckoutPage.backHomeButton` are never used.
7. **Low – Design:** `CartPage` owns the header's cart badge and cart link, which appear on every page, not just the cart. A small `HeaderComponent` would separate these better. This is a judgement call, not a defect.

## Case 2 – Verify error messages for mandatory fields

1. **High – Step 5 (scroll to the bottom) is not implemented.** [smoke.spec.ts:42-48](saucedemo/tests/smoke.spec.ts#L42-L48) checks the footer without scrolling. `toContainText` doesn't scroll, so the step is missing. Add an explicit scroll, e.g. `await inventoryPage.termsOfSevice.scrollIntoViewIfNeeded()` or `page.mouse.wheel(...)`, and optionally `await expect(footer).toBeInViewport()`.
2. **High – Step 6 checks `2026`, but the task says `2023`.** [smoke.spec.ts:46](saucedemo/tests/smoke.spec.ts#L46). The live site presumably shows the current year, so the test is probably right, but the difference isn't in the README the way the Case 4 differences are. Also, hard-coding `'2026'` will make the test fail on 1 January 2027. Use `String(new Date().getFullYear())` or a `/\d{4}/` regex, and document the difference.
3. **Medium – The case is split across two tests.** Steps 1–3 are in `login without credential` and steps 4–6 in `terms of service validation`. The task describes one flow: error first, then log in on the same page. Either merge them into one test named after Case 2, or note the split.
4. **Medium – Step 1 URL:** same as Case 1. The test opens `/`, not `/inventory.html`.
5. **Low – Typo and misleading name:** `termsOfSevice` ([inventory.ts:7](saucedemo/pages/inventory.ts#L7)) is missing an "r". It also points at the whole footer copyright text (`footer-copy`), so `footer` or `footerCopy` would be a more accurate name. The footer is shared across pages, so it fits a header/footer component better than `InventoryPage`.
6. **Low – Inconsistent credentials:** Case 1 reads them from JSON, but Case 2 hard-codes `'standard_user', 'secret_sauce'`. That's acceptable, since the task gives them inline, but a constant or a second JSON entry would be more consistent.

## Case 3 – Rich Text Editor

1. ✅ Bold "Automation", underlined "Test", and a full-text check are all implemented, and the CKEditor word-joiner workaround is in place.
2. **Low – The space after "Automation" is bold.** `fill('Automation ')` runs while bold is on ([editor.spec.ts:10-12](onlinehtmleditor/editor.spec.ts#L10-L12)), so the HTML is `<strong>Automation </strong>`. The `strong` check passes only because `toHaveText` trims whitespace. Typing the space after turning bold off would match the task exactly.
3. **Low – Mixed typing methods:** the first word uses `fill()` and the rest use `pressSequentially()`. Use `pressSequentially()` throughout. `fill()` replaces the editor's contents, which works here only because the editor starts empty.
4. **Low – Invisible character in the regex:** [editor.spec.ts:23](onlinehtmleditor/editor.spec.ts#L23) has a literal U+2060 inside `/⁠/g`, which can't be seen. Write it as `/⁠/g` so a reviewer can tell what it removes.
5. **Low – Unused import:** `type Page` is imported but not used.
6. **Low – Missing README note:** the hidden-character workaround is a real difference between the task and the site, but it isn't mentioned in the README (Case 4's differences are).
7. **Optional:** also check `aria-pressed` on the Bold/Underline buttons, to prove the formatting was toggled through the UI.

## Case 4 – iFrame and tab handling

1. ✅ The README documents the differences from the task: the title, the missing "Testing" menu on the main window, hover vs. click, Submit vs. Join Now, and Cloudflare blocking CI.
2. **Medium – Step order differs from the task.** The tab is closed at the end ([guru99.spec.ts:31-32](guru99/guru99.spec.ts#L31-L32)), not after step 3, because the "Testing" menu only exists in the new tab. This is documented, but the code comment "Back to the original page" has nothing after it that uses the original page. Consider checking something on `page` after switching back, e.g. that the iframe is still visible, so the "switch back" step is actually tested.
3. **Medium – Step 6 only checks that the button is visible.** The task says "wide red ... button near bottom of the page". The test only checks that a `Submit` button is visible ([guru99.spec.ts:28](guru99/guru99.spec.ts#L28)). It could also check the colour (`toHaveCSS('background-color', 'rgb(244, 53, 0)')`) and/or the width, to match the task's description.
4. **Medium – Never runs on CI.** The file-level `test.skip(!!process.env.CI, ...)` means CI never runs Case 4, even on days Cloudflare would allow it. This is documented and acceptable, but worth knowing.
5. **Low – Step 2 says "image".** The test clicks the link that wraps the image (`getByRole('link')`). Locating the `img` inside the iframe, or the link by its image, would match the wording better.
6. **Low – Formatting:** the test body isn't indented (lines 8-32), line 28 is missing a semicolon, and line 32 has trailing whitespace.
7. **Low – Leftover code:** the commented-out hover line (lines 21-22) is now covered by the README. Remove it, or keep a single explanatory comment.
8. **Low – Test name:** `'guru99'` doesn't say what's tested. Something like `'Case 4 – iFrame and tab handling'` would be clearer.

## Case 5 – REST API testing

1. **Medium – Step 1, "Add REST API library".** The test uses Playwright's built-in `request` fixture and adds no library. That's a valid and arguably better choice, but the task explicitly asks for a library to be added, so a reviewer may look for one (e.g. `axios`). Document in the README why Playwright's `APIRequestContext` was chosen.
2. ✅ Steps 2–5 are covered: GET `/users`, parse the JSON, log `name | email` in the example's format, and check that the first email contains `@`.
3. **Low – Unnecessary header:** the project config sends `Content-Type: application/json` on every request, including GETs, which have no body. It's harmless, but `Accept` alone is enough here.
4. **Low – Missing semicolon:** [api.spec.ts:13](jsonplaceholder/api.spec.ts#L13).
5. **Low – Test name grammar:** `'GET /users return with valid users'` should be `'GET /users returns valid users'`.

## Repository / README / CI

1. **High – The README isn't reviewer-ready.**
   - It opens with personal notes and open questions ("Why it is differ…").
   - Case 1 still contains placeholders ("Open the url XXX", `username: xxx`).
   - Cases 2, 3 and 5 aren't described.
   - There's no "how to install / run" section and no explanation of the project layout.

   Suggested structure: overview → prerequisites → `npm ci` / `npx playwright install` / `npm test` (+ per-case scripts) → project structure → the per-case differences from the task.
2. **Medium – File and test names don't match the cases.** `saucedemo/tests/smoke.spec.ts` contains Cases 1 and 2, and none of the test names mention case numbers. Naming tests `Case 1 – …` through `Case 5 – …` would make it easy to map the HTML report onto the PDF.
3. ✅ CI: the GitHub Actions workflow runs on pushes and pull requests to `main`, uploads the HTML report, and records traces on retry.
4. ✅ Structure: one Playwright config with a project per site, page objects plus fixtures for SauceDemo, and strict TypeScript.
5. **Low – Credentials committed.** `saucedemo/credentials.json` is in git. That's fine for SauceDemo's public demo credentials, and the task asks for the file, but a one-line README note would show you're aware of it.

---

## Suggested order of fixes

1. Case 2: add the scroll step, make the year check stay correct after 2026 and document 2023 → 2026, and consider merging into one test.
2. Pin Playwright to 1.39.0 or document why you didn't.
3. Rewrite the README: run instructions, project structure, and the differences from the task for every case.
4. Case 1: use the `/inventory.html` start URL and the `test/resources/credential.json` location, or document why not.
5. Case 5: say why no extra REST library was added.
6. Cleanups: typos, semicolons, unused code, indentation, the `⁠` regex, test names.
