import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import * as XLSX from 'xlsx';
// import { ExcelReader } from '../pages/excelReader';
// Membuat instance ExcelReader dan membaca data dari file Excel
// Load and parse the Excel file
const workbook = XLSX.readFile('../BPR-SMILE/testdata/testdata.xlsx');
const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
const worksheet = workbook.Sheets[sheetName];

// Convert the sheet to JSON
const data = XLSX.utils.sheet_to_json(worksheet);


// Menggunakan data dari Excel untuk melakukan pengujian
test.describe('Login tests)', () => {
  data.forEach((data: any, index) => {

    const username = data.Username;
    const password = data.Password;

    test(`login #${index}`, async ({ page }) => {
      const loginTest = new LoginPage(page);
      try {
        // Melakukan login
        await loginTest.navigate();
        await loginTest.login(username, password);

        // Verifikasi apakah login berhasil
        await loginTest.verifySuccessLogin();
      } catch (error) {
        console.error(`Test failed for ${data.Username}: ${error.message}`);
      }
    });
  });
});
