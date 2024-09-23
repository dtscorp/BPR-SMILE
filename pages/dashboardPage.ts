import { expect, type Locator, type Page } from '@playwright/test';
import dotenv from 'dotenv';
import { WebServices } from '../services/WebService';
require('dotenv').config()

export class Dashboard {
  readonly page: Page;
  readonly caseStageSelect: Locator;
  readonly refreshButton: Locator;
  readonly microTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.caseStageSelect = page.locator('iframe[name="PegaGadget0Ifr"]').contentFrame().locator('//*[@id="8a82c025"]');
    this.refreshButton = page.locator('iframe[name="PegaGadget0Ifr"]').contentFrame().locator('(//button[@data-test-id="20150603080752006853952"])[1]');
    this.microTable = page.locator('iframe[name="PegaGadget0Ifr"]').contentFrame().locator('//div[@data-expr-id="802ff636a72069a5b157497bd436c432d1dea2ba_25"');
  }

  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async navigate() {
    await this.page.goto(process.env.BASE_URL ?? "");
  }

  async showCaseStageMicro() {
    await WebServices.takeScreenshot(this.page, "select_micro", async () => {
      await this.caseStageSelect.selectOption('MDR-LOS-Work-Mikro');
      await this.refreshButton.click()
    })
  }

  async showCaseStageMBP() {
    await WebServices.takeScreenshot(this.page, "select_mbp", async () => {
      await this.caseStageSelect.selectOption('MDR-LOS-Work-ManageBusinessParameter');
      await this.refreshButton.click()
    })
  }

  async showCaseStageSLIKCheck() {
    await WebServices.takeScreenshot(this.page, "select_slik_Check", async () => {
      await this.caseStageSelect.selectOption('MDR-LOS-Work-SLIKCheck');
      await this.refreshButton.click()
    })
  }

  async showCaseStageFraudCheck() {
    await WebServices.takeScreenshot(this.page, "select_fraud_check", async () => {
      await this.caseStageSelect.selectOption('MDR-LOS-Work-FraudCheck');
      await this.refreshButton.click()
    })
  }

  async showCaseStageReassignment() {
    await WebServices.takeScreenshot(this.page, "select_reassignment", async () => {
      await this.caseStageSelect.selectOption('MDR-LOS-Work-Reassignment');
      await this.refreshButton.click()
    })
  }
}
