import { test, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process';

test.describe('Excel Storage API & Live Frontend Submission Integration', () => {
  const excelPath = path.resolve(process.cwd(), 'data', 'inquiries.xlsx');

  test('should accept valid inquiry via POST /api/inquiries and return 201 with unique ID', async ({ request }) => {
    const payload = {
      services: ['Website Development', 'Creative Design & Video'],
      projectName: 'Nova Creative Systems',
      projectDescription: 'Architecting an editorial design flagship and motion system.',
      projectGoal: 'Strengthen brand presentation',
      budgetRange: '₹50,000–₹1,00,000',
      timeline: 'Within 1 month',
      fullName: 'Rhea Montgomery',
      email: 'rhea@novacreative.io',
      phone: '+91 98765 43210',
      message: 'Looking for high fidelity delivery.',
    };

    const response = await request.post('/api/inquiries', {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.inquiryId).toMatch(/^INQ-HD-\d{8}-[A-Z0-9]{4}$/);
    expect(body.message).toContain('successfully recorded');

    // Confirm that the Excel workbook exists on disk
    expect(fs.existsSync(excelPath)).toBe(true);
    const stats = fs.statSync(excelPath);
    expect(stats.size).toBeGreaterThan(1000);
  });

  test('should reject invalid inquiry via POST /api/inquiries with 400 Bad Request', async ({ request }) => {
    const invalidPayload = {
      services: [],
      projectName: '',
      projectDescription: 'too-short',
      projectGoal: '',
      fullName: '',
      email: 'not-an-email',
    };

    const response = await request.post('/api/inquiries', {
      data: invalidPayload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBe('Validation failed');
    expect(body.errors).toBeDefined();
  });

  test('should reject oversized payloads exceeding 100KB with 413 Payload Too Large', async ({ request }) => {
    const hugeDescription = 'A'.repeat(120 * 1024); // 120KB
    const oversizedPayload = {
      services: ['Website Development'],
      projectName: 'Huge Project',
      projectDescription: hugeDescription,
      projectGoal: 'Build something new',
      fullName: 'Oversized Tester',
      email: 'huge@tester.com',
    };

    const response = await request.post('/api/inquiries', {
      data: oversizedPayload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(413);
  });

  test('should handle live browser submission end-to-end through #contact form to Excel', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    // Step 1: Project Type
    await expect(contactSection.getByRole('heading', { name: 'What are you looking to build?' })).toBeVisible();
    await contactSection.getByRole('button', { name: 'Website Development' }).click();
    await contactSection.getByRole('button', { name: 'SEO Optimization' }).click();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // Step 2: Project Details
    await expect(contactSection.getByRole('heading', { name: 'Tell us a little about your project.' })).toBeVisible();
    await contactSection.locator('#projectName').fill('Aether Systems');
    await contactSection.locator('#projectDescription').fill('End to end digital presence and technical engineering platform.');
    await contactSection.getByRole('button', { name: 'Build something new' }).click();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // Step 3: Scope & Timeline
    await expect(contactSection.getByRole('heading', { name: "Let's understand the scope." })).toBeVisible();
    await contactSection.getByRole('button', { name: '₹50,000–₹1,00,000' }).click();
    await contactSection.getByRole('button', { name: 'Within 1 month' }).click();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // Step 4: Your Details
    await expect(contactSection.getByRole('heading', { name: 'Where can we reach you?' })).toBeVisible();
    await contactSection.locator('#fullName').fill('Siddharth Menon');
    await contactSection.locator('#email').fill('siddharth@aethersystems.io');
    await contactSection.locator('#phone').fill('+91 98765 43210');
    await contactSection.locator('#message').fill('Seeking an initial consultation.');
    const reviewBtn = contactSection.getByRole('button', { name: /Review Inquiry/i });
    await reviewBtn.scrollIntoViewIfNeeded();
    await reviewBtn.click();

    // Review Step
    await expect(contactSection.getByRole('heading', { name: 'Review Your Project Inquiry' })).toBeVisible();
    await expect(contactSection.getByText('Aether Systems')).toBeVisible();
    await expect(contactSection.getByText('siddharth@aethersystems.io')).toBeVisible();

    // Submit live inquiry (NO MOCKS - hits actual backend through Vite dev server)
    const submitBtn = contactSection.getByRole('button', { name: 'Submit Project Inquiry' });
    await submitBtn.scrollIntoViewIfNeeded();
    await submitBtn.click();

    // Verify confirmed success state appears with real reference ID
    await expect(contactSection.getByText('Inquiry Successfully Received')).toBeVisible({ timeout: 15000 });
    const referenceElem = contactSection.locator('text=/REFERENCE // INQ-HD-\\d{8}-[A-Z0-9]{4}/');
    await expect(referenceElem).toBeVisible();

    // Verify with a node verification script that the record was written to the Excel file
    const verifyScript = `
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      workbook.xlsx.readFile('${excelPath.replace(/\\/g, '\\\\')}').then(() => {
        const sheet = workbook.getWorksheet('Inquiries');
        let found = false;
        sheet.eachRow((row) => {
          if (row.getCell(4).value === 'Aether Systems' && row.getCell(10).value === 'siddharth@aethersystems.io') {
            found = true;
          }
        });
        if (!found) process.exit(1);
        console.log('RECORD_VERIFIED');
      }).catch(err => { console.error(err); process.exit(1); });
    `;

    const output = execSync(`node -e "${verifyScript.replace(/\n/g, ' ')}"`).toString();
    expect(output).toContain('RECORD_VERIFIED');
  });
});

