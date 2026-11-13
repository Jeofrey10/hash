import ExcelJS from 'exceljs';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { StoredInquiryRow } from './types.ts';

/**
 * Concurrency Mutex Queue
 * Guarantees that simultaneous inquiry submissions write sequentially
 * without race conditions or workbook file corruption.
 */
let storageLockQueue: Promise<unknown> = Promise.resolve();

export function withStorageLock<T>(operation: () => Promise<T>): Promise<T> {
  const nextLock = storageLockQueue.then(operation, operation);
  storageLockQueue = nextLock.then(
    () => {},
    () => {}
  );
  return nextLock;
}

/**
 * Neutralize spreadsheet formula injection (CSV/Excel Formula Injection).
 * Any text starting with '=', '+', '-', or '@' is escaped with a leading single quote.
 */
export function sanitizeCellValue(val: unknown): string {
  if (val === undefined || val === null) return '';
  const text = String(val).trim();
  if (/^[=+\-@]/.test(text)) {
    return `'${text}`;
  }
  return text;
}

/**
 * Resolves the target Excel workbook path.
 * Prioritizes `INQUIRY_EXCEL_PATH` environment variable; defaults to `<project_root>/data/inquiries.xlsx`.
 */
export function resolveWorkbookPath(overridePath?: string): string {
  if (overridePath && overridePath.trim()) {
    return path.resolve(overridePath.trim());
  }
  if (process.env.INQUIRY_EXCEL_PATH && process.env.INQUIRY_EXCEL_PATH.trim()) {
    return path.resolve(process.env.INQUIRY_EXCEL_PATH.trim());
  }
  return path.resolve(process.cwd(), 'data', 'inquiries.xlsx');
}

/**
 * Initializes formatting and metadata for the `Inquiries` worksheet.
 */
function configureInquiriesWorksheet(worksheet: ExcelJS.Worksheet): void {
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  // Column definitions strictly in required order A through M
  worksheet.columns = [
    { header: 'Inquiry ID', key: 'inquiryId', width: 24 },
    { header: 'Submitted At', key: 'submittedAt', width: 26 },
    { header: 'Project Type(s)', key: 'services', width: 34 },
    { header: 'Project / Business Name', key: 'projectName', width: 28 },
    { header: 'Project Description', key: 'projectDescription', width: 50 },
    { header: 'Primary Goal', key: 'projectGoal', width: 32 },
    { header: 'Estimated Budget (INR)', key: 'budgetRange', width: 24 },
    { header: 'Preferred Timeline', key: 'timeline', width: 24 },
    { header: 'Full Name', key: 'fullName', width: 26 },
    { header: 'Work Email', key: 'email', width: 32 },
    { header: 'Phone Number', key: 'phone', width: 22 },
    { header: 'Additional Notes', key: 'message', width: 44 },
    { header: 'Submission Status', key: 'status', width: 20 },
  ];

  // Header Row (Row 1) Styling
  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF050505' }, // Obsidian Black
    };
    cell.font = {
      name: 'Segoe UI',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' }, // Pure White
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF262626' } },
      left: { style: 'thin', color: { argb: 'FF262626' } },
      right: { style: 'thin', color: { argb: 'FF262626' } },
      bottom: { style: 'medium', color: { argb: 'FF35E85B' } }, // Hash Neon Green Accent
    };
  });

  // Enable AutoFilter for the header range
  worksheet.autoFilter = {
    from: 'A1',
    to: 'M1',
  };
}

/**
 * Initializes the `Read Me` documentation and privacy notice worksheet.
 */
