import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = '/app/applet/chrome/linux-154.0.8037.57/chrome-linux64/chrome';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/images');
const PUBLIC_DIR = path.resolve(__dirname, '../public/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

async function run() {
  console.log('Launching headless Chrome for full-content screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();
  // Using deviceScaleFactor: 1.5 gives crisp 2880px wide high-DPI screenshots without blowing up file size
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1.5 });

  // 1. Prepare localStorage state with complete progress
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  console.log('Injecting pre-completed curriculum & POM mentor progress...');
  await page.evaluate(() => {
    // A) Student progress (Dashboard & all course drills)
    const allDrillIds = [
      'setup-1', 'setup-2',
      'locators-1', 'locators-2', 'locators-3', 'locators-4', 'locators-5',
      'assertions-1', 'assertions-2', 'assertions-3', 'assertions-4',
      'debugging-1', 'debugging-2', 'debugging-3',
      'pom-1', 'pom-2', 'pom-3', 'pom-4', 'pom-5', 'pom-6',
      'fixtures-1', 'fixtures-2', 'fixtures-3',
      'api-1', 'api-2', 'api-3',
      'ci-1', 'ci-2',
      'capstone-1'
    ];

    const studentProgress = {
      completedDrillIds: allDrillIds,
      moduleStatus: {
        setup: 'mastered',
        locators: 'mastered',
        assertions: 'mastered',
        debugging: 'mastered',
        pom: 'mastered',
        fixtures: 'mastered',
        'api-mocking': 'mastered',
        'ci-cd': 'mastered',
        capstone: 'mastered',
      },
      savedSolutions: {},
      draftSolutions: {},
      lastActiveModuleId: 'fixtures',
    };

    localStorage.setItem('playwright_student_progress_v2', JSON.stringify(studentProgress));

    // B) POM Mentor Gym Progress (Level 1 & Level 2 completely solved and mastered)
    const level2Drill5Solution = `import { Page, Locator } from '@playwright/test';

export class OrdersPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly orderRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search orders...');
    this.orderRows = page.getByRole('row');
  }

  async searchOrder(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  getOrderRow(orderId: string): Locator {
    return this.orderRows.filter({ hasText: orderId });
  }

  async cancelOrder(orderId: string): Promise<void> {
    const row = this.getOrderRow(orderId);
    await row.getByRole('button', { name: 'Cancel Order' }).click();
  }
}`;

    const pomProgress = {
      currentDrillId: 'pom-drill-2-5',
      drillAttempts: {
        'pom-drill-1-1': 1, 'pom-drill-1-2': 1, 'pom-drill-1-3': 1, 'pom-drill-1-4': 1, 'pom-drill-1-5': 1,
        'pom-drill-2-1': 1, 'pom-drill-2-2': 1, 'pom-drill-2-3': 1, 'pom-drill-2-4': 1, 'pom-drill-2-5': 1,
      },
      masteryScores: {
        'Store readonly locators': 4,
        'Initialize locators in constructor': 4,
        'Encapsulate fill and click actions': 4,
        'Proper async/await and explicit return types': 4,
        'Separation of POM and test assertions': 4,
        'Web-first assertions in test specs': 4,
        'Granular user action methods': 4,
        'Refactoring brittle CSS to accessible locators': 4,
        'Accessible locators (getByRole, getByLabel)': 4,
        'Parameterized locator methods': 4,
        'Table row filtering with hasText': 4,
        'Cell-scoped action methods': 4,
        'Container scoping (.locator / .filter)': 4,
        'Chained modal dialog disambiguation': 4,
        'Handling dynamic lists and element counts': 4,
        'Iterating item collections (all(), count())': 4,
        'Full locator fluency synthesis': 4,
      },
      completedDrillIds: [
        'pom-drill-1-1', 'pom-drill-1-2', 'pom-drill-1-3', 'pom-drill-1-4', 'pom-drill-1-5',
        'pom-drill-2-1', 'pom-drill-2-2', 'pom-drill-2-3', 'pom-drill-2-4', 'pom-drill-2-5',
      ],
      savedCode: {
        'pom-drill-2-5': level2Drill5Solution,
      },
      revealedHints: {},
      skillsMastered: [
        'Store readonly locators',
        'Initialize locators in constructor',
        'Encapsulate fill and click actions',
        'Proper async/await and explicit return types',
        'Separation of POM and test assertions',
        'Web-first assertions in test specs',
        'Granular user action methods',
        'Refactoring brittle CSS to accessible locators',
        'Accessible locators (getByRole, getByLabel)',
        'Parameterized locator methods',
        'Table row filtering with hasText',
        'Cell-scoped action methods',
        'Container scoping (.locator / .filter)',
        'Chained modal dialog disambiguation',
        'Handling dynamic lists and element counts',
        'Iterating item collections (all(), count())',
        'Full locator fluency synthesis',
      ],
      skillsNeedingPractice: [],
    };

    localStorage.setItem('playwright_pom_mentor_v1', JSON.stringify(pomProgress));
  });

  // Helper to save full page screenshots both as PNG and JPG
  const saveShot = async (basename) => {
    const pngName = basename.endsWith('.png') ? basename : basename + '.png';
    const jpgName = basename.replace(/\.png$/, '.jpg');

    const docsPng = path.join(OUTPUT_DIR, pngName);
    const pubPng = path.join(PUBLIC_DIR, pngName);
    const docsJpg = path.join(OUTPUT_DIR, jpgName);
    const pubJpg = path.join(PUBLIC_DIR, jpgName);

    // fullPage: true captures the complete page content from top to bottom
    console.log(`Capturing FULL-PAGE: ${pngName}...`);
    await page.screenshot({ path: docsPng, type: 'png', fullPage: true });
    fs.copyFileSync(docsPng, pubPng);

    // Also generate JPG for markdown compatibility
    await page.screenshot({ path: docsJpg, type: 'jpeg', quality: 90, fullPage: true });
    fs.copyFileSync(docsJpg, pubJpg);

    const stat = fs.statSync(docsPng);
    console.log(`Saved ${pngName} (${(stat.size / 1024).toFixed(1)} KB) and ${jpgName}`);
  };

  // ============================================================
  // SCREENSHOT 1: Full Student Learning Dashboard & Competency Radar
  // ============================================================
  console.log('\n--- Screenshot 1: Full Student Learning Dashboard ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#tab-dashboard');
  await page.click('#tab-dashboard');
  await new Promise(r => setTimeout(r, 1500)); // wait for Recharts animation
  await saveShot('student-dashboard.png');

  // ============================================================
  // SCREENSHOT 2: Complete Level 2 in POM Mentor Gym with Evaluation Scorecard
  // ============================================================
  console.log('\n--- Screenshot 2: Complete Level 2 in POM Mentor Gym ---');
  await page.click('#tab-pom-mentor');
  await new Promise(r => setTimeout(r, 800));

  // Select Level 2 tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const lvl2Btn = buttons.find(b => b.textContent && b.textContent.includes('Level 2'));
    if (lvl2Btn) lvl2Btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Select Drill 2.5 if available
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const drillBtn = buttons.find(b => b.textContent && b.textContent.includes('Drill 2.5'));
    if (drillBtn) drillBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click 'Submit for Architectural Evaluation' to trigger full passed scorecard & defense feedback
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const evalBtn = buttons.find(b => 
      b.textContent && (b.textContent.includes('Submit for Architectural Evaluation') || b.textContent.includes('Submit for Mentor Review'))
    );
    if (evalBtn) evalBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500)); // wait for AST analysis animation

  await saveShot('pom-mentor-arena-level2.png');
  // Also keep pom-mentor-arena.png and .jpg synced
  fs.copyFileSync(path.join(OUTPUT_DIR, 'pom-mentor-arena-level2.png'), path.join(OUTPUT_DIR, 'pom-mentor-arena.png'));
  fs.copyFileSync(path.join(OUTPUT_DIR, 'pom-mentor-arena-level2.png'), path.join(PUBLIC_DIR, 'pom-mentor-arena.png'));
  fs.copyFileSync(path.join(OUTPUT_DIR, 'pom-mentor-arena-level2.jpg'), path.join(OUTPUT_DIR, 'pom-mentor-arena.jpg'));
  fs.copyFileSync(path.join(OUTPUT_DIR, 'pom-mentor-arena-level2.jpg'), path.join(PUBLIC_DIR, 'pom-mentor-arena.jpg'));

  // ============================================================
  // SCREENSHOT 3: Drill Lab in POM with POM Quick Reference Open
  // ============================================================
  console.log('\n--- Screenshot 3: Drill Lab in POM with POM Quick Reference Open ---');
  await page.click('#tab-drills');
  await new Promise(r => setTimeout(r, 800));

  // Select 'pom' module on roadmap
  await page.evaluate(() => {
    const pomBtn = document.getElementById('roadmap-btn-pom');
    if (pomBtn) pomBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Ensure POM Quick Reference drawer is toggled open
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const refToggleBtn = buttons.find(b => b.textContent && b.textContent.includes('POM Quick Ref'));
    const drawerOpen = document.querySelector('[data-testid="pom-quick-ref"]') || 
                       Array.from(document.querySelectorAll('h3, h4')).some(el => el.textContent && el.textContent.includes('POM Architectural Rules Cheat Sheet'));
    if (!drawerOpen && refToggleBtn) {
      refToggleBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await saveShot('pom-drill-lab-with-quick-reference.png');

  // ============================================================
  // SCREENSHOT 4: Fixtures Module Canvas Textbook (Full Content)
  // ============================================================
  console.log('\n--- Screenshot 4: Fixtures Module Canvas Textbook ---');
  await page.click('#tab-canvas');
  await new Promise(r => setTimeout(r, 800));

  // Select 'fixtures' module on roadmap
  await page.evaluate(() => {
    const fixturesBtn = document.getElementById('roadmap-btn-fixtures');
    if (fixturesBtn) fixturesBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await saveShot('fixtures-canvas-textbook.png');

  // ============================================================
  // SCREENSHOT 5: Live Target Application Sandbox
  // ============================================================
  console.log('\n--- Screenshot 5: Target App Sandbox ---');
  await page.click('#tab-sandbox');
  await new Promise(r => setTimeout(r, 1000));
  await saveShot('target-app-sandbox.png');

  // ============================================================
  // SCREENSHOT 6: Cumulative Production Test Suite Explorer
  // ============================================================
  console.log('\n--- Screenshot 6: Cumulative Production Test Suite Explorer ---');
  await page.click('#tab-project');
  await new Promise(r => setTimeout(r, 1000));
  await saveShot('cumulative-project-suite.png');

  await browser.close();
  console.log('\n✅ All 6 full-content real screenshots captured and synced successfully!');
}

run().catch(err => {
  console.error('Screenshot script error:', err);
  process.exit(1);
});
