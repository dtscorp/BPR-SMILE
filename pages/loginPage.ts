import { expect, type Locator, type Page } from '@playwright/test';
import { WebServices } from '../services/WebService';
import dotenv from 'dotenv';
require('dotenv').config()

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly Welcome: Locator;
  readonly today = WebServices.getDateNow();

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('//*[@id="txtUserID"]');
    this.passwordInput = page.locator('//*[@id="txtPassword"]');
    this.loginButton = page.locator('//*[@id="sub"]');
    this.Welcome = page.locator('[data-test-id="\\32 019032707440904433327"]');
  }

  async login(page: Page, username: String, password: String) {
    await WebServices.takeScreenshot(page, "Login Account", async () => {
      await WebServices.openUrl(page, process.env.BASE_URL)
      await this.usernameInput.fill(`${username}`);
      await this.passwordInput.fill(`${password}`);
      await this.loginButton.click();
      await WebServices.verifyNavigationTo('[data-test-id="\\32 019032707440904433327"]', 5000, page)
    })
  }

  async verifySuccessLogin() {
    await expect(this.Welcome).toBeVisible();
  }
}