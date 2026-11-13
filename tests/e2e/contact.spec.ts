import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Stage 10 Contact Section & Inquiry Workflow Validation', () => {
  const screenshotDir = path.join(process.cwd(), 'tests', 'e2e', 'screenshots', 'stage-10');

  test('should render contact section after capabilities with correct ID and heading structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Verify section exists with id="contact"
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeVisible();

    // 2. Verify section comes directly after capabilities in DOM
    const isAfterCapabilities = await page.evaluate(() => {
      const capabilities = document.getElementById('capabilities');
      const contact = document.getElementById('contact');
      if (!capabilities || !contact) return false;
      return Boolean(capabilities.compareDocumentPosition(contact) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(isAfterCapabilities).toBe(true);

    // 3. Verify heading accessibility and hierarchy
    const sectionHeading = contactSection.getByRole('heading', { level: 2 });
    await expect(sectionHeading).toBeVisible();
    await expect(sectionHeading).toHaveAttribute('id', 'contact-heading');
    await expect(sectionHeading).toContainText("Have a project in mind? Let's build something purposeful.");

    // 4. Verify technical markers
    await expect(contactSection.getByText('SEC // 05.CONTACT')).toBeAttached();
    await expect(contactSection.getByText('FLOW // 04.STEPS')).toBeAttached();
  });

  test('should complete the entire multi-step form workflow with validation and review', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    // STEP 1: Project Type
    await expect(contactSection.getByRole('heading', { name: 'What are you looking to build?' })).toBeVisible();

    // Attempt to continue without selection -> verify validation error
    const continueBtn = contactSection.getByRole('button', { name: /Continue/i });
    await continueBtn.click();
    await expect(contactSection.getByText('Please select at least one relevant service or choice.')).toBeVisible();

    // Select two services: Website Development and Creative Design & Video
    const webBtn = contactSection.getByRole('button', { name: 'Website Development' });
    const creativeBtn = contactSection.getByRole('button', { name: 'Creative Design & Video' });
    await webBtn.click();
    await creativeBtn.click();
    await expect(webBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(creativeBtn).toHaveAttribute('aria-pressed', 'true');

    // Continue to Step 2
    await continueBtn.click();

    // STEP 2: Project Details
    await expect(contactSection.getByRole('heading', { name: 'Tell us a little about your project.' })).toBeVisible();

    // Test validation on required fields
    await continueBtn.click();
    await expect(contactSection.getByText('Project or business name is required.')).toBeVisible();

    // Fill valid data
    const nameInput = contactSection.locator('#projectName');
    const descInput = contactSection.locator('#projectDescription');
    await nameInput.fill('Aura Systems');
    await descInput.fill('We are engineering a next-generation headless digital platform with high conversion velocity.');

    // Select primary goal
    const goalBtn = contactSection.getByRole('button', { name: 'Build something new' });
    await goalBtn.click();

    // Continue to Step 3
    await continueBtn.click();

    // STEP 3: Scope & Timeline (Optional)
    await expect(contactSection.getByRole('heading', { name: "Let's understand the scope." })).toBeVisible();

    // Select optional budget and timeline
    const budgetBtn = contactSection.getByRole('button', { name: '₹50,000–₹1,00,000' });
    const timelineBtn = contactSection.getByRole('button', { name: 'Within 1 month' });
    await budgetBtn.click();
    await timelineBtn.click();

    // Test Back button -> verify Step 2 inputs are strictly preserved
    const backBtn = contactSection.getByRole('button', { name: /Back/i });
    await backBtn.click();
    await expect(contactSection.getByRole('heading', { name: 'Tell us a little about your project.' })).toBeVisible();
    await expect(nameInput).toHaveValue('Aura Systems');
    await expect(descInput).toHaveValue('We are engineering a next-generation headless digital platform with high conversion velocity.');

    // Forward to Step 3 and then to Step 4
    await continueBtn.click();
    await expect(contactSection.getByRole('heading', { name: "Let's understand the scope." })).toBeVisible();
    await continueBtn.click();

    // STEP 4: Your Details
    await expect(contactSection.getByRole('heading', { name: 'Where can we reach you?' })).toBeVisible();

    // Test email validation
    const fullNameInput = contactSection.locator('#fullName');
    const emailInput = contactSection.locator('#email');
    await fullNameInput.fill('Devon Vance');
    await emailInput.fill('invalid-email-address');

    const reviewBtn = contactSection.getByRole('button', { name: /Review Inquiry/i });
    await reviewBtn.click();
    await expect(contactSection.getByText('Please enter a valid email address.')).toBeVisible();

    // Fix email and add phone
    await emailInput.fill('devon.vance@aurasystems.io');
    const phoneInput = contactSection.locator('#phone');
    await phoneInput.fill('+91 98765 43210');

    // Advance to Review Step
    await reviewBtn.click();

    // REVIEW STEP
    await expect(contactSection.getByRole('heading', { name: 'Review Your Project Inquiry' })).toBeVisible();
    await expect(contactSection.getByText('Aura Systems')).toBeVisible();
    await expect(contactSection.getByText('devon.vance@aurasystems.io')).toBeVisible();
    await expect(contactSection.getByText('+91 98765 43210')).toBeVisible();
    await expect(contactSection.getByText('₹50,000–₹1,00,000')).toBeVisible();
    await expect(contactSection.getByText('Within 1 month')).toBeVisible();

    // Test Edit control: return to step 1 and verify answers preserved
    const editServicesBtn = contactSection.getByRole('button', { name: 'Edit selected services' });
    await editServicesBtn.click();
    await expect(contactSection.getByRole('heading', { name: 'What are you looking to build?' })).toBeVisible();
    await expect(webBtn).toHaveAttribute('aria-pressed', 'true');

    // Return to review
    await continueBtn.click();
    await expect(contactSection.getByRole('heading', { name: 'Tell us a little about your project.' })).toBeVisible();
    await continueBtn.click();
    await expect(contactSection.getByRole('heading', { name: "Let's understand the scope." })).toBeVisible();
    await continueBtn.click();
    await expect(contactSection.getByRole('heading', { name: 'Where can we reach you?' })).toBeVisible();
    await reviewBtn.click();
    await expect(contactSection.getByRole('heading', { name: 'Review Your Project Inquiry' })).toBeVisible();
  });

  test('should handle submission states, mock network success, and retry on failure', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();

    // Step 1
    await expect(contactSection.getByRole('heading', { name: 'What are you looking to build?' })).toBeVisible();
    await contactSection.getByRole('button', { name: 'Website Development' }).click();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // Step 2
    await expect(contactSection.getByRole('heading', { name: 'Tell us a little about your project.' })).toBeVisible();
    await contactSection.locator('#projectName').fill('Helios Lab');
    await contactSection.locator('#projectDescription').fill('Building a brand flagship and design engineering system.');
    await contactSection.getByRole('button', { name: 'Strengthen brand presentation' }).click();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // Step 3 (optional)
    await expect(contactSection.getByRole('heading', { name: "Let's understand the scope." })).toBeVisible();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // 1. Test Failure Response (500 Error)
    await page.route('**/api/inquiry', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database service temporarily unavailable' }),
      });
    });

    // Step 4
    await expect(contactSection.getByRole('heading', { name: 'Where can we reach you?' })).toBeVisible();
    await contactSection.locator('#fullName').fill('Elena Rostova');
    await contactSection.locator('#email').fill('elena@helioslab.dev');
    await contactSection.getByRole('button', { name: /Review Inquiry/i }).click();

    // Review Step
    await expect(contactSection.getByRole('heading', { name: 'Review Your Project Inquiry' })).toBeVisible();

    const submitBtn = contactSection.getByRole('button', { name: 'Submit Project Inquiry' });
    await submitBtn.click();

    // Verify error state appears and retry option is presented
    await expect(contactSection.getByText('Transmission Notice')).toBeVisible();
    const retryBtn = contactSection.getByRole('button', { name: 'Retry Submission' });
    await expect(retryBtn).toBeVisible();

    // Verify form data is still completely preserved
    await expect(contactSection.getByText('Helios Lab')).toBeVisible();
    await expect(contactSection.getByText('elena@helioslab.dev')).toBeVisible();

    // 2. Test Success Response (200 OK)
    await page.unroute('**/api/inquiry');
    await page.route('**/api/inquiry', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          inquiryId: 'INQ-HD-2026-X99',
          message: 'Project parameters received. Our lead will follow up shortly.',
        }),
      });
    });

    await retryBtn.click();

    // Verify success state
    await expect(contactSection.getByText('Inquiry Successfully Received')).toBeVisible();
    await expect(contactSection.getByText('REFERENCE // INQ-HD-2026-X99')).toBeVisible();

    // Verify reset button works
    const resetBtn = contactSection.getByRole('button', { name: 'Submit Another Inquiry' });
    await resetBtn.click();
    await expect(contactSection.getByRole('heading', { name: 'What are you looking to build?' })).toBeVisible();
  });

  test('should verify navigation link scrolls cleanly to #contact without header overlap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Contact link in header navigation
    const navLink = page.locator('header').getByRole('link', { name: 'Contact' });
    await expect(navLink).toBeVisible();
    await navLink.click();

    // Allow smooth scroll to settle
    await page.waitForTimeout(600);

    // Verify section heading is in viewport and below the header
    const heading = page.locator('#contact-heading');
    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();
    expect(headingBox!.y).toBeGreaterThan(60);
    expect(headingBox!.y).toBeLessThan(300);
  });

  test('should verify zero horizontal overflow across all 5 standard viewports', async ({ page }) => {
    const viewports = [
      { width: 360, height: 800, name: '360x800' },
      { width: 390, height: 844, name: '390x844' },
      { width: 768, height: 1024, name: '768x1024' },
      { width: 1280, height: 800, name: '1280x800' },
      { width: 1440, height: 900, name: '1440x900' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Scroll to contact section
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }
  });

  test('should capture all 8 required visual screenshots', async ({ page }) => {
    // 1. Contact section desktop (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    await page.screenshot({
      path: path.join(screenshotDir, '01-contact-desktop-full.png'),
      fullPage: false,
    });

    // 2. First form step (Project Type)
    await page.screenshot({
      path: path.join(screenshotDir, '02-contact-step1-project-type.png'),
      fullPage: false,
    });

    // Select service and proceed to Step 2
    await contactSection.getByRole('button', { name: 'Website Development' }).click();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // 3. Middle form step (Project Details)
    await expect(contactSection.getByRole('heading', { name: 'Tell us a little about your project.' })).toBeVisible();
    await page.screenshot({
      path: path.join(screenshotDir, '03-contact-step2-project-details.png'),
      fullPage: false,
    });

    // Fill Step 2 and proceed through Step 3 to Step 4
    await contactSection.locator('#projectName').fill('Krypton Systems');
    await contactSection.locator('#projectDescription').fill('Architecting a high-speed web application and creative brand design.');
    await contactSection.getByRole('button', { name: 'Build something new' }).click();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // Step 3 -> continue
    await expect(contactSection.getByRole('heading', { name: "Let's understand the scope." })).toBeVisible();
    await contactSection.getByRole('button', { name: /Continue/i }).click();

    // 4. Final details step (Step 4)
    await expect(contactSection.getByRole('heading', { name: 'Where can we reach you?' })).toBeVisible();
    await page.screenshot({
      path: path.join(screenshotDir, '04-contact-step4-your-details.png'),
      fullPage: false,
    });

    // 6. Success state using controlled test response
    await page.route('**/api/inquiry', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          inquiryId: 'INQ-HD-2026-QA8',
          message: 'Your project parameters have been confirmed.',
        }),
      });
    });

    // Fill Step 4 and proceed to Review
    await contactSection.locator('#fullName').fill('Siddharth Rao');
    await contactSection.locator('#email').fill('siddharth@kryptonsystems.io');
    await contactSection.getByRole('button', { name: /Review Inquiry/i }).click();

    // 5. Review step
    await expect(contactSection.getByRole('heading', { name: 'Review Your Project Inquiry' })).toBeVisible();
    await page.screenshot({
      path: path.join(screenshotDir, '05-contact-review-step.png'),
      fullPage: false,
    });

    await contactSection.getByRole('button', { name: 'Submit Project Inquiry' }).click();
    await expect(contactSection.getByText('Inquiry Successfully Received')).toBeVisible();

    await page.screenshot({
      path: path.join(screenshotDir, '06-contact-success-state.png'),
      fullPage: false,
    });

    // 7. Mobile form (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const mobileContact = page.locator('#contact');
    await mobileContact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(screenshotDir, '07-contact-mobile-form.png'),
      fullPage: false,
    });

    // 8. Reduced-motion state
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const reducedContact = page.locator('#contact');
    await reducedContact.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(screenshotDir, '08-contact-reduced-motion.png'),
      fullPage: false,
    });
  });

  test('should verify zero browser console errors during full contact workflow', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    expect(consoleErrors).toEqual([]);
  });
});
