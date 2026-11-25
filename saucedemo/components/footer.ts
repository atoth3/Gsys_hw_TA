import { type Locator, type Page } from '@playwright/test';

/** The footer shown on every page after login. */
export class FooterComponent {
  readonly page: Page;
  readonly termsOfService: Locator;

  constructor(page: Page) {
    this.page = page;
    this.termsOfService = page.getByTestId('footer-copy');
  }
}
