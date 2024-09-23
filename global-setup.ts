import { Browser, chromium, expect, Page } from "@playwright/test";
import dotenv from 'dotenv';
require('dotenv').config()
import { LoginPage } from "./pages/loginPage";

async function globalSetup() {
    const browser: Browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page: Page = await context.newPage()
    let loginPage = new LoginPage(page);
    await loginPage.login(page)
    await page.context().storageState({ path: "auth.json" })
    await browser.close();
}

export default globalSetup