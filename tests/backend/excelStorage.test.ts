import { describe, it, beforeEach, after } from 'node:test';
import assert from 'node:assert';
import * as path from 'node:path';
import * as fs from 'node:fs';
import ExcelJS from 'exceljs';
import {
  appendInquiryRecord,
  resolveWorkbookPath,
  sanitizeCellValue,
} from '../../server/excelStorage.ts';
import {
  validateInquiryPayload,
  processInquirySubmission,
} from '../../server/inquiryService.ts';
import type { StoredInquiryRow } from '../../server/types.ts';

describe('Excel Inquiry Storage Backend Service', () => {
  const testDir = path.join(process.cwd(), 'tests', 'fixtures', 'excel-tests');
  const testWorkbookPath = path.join(testDir, 'test-inquiries.xlsx');

  beforeEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
    fs.mkdirSync(testDir, { recursive: true });
  });

  after(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('1. First submission automatically creates the workbook file with Inquiries and Read Me worksheets', async () => {
    assert.strictEqual(fs.existsSync(testWorkbookPath), false);

    const record: StoredInquiryRow = {
      inquiryId: 'INQ-HD-20261113-T001',
      submittedAt: new Date().toISOString(),
      services: 'Website Development, SEO Optimization',
      projectName: 'Aero Vanguard',
      projectDescription: 'Building a high-performance web platform.',
      projectGoal: 'Build something new',
      budgetRange: '₹50,000–₹1,00,000',
      timeline: 'Within 1 month',
      fullName: 'Aria Thorne',
      email: 'aria@aerovanguard.io',
      phone: '+91 98765 43210',
      message: 'Excited to partner on this project.',
      status: 'CONFIRMED',
    };

    const result = await appendInquiryRecord(record, testWorkbookPath);
    assert.strictEqual(result.success, true);
    assert.strictEqual(fs.existsSync(testWorkbookPath), true);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);

    const inquiriesSheet = workbook.getWorksheet('Inquiries');
    const readMeSheet = workbook.getWorksheet('Read Me');

    assert.ok(inquiriesSheet, 'Inquiries worksheet must exist');
    assert.ok(readMeSheet, 'Read Me worksheet must exist');
  });

  it('2. Correct headers are generated in exact Column A through M order', async () => {
    const record: StoredInquiryRow = {
      inquiryId: 'INQ-HD-20261113-T002',
      submittedAt: new Date().toISOString(),
      services: 'Application Development',
      projectName: 'Nexus Core',
      projectDescription: 'Architecting scalable cloud application systems.',
      projectGoal: 'Improve an existing digital experience',
      budgetRange: '₹1,00,000+',
      timeline: 'Within 2–3 months',
      fullName: 'Kaelen Vance',
      email: 'kaelen@nexuscore.dev',
      phone: '+91 91234 56789',
      message: 'Looking for a structured sprint.',
      status: 'CONFIRMED',
    };

    await appendInquiryRecord(record, testWorkbookPath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);
    const sheet = workbook.getWorksheet('Inquiries');
    assert.ok(sheet);

    const expectedHeaders = [
      'Inquiry ID',
      'Submitted At',
      'Project Type(s)',
      'Project / Business Name',
      'Project Description',
      'Primary Goal',
      'Estimated Budget (INR)',
      'Preferred Timeline',
      'Full Name',
      'Work Email',
      'Phone Number',
      'Additional Notes',
      'Submission Status',
    ];

    const headerRow = sheet.getRow(1);
    for (let col = 1; col <= 13; col++) {
      assert.strictEqual(headerRow.getCell(col).value, expectedHeaders[col - 1]);
    }
  });

  it('3. Valid inquiry is appended as a row with exact cell values and formatting', async () => {
    const record: StoredInquiryRow = {
      inquiryId: 'INQ-HD-20261113-T003',
      submittedAt: '2026-11-13T12:00:00.000Z',
      services: 'Meta Advertising',
      projectName: 'Solaris Health',
      projectDescription: 'Performance marketing and brand campaigns.',
      projectGoal: 'Generate more qualified leads',
      budgetRange: '₹25,000–₹50,000',
      timeline: 'As soon as possible',
      fullName: 'Liam Chen',
      email: 'liam@solarishealth.com',
      phone: '+91 99887 76655',
      message: 'Targeting regional expansion.',
      status: 'CONFIRMED',
    };

    await appendInquiryRecord(record, testWorkbookPath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);
    const sheet = workbook.getWorksheet('Inquiries');
    assert.ok(sheet);

    const dataRow = sheet.getRow(2);
    assert.strictEqual(dataRow.getCell(1).value, 'INQ-HD-20261113-T003');
    assert.strictEqual(dataRow.getCell(2).value, '2026-11-13T12:00:00.000Z');
    assert.strictEqual(dataRow.getCell(3).value, 'Meta Advertising');
    assert.strictEqual(dataRow.getCell(4).value, 'Solaris Health');
    assert.strictEqual(dataRow.getCell(5).value, 'Performance marketing and brand campaigns.');
    assert.strictEqual(dataRow.getCell(6).value, 'Generate more qualified leads');
    assert.strictEqual(dataRow.getCell(7).value, '₹25,000–₹50,000');
    assert.strictEqual(dataRow.getCell(8).value, 'As soon as possible');
    assert.strictEqual(dataRow.getCell(9).value, 'Liam Chen');
    assert.strictEqual(dataRow.getCell(10).value, 'liam@solarishealth.com');
    assert.strictEqual(dataRow.getCell(11).value, '\'+91 99887 76655');
    assert.strictEqual(dataRow.getCell(12).value, 'Targeting regional expansion.');
    assert.strictEqual(dataRow.getCell(13).value, 'CONFIRMED');
  });

  it('4 & 5. Multiple submissions create separate rows and existing records remain intact', async () => {
    const record1: StoredInquiryRow = {
      inquiryId: 'INQ-HD-REC-001',
      submittedAt: new Date().toISOString(),
      services: 'Website Development',
      projectName: 'Client One Alpha',
      projectDescription: 'Description for client number one.',
      projectGoal: 'Build something new',
      budgetRange: 'Under ₹25,000',
      timeline: 'Flexible / Exploring',
      fullName: 'First Client',
      email: 'client1@alpha.io',
      phone: '',
      message: '',
      status: 'CONFIRMED',
    };

    const record2: StoredInquiryRow = {
      inquiryId: 'INQ-HD-REC-002',
      submittedAt: new Date().toISOString(),
      services: 'Creative Design & Video',
      projectName: 'Client Two Beta',
      projectDescription: 'Description for client number two.',
      projectGoal: 'Strengthen brand presentation',
      budgetRange: '₹50,000–₹1,00,000',
      timeline: 'Within 1 month',
      fullName: 'Second Client',
      email: 'client2@beta.io',
      phone: '+91 98765 00000',
      message: 'Urgent turnaround.',
      status: 'CONFIRMED',
    };

    await appendInquiryRecord(record1, testWorkbookPath);
    await appendInquiryRecord(record2, testWorkbookPath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);
    const sheet = workbook.getWorksheet('Inquiries');
    assert.ok(sheet);

    assert.strictEqual(sheet.rowCount, 3); // 1 header + 2 data rows

    // Record 1 preserved in row 2
    assert.strictEqual(sheet.getRow(2).getCell(1).value, 'INQ-HD-REC-001');
    assert.strictEqual(sheet.getRow(2).getCell(4).value, 'Client One Alpha');

    // Record 2 appended in row 3
    assert.strictEqual(sheet.getRow(3).getCell(1).value, 'INQ-HD-REC-002');
    assert.strictEqual(sheet.getRow(3).getCell(4).value, 'Client Two Beta');
  });

  it('6. Missing optional fields are handled correctly without inventing values', async () => {
    const record: StoredInquiryRow = {
      inquiryId: 'INQ-HD-MINIMAL-01',
      submittedAt: new Date().toISOString(),
      services: 'SEO Optimization',
      projectName: 'Organic Labs',
      projectDescription: 'Ten characters minimum project description.',
      projectGoal: 'Improve online visibility',
      budgetRange: '',
      timeline: '',
      fullName: 'Tara Mercer',
      email: 'tara@organiclabs.co',
      phone: '',
      message: '',
      status: 'CONFIRMED',
    };

    await appendInquiryRecord(record, testWorkbookPath);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);
    const sheet = workbook.getWorksheet('Inquiries');
    assert.ok(sheet);

    const row = sheet.getRow(2);
    assert.strictEqual(row.getCell(7).value, ''); // Budget
    assert.strictEqual(row.getCell(8).value, ''); // Timeline
    assert.strictEqual(row.getCell(11).value, ''); // Phone
    assert.strictEqual(row.getCell(12).value, ''); // Message
  });

  it('7. Multi-select project types are saved correctly in readable comma-separated format', async () => {
    const payload = {
      services: ['Website Development', 'Application Development', 'SEO Optimization'],
      projectName: 'Omni Platform',
      projectDescription: 'End to end digital presence and technical engineering.',
      projectGoal: 'Build something new',
      fullName: 'Marcus Vance',
      email: 'marcus@omniplatform.com',
    };

    const result = await processInquirySubmission(payload, testWorkbookPath);
    assert.strictEqual(result.success, true);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);
    const sheet = workbook.getWorksheet('Inquiries');
    assert.ok(sheet);

    const servicesCell = sheet.getRow(2).getCell(3).value;
    assert.strictEqual(servicesCell, 'Website Development, Application Development, SEO Optimization');
  });

  it('8. Invalid submissions are rejected with validation errors without touching storage', async () => {
    const invalidPayload = {
      services: [],
      projectName: '',
      projectDescription: 'short',
      projectGoal: '',
      fullName: '',
      email: 'not-an-email',
    };

    const validation = validateInquiryPayload(invalidPayload);
    assert.strictEqual(validation.valid, false);
    assert.ok(validation.errors?.services);
    assert.ok(validation.errors?.projectName);
    assert.ok(validation.errors?.projectDescription);
    assert.ok(validation.errors?.fullName);
    assert.ok(validation.errors?.email);

    const result = await processInquirySubmission(invalidPayload, testWorkbookPath);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Validation failed');
    assert.strictEqual(fs.existsSync(testWorkbookPath), false);
  });

  it('9. Formula injection is neutralized with a leading single quote', async () => {
    assert.strictEqual(sanitizeCellValue('=1+1'), "'=1+1");
    assert.strictEqual(sanitizeCellValue('+cmd|/c calc'), "'+cmd|/c calc");
    assert.strictEqual(sanitizeCellValue('-2+3'), "'-2+3");
    assert.strictEqual(sanitizeCellValue('@SUM(A1:A10)'), "'@SUM(A1:A10)");
    assert.strictEqual(sanitizeCellValue('Safe Business Name'), 'Safe Business Name');

    const injectionPayload = {
      services: ['Website Development'],
      projectName: '=HYPERLINK("http://attacker.com")',
      projectDescription: '@SUM(1,999) injection test description with length.',
      projectGoal: '+cmd /c start',
      fullName: '-Admin',
      email: 'admin@safety.org',
    };

    const result = await processInquirySubmission(injectionPayload, testWorkbookPath);
    assert.strictEqual(result.success, true);

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);
    const sheet = workbook.getWorksheet('Inquiries');
    assert.ok(sheet);

    const row = sheet.getRow(2);
    assert.strictEqual(row.getCell(4).value, '\'=HYPERLINK("http://attacker.com")');
    assert.strictEqual(row.getCell(5).value, '\'@SUM(1,999) injection test description with length.');
    assert.strictEqual(row.getCell(6).value, '\'+cmd /c start');
    assert.strictEqual(row.getCell(9).value, '\'-Admin');
  });

  it('10. Workbook write failure handles corrupted destination gracefully', async () => {
    // Create an inaccessible / corrupted directory blocking file writes
    const corruptedPath = path.join(testDir, 'corrupted-file.xlsx');
    // Create a directory with that name so readFile/writeFile on it as a file fails
    fs.mkdirSync(corruptedPath);

    const record: StoredInquiryRow = {
      inquiryId: 'INQ-HD-FAIL-01',
      submittedAt: new Date().toISOString(),
      services: 'Website Development',
      projectName: 'Fail Test',
      projectDescription: 'Description for write failure test.',
      projectGoal: 'Build something new',
      budgetRange: '',
      timeline: '',
      fullName: 'Fail Tester',
      email: 'fail@test.com',
      phone: '',
      message: '',
      status: 'CONFIRMED',
    };

    await assert.rejects(
      async () => {
        await appendInquiryRecord(record, corruptedPath);
      },
      /Unable to access existing workbook|EISDIR|operation not permitted|read error/i
    );
  });

  it('11. Simultaneous submissions write sequentially without overwriting or corruption', async () => {
    const count = 5;
    const promises = [];

    for (let i = 1; i <= count; i++) {
      const payload = {
        services: ['Application Development'],
        projectName: `Concurrent Client ${i}`,
        projectDescription: `Concurrent project description test #${i} ensuring sequential write locking.`,
        projectGoal: 'Explore an idea',
        fullName: `Tester ${i}`,
        email: `tester${i}@concurrent.io`,
      };
      promises.push(processInquirySubmission(payload, testWorkbookPath));
    }

    const results = await Promise.all(promises);
    for (const res of results) {
      assert.strictEqual(res.success, true);
      assert.ok(res.inquiryId);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(testWorkbookPath);
    const sheet = workbook.getWorksheet('Inquiries');
    assert.ok(sheet);

    // 1 header + 5 rows = 6 rows total
    assert.strictEqual(sheet.rowCount, count + 1);

    const projectNames = [];
    for (let r = 2; r <= count + 1; r++) {
      projectNames.push(sheet.getRow(r).getCell(4).value);
    }
    assert.strictEqual(projectNames.length, count);
    for (let i = 1; i <= count; i++) {
      assert.ok(projectNames.includes(`Concurrent Client ${i}`));
    }
  });

  it('12. Environment configuration path resolution priority', () => {
    const originalEnv = process.env.INQUIRY_EXCEL_PATH;
    try {
      process.env.INQUIRY_EXCEL_PATH = 'C:\\custom\\path\\inquiries.xlsx';
      assert.strictEqual(resolveWorkbookPath(), path.resolve('C:\\custom\\path\\inquiries.xlsx'));

      delete process.env.INQUIRY_EXCEL_PATH;
      assert.strictEqual(resolveWorkbookPath(), path.resolve(process.cwd(), 'data', 'inquiries.xlsx'));
    } finally {
      process.env.INQUIRY_EXCEL_PATH = originalEnv;
    }
  });
});
