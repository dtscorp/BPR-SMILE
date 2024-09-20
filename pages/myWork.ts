import { expect, type Locator, type Page } from '@playwright/test';

export class MyWork {
  readonly page: Page;
  readonly myWorkhMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myWorkhMenu = page.getByRole('menuitem', { name: 'My Work' });
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async goToMyWork() {
    await this.myWorkhMenu.click();
  }
}