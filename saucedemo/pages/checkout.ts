import { expect, type Locator, type Page } from '@playwright/test';

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

/** Covers the three checkout steps: information form, overview, and completion. */
export class CheckoutPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  readonly items: Locator;
  readonly finishButton: Locator;

  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');

    this.items = page.getByTestId('inventory-item');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillCustomerInformation(info: CustomerInfo) {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
    await this.continueButton.click();
  }

  async expectOverviewLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.finishButton).toBeVisible();
  }

  /** Verifies the overview lists exactly these products (order independent). */
  async expectItems(productNames: string[]) {
    await expect(this.items).toHaveCount(productNames.length);
    for (const name of productNames) {
      await expect(this.items.filter({ hasText: name })).toBeVisible();
    }
  }

  async expectOrderComplete() {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
