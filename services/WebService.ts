import * as XLSX from 'xlsx';
import { Page } from '@playwright/test';

export class WebServices {
    // readonly page:Page;
    // constructor(page: Page) {
    //     this.page = page;
    // }

    static async getMasterTestData(sheetName: String, scenarioName: String) {
        let testData: any = {};
        const filePath = './testdata/Master.xlsx';
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[`${sheetName}`];
        testData = XLSX.utils.sheet_to_json(sheet);
        for (const item of testData) {
            if(item.Scenario == scenarioName){
                return item;  
            }
        }
    }

    static async writeExcelByHeader(filePath: String, sheetName: String, scenarioName: String, headerName: String, value: String) {
        let testData: any = {};
        const workbook = XLSX.readFile(`${filePath}`);
        const sheet = workbook.Sheets[`${sheetName}`];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        testData = XLSX.utils.sheet_to_json(sheet);
        // Find header index
        const headers = data[0] as string[];
        const targetHeader = headerName;
        let colIndex : number = headers.indexOf(`${targetHeader}`);
        let idx : number = 2
        let isFind : boolean = false
        for (const item of testData) {
            console.log(`${item.Scenario}`)
            if(item.Scenario == scenarioName) {
                sheet[`${String.fromCharCode(colIndex + 65)}${idx}`] = { v: `${value}`, t: 's' };
                XLSX.writeFile(workbook, `${filePath}`);
                isFind = true;
            }
            idx++;
        }
        if(!isFind){
            throw new Error('Target data not found');
        }
    }

    static async openUrl(page:Page, url: string): Promise<void> {
        try {
          console.log(`Opening URL: ${url}`);
          await page.goto(url, { waitUntil: 'load' });
          console.log(`Successfully opened URL: ${url}`);
        } catch (error) {
          console.error(`Failed to open URL: ${url}`);
          throw new Error(`Error while opening URL: ${url}`);
        }
      }

    static async scrollToElement(locator:string, waitForVisible:3000, page:Page): Promise<void>{
        try {
            console.log(`Scrolling to element: ${locator}`);
            const elementHandle = await page.$(locator);
            if (elementHandle) {
              await page.evaluate((el) => el.scrollIntoView(), elementHandle);
              console.log(`Successfully scrolled to element: ${locator}`);
              if (waitForVisible) {
                await elementHandle.waitForElementState('visible');
                console.log(`Element is visible: ${locator}`);
              }
            } else {
              throw new Error(`Element not found: ${locator}`);
            }

          } catch (error) {
            console.error(`Failed to scroll to element: ${locator}`);
            throw error;
          }
    }

    static async verifyNavigationTo(selector: string, timeout: number = 5000, page:Page): Promise<boolean> {
        try {
          console.log(`Verifying navigation by checking for element: ${selector}`);
          const element = await page.waitForSelector(selector, { timeout });
          const isVisible = await element.isVisible();
          if (isVisible) {
            console.log(`Successfully navigated, element ${selector} is visible.`);
            return true;
          } else {
            console.log(`Element ${selector} is not visible.`);
            return false;
          }
        } catch (error) {
          console.error(`Failed to verify navigation: ${error.message}`);
          return false;
        }
      }

    static async swipeLeft(selector: string, distance: number = 500, page:Page): Promise<void> {
        try {
          console.log(`Swiping left on element: ${selector}`);
    
          const element = await page.$(selector);
          if (!element) {
            throw new Error(`Element not found: ${selector}`);
          }
    
          // Dapatkan posisi bounding box dari elemen untuk memulai swipe
          const box = await element.boundingBox();
          if (!box) {
            throw new Error('Unable to retrieve bounding box of the element');
          }
    
          // Hitung titik awal dan akhir swipe (left swipe: geser ke kiri)
          const startX = box.x + box.width - 10; // Mulai dari tepi kanan elemen
          const startY = box.y + box.height / 2; // Di tengah elemen secara vertikal
          const endX = startX - distance;        // Geser sejauh jarak yang diberikan (default 500px)
    
          // Simulasikan swipe ke kiri menggunakan mouse
          await page.mouse.move(startX, startY);
          await page.mouse.down();
          await page.mouse.move(endX, startY, { steps: 20 }); // Gerakan halus dengan 20 langkah
          await page.mouse.up();
    
          console.log(`Successfully swiped left on element: ${selector}`);
        } catch (error) {
          console.error(`Failed to swipe left on element: ${selector}`);
          throw error;
        }
      }

      static getDateNow() {
        const date = new Date();
        const todayString = date.toLocaleString().replace(/\//g, '-').replace(/,\s/g, '_');
        return todayString
    }


    static async takeScreenshot(page, testName, actions) {
        const today = WebServices.getDateNow();
        try {
            await actions(); // Perform test-specific actions
        } catch (error) {
            console.error(`${testName} : `, error);
        } finally {
            await page.screenshot({ path:` test-reports/${today}_${testName}/screenshot.jpg `});

        }
    }
    

}