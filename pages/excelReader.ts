import * as XLSX from 'xlsx';

export class ExcelReader {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // Fungsi untuk membaca dan mengembalikan data Excel sebagai array JSON
  public readData(): any[] {
    try {
      const workbook = XLSX.readFile(this.filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      return XLSX.utils.sheet_to_json(worksheet);
    } catch (error) {
      console.error(`Error reading Excel file: ${error.message}`);
      return [];
    }
  }
}
