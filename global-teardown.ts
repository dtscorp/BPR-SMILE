import { Browser, Page, chromium } from '@playwright/test';
import { promises as fs } from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

require('dotenv').config()

async function globalTeardown() {

    const browser: Browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
        storageState: 'auth.json'
    })
    const page: Page = await context.newPage()
    await page.goto(process.env.BASE_URL ?? "");
    await page.context().storageState({ path: "teardown.json" })
    await browser.close();
}

export default globalTeardown;