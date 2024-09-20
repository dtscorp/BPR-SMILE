import { expect, type Locator, type Page } from '@playwright/test';

export class AdvanceSearch {
  readonly page: Page;
  readonly AdvanceSearchMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.AdvanceSearchMenu = page.getByRole('menuitem', { name: 'Advance Search' });
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async goToAdvanceSerach() {
    await this.AdvanceSearchMenu.click()
  }
}