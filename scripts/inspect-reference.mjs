import { chromium } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const TARGET_URL = 'https://www.generalintelligencecompany.com/';
const SCREENSHOT_DIR = path.resolve('tests/e2e/screenshots/reference-analysis');

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900, isMobile: false },
  { name: 'laptop-1280', width: 1280, height: 800, isMobile: false },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: true },
  { name: 'mobile-390', width: 390, height: 844, isMobile: true },
  { name: 'small-mobile-360', width: 360, height: 800, isMobile: true },
];

async function inspect() {
  console.log(`Starting inspection of ${TARGET_URL}...`);
  const browser = await chromium.launch({ headless: true });

  const inspectionData = {
    url: TARGET_URL,
    timestamp: new Date().toISOString(),
    viewports: {},
    domAnalysis: {},
  };

  // 1. Desktop Detailed Inspection (1440x900)
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  console.log('Navigating to target...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000); // allow animations/fonts to settle

  // Initial Hero Screenshot (Desktop)
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '01-desktop-1440-hero.png'),
    fullPage: false,
  });

  // Full Page Screenshot (Desktop)
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '02-desktop-1440-fullpage.png'),
    fullPage: true,
  });

  // Detailed DOM & Section Inspection
  const pageDetails = await page.evaluate(() => {
    const data = {
      title: document.title,
      metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      sections: [],
      headings: [],
      nav: null,
      glassCards: [],
      fontsDetected: [],
      buttons: [],
    };

    // Nav analysis
    const navEl = document.querySelector('nav') || document.querySelector('header');
    if (navEl) {
      const rect = navEl.getBoundingClientRect();
      const style = window.getComputedStyle(navEl);
      data.nav = {
        tag: navEl.tagName,
        position: style.position,
        top: style.top,
        height: rect.height,
        width: rect.width,
        bg: style.backgroundColor,
        backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
        border: style.border,
        borderRadius: style.borderRadius,
        links: Array.from(navEl.querySelectorAll('a, button')).map(el => ({
          text: el.textContent?.trim(),
          tag: el.tagName,
          classes: el.className,
          href: el.getAttribute('href'),
        })),
      };
    }

    // Identify sections
    const sectionEls = Array.from(document.querySelectorAll('section, main > div, body > div > section, body > div > div'));
    data.sections = sectionEls.map((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      const style = window.getComputedStyle(sec);
      return {
        index: idx,
        tag: sec.tagName,
        id: sec.id,
        className: sec.className,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top + window.scrollY),
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        marginTop: style.marginTop,
        marginBottom: style.marginBottom,
        bg: style.backgroundColor,
        bgImage: style.backgroundImage !== 'none' ? 'present' : 'none',
        display: style.display,
        firstHeading: sec.querySelector('h1, h2, h3, h4')?.textContent?.trim() || null,
        textSnippet: sec.textContent?.trim().slice(0, 150),
      };
    }).filter(s => s.height > 80); // filter out micro containers

    // Headings
    const headingEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    data.headings = headingEls.map(h => {
      const style = window.getComputedStyle(h);
      return {
        tag: h.tagName,
        text: h.textContent?.trim(),
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        color: style.color,
      };
    });

    // Glass/Frosted elements
    const allEls = Array.from(document.querySelectorAll('*'));
    for (const el of allEls) {
      const style = window.getComputedStyle(el);
      const bf = style.backdropFilter || style.webkitBackdropFilter;
      if (bf && bf !== 'none') {
        const rect = el.getBoundingClientRect();
        data.glassCards.push({
          tag: el.tagName,
          className: el.className,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          backdropFilter: bf,
          bg: style.backgroundColor,
          border: style.border,
          borderRadius: style.borderRadius,
          boxShadow: style.boxShadow,
          textSnippet: el.textContent?.trim().slice(0, 100),
        });
      }
    }

    // Buttons
    const btnEls = Array.from(document.querySelectorAll('button, a[class*="button"], a[class*="btn"], a[class*="pill"]'));
    data.buttons = btnEls.map(b => {
      const style = window.getComputedStyle(b);
      return {
        text: b.textContent?.trim(),
        tag: b.tagName,
        className: b.className,
        bg: style.backgroundColor,
        color: style.color,
        borderRadius: style.borderRadius,
        padding: `${style.paddingTop} ${style.paddingRight} ${style.paddingBottom} ${style.paddingLeft}`,
        fontSize: style.fontSize,
        border: style.border,
      };
    });

    return data;
  });

  inspectionData.domAnalysis = pageDetails;
  console.log('Desktop 1440 details extracted.');

  // Check interactive hover states
  console.log('Testing interactive states...');
  const firstButton = page.locator('button, a[href*="get"], a[href*="contact"], a[class*="pill"]').first();
  if (await firstButton.count() > 0) {
    await firstButton.hover();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, '03-desktop-interactive-button-hover.png'),
    });
  }

  // Scroll down to capture mid-page and footer sections
  console.log('Capturing section snapshots on desktop...');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '04-desktop-scroll-midpage.png'),
  });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '05-desktop-scroll-bottom.png'),
  });

  await context.close();

  // 2. Iterate remaining viewports
  for (const vp of VIEWPORTS.slice(1)) {
    console.log(`Inspecting viewport ${vp.name} (${vp.width}x${vp.height})...`);
    const vpContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });
    const vpPage = await vpContext.newPage();
    await vpPage.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await vpPage.waitForTimeout(2000);

    // Hero screenshot
    await vpPage.screenshot({
      path: path.join(SCREENSHOT_DIR, `06-${vp.name}-hero.png`),
      fullPage: false,
    });

    // Full page screenshot
    await vpPage.screenshot({
      path: path.join(SCREENSHOT_DIR, `07-${vp.name}-fullpage.png`),
      fullPage: true,
    });

    // Extract viewport specific measurements
    const vpData = await vpPage.evaluate(() => {
      const h1 = document.querySelector('h1');
      const h1Style = h1 ? window.getComputedStyle(h1) : null;
      const nav = document.querySelector('nav') || document.querySelector('header');
      const navStyle = nav ? window.getComputedStyle(nav) : null;
      return {
        h1FontSize: h1Style ? h1Style.fontSize : null,
        h1LineHeight: h1Style ? h1Style.lineHeight : null,
        navDisplay: navStyle ? navStyle.display : null,
        navHeight: nav ? nav.getBoundingClientRect().height : null,
        hasMobileMenuButton: !!document.querySelector('button[aria-label*="menu" i], button[class*="menu" i], button[class*="hamburger" i], svg[class*="menu" i]'),
        bodyOverflowX: window.getComputedStyle(document.body).overflowX,
        scrollWidth: document.body.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.body.scrollWidth > document.documentElement.clientWidth,
      };
    });

    inspectionData.viewports[vp.name] = {
      ...vp,
      ...vpData,
    };

    // If mobile, check if mobile menu can be toggled
    if (vp.name === 'mobile-390') {
      const menuBtn = vpPage.locator('button[aria-label*="menu" i], button[class*="menu" i], button:has(svg)').first();
      if (await menuBtn.count() > 0) {
        try {
          await menuBtn.click({ timeout: 2000 });
          await vpPage.waitForTimeout(600);
          await vpPage.screenshot({
            path: path.join(SCREENSHOT_DIR, '08-mobile-menu-open.png'),
          });
        } catch (e) {
          console.log('Mobile menu click bypassed or not interactive:', e.message);
        }
      }
    }

    await vpContext.close();
  }

  await browser.close();

  // Save JSON report
  const jsonPath = path.resolve('tests/e2e/screenshots/reference-analysis/inspection-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(inspectionData, null, 2));
  console.log(`Inspection complete! Data written to ${jsonPath}`);
}

inspect().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});

