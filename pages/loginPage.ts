import { expect, type Locator, type Page } from '@playwright/test';
import { WebServices } from '../services/WebService';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly Welcome: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('//*[@id="txtUserID"]');
    this.passwordInput = page.locator('//*[@id="txtPassword"]');
    this.loginButton = page.locator('//*[@id="sub"]');
    this.Welcome = page.locator('[data-test-id="\\32 019032707440904433327"]');
  }

  // async navigate() {
  //   await this.page.goto('http://10.243.211.45:7111/prweb/app/LOS/pkNajMMovK7tIFwgpZZuWHBWRKFIPrb0*/!STANDARD');
  // }

  async login(page) {
    await WebServices.openUrl(page, 'http://10.243.211.45:7111/prweb/app/LOS/pkNajMMovK7tIFwgpZZuWHBWRKFIPrb0*/!STANDARD')
    let data = await WebServices.getMasterTestData("Test", "P_001_Scenario_Positif")
    await this.usernameInput.fill(data.Username)
    await this.passwordInput.fill(data.Password);
    await this.loginButton.click();
    await WebServices.verifyNavigationTo('[data-test-id="\\32 019032707440904433327"]', 5000, page)
  }

  async verifySuccessLogin() {
    await expect(this.Welcome).toBeVisible();
  }
}