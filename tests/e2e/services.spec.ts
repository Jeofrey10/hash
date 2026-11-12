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

  test('should verify interactive cards have visible keyboard focus and open consultation dialog', async ({
    page,
  }) => {
    await page.goto('/');

    const firstCard = page.locator('#services article').first();
    await expect(firstCard).toBeVisible();

    // Focus via keyboard Tab
    await firstCard.focus();
    await expect(firstCard).toBeFocused();

    // Activate via Enter key
    await page.keyboard.press('Enter');

    // Dialog should open
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Start a Project');

    // Close dialog
    const closeBtn = dialog.getByRole('button', { name: 'Close Dialog' });
    await closeBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('should capture required responsive screenshots at all 5 viewports without horizontal overflow', async ({
    page,
  }) => {
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
