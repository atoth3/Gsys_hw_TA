import { expect, type Locator, type Page } from '@playwright/test';

/** The top bar shown on every page after login. */
export class HeaderComponent {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  /** Verifies the cart icon badge shows the given item count. */
  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  /** Opens the cart via the cart icon. */
  async openCart() {
    await this.cartLink.click();
  }
}
