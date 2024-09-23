import * as XLSX from 'xlsx';
import { Page, type Locator } from '@playwright/test';
import { promises as fs } from 'fs';
const efs = require('fs');
import puppeteer from 'puppeteer';
import * as path from 'path';
import { getGlobalState, setGlobalState } from '../variable/global';

export class WebServices {
  // readonly page:Page;
  // constructor(page: Page) {
  //     this.page = page;
  // }

  static async getMasterTestData(sheetName: String, scenarioName: String) {
    let testData: any = {};
    const filePath = 'test-data/Master.xlsx';
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[`${sheetName}`];
    testData = XLSX.utils.sheet_to_json(sheet);
    for (const item of testData) {
      if (item.Scenario == scenarioName) {
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
    let colIndex: number = headers.indexOf(`${targetHeader}`);
    let idx: number = 2
    let isFind: boolean = false
    for (const item of testData) {
      console.log(`${item.Scenario}`)
      if (item.Scenario == scenarioName) {
        sheet[`${String.fromCharCode(colIndex + 65)}${idx}`] = { v: `${value}`, t: 's' };
        XLSX.writeFile(workbook, `${filePath}`);
        isFind = true;
      }
      idx++;
    }
    if (!isFind) {
      throw new Error('Target data not found');
    }
  }

  static async openUrl(page: Page, url: string): Promise<void> {
    try {
      console.log(`Opening URL: ${url}`);
      await page.goto(url, { waitUntil: 'load' });
      console.log(`Successfully opened URL: ${url}`);
    } catch (error) {
      console.error(`Failed to open URL: ${url}`);
      throw new Error(`Error while opening URL: ${url}`);
    }
  }

  static async scrollToElement(locator: string, waitForVisible: 3000, page: Page): Promise<void> {
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

  static async swipeToElement(page: Page, locator: Locator, direction: 'up' | 'down' | 'left' | 'right', distance: number = 500, maxRetries: number = 5): Promise<void> {
    try {
      console.log(`Swiping ${direction} to find element using Locator`);

      // Cek apakah elemen sudah ada di halaman
      for (let i = 0; i < maxRetries; i++) {
        // Cek apakah elemen sudah terlihat
        if (await locator.isVisible()) {
          console.log(`Element is visible`);
          return;
        }

        // Swipe ke arah yang ditentukan
        if (direction === 'down') {
          await page.mouse.wheel(0, distance);  // Scroll ke bawah
        } else if (direction === 'up') {
          await page.mouse.wheel(0, -distance); // Scroll ke atas
        } else if (direction === 'right') {
          await page.mouse.wheel(distance, 0);  // Scroll ke kanan
        } else if (direction === 'left') {
          await page.mouse.wheel(-distance, 0); // Scroll ke kiri
        }

        // Tunggu setelah setiap swipe
        await page.waitForTimeout(500);
      }

      throw new Error(`Element not found after swiping with locator`);
    } catch (error) {
      console.error(`Error while swiping to element with locator: ${error.message}`);
      throw error;
    }
  }

  static async verifyNavigationTo(selector: string, timeout: number = 5000, page: Page): Promise<boolean> {
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

  static getDateNow() {
    const date = new Date();
    const todayString = date.toLocaleString().replace(/\//g, '-').replace(/,\s/g, '_');
    return todayString
  }


  static async takeScreenshot(page, testName, actions) {

    let { pathReport } = getGlobalState();
    try {
      await actions();
    } catch (error) {
      console.error(`${testName} failed : `, error);
    } finally {
      await page.screenshot({ path: `${pathReport}/${testName}.jpg` });
    }
  }

  static async generatePdf(testInfo) {
    let { pathReport } = getGlobalState();
    let generatedPath = `${pathReport}/test-report.pdf`
    const htmlContent = await this.generateHtmlReport(testInfo, pathReport); // Generate HTML content

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    console.log('Generating PDF report');

    await page.pdf({
      path: generatedPath,
      format: 'A4',
      printBackground: true,
    });

    console.log('PDF report generated');

    await browser.close();
  }

  static async generateHtmlReport(testInfo, pathReport) {
    const imagesHtml = await this.attachImagesFromFolder(pathReport);

    const testRows = ((info) => {
      return `
        <tr>
            <td>${info.title}</td>
            <td>${info.status}</td>
            <td>${info.duration}ms</td>
        </tr>
      `;
    })(testInfo);

    return `
      <html>
      <head>
          <style>
              table {
                  width: 100%;
                  border-collapse: collapse;
              }
              th, td {
                  padding: 8px 12px;
                  border: 1px solid #ddd;
                  text-align: left;
              }
              th {
                  background-color: #f4f4f4;
              }
              img {
                  border: 1px solid #ddd;
                  margin: 5px;
                  max-width: 100%; /* Ensure the images fit */
                  height: auto;
              }
          </style>
      </head>
      <body>
          <h1>Test Report</h1>
          <table>
              <thead>
                  <tr>
                      <th>Test Name</th>
                      <th>Status</th>
                      <th>Duration</th>
                  </tr>
              </thead>
              <tbody>
                  ${testRows}
              </tbody>
          </table>
          <h2>Attached Images</h2>
          ${imagesHtml} <!-- Display all images here -->
      </body>
      </html>
    `;
  }

  static async attachImagesFromFolder(folderPath) {
    let imagesHtml = '';

    const files = efs.readdirSync(folderPath);

    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
    });

    for (const file of imageFiles) {
      const absoluteImagePath = path.resolve(folderPath, file);
      const imageUrl = `file://${absoluteImagePath}`; // For puppeteer to access the local file
      imagesHtml += `<img src="${imageUrl}" alt="${file}" />`;
    }

    return imagesHtml;
  }

  static async reportVideo() {
    let { pathReport } = getGlobalState();
    try {
      const targetDir = path.join(__dirname, pathReport);
      const sourceDir = path.join(__dirname, '../test-results'); // Default test results directory
      const subdirectories = await fs.readdir(sourceDir, { withFileTypes: true });
      for (const subdirectory of subdirectories) {
        if (subdirectory.isDirectory()) {
          const folderName = subdirectory.name;
          const folderPath = path.join(sourceDir, folderName);
          console.log('Folder path : ', folderPath)
          const files = await fs.readdir(folderPath);
          for (const file of files) {
            if (file.endsWith('.webm')) {
              const sourcePath = path.join(folderPath, file);
              const targetPath = path.join(targetDir, file);
              await fs.rename(sourcePath, targetPath);
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading test-results: ${error}`);
    }
  }

  // static async reportVideo() {
  //   let { pathReport } = getGlobalState();

  //   try {
  //     const targetDir = path.join(__dirname, pathReport);
  //     const sourceDir = path.join(__dirname, '../test-results'); // Default test results directory

  //     // Read all subdirectories in the test-results directory
  //     const subdirectories = await fs.readdir(sourceDir, { withFileTypes: true });

  //     for (const subdirectory of subdirectories) {
  //       // Look for directories that match '.playwright-artifacts' pattern
  //       if (subdirectory.isDirectory() && subdirectory.name.startsWith('.playwright-artifacts')) {
  //         const folderName = subdirectory.name;
  //         const folderPath = path.join(sourceDir, folderName);
  //         console.log('Folder path:', folderPath);

  //         // Read all files in the matched folder
  //         const files = await fs.readdir(folderPath);

  //         for (const file of files) {
  //           // Check if the file is a .webm video
  //           if (file.endsWith('.webm')) {
  //             const sourcePath = path.join(folderPath, file);
  //             const targetPath = path.join(targetDir, file);

  //             // Move the .webm file from source to target
  //             await fs.copyFile(sourcePath, targetPath);
  //             console.log(`Moved video from ${sourcePath} to ${targetPath}`);
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error(`Error reading test-results: ${error}`);
  //   }
  // }

}