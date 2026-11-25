import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly container: Locator;
  readonly items: Locator;
  readonly checkout: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('cart-list');
    this.items = page.getByTestId('inventory-item');
    this.checkout = page.getByTestId('checkout');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** Verifies the cart icon badge in the header shows the given item count. */
  async expectBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  /** Opens the cart via the cart icon in the header and waits for it to load. */
  async open() {
    await this.cartLink.click();
    await this.expectLoaded();
  }

  async expectLoaded() {
    await expect(this.container).toBeVisible();
  }

  /** The cart card whose text contains the given product name. */
  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  /** Names of all products currently in the cart (snapshot, no auto-wait). */
  async getItemList(): Promise<string[]> {
    return this.items.getByTestId('inventory-item-name').allTextContents();
  }

  /** Verifies the cart contains exactly these products (order independent). */
  async expectItems(productNames: string[]) {
    await expect(this.items).toHaveCount(productNames.length);
    for (const name of productNames) {
      await expect(this.item(name)).toBeVisible();
    }
  }
}