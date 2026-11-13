import { test, expect } from '@playwright/test';

test.describe('Stage 06 Services Section Validation', () => {
  const expectedServices = [
    { index: '01', title: 'Website Development', category: 'Engineering' },
    { index: '02', title: 'Application Development', category: 'Software' },
    { index: '03', title: 'SEO Optimization', category: 'Growth' },
    { index: '04', title: 'Meta Advertising', category: 'Media' },
    { index: '05', title: 'Creative Design & Video', category: 'Creative' },
  ];

  test('should render services section with correct ID, heading, and exactly five confirmed services', async ({
    page,
  }) => {
    await page.goto('/');

    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeVisible();

    // Verify overline
    const overline = servicesSection.getByText('What We Do');
    await expect(overline).toBeVisible();

    // Verify section heading
    const heading = servicesSection.locator('#services-heading');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Integrated capabilities for connected digital growth.');

    // Verify exactly five service cards in the section
    const serviceCards = servicesSection.locator('article');
    await expect(serviceCards).toHaveCount(5);

    // Verify each service title, index, and category
    for (const service of expectedServices) {
      const card = servicesSection.locator(`article:has-text("${service.title}")`);
      await expect(card).toBeVisible();
      await expect(card).toContainText(`${service.index} //`);
      await expect(card).toContainText(service.category);
    }
  });

  test('should verify hero CTA navigates and scrolls cleanly to #services', async ({ page }) => {
    await page.goto('/');

    const heroCta = page.locator('#hero a[href="#services"]');
    await expect(heroCta).toBeVisible();

    // Click secondary hero CTA
    await heroCta.click();

    // Verify URL hash updated
    await expect(page).toHaveURL(/.*#services/);

    // Verify services section is in viewport
    const servicesSection = page.locator('#services');
    await expect(servicesSection).toBeInViewport();
  });

  test('should verify main navigation Services link targets and scrolls to #services', async ({ page }) => {
    await page.goto('/');

    const navServicesLink = page
      .getByRole('navigation', { name: 'Main Navigation' })
      .locator('a[href="#services"]')
      .first();

    if (await navServicesLink.isVisible()) {
      await navServicesLink.click();
      await expect(page).toHaveURL(/.*#services/);
      const servicesHeading = page.locator('#services-heading');
      await expect(servicesHeading).toBeInViewport();
    }
  });

  test('should verify modal portal placement, background inert isolation, keyboard trap, and focus restoration', async ({
    page,
  }) => {
    await page.goto('/');

    const serviceButtons = page.locator('#services article button[aria-label^="Inquire about"]');
    await expect(serviceButtons).toHaveCount(5);

    const firstBtn = serviceButtons.first();
    await firstBtn.focus();
    await expect(firstBtn).toBeFocused();

    // 1. Activate via Enter key
    await page.keyboard.press('Enter');

    // 2. Modal is rendered via React portal outside #root and outside main/header/footer
    const modalRoot = page.locator('#modal-root');
    await expect(modalRoot).toBeAttached();

    const dialog = modalRoot.getByRole('dialog', { name: 'Project Consultation Inbound' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toContainText('Inquire: Website Development');

    // Confirm dialog is NOT inside #root, header, main, or footer
    const insideRoot = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      const root = document.getElementById('root');
      return root ? root.contains(modal) : false;
    });
    expect(insideRoot).toBe(false);

    // 3. Background application root (#root) receives inert & aria-hidden
    const appRoot = page.locator('#root');
    await expect(appRoot).toHaveAttribute('inert', '');
    await expect(appRoot).toHaveAttribute('aria-hidden', 'true');

    // Modal root must NOT be inert or aria-hidden
    await expect(modalRoot).not.toHaveAttribute('inert');
    await expect(modalRoot).not.toHaveAttribute('aria-hidden');

    // 4. Tab and Shift+Tab focus trap verification
    // Close button should be initially focused
    const closeDialogBtn = dialog.getByRole('button', { name: 'Close Dialog' });
    await expect(closeDialogBtn).toBeFocused();

    // Press Tab from last focusable element wraps to top-right dismiss button
    await page.keyboard.press('Tab');
    const dismissBtn = dialog.getByRole('button', { name: 'Close consultation dialog' });
    await expect(dismissBtn).toBeFocused();

    // Press Tab from dismiss button wraps back to Close Dialog button
    await page.keyboard.press('Tab');
    await expect(closeDialogBtn).toBeFocused();

    // Press Shift+Tab wraps back to dismiss button
    await page.keyboard.press('Shift+Tab');
    await expect(dismissBtn).toBeFocused();

    // 5. Escape closes the dialog and restores background accessibility
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Background #root is no longer inert or aria-hidden
    await expect(appRoot).not.toHaveAttribute('inert');
    await expect(appRoot).not.toHaveAttribute('aria-hidden');

    // Focus is returned to the exact triggering service button
    await expect(firstBtn).toBeFocused();

    // 6. Test repeated open/close cycles across multiple service cards
    const secondBtn = serviceButtons.nth(1);
    await secondBtn.focus();
    await page.keyboard.press('Space');

    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Inquire: Application Development');
    await expect(appRoot).toHaveAttribute('inert', '');

    // Dismiss via top-right close button
    await dismissBtn.click();
    await expect(dialog).not.toBeVisible();
    await expect(appRoot).not.toHaveAttribute('inert');
    await expect(secondBtn).toBeFocused();

    // Third cycle: third button
    const thirdBtn = serviceButtons.nth(2);
    await thirdBtn.focus();
    await page.keyboard.press('Enter');

    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Inquire: SEO Optimization');

    // Dismiss via Close Dialog button
    await closeDialogBtn.click();
    await expect(dialog).not.toBeVisible();
    await expect(thirdBtn).toBeFocused();

    // Verify zero stale attributes remain after repeated cycles
    await expect(appRoot).not.toHaveAttribute('inert');
    await expect(appRoot).not.toHaveAttribute('aria-hidden');
  });

  test('should verify exact background attribute restoration for both unmodified root and root with pre-existing attributes', async ({
    page,
  }) => {
    await page.goto('/');

    const appRoot = page.locator('#root');
    const firstServiceBtn = page.locator('#services article button[aria-label^="Inquire about"]').first();
    const dialog = page.locator('#modal-root [role="dialog"]');

    // ── Scenario 1: Restoration of initially unmodified root ──
    // Confirm initial baseline has no inert and no aria-hidden
    await expect(appRoot).not.toHaveAttribute('inert');
    await expect(appRoot).not.toHaveAttribute('aria-hidden');

    // Open modal
    await firstServiceBtn.click();
    await expect(dialog).toBeVisible();
    await expect(appRoot).toHaveAttribute('inert', '');
    await expect(appRoot).toHaveAttribute('aria-hidden', 'true');

    // Close modal via Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    // Verify root is returned to unmodified state
    await expect(appRoot).not.toHaveAttribute('inert');
    await expect(appRoot).not.toHaveAttribute('aria-hidden');

    // ── Scenario 2: Restoration of root with pre-existing inert & aria-hidden attributes ──
    // Inject custom pre-existing attributes on #root
    await page.evaluate(() => {
      const root = document.getElementById('root');
      if (root) {
        root.setAttribute('inert', 'pre-existing-inert');
        root.setAttribute('aria-hidden', 'custom-hidden-value');
      }
    });

    // Verify pre-existing state is in place
    await expect(appRoot).toHaveAttribute('inert', 'pre-existing-inert');
    await expect(appRoot).toHaveAttribute('aria-hidden', 'custom-hidden-value');

    // Open modal while #root has pre-existing attributes (trigger programmatically since DOM-level inert suppresses hardware click events)
    await page.evaluate(() => {
      const btn = document.querySelector('#services article button[aria-label^="Inquire about"]') as HTMLButtonElement;
      if (btn) btn.click();
    });
    await expect(dialog).toBeVisible();

    // Modal overrides attributes while open
    await expect(appRoot).toHaveAttribute('inert', '');
    await expect(appRoot).toHaveAttribute('aria-hidden', 'true');

    // Close modal via close button
    const closeBtn = dialog.getByRole('button', { name: 'Close Dialog' });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();

    // Verify exact pre-existing values were restored without loss or alteration
    await expect(appRoot).toHaveAttribute('inert', 'pre-existing-inert');
    await expect(appRoot).toHaveAttribute('aria-hidden', 'custom-hidden-value');

    // Clean up test attributes on #root
    await page.evaluate(() => {
      const root = document.getElementById('root');
      if (root) {
        root.removeAttribute('inert');
        root.removeAttribute('aria-hidden');
      }
    });
  });

  test('should capture required responsive screenshots at all 5 viewports without horizontal overflow', async ({
    page,
  }) => {
    test.setTimeout(60000);
    const viewports = [
      { name: '01-services-desktop-1440.png', width: 1440, height: 900 },
      { name: '02-services-laptop-1280.png', width: 1280, height: 800 },
      { name: '03-services-tablet-768.png', width: 768, height: 1024 },
      { name: '04-services-mobile-390.png', width: 390, height: 844 },
      { name: '05-services-mobile-360.png', width: 360, height: 800 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/#services');
      await page.waitForTimeout(500);

      // Verify no horizontal overflow across entire document
      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasOverflow, `Overflow detected on ${vp.width}px`).toBe(false);

      // Verify all 5 cards have positive bounding boxes without overlap
      const cards = page.locator('#services article');
      const count = await cards.count();
      expect(count).toBe(5);

      for (let i = 0; i < count; i++) {
        const box = await cards.nth(i).boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(200);
        expect(box!.height).toBeGreaterThan(150);
      }

      // Temporarily hide fixed header so element screenshot is pristine and unobstructed
      await page.evaluate(() => {
        const header = document.querySelector('header');
        if (header) header.style.visibility = 'hidden';
      });

      // Capture screenshot of the Services section
      const servicesSection = page.locator('#services');
      await servicesSection.screenshot({
        path: `tests/e2e/screenshots/stage-06/${vp.name}`,
      });

      // Restore header visibility
      await page.evaluate(() => {
        const header = document.querySelector('header');
        if (header) header.style.visibility = 'visible';
      });
    }

    // Capture Hero to Services transition seam
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/');
    // Scroll so hero bottom anchor card and services heading are both framed
    await page.evaluate(() => {
      window.scrollTo(0, 650);
    });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'tests/e2e/screenshots/stage-06/06-hero-to-services-transition.png',
      fullPage: false,
    });
  });

  test('should verify reduced motion preference is respected across services section', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/#services');

    const card = page.locator('#services article').first();
    const durationSec = await card.evaluate((el) => {
      const durationStr = window.getComputedStyle(el).transitionDuration;
      return parseFloat(durationStr);
    });

    // In reduced motion mode, transitions should be instant (<= 0.001s / 1ms)
    expect(durationSec).toBeLessThanOrEqual(0.001);
  });

  test('should verify zero browser console errors on page load and section interactions', async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(400);

    // Scroll to services
    await page.locator('#hero a[href="#services"]').click();
    await page.waitForTimeout(400);

    // Hover each card
    const cards = page.locator('#services article');
    for (let i = 0; i < 5; i++) {
      await cards.nth(i).hover();
    }

    expect(consoleErrors).toEqual([]);
  });
});
