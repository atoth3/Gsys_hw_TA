import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly container: Locator;
  readonly items: Locator;
  readonly checkout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('cart-list');
    this.items = page.getByTestId('inventory-item');
    this.checkout = page.getByTestId('checkout');
  }

  async expectLoaded() {
    await expect(this.container).toBeVisible();
  }

  /** The cart card whose text contains the given product name. */
  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  /** Verifies the cart contains exactly these products (order independent). */
  async expectItems(productNames: string[]) {
    await expect(this.items).toHaveCount(productNames.length);
    for (const name of productNames) {
      await expect(this.item(name)).toBeVisible();
    }
  }
}
