import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Capabilities Section Refinement & Content Separation Validation', () => {
  const screenshotDir = path.join(process.cwd(), 'tests', 'e2e', 'screenshots', 'capabilities-refinement');

  const expectedCapabilityPillars = [
    {
      index: '01',
      title: 'Digital Experience Strategy',
      tag: 'STRATEGY // EXPERIENCE ARCHITECTURE',
      description: 'We structure digital experiences around business objectives, user needs, and clear conversion paths.',
      capabilities: [
        'Information architecture',
        'User journey planning',
        'Conversion-focused experience design',
        'Digital experience planning',
      ],
    },
    {
      index: '02',
      title: 'Interface & Experience Design',
      tag: 'DESIGN // INTERACTION SYSTEMS',
      description: 'We shape intuitive interfaces and consistent visual systems that make digital products easier to understand and use.',
      capabilities: [
        'UI/UX design',
        'Responsive interface systems',
        'Visual consistency',
        'Usability-focused design',
      ],
    },
    {
      index: '03',
      title: 'Software & Platform Engineering',
      tag: 'ENGINEERING // SOFTWARE ARCHITECTURE',
      description: 'We build structured digital platforms and software experiences with attention to architecture, functionality, and performance.',
      capabilities: [
        'Frontend architecture',
        'Web application development',
        'Backend integration',
        'Scalable software architecture',
      ],
    },
    {
      index: '04',
      title: 'Search & Acquisition Systems',
      tag: 'GROWTH // DISCOVERY & ACQUISITION',
      description: 'We combine search optimization and paid acquisition practices to improve digital discoverability and support customer acquisition.',
      capabilities: [
        'Technical and on-page SEO',
        'Search visibility optimization',
        'Campaign architecture',
        'Audience targeting and creative testing',
      ],
    },
    {
      index: '05',
      title: 'Brand & Motion Systems',
      tag: 'CREATIVE // VISUAL COMMUNICATION',
      description: 'We develop coherent visual identities and digital creative experiences that communicate a brand consistently across touchpoints.',
      capabilities: [
        'Brand identity and visual systems',
        'Digital creative assets',
        'Video storytelling',
        'Motion design',
      ],
    },
  ];

  const serviceTitles = [
    'Website Development',
    'Application Development',
    'SEO Optimization',
    'Meta Advertising',
    'Creative Design & Video',
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
    await expect(sectionHeading).toContainText('The thinking and craft behind every digital experience');

    // 4. Verify technical markers
    await expect(capabilitiesSection.getByText('SEC // 04.CAPABILITIES')).toBeAttached();
    await expect(capabilitiesSection.getByText('FRAMEWORK // 05.PILLARS')).toBeAttached();
  });

  test('should render all five refined capability pillars and exact confirmed methods', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const capabilitiesSection = page.locator('#capabilities');
    await capabilitiesSection.scrollIntoViewIfNeeded();

    const articles = capabilitiesSection.locator('article');
    await expect(articles).toHaveCount(5);

    for (let i = 0; i < expectedCapabilityPillars.length; i++) {
      const pillar = expectedCapabilityPillars[i];
      const article = articles.nth(i);

      // Verify index
      await expect(article.getByText(`${pillar.index} //`)).toBeVisible();

      // Verify category tag
      await expect(article.getByText(pillar.tag)).toBeVisible();

      // Verify title as H3
      const h3 = article.getByRole('heading', { level: 3 });
      await expect(h3).toContainText(pillar.title);

      // Verify description
      await expect(article.getByText(pillar.description)).toBeVisible();

      // Verify all core capabilities
      for (const cap of pillar.capabilities) {
        await expect(article.getByText(cap, { exact: true })).toBeVisible();
      }
    }
  });

  test('should verify strict content separation between Services offerings and Capabilities pillars', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const servicesSection = page.locator('#services');
    const capabilitiesSection = page.locator('#capabilities');

    // 1. Verify #services maintains the five official client deliverables
    for (const service of serviceTitles) {
      await expect(servicesSection.getByRole('heading', { level: 3, name: service })).toBeVisible();
    }

    // 2. Verify #capabilities does NOT reuse the five service names as capability headings
    const capabilityHeadings = await capabilitiesSection.locator('article h3').allTextContents();
    for (const service of serviceTitles) {
      expect(capabilityHeadings).not.toContain(service);
    }

    // 3. Verify #capabilities headings match the five cross-disciplinary pillars
    for (const pillar of expectedCapabilityPillars) {
      await expect(capabilitiesSection.getByRole('heading', { level: 3, name: pillar.title })).toBeVisible();
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

    // 2. Interactive or hover state on first card
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
