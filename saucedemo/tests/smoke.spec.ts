import { expect, test } from '../fixtures/pages';
import { credentials } from '../utils/credentials';

test('purchase flow', async ({ loginPage, inventoryPage, cartPage, checkoutPage }) => {
  // Login
  await loginPage.goto();
  await loginPage.login(credentials.username, credentials.password);

  // Add items
  await inventoryPage.expectLoaded();
  const products = ['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket'];
  for (const product of products) {
    await inventoryPage.addToCart(product);
  }

  await cartPage.expectBadgeCount(products.length);

  // Cart
  await cartPage.open();
  await cartPage.expectItems(products);

  // Checkout
  await cartPage.checkout.click();

  await checkoutPage.fillCustomerInformation({ firstName: 'John', lastName: 'Doe', postalCode: '1234' });

  await checkoutPage.expectOverviewLoaded();
  await checkoutPage.expectItems(products);
  await checkoutPage.finishButton.click()

  //Completed
  await checkoutPage.expectOrderComplete();
});

test('login without credential', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.loginButton.click();

  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
});

test('terms of service validation', async ({ loginPage, inventoryPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  
  await expect(inventoryPage.termsOfSevice).toContainText('2026');
  await expect(inventoryPage.termsOfSevice).toContainText('Terms of Service');

});
