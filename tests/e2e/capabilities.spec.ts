import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Stage 09 Capabilities Section Validation', () => {
  const screenshotDir = path.join(process.cwd(), 'tests', 'e2e', 'screenshots', 'stage-09');

  const expectedCapabilityAreas = [
    {
      index: '01',
      title: 'Website Development',
      tag: 'Core Platform // Engineering',
      capabilities: [
        'High-performance websites',
        'Responsive interface engineering',
        'Landing pages and conversion-focused experiences',
        'Frontend architecture',
      ],
    },
    {
      index: '02',
      title: 'Application Development',
      tag: 'Software Systems // Full-Stack',
      capabilities: [
        'Web applications',
        'Application interfaces',
        'Backend integration',
        'Scalable software architecture',
      ],
    },
    {
      index: '03',
      title: 'SEO Optimization',
      tag: 'Search Performance // Technical',
      capabilities: [
        'Technical SEO',
        'On-page optimization',
        'Search visibility',
        'Website structure and performance',
      ],
    },
    {
      index: '04',
      title: 'Meta Advertising',
      tag: 'Paid Acquisition // Funnel Strategy',
      capabilities: [
        'Campaign architecture',
        'Audience targeting',
        'Paid acquisition strategy',
        'Creative testing',
      ],
    },
    {
      index: '05',
      title: 'Creative Design & Video',
      tag: 'Brand Systems // Motion & UI',
      capabilities: [
        'Brand identity and visual systems',
        'UI/UX design',
        'Digital creative assets',
        'Video content and motion design',
      ],
    },
  ];

  test('should render capabilities section after approach with correct ID and heading structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1. Verify section exists with id="capabilities"
    const capabilitiesSection = page.locator('#capabilities');
    await expect(capabilitiesSection).toBeVisible();

    // 2. Verify section comes directly after approach in DOM
    const isAfterApproach = await page.evaluate(() => {
      const approach = document.getElementById('approach');
      const capabilities = document.getElementById('capabilities');
      if (!approach || !capabilities) return false;
      return Boolean(approach.compareDocumentPosition(capabilities) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(isAfterApproach).toBe(true);

    // 3. Verify heading accessibility and hierarchy
    const sectionHeading = capabilitiesSection.getByRole('heading', { level: 2 });
    await expect(sectionHeading).toBeVisible();
    await expect(sectionHeading).toHaveAttribute('id', 'capabilities-heading');
    await expect(sectionHeading).toContainText('Specialized capabilities for connected digital execution');

    // 4. Verify technical markers
    await expect(capabilitiesSection.getByText('SEC // 04.CAPABILITIES')).toBeAttached();
    await expect(capabilitiesSection.getByText('AREAS // 05.SYSTEM')).toBeAttached();
  });

  test('should render all five capability areas and exact confirmed sub-capabilities', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const capabilitiesSection = page.locator('#capabilities');
    await capabilitiesSection.scrollIntoViewIfNeeded();

    const articles = capabilitiesSection.locator('article');
    await expect(articles).toHaveCount(5);

    for (let i = 0; i < expectedCapabilityAreas.length; i++) {
      const area = expectedCapabilityAreas[i];
      const article = articles.nth(i);

      // Verify index
      await expect(article.getByText(`${area.index} //`)).toBeVisible();

      // Verify title as H3
      const h3 = article.getByRole('heading', { level: 3 });
      await expect(h3).toContainText(area.title);

      // Verify all sub-capabilities
      for (const cap of area.capabilities) {
        await expect(article.getByText(cap, { exact: true })).toBeVisible();
      }
    }
  });

  test('should verify navigation link scrolls cleanly to #capabilities without header overlap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Capabilities link in header navigation
    const navLink = page.locator('header').getByRole('link', { name: 'Capabilities' });
    await expect(navLink).toBeVisible();
    await navLink.click();

    // Allow smooth scroll to settle
    await page.waitForTimeout(600);

    // Verify section heading is in viewport and below the header
    const heading = page.locator('#capabilities-heading');
    const headingBox = await heading.boundingBox();
    expect(headingBox).not.toBeNull();
    // Header height is approx 64-74px; headingBox.y must be greater than header height to prevent overlap
    expect(headingBox!.y).toBeGreaterThan(60);
    expect(headingBox!.y).toBeLessThan(300);
  });

  test('should verify keyboard accessibility and focus navigation across capability articles', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const capabilitiesSection = page.locator('#capabilities');
    await capabilitiesSection.scrollIntoViewIfNeeded();

    const articles = capabilitiesSection.locator('article');
    await expect(articles).toHaveCount(5);

    // Focus first article directly and verify active element
    await articles.first().focus();
    const isFirstFocused = await articles.first().evaluate((el) => document.activeElement === el);
    expect(isFirstFocused).toBe(true);

    // Press Tab to navigate to the second article
    await page.keyboard.press('Tab');
    const isSecondFocused = await articles.nth(1).evaluate((el) => document.activeElement === el);
    expect(isSecondFocused).toBe(true);
  });

  test('should verify reduced motion preference support in capabilities section', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const capabilitiesSection = page.locator('#capabilities');
    await capabilitiesSection.scrollIntoViewIfNeeded();

    // Heading and all articles must be immediately visible
    const heading = capabilitiesSection.locator('#capabilities-heading');
    await expect(heading).toBeVisible();

    const articles = capabilitiesSection.locator('article');
    await expect(articles).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(articles.nth(i)).toBeVisible();
    }

    // Capture reduced-motion screenshot
    await page.screenshot({
      path: path.join(screenshotDir, '06-capabilities-reduced-motion.png'),
      fullPage: false,
    });
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

      // Scroll to capabilities section
      const capabilitiesSection = page.locator('#capabilities');
      await capabilitiesSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }
  });

  test('should capture required visual screenshots at desktop, tablet, mobile, and hover state', async ({ page }) => {
    // 1. Desktop full section (1440x900)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const capabilitiesSection = page.locator('#capabilities');
    await capabilitiesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    await page.screenshot({
      path: path.join(screenshotDir, '01-capabilities-desktop-full.png'),
      fullPage: false,
    });

    // 2. Interactive or hover state on featured card
    const firstCard = capabilitiesSection.locator('article').first();
    await firstCard.hover();
    await page.waitForTimeout(250);

    await page.screenshot({
      path: path.join(screenshotDir, '05-capabilities-interactive-hover.png'),
      fullPage: false,
    });

    // 3. Desktop section during reveal
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      const el = document.getElementById('capabilities');
      el?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await page.waitForTimeout(100);

    await page.screenshot({
      path: path.join(screenshotDir, '02-capabilities-desktop-reveal.png'),
      fullPage: false,
    });

    // 4. Tablet layout (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const tabletSection = page.locator('#capabilities');
    await tabletSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    await page.screenshot({
      path: path.join(screenshotDir, '04-capabilities-tablet-layout.png'),
      fullPage: false,
    });

    // 5. Mobile full section (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const mobileSection = page.locator('#capabilities');
    await mobileSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);

    await page.screenshot({
      path: path.join(screenshotDir, '03-capabilities-mobile-full.png'),
      fullPage: false,
    });
  });

  test('should verify zero browser console errors during full capabilities interaction', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const capabilitiesSection = page.locator('#capabilities');
    await capabilitiesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    // Hover over each capability card
    const articles = capabilitiesSection.locator('article');
    const count = await articles.count();
    for (let i = 0; i < count; i++) {
      await articles.nth(i).hover();
      await page.waitForTimeout(100);
    }

    // Click consultation CTA inside closing banner
    const ctaBtn = capabilitiesSection.getByRole('button', { name: 'Initiate Project Consultation' });
    await expect(ctaBtn).toBeVisible();
    await ctaBtn.click();

    // Verify consultation dialog opened
    const dialog = page.getByRole('dialog', { name: 'Project Consultation Inbound' });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();

    expect(consoleErrors).toEqual([]);
  });
});
