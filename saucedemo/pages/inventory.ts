import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly container: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByTestId('inventory-container');
    this.items = page.getByTestId('inventory-item');
  }

  async expectLoaded() {
    await expect(this.container).toBeVisible();
  }

  /** The inventory card whose text contains the given product name. */
  item(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  /** Adds the product to the cart and verifies its button switched to "Remove". */
  async addToCart(productName: string) {
    const item = this.item(productName);
    await item.getByRole('button', { name: 'Add to cart' }).click();
    await expect(item.getByRole('button', { name: 'Remove' })).toBeVisible();
  }
}
