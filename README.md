- I'm using DataTestIDs but lot of people recommend getByRole and filter to text because it is more robust against code change. But if we generate testIDs automaticall it should be the fastest way to find an element.
- In the checkout process the cart item test ID is inventory-item but the class is cart_item. Why it is differ if everywhere else same
- Opening the /inventory page throw an login error immidiatelly

Case 1 – Automate Purchase Process

Open the url XXX
2. Create a credential.json file in test/resources folder and store:
{
username: xxx,
password: xxx
}
3. Parse the credentials from credential.json and use it for the following test
4. On the website type username and password and click on login button
5. Add the following items to the cart: Sauce Labs Backpack, Sauce Labs Fleece Jacket
6. Validate the number on the cart symbol
7. Go through the checkout process
8. Validate that Thank you for your order message is appearing

Case 4 – iFrame and tab handling

1. Open this url http://demo.guru99.com/test/guru99home
2. Locate the image inside the iframe near bottom of the page just above Email Submission and click on it
3. Verify new page is loaded in new tab with title: Selenium Live Project: FREE Real Time Project for Practice
4. Close this tab and switch back to main window
5. From top menu click on Selenium link that can be seen while hovering on Testing menu item
6. Verify the wide red Join Now button is displayed near bottom of the page

Differences between the task and the live site (checked on 2026-11-25):

- Step 1 – The page never fires the `load` event (the YouTube embed and ads keep loading; still not fired after 20s), so a default `page.goto()` times out. The test uses `waitUntil: 'commit'` and then waits for the iframe itself. The `http://` URL redirects to `https://`.
- Step 3 – The new tab's title is **"Selenium Live Project for Practice"**, not "Selenium Live Project: FREE Real Time Project for Practice". The tab opens https://www.guru99.com/live-selenium-project.html.
- Steps 4–5 – The main window (demo.guru99.com) has **no "Testing" menu item**; its top menu is a "Selenium" dropdown of demo pages. The "Testing" menu only exists on www.guru99.com, i.e. in the new tab. Following steps 4 and 5 literally is therefore impossible, so the test does step 5 in the new tab and closes it afterwards.
- Step 5 – Hovering over "Testing" does **not** open the dropdown (not with `hover()` and not with step-by-step mouse movement). It opens on click, so the test clicks the "Testing" title. The menu item text is "🏅 Selenium" (with an emoji), so it is matched by partial name.
- Step 6 – There is **no "Join Now" button** on the Selenium tutorial page. The wide red button near the bottom (520px wide, background `rgb(244, 53, 0)`) is labelled **"Submit"**, so the test verifies that button.
- CI – www.guru99.com is protected by Cloudflare, which blocks GitHub Actions runners: the new tab shows "Attention Required! | Cloudflare" instead of the real page. Therefore the whole test is **skipped on CI** (with the reason shown in the report) and only runs locally.