import { expect, test } from '../fixtures/pages';
import { credentials } from '../utils/credentials';

test('Case 1 – Automate purchase process', async ({ loginPage, inventoryPage, header, cartPage, checkoutPage }) => {
  // Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Add items
  await inventoryPage.expectLoaded();
  const products = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket'];
  for (const product of products) {
    await inventoryPage.addToCart(product);
  }

  await header.expectCartBadgeCount(products.length);

  // Cart
  await header.openCart();
  await cartPage.expectLoaded();
  await cartPage.expectItems(products);

  // Checkout
  await cartPage.checkout.click();

  await checkoutPage.fillCustomerInformation({ firstName: 'John', lastName: 'Doe', postalCode: '1234' });

  await checkoutPage.expectOverviewLoaded();
  await checkoutPage.expectItems(products);
  await checkoutPage.finishButton.click();

  // Completed
  await checkoutPage.expectOrderComplete();
});

test('Case 2 – Error message for mandatory login fields', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginButton.click();

  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
});

test('Case 2 – Footer contains the year and Terms of Service', async ({ loginPage, footer }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(footer.termsOfService).toContainText('2026');
  await expect(footer.termsOfService).toContainText('Terms of Service');
});