function configureReadMeWorksheet(worksheet: ExcelJS.Worksheet): void {
  worksheet.views = [{ showGridLines: true }];

  worksheet.columns = [
    { width: 24 },
    { width: 70 },
  ];

  const titleRow = worksheet.addRow(['HASH.DEVS', 'Project Inquiries Storage Archive']);
  titleRow.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FF050505' } };
  worksheet.addRow([]);

  const sections: [string, string][] = [
    ['Document Type', 'Prospective Client Inbound Inquiries Registry'],
    ['Origin', 'HASH.DEVS Website Intake Experience (Stage 10 / #contact)'],
    ['Security & Privacy', 'CONFIDENTIAL // Contains prospective client personal identifiable information (PII). Access is restricted to authorized studio personnel only.'],
    ['Version Control Policy', 'Do NOT commit this workbook or client data to Git. Directory /data/ is strictly git-ignored.'],
    ['Formula Injection', 'Formula characters (=, +, -, @) are automatically sanitized with leading single quotes to neutralize spreadsheet code execution.'],
    ['Local vs Production', 'This workbook operates on the local developer environment. For public cloud deployments, submissions should be directed to a persistent database or managed service.'],
    ['Data Retention', 'Rows are appended sequentially in chronological order. Records must never be manually overwritten.'],
  ];

  for (const [key, desc] of sections) {
    const row = worksheet.addRow([key, desc]);
    row.getCell(1).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF171A18' } };
    row.getCell(2).font = { name: 'Segoe UI', size: 10, color: { argb: 'FF404040' } };
    row.getCell(2).alignment = { wrapText: true, vertical: 'middle' };
  }
}

/**
 * Appends a new inquiry record into the Excel workbook.
 * Safely handles missing directories, initial workbook generation, and existing record preservation.
 */
export async function appendInquiryRecord(
  record: StoredInquiryRow,
  customFilePath?: string
): Promise<{ success: boolean; filePath: string }> {
  return withStorageLock(async () => {
    const filePath = resolveWorkbookPath(customFilePath);
    const directory = path.dirname(filePath);

    // Ensure parent directory exists
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    const fileExists = fs.existsSync(filePath);

    let inquiriesSheet: ExcelJS.Worksheet;

    if (fileExists) {
      // Load existing workbook without overwriting past entries
      try {
        await workbook.xlsx.readFile(filePath);
        inquiriesSheet =
          workbook.getWorksheet('Inquiries') || workbook.addWorksheet('Inquiries');
      } catch (readError) {
        throw new Error(
          `Unable to access existing workbook at storage destination: ${
            readError instanceof Error ? readError.message : 'Unknown read error'
          }`
        );
      }
    } else {
      // Create fresh workbook with styled worksheets
      workbook.creator = 'HASH.DEVS Intake System';
      workbook.created = new Date();

      inquiriesSheet = workbook.addWorksheet('Inquiries');
      configureInquiriesWorksheet(inquiriesSheet);

      const readMeSheet = workbook.addWorksheet('Read Me');
      configureReadMeWorksheet(readMeSheet);
    }

    // Prepare row values in exact Column A-M order with formula neutralization
    const rowValues = [
      sanitizeCellValue(record.inquiryId),
      sanitizeCellValue(record.submittedAt),
      sanitizeCellValue(record.services),
      sanitizeCellValue(record.projectName),
      sanitizeCellValue(record.projectDescription),
      sanitizeCellValue(record.projectGoal),
      sanitizeCellValue(record.budgetRange),
      sanitizeCellValue(record.timeline),
      sanitizeCellValue(record.fullName),
      sanitizeCellValue(record.email),
      sanitizeCellValue(record.phone),
      sanitizeCellValue(record.message),
      sanitizeCellValue(record.status || 'CONFIRMED'),
    ];

    const newRow = inquiriesSheet.addRow(rowValues);
    newRow.height = 24;

    // Apply alternating row zebra styling
    const rowNumber = newRow.number;
    const isEven = rowNumber % 2 === 0;

    newRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      cell.font = {
        name: 'Segoe UI',
        size: 10,
        color: { argb: 'FF171A18' },
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFF9FAFB' : 'FFFFFFFF' },
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      };

      // Wrap text for descriptions and notes (Cols 5 and 12)
      if (colNumber === 5 || colNumber === 12) {
        cell.alignment = { vertical: 'middle', wrapText: true };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }

      // Highlight Inquiry ID in monospace bold
      if (colNumber === 1) {
        cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FF050505' } };
      }

      // Highlight status column in emerald
      if (colNumber === 13) {
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF15803D' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });

    // Commit changes to disk
    await workbook.xlsx.writeFile(filePath);

    return { success: true, filePath };
  });
}

