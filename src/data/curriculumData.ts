import { ModuleData, ProjectFile } from '../types';

export const ROADMAP_STAGES = [
  'Setup',
  'Basics',
  'Assertions',
  'Debugging',
  'POM',
  'Fixtures',
  'API',
  'CI/CD',
  'Capstone',
] as const;

export const MODULES_DATA: ModuleData[] = [
  {
    id: 'setup',
    stage: 'Setup',
    title: 'Module 1: Setup & Ubuntu 24.04 Environment',
    subtitle: 'Laying your test automation foundation in Linux and VS Code',
    estimatedTime: '45 mins',
    targetApp: 'Ubuntu Terminal & Local Node.js Runtime',
    theorySections: [
      {
        title: 'The Modern Playwright Architecture',
        content: `Playwright is an open-source test automation framework built by Microsoft. Unlike legacy tools (like Selenium WebDriver) that sent HTTP commands through browser drivers, Playwright communicates directly with browser rendering engines (Chromium, Firefox, and WebKit) via low-level WebSocket protocol connections (Chrome DevTools Protocol & internal browser channels).

This direct-pipe communication gives you:
1. Zero flakiness from out-of-sync driver relays.
2. Native support for multi-tabs, popups, worker threads, and iframes.
3. True network request interception and mocking at the socket level.
4. Auto-waiting on actionable elements before executing actions.`,
        callout: {
          type: 'ubuntu',
          title: 'Ubuntu 24.04 LTS Specifics',
          text: 'Ubuntu 24.04 (Noble Numbat) comes with Wayland display protocol by default. Playwright tests running headfully require Linux graphical libraries (libasound, libgbm, etc.). Always run `npx playwright install --with-deps` so Playwright pulls system packages via `apt` automatically.'
        }
      },
      {
        title: 'Project Anatomy & playwright.config.ts',
        content: `When you initialize a project using \`npm init playwright@latest\`, Playwright creates a minimal, battle-tested directory structure:

- \`playwright.config.ts\`: The nerve center. Controls timeouts, parallel workers, browser matrix, base URLs, and test reporter configurations.
- \`package.json\`: Declares \`@playwright/test\` and \`typescript\` dependencies.
- \`tests/\`: Where your test specification files (\`*.spec.ts\`) reside.
- \`tests-examples/\`: Demo tests (can be safely removed in our project).`,
        codeSnippet: {
          language: 'typescript',
          caption: 'playwright.config.ts — The production foundation',
          code: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Run test files in parallel across CPU cores
  forbidOnly: !!process.env.CI, // Fail build if accidental test.only is committed
  retries: process.env.CI ? 2 : 0, // Retry failed tests on CI runners
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry', // Records execution trace with DOM snapshots on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});`
        }
      }
    ],
    justInTimeTs: {
      concept: 'ES Modules & Configuration Typing',
      whyNow: 'Playwright configuration uses TypeScript exports (`defineConfig`) so VS Code can autocomplete every setting with zero guesswork.',
      explanation: 'In modern TypeScript, we import modules with `import { ... } from "package"` rather than old Node `require()`. Wrapping our config with `defineConfig({...})` enables compile-time type validation for all Playwright options.',
      codeExample: `// Notice: defineConfig ensures your configuration keys are typo-free
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30_000, // TypeScript enforces number type here!
});`
    },
    ubuntuTerminalCommands: [
      {
        command: 'node -v && npm -v',
        description: 'Verify Node.js (v18+ or v20+ recommended on Ubuntu 24.04)',
        expectedOutput: 'v20.12.0\n10.5.0'
      },
      {
        command: 'mkdir playwright-mastery && cd playwright-mastery && npm init -y',
        description: 'Initialize our cumulative root project directory',
        expectedOutput: 'Wrote to /home/ubuntu/playwright-mastery/package.json'
      },
      {
        command: 'npm init playwright@latest -- --yes --quiet',
        description: 'Scaffold Playwright with TypeScript and download core browser binaries',
        expectedOutput: '✔ Success! Created a Playwright Test project at /home/ubuntu/playwright-mastery'
      },
      {
        command: 'npx playwright install --with-deps',
        description: 'Crucial on Ubuntu: installs native Linux shared system libraries required by Chromium/WebKit',
        expectedOutput: 'Installing dependencies for browsers... Done.'
      },
      {
        command: 'npx playwright test',
        description: 'Run the default test suite headlessly across all configured browsers',
        expectedOutput: 'Running 6 tests using 4 workers\n  6 passed (4.2s)'
      }
    ],
    drills: [
      {
        id: 'drill-1-1',
        moduleId: 'setup',
        drillNumber: '1.1',
        title: 'Predict & Understand: Ubuntu Dependency Flag',
        type: 'predict',
        prompt: `On your Ubuntu 24.04 machine, you clone a Playwright repository and run \`npx playwright test\`. You receive an error:
"Host system is missing dependencies to run browsers. Missing libraries: libasound2, libgbm1".

Which single command resolves this on Ubuntu, and what does the \`--with-deps\` flag actually tell the system package manager to do?`,
        starterCode: `// Write the exact command and explain its Linux system action:
const command = "npx playwright install --with-deps";
// Explanation:`,
        hints: {
          tier1Concept: 'Playwright headless and headed browser engines require Linux shared C libraries (.so files) that are not always bundled in standard desktop or server Ubuntu minimal installs.',
          tier2Partial: 'The command is `npx playwright install --with-deps`. It invokes `sudo apt-get install` internally for browser dependencies.',
          tier3Solution: `Command: npx playwright install --with-deps
Explanation: This command downloads the pinned browser binaries (Chromium, Firefox, WebKit) and automatically invokes Ubuntu's apt package manager to install required OS-level shared libraries (such as libasound, libgbm, libx11) needed to launch the browser engines.`
        },
        validation: {
          requiredKeywords: ['--with-deps', 'apt', 'libraries'],
          solutionCode: `npx playwright install --with-deps
// Invokes apt package manager to install missing Linux shared libraries.`
        }
      },
      {
        id: 'drill-1-2',
        moduleId: 'setup',
        drillNumber: '1.2',
        title: 'Spot and Fix: Risky playwright.config.ts',
        type: 'spot-and-fix',
        prompt: `Review the flawed configuration snippet below. Identify the two major anti-patterns/bugs for an automated test setup, and fix them:
1. What happens if a developer commits a forgotten \`test.only\` to GitHub CI?
2. Why is hardcoding \`workers: 1\` on a powerful multi-core developer workstation undesirable?`,
        starterCode: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // BUG 1: test.only will pass on CI without warning
  forbidOnly: false,
  // BUG 2: unnecessarily restricts local CPU utilization
  workers: 1,
  use: {
    baseURL: 'https://www.saucedemo.com',
  },
});`,
        hints: {
          tier1Concept: 'Continuous Integration environments require strict validation so one developer does not accidentally suppress the rest of the test suite.',
          tier2Partial: 'Set `forbidOnly: !!process.env.CI` and allow `workers` to be dynamic (e.g., `process.env.CI ? 1 : undefined`).',
          tier3Solution: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'https://www.saucedemo.com',
  },
});`
        },
        validation: {
          requiredKeywords: ['forbidOnly: !!process.env.CI', 'process.env.CI ? 1 : undefined'],
          solutionCode: `import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'https://www.saucedemo.com',
  },
});`
        }
      },
      {
        id: 'drill-1-3',
        moduleId: 'setup',
        drillNumber: '1.3',
        title: 'Mastery Gate: Scaffold Our Cumulative Project Config',
        type: 'build-from-scratch',
        isMasteryGate: true,
        prompt: `Write our cumulative project's \`playwright.config.ts\` from scratch.
Requirements:
1. Import \`defineConfig\` and \`devices\` from \`@playwright/test\`.
2. Configure \`testDir\` to \`'./tests'\`.
3. Enable \`fullyParallel: true\`.
4. Set \`forbidOnly: !!process.env.CI\`.
5. Under \`use\`, set \`baseURL: 'https://www.saucedemo.com'\`, \`trace: 'on-first-retry'\`, and \`screenshot: 'only-on-failure'\`.
6. Define three projects: \`chromium\`, \`firefox\`, and \`webkit\` using \`devices\`.

Mastery Requirement: Explain in your own words why setting \`trace: 'on-first-retry'\` is superior to running traces on every passing test.`,
        starterCode: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Your code here
});`,
        hints: {
          tier1Concept: 'Playwright traces record entire DOM snapshots, console logs, and network packets. Generating them on thousands of passing tests consumes huge disk space and slows CI execution.',
          tier2Partial: 'Use `trace: "on-first-retry"` so you only pay the performance cost when a test actually fails and is retried.',
          tier3Solution: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});`
        },
        validation: {
          requiredKeywords: ['fullyParallel', 'on-first-retry', 'Desktop Chrome', 'Desktop Firefox', 'Desktop Safari', 'baseURL'],
          expectedExplanationKeywords: ['disk', 'performance', 'slow', 'space', 'retry', 'fail', 'overhead'],
          solutionCode: `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 1 No-Notes Checkpoint',
      scenario: 'You are on an Ubuntu 24.04 cloud VM. Without consulting references, explain how you would initialize a brand-new Playwright TypeScript repository, configure base URL and trace collection, install the Linux headless dependencies, and execute tests across Chromium and Firefox.',
      successCriteria: [
        'States npm init playwright@latest with TypeScript option',
        'Includes npx playwright install --with-deps for Linux dependencies',
        'Specifies trace: "on-first-retry" and baseURL in playwright.config.ts',
        'Runs npx playwright test --project=chromium,firefox'
      ]
    }
  },
  {
    id: 'basics',
    stage: 'Basics',
    title: 'Module 2: Basics — Web-First Locators & Actions',
    subtitle: 'Interacting with real web apps like a human user without brittle selectors',
    estimatedTime: '60 mins',
    targetApp: 'https://www.saucedemo.com & https://the-internet.herokuapp.com',
    theorySections: [
      {
        title: 'Web-First Locators: The Gold Standard',
        content: `Playwright introduced a revolutionary philosophy: locate elements the same way assistive technologies and real human users find them — by accessible role, visible text, or semantic form labels.

Hierarchy of Locator Preference:
1. \`page.getByRole('button', { name: 'Login' })\` (Accessible Role + Accessible Name) — #1 PREFERRED
2. \`page.getByLabel('Username')\` (Associated Form Label) — #2 PREFERRED
3. \`page.getByPlaceholder('Enter your username')\` (Input placeholder)
4. \`page.getByText('Products')\` (Visible non-interactive text)
5. \`page.getByTestId('submit-btn')\` (Resilient QA attribute)
6. \`page.locator('css or xpath')\` — STRICTLY FALLBACK ONLY!

Why avoid XPath and nested CSS like \`div > div.col-md-4:nth-child(2) > button\`?
Because the moment a frontend designer wraps that button in a flexbox \`<div>\`, your entire test suite breaks. Accessible roles remain resilient.`,
        codeSnippet: {
          language: 'typescript',
          caption: 'tests/e2e/login.spec.ts — Cumulative Project Initial Test',
          code: `import { test, expect } from '@playwright/test';

test('standard user can log in to SauceDemo successfully', async ({ page }) => {
  // 1. Navigate using the configured baseURL
  await page.goto('/');

  // 2. Locate inputs by label/placeholder using web-first locators
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // 3. Click the login button by accessible role
  await page.getByRole('button', { name: 'Login' }).click();

  // 4. Assert URL and visible heading
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();
});`
        },
        callout: {
          type: 'warning',
          title: 'The Anti-Pattern Ban: waitForTimeout()',
          text: 'Playwright automatically waits for elements to be attached, visible, stable, enabled, and editable before clicking or typing. NEVER use `page.waitForTimeout(3000)`. It slows test runs, causes arbitrary CI flakiness, and violates modern test automation craftsmanship.'
        }
      }
    ],
    justInTimeTs: {
      concept: 'async / await and Promises',
      whyNow: 'Browsers run asynchronously. Every interaction with a web page (`goto`, `click`, `fill`, `expect`) takes time over the network or rendering engine.',
      explanation: 'In JavaScript/TypeScript, asynchronous functions return a `Promise`. The `await` keyword pauses execution of the test until that specific browser operation completes before moving to the next line. Missing an `await` causes tests to finish prematurely with unhandled promise rejections!',
      codeExample: `// Bad: Missing await causes race condition
page.goto('/'); 

// Correct: Always await asynchronous Playwright methods
await page.goto('/');
await page.getByRole('button', { name: 'Submit' }).click();`
    },
    ubuntuTerminalCommands: [
      {
        command: 'npx playwright test tests/e2e/login.spec.ts --headed',
        description: 'Run the login test in a visible browser window on Ubuntu',
        expectedOutput: '1 passed (1.4s)'
      },
      {
        command: 'npx playwright codegen https://www.saucedemo.com',
        description: 'Launch the interactive Playwright test generator and locator inspector',
        expectedOutput: '[Playwright Inspector launched]'
      }
    ],
    drills: [
      {
        id: 'drill-2-1',
        moduleId: 'basics',
        drillNumber: '2.1',
        title: 'Spot the Anti-Patterns: Brittle Locators & Arbitrary Waits',
        type: 'spot-and-fix',
        prompt: `A junior QA wrote the following test for SauceDemo login. It has 3 severe issues:
1. Uses brittle CSS/XPath instead of web-first locators.
2. Uses the strictly forbidden \`waitForTimeout\` anti-pattern.
3. Contains a missing \`await\` keyword.

Refactor it to modern Playwright standards.`,
        starterCode: `import { test } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  
  // FIX ME: Brittle selector
  page.locator('#user-name').fill('standard_user');
  
  // FIX ME: Brittle selector and missing await
  page.locator('xpath=//*[@id="password"]').fill('secret_sauce');
  
  // FIX ME: FORBIDDEN anti-pattern
  await page.waitForTimeout(2000);
  
  // FIX ME: Brittle CSS selector
  await page.locator('.btn_action').click();
});`,
        hints: {
          tier1Concept: 'Playwright auto-waits for elements to become actionable. Hardcoded pauses waste CI minutes. Prefer `getByPlaceholder` and `getByRole`.',
          tier2Partial: 'Replace `.locator(#user-name)` with `getByPlaceholder("Username")`, remove `waitForTimeout`, and use `getByRole("button", { name: "Login" })`. Ensure every line is awaited.',
          tier3Solution: `import { test } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
});`
        },
        validation: {
          forbiddenKeywords: ['waitForTimeout', 'xpath', '#user-name', '.btn_action'],
          requiredKeywords: ['getByPlaceholder', 'getByRole', 'await page.goto'],
          solutionCode: `import { test } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
});`
        }
      },
      {
        id: 'drill-2-2',
        moduleId: 'basics',
        drillNumber: '2.2',
        title: 'Build from Scratch: The Internet Checkboxes',
        type: 'build-from-scratch',
        prompt: `Write a test that navigates to \`https://the-internet.herokuapp.com/checkboxes\`.
The page contains two checkbox inputs inside a form \`#checkboxes\`.
Requirements:
1. Locate checkbox 1 by role \`checkbox\` or label.
2. Check checkbox 1 using the \`.check()\` action.
3. Uncheck checkbox 2 using the \`.uncheck()\` action.
4. Do NOT use \`waitForTimeout\`. All actions must be properly awaited.`,
        starterCode: `import { test, expect } from '@playwright/test';

test('should toggle checkboxes', async ({ page }) => {
  // Your implementation here
});`,
        hints: {
          tier1Concept: 'Playwright has dedicated `.check()` and `.uncheck()` actions for checkboxes and radio buttons that verify element readiness automatically.',
          tier2Partial: 'Use `page.getByRole("checkbox").first()` or nth, or locate them through `page.getByRole("checkbox")`.',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('should toggle checkboxes', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  
  const checkbox1 = page.getByRole('checkbox').first();
  const checkbox2 = page.getByRole('checkbox').nth(1);

  await checkbox1.check();
  await checkbox2.uncheck();
});`
        },
        validation: {
          forbiddenKeywords: ['waitForTimeout'],
          requiredKeywords: ['check()', 'uncheck()', 'getByRole'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('should toggle checkboxes', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  
  const checkbox1 = page.getByRole('checkbox').first();
  const checkbox2 = page.getByRole('checkbox').nth(1);

  await checkbox1.check();
  await checkbox2.uncheck();
});`
        }
      },
      {
        id: 'drill-2-3',
        moduleId: 'basics',
        drillNumber: '2.3',
        title: 'Mastery Gate: SauceDemo Add-to-Cart Flow',
        type: 'build-from-scratch',
        isMasteryGate: true,
        prompt: `Write a complete test for SauceDemo in \`tests/e2e/inventory.spec.ts\`:
Scenario:
1. Navigate to \`/\`
2. Log in with \`standard_user\` and \`secret_sauce\`
3. Click "Add to cart" on the "Sauce Labs Backpack" item using a web-first locator.
4. Click the shopping cart link by role or accessible locator.
5. In your submission, explain in one sentence why \`page.getByRole('button', { name: 'Add to cart' })\` is more resilient than \`page.locator('#add-to-cart-sauce-labs-backpack')\`.`,
        starterCode: `import { test, expect } from '@playwright/test';

test('add backpack to cart', async ({ page }) => {
  // Implement full flow
});`,
        hints: {
          tier1Concept: 'Combine the login sequence with product selection using accessible roles and button labels.',
          tier2Partial: 'Log in, then click `page.getByRole("button", { name: "Add to cart" }).first()`, then click `page.locator(".shopping_cart_link")` or `page.getByRole("link")`.',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('add backpack to cart', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('.shopping_cart_link').click();
});`
        },
        validation: {
          forbiddenKeywords: ['waitForTimeout'],
          requiredKeywords: ['standard_user', 'secret_sauce', 'Add to cart', 'click()'],
          expectedExplanationKeywords: ['accessible', 'role', 'user', 'id', 'change', 'resilient', 'assistive'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('add backpack to cart', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('.shopping_cart_link').click();
});`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 2 No-Notes Checkpoint',
      scenario: 'Explain without notes how you would navigate to an e-commerce login page, fill email/password fields using accessibility-focused locators, submit, and click the first item in the catalog. Emphasize why wait statements are unnecessary.',
      successCriteria: [
        'Mentions getByPlaceholder or getByLabel for inputs',
        'Uses getByRole("button", { name: "..." }) for submission',
        'Highlights built-in auto-waiting for actionability (visible, stable, enabled)'
      ]
    }
  },
  {
    id: 'assertions',
    stage: 'Assertions',
    title: 'Module 3: Web-First Assertions & Auto-Retries',
    subtitle: 'Writing non-flaky assertions that automatically retry until the DOM settles',
    estimatedTime: '60 mins',
    targetApp: 'https://the-internet.herokuapp.com/dynamic_loading/1',
    theorySections: [
      {
        title: 'Auto-Retrying vs. Non-Retrying Assertions',
        content: `In standard testing libraries (Jest, Chai), an assertion checks the value once. If an animation is taking 200ms, the test fails immediately.

Playwright features **Web-First Assertions** via \`expect(locator)\`. These assertions automatically poll and retry until the expected condition is met, or the timeout (default 5s) expires!

Comparison:
- \`expect(await locator.isVisible()).toBe(true)\` ❌ DANGEROUS! Evaluates once immediately, no auto-retry.
- \`await expect(locator).toBeVisible()\` ✅ WEB-FIRST! Polls repeatedly until the element appears.`,
        codeSnippet: {
          language: 'typescript',
          caption: 'Auto-retrying assertions table',
          code: `// Auto-retrying Web-First Assertions (Always await expect(locator)):
await expect(page.getByRole('heading')).toHaveText('Welcome');
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('checkbox')).toBeChecked();
await expect(page).toHaveURL(/.*dashboard/);
await expect(page).toHaveTitle(/Store Catalog/);
await expect(page.getByTestId('cart-count')).toHaveText('1');

// Inverting assertions (also auto-retries!):
await expect(page.getByText('Loading...')).not.toBeVisible();`
        }
      }
    ],
    justInTimeTs: {
      concept: 'Regular Expressions (RegExp) in TypeScript',
      whyNow: 'URLs and dynamic headings often include session IDs or tokens. Using RegExp allows flexible pattern matching.',
      explanation: 'A regular expression in TypeScript is enclosed in slashes `/pattern/`. For example, `/.*inventory/` matches any string ending with "inventory".',
      codeExample: `// Exact string match (rigid)
await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

// Regular Expression match (flexible & environment-independent)
await expect(page).toHaveURL(/.*inventory.html/);`
    },
    ubuntuTerminalCommands: [
      {
        command: 'npx playwright test -g "assertions"',
        description: 'Run only tests matching the name "assertions"',
        expectedOutput: 'Running 3 tests using 3 workers\n  3 passed (2.1s)'
      }
    ],
    drills: [
      {
        id: 'drill-3-1',
        moduleId: 'assertions',
        drillNumber: '3.1',
        title: 'Spot the Flaky Assertion: Auto-Retry Violation',
        type: 'spot-and-fix',
        prompt: `Look at this test targeting dynamic loading. Why will it intermittently fail on slow CI runners, and how do you rewrite it to be web-first?`,
        starterCode: `import { test, expect } from '@playwright/test';

test('dynamic loading test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();

  // FIX ME: This evaluates synchronously once and does NOT auto-retry!
  const isVisible = await page.getByRole('heading', { name: 'Hello World!' }).isVisible();
  expect(isVisible).toBe(true);
});`,
        hints: {
          tier1Concept: 'Calling `await locator.isVisible()` returns a boolean immediately at that exact millisecond. The loading bar is still active, so it returns false and fails.',
          tier2Partial: 'Wrap the locator in `expect(locator)` and await the auto-retrying matcher `toBeVisible()`.',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('dynamic loading test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();
});`
        },
        validation: {
          forbiddenKeywords: ['isVisible()', 'toBe(true)'],
          requiredKeywords: ['await expect(', 'toBeVisible()'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('dynamic loading test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();
});`
        }
      },
      {
        id: 'drill-3-2',
        moduleId: 'assertions',
        drillNumber: '3.2',
        title: 'Mastery Gate: Negative Assertions & State Settling',
        type: 'build-from-scratch',
        isMasteryGate: true,
        prompt: `On \`https://the-internet.herokuapp.com/dynamic_loading/1\`:
1. Click the "Start" button.
2. Assert that the loading indicator (\`#loading\`) is visible initially or that it becomes NOT visible (\`not.toBeVisible()\`).
3. Assert that the heading "Hello World!" becomes visible and contains the exact text "Hello World!".
4. In your submission, explain why Playwright can assert \`not.toBeVisible()\` without race conditions.`,
        starterCode: `import { test, expect } from '@playwright/test';

test('verifies loading indicator disappears and heading displays', async ({ page }) => {
  // Write test
});`,
        hints: {
          tier1Concept: 'Auto-retrying assertions also work with `.not`. Playwright will wait until the loading bar is detached or hidden.',
          tier2Partial: 'Use `await expect(page.locator("#loading")).not.toBeVisible();` followed by `await expect(page.getByRole("heading", { name: "Hello World!" })).toHaveText("Hello World!");`',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('verifies loading indicator disappears and heading displays', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.locator('#loading')).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hello World!' })).toHaveText('Hello World!');
});`
        },
        validation: {
          requiredKeywords: ['not.toBeVisible', 'toHaveText', 'toBeVisible'],
          expectedExplanationKeywords: ['poll', 'retry', 'wait', 'condition', 'timeout', 'auto'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('verifies loading indicator disappears and heading displays', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
  await page.getByRole('button', { name: 'Start' }).click();

  await expect(page.locator('#loading')).not.toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hello World!' })).toHaveText('Hello World!');
});`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 3 No-Notes Checkpoint',
      scenario: 'You have a checkout form that submits an asynchronous payment order. State the difference between `expect(await page.locator(".success").count() > 0).toBe(true)` and `await expect(page.locator(".success")).toBeVisible()`.',
      successCriteria: [
        'Explains that count() > 0 evaluates immediately without polling',
        'Explains that toBeVisible() auto-retries until timeout',
        'Explains how this prevents timing bugs on network latency'
      ]
    }
  },
  {
    id: 'debugging',
    stage: 'Debugging',
    title: 'Module 4: Debugging — Trace Viewer, UI Mode & Error Stacks',
    subtitle: 'Mastering the time-travel debugger and diagnosing Ubuntu failures like a senior engineer',
    estimatedTime: '60 mins',
    targetApp: 'Ubuntu Terminal, Playwright UI Mode & Trace Viewer',
    theorySections: [
      {
        title: 'The Time-Traveling Trace Viewer',
        content: `Trace Viewer is Playwright's superpower. It captures full DOM snapshots before and after every action, exact network request/response timing waterfall, console logs, and action filmstrips.

Opening a trace on Ubuntu:
\`npx playwright show-trace test-results/.../trace.zip\`

In the Trace Viewer UI, you can:
1. Scrub through the timeline millisecond by millisecond.
2. Click any action to inspect the exact live DOM tree at that moment.
3. See exact network request headers and payload bodies.
4. Verify why a locator timed out or matched multiple elements.`,
        callout: {
          type: 'ubuntu',
          title: 'Running UI Mode on Ubuntu Desktop',
          text: 'If you are running on an Ubuntu desktop with a graphical session (GNOME), `npx playwright test --ui` gives you an interactive watch mode with locator playground, time travel, and watch filters.'
        }
      },
      {
        title: 'Reading Playwright Error Stacks',
        content: `When a Playwright test fails, it provides an actionable error report:
1. **Call log**: Every step Playwright attempted (waiting for selector, element found, checking if visible, checking if enabled, performing click).
2. **Timeout error**: "Timeout 30000ms exceeded while waiting for getByRole('button', { name: 'Submit' })".
3. **Strict mode violation**: "Error: strict mode violation: locator resolved to 3 elements". Playwright will refuse to guess which element you meant, forcing robust locators.`
      }
    ],
    justInTimeTs: {
      concept: 'Reading TypeScript Compilation Errors in Terminal',
      whyNow: 'Playwright compiles TypeScript before running. Syntax or typing mistakes are caught before the browser even opens.',
      explanation: 'Common errors like `Property "clck" does not exist on type "Locator". Did you mean "click"?` or `Argument of type "number" is not assignable to parameter of type "string"`. TypeScript protects you from silly typos at compile time.',
      codeExample: `// TS error caught at compile-time:
// await page.getByRole('button').clck(); 
// Error: TS2339: Property 'clck' does not exist on type 'Locator'. Did you mean 'click'?`
    },
    ubuntuTerminalCommands: [
      {
        command: 'npx playwright test --ui',
        description: 'Launch the interactive Playwright UI Mode for live debugging and watch-mode testing',
        expectedOutput: '[UI Mode launched at localhost]'
      },
      {
        command: 'npx playwright show-trace trace.zip',
        description: 'Open the standalone Trace Viewer for a failed CI or local run artifact',
        expectedOutput: '[Trace viewer opened in browser]'
      },
      {
        command: 'npx playwright test --debug',
        description: 'Run tests with the Playwright Inspector stepping through actions line by line',
        expectedOutput: '[Playwright Inspector paused on line 1]'
      }
    ],
    drills: [
      {
        id: 'drill-4-1',
        moduleId: 'debugging',
        drillNumber: '4.1',
        title: 'Error Decoding: Strict Mode Violation',
        type: 'spot-and-fix',
        prompt: `You run your suite on Ubuntu and receive this failure log:
\`\`\`
Error: strict mode violation: getByRole('button', { name: 'Delete' }) resolved to 5 elements:
  1) <button class="btn-delete">Delete</button> aka getByRole('row', { name: 'User 1' }).getByRole('button')
  2) <button class="btn-delete">Delete</button>
  3) <button class="btn-delete">Delete</button>
  ...
\`\`\`
1. Explain what Playwright Strict Mode means.
2. Fix the test code below so it specifically clicks the Delete button for "User 1".`,
        starterCode: `import { test, expect } from '@playwright/test';

test('delete specific user', async ({ page }) => {
  await page.goto('/users');
  
  // FIX ME: Currently causes strict mode violation
  await page.getByRole('button', { name: 'Delete' }).click();
});`,
        hints: {
          tier1Concept: 'Playwright locator actions enforce strict mode by default. If a locator matches more than one element, Playwright will throw an error rather than clicking an ambiguous element.',
          tier2Partial: 'Scope your locator to the row containing "User 1" using chaining or filtering: `page.getByRole("row", { name: "User 1" }).getByRole("button", { name: "Delete" })`.',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('delete specific user', async ({ page }) => {
  await page.goto('/users');
  
  await page.getByRole('row', { name: 'User 1' }).getByRole('button', { name: 'Delete' }).click();
});`
        },
        validation: {
          requiredKeywords: ['getByRole(\'row\'', 'User 1'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('delete specific user', async ({ page }) => {
  await page.goto('/users');
  
  await page.getByRole('row', { name: 'User 1' }).getByRole('button', { name: 'Delete' }).click();
});`
        }
      },
      {
        id: 'drill-4-2',
        moduleId: 'debugging',
        drillNumber: '4.2',
        title: 'Mastery Gate: Trace Analysis & Flakiness Diagnosis',
        type: 'explain-concept',
        isMasteryGate: true,
        prompt: `A test failed on GitHub Actions Ubuntu runner with:
"Timeout 30000ms exceeded while waiting for locator('button.submit-order')".
You download the \`trace.zip\` artifact and run \`npx playwright show-trace trace.zip\`.
In the Network tab of the trace, you see a POST request to \`/api/validate-cart\` returned HTTP 429 (Rate Limited).

Explain:
1. Why did the button never become actionable?
2. What feature of Trace Viewer allowed you to identify the root cause without having to reproduce it blindly?
3. How should this scenario be handled in modern test architecture?`,
        starterCode: `// Write your concise technical analysis and architectural fix:
// 1. Root cause:
// 2. Trace Viewer utility:
// 3. Architectural fix:`,
        hints: {
          tier1Concept: 'Connect the frontend UI state to the backend HTTP response. If the API failed with 429, the frontend never unlocked the submit button.',
          tier2Partial: 'The button remained disabled. Trace Viewer recorded the exact network waterfall and response status code 429. The fix involves either network mocking or backoff.',
          tier3Solution: `1. The button remained in a disabled state because the frontend form was waiting for the cart validation API call to succeed.
2. Trace Viewer recorded every network request and response body synchronized with DOM snapshots, exposing the 429 status.
3. Mock the rate-limited API route using page.route() in the test suite to insulate UI tests from external rate limits.`
        },
        validation: {
          requiredKeywords: ['429', 'network', 'disabled', 'mock', 'trace'],
          solutionCode: `1. The button remained disabled because /api/validate-cart returned 429.
2. Trace Viewer network waterfall revealed the exact HTTP status codes.
3. Isolate the test with page.route() mocking.`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 4 No-Notes Checkpoint',
      scenario: 'You are handed a failed test log with a locator timeout. Describe the step-by-step workflow on Ubuntu terminal to inspect the trace artifact and locate the exact network failure.',
      successCriteria: [
        'Mentions npx playwright show-trace path/to/trace.zip',
        'Explains inspecting the Network panel for 4xx/5xx responses',
        'Explains looking at DOM snapshot and Action Call log'
      ]
    }
  },
  {
    id: 'pom',
    stage: 'POM',
    title: 'Module 5: Page Object Model (POM) Refactoring',
    subtitle: 'Transforming procedural scripts into modular, maintainable, enterprise-grade architecture',
    estimatedTime: '75 mins',
    targetApp: 'https://www.saucedemo.com (Refactoring tests/e2e/)',
    theorySections: [
      {
        title: 'Why POM? Refactoring the Cumulative Project',
        content: `Up to this point, our tests directly invoked \`page.getByPlaceholder('Username').fill(...)\`.
What happens when your company has 80 test specs that log in, and the designer changes the login field?
You would have to edit 80 different files.

The **Page Object Model (POM)** encapsulates the UI structure and interactions of a specific page inside a dedicated TypeScript class:
1. **Locators as class properties** (initialized in the constructor using \`readonly\`).
2. **User action methods** (e.g. \`login(user, pass)\`, \`addItemToCart(name)\`).
3. **Tests become pure high-level business logic.**`,
        codeSnippet: {
          language: 'typescript',
          caption: 'pages/LoginPage.ts — Clean Page Object',
          code: `import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}`
        }
      }
    ],
    justInTimeTs: {
      concept: 'TypeScript Classes, Access Modifiers (`readonly`), and Types',
      whyNow: 'Page Objects are TypeScript classes. We use `readonly` and type imports (`type Page`, `type Locator`) to ensure locators cannot be accidentally mutated.',
      explanation: 'The `readonly` keyword prevents properties from being reassigned after construction. Using `type Page` imports only the interface for type checking, with zero runtime overhead.',
      codeExample: `export class InventoryPage {
  // readonly prevents accidental reassignment: this.title = somethingElse;
  readonly title: Locator;

  constructor(readonly page: Page) {
    this.title = page.getByText('Products');
  }
}`
    },
    ubuntuTerminalCommands: [
      {
        command: 'mkdir -p pages && touch pages/LoginPage.ts pages/InventoryPage.ts',
        description: 'Create the Page Object Model directories in our cumulative project',
        expectedOutput: ''
      },
      {
        command: 'npx playwright test tests/e2e/login.spec.ts',
        description: 'Run our refactored POM login test',
        expectedOutput: '1 passed (1.2s)'
      }
    ],
    drills: [
      {
        id: 'drill-5-1',
        moduleId: 'pom',
        drillNumber: '5.1',
        title: 'Build from Scratch: InventoryPage Class',
        type: 'build-from-scratch',
        prompt: `Create the \`InventoryPage\` class in \`pages/InventoryPage.ts\`.
Requirements:
1. Import \`type Page\` and \`type Locator\` from \`@playwright/test\`.
2. Define \`readonly page: Page\`, \`readonly title: Locator\`, and \`readonly cartBadge: Locator\`.
3. Locate \`title\` by text "Products".
4. Locate \`cartBadge\` using \`page.locator('.shopping_cart_badge')\`.
5. Add an async method \`addItemToCart(itemName: string)\` that locates the item card container and clicks its "Add to cart" button.`,
        starterCode: `import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  // Your implementation
}`,
        hints: {
          tier1Concept: 'Store locators as readonly class members. Methods encapsulate multi-step user actions.',
          tier2Partial: 'In `addItemToCart`, find the button with name "Add to cart" or filter by item name.',
          tier3Solution: `import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addItemToCart(itemName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }
}`
        },
        validation: {
          requiredKeywords: ['export class InventoryPage', 'readonly title: Locator', 'addItemToCart', 'filter'],
          solutionCode: `import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async addItemToCart(itemName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }
}`
        }
      },
      {
        id: 'drill-5-2',
        moduleId: 'pom',
        drillNumber: '5.2',
        title: 'Refactor Cumulative Test into POM',
        type: 'build-from-scratch',
        isMasteryGate: false,
        prompt: `Refactor our original \`tests/e2e/login.spec.ts\` to consume \`LoginPage\` and \`InventoryPage\`.
Requirements:
1. Import \`LoginPage\` and \`InventoryPage\`.
2. Instantiate them inside the test passing \`page\`.
3. Navigate using \`loginPage.goto()\`.
4. Call \`loginPage.login('standard_user', 'secret_sauce')\`.
5. Assert \`inventoryPage.title\` is visible.
6. Mastery Requirement: Explain why assertions should preferably remain inside the test file rather than hidden inside Page Object helper methods.`,
        starterCode: `import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test('login flow via Page Object Model', async ({ page }) => {
  // Your code
});`,
        hints: {
          tier1Concept: 'Page Objects provide the "What" (state and actions). The test spec provides the "Expectation" (asserting business intent).',
          tier2Partial: 'Instantiate `const loginPage = new LoginPage(page);` and call `await loginPage.login(...)`. Assert `expect(inventoryPage.title).toBeVisible()`.',
          tier3Solution: `import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test('login flow via Page Object Model', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(inventoryPage.title).toBeVisible();
});`
        },
        validation: {
          requiredKeywords: ['new LoginPage(page)', 'loginPage.goto()', 'loginPage.login', 'expect(inventoryPage.title).toBeVisible()'],
          expectedExplanationKeywords: ['assertion', 'test', 'readability', 'reuse', 'single responsibility', 'debugging', 'failure'],
          solutionCode: `import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test('login flow via Page Object Model', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(inventoryPage.title).toBeVisible();
});`
        }
      },
      {
        id: 'drill-5-3',
        moduleId: 'pom',
        drillNumber: '5.3',
        title: 'Spot and Fix: Page Object Anti-Patterns',
        type: 'spot-and-fix',
        prompt: `Refactor this flawed \`CartPage\` class to adhere strictly to Playwright POM principles:
1. Remove hardcoded assertions (\`expect(...)\`) from inside the page object methods.
2. Eliminate the brittle \`await this.page.waitForTimeout(2000)\` call—rely on Playwright's native auto-waiting.
3. Declare \`readonly checkoutButton: Locator\` in the constructor instead of calling \`page.getByRole()\` dynamically inside \`proceedToCheckout()\`.
4. Ensure \`removeItem(itemName: string)\` performs locator filtering and clicks without internal assertions.`,
        starterCode: `import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async removeItem(itemName: string) {
    // ANTI-PATTERN: waitForTimeout
    await this.page.waitForTimeout(2000);
    const item = this.page.locator('.cart_item').filter({ hasText: itemName });
    await item.getByRole('button', { name: 'Remove' }).click();
    // ANTI-PATTERN: Assertion buried inside Page Object
    await expect(item).not.toBeVisible();
  }

  async proceedToCheckout() {
    // ANTI-PATTERN: Locating elements on the fly instead of reusing constructor locators
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}`,
        hints: {
          tier1Concept: 'Page Objects must not contain expect() assertions or waitForTimeout(). Define locators in the constructor.',
          tier2Partial: 'Add `readonly checkoutButton: Locator;` to properties, assign `this.checkoutButton = page.getByRole(\'button\', { name: \'Checkout\' })`, and remove the expect() and waitForTimeout() from removeItem().',
          tier3Solution: `import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async removeItem(itemName: string) {
    await this.page
      .locator('.cart_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}`
        },
        validation: {
          forbiddenKeywords: ['waitForTimeout', 'expect('],
          requiredKeywords: ['readonly checkoutButton: Locator', 'this.checkoutButton = page.getByRole', 'this.checkoutButton.click()', 'removeItem'],
          solutionCode: `import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async removeItem(itemName: string) {
    await this.page
      .locator('.cart_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}`
        }
      },
      {
        id: 'drill-5-4',
        moduleId: 'pom',
        drillNumber: '5.4',
        title: 'Component Object Model: Header & Cart Badge',
        type: 'build-from-scratch',
        prompt: `Build a reusable Component Object \`HeaderComponent\` in \`components/HeaderComponent.ts\`.
In large-scale enterprise suites, persistent elements (header, navigation bar, footer) belong in modular Component Objects rather than duplicated across every page class.
Requirements:
1. Define \`HeaderComponent\` accepting \`page: Page\` in constructor.
2. Declare \`readonly menuButton: Locator\` locating the accessible button 'Open Menu'.
3. Declare \`readonly cartLink: Locator\` locating \`.shopping_cart_link\`.
4. Declare \`readonly cartBadge: Locator\` locating \`.shopping_cart_badge\`.
5. Add action method \`async openMenu()\` to click \`menuButton\`.
6. Add method \`async getCartCount(): Promise<number>\` that returns \`0\` if \`cartBadge\` is not visible, or parses its text as an integer using \`parseInt\`.`,
        starterCode: `import { type Page, type Locator } from '@playwright/test';

export class HeaderComponent {
  // Your implementation
}`,
        hints: {
          tier1Concept: 'A Component Object is structured like a Page Object, scoping controls to a reusable header/nav bar.',
          tier2Partial: 'In `getCartCount()`, check `if (await this.cartBadge.isVisible())` and return `parseInt(await this.cartBadge.innerText(), 10)` else `0`.',
          tier3Solution: `import { type Page, type Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.innerText();
      return parseInt(text, 10);
    }
    return 0;
  }
}`
        },
        validation: {
          forbiddenKeywords: ['waitForTimeout'],
          requiredKeywords: ['readonly menuButton: Locator', 'readonly cartBadge: Locator', 'openMenu', 'getCartCount', 'parseInt'],
          solutionCode: `import { type Page, type Locator } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async openMenu() {
    await this.menuButton.click();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.innerText();
      return parseInt(text, 10);
    }
    return 0;
  }
}`
        }
      },
      {
        id: 'drill-5-5',
        moduleId: 'pom',
        drillNumber: '5.5',
        title: 'Predict & Implement: Fluent Method Chaining & Page Transitions',
        type: 'predict',
        prompt: `In the Fluent Interface POM pattern, action methods that cause a page navigation return an instance of the destination Page Object.
Implement \`CheckoutStepOnePage\` so that calling \`submitInformation()\` fills the form, clicks continue, and returns a new instance of \`CheckoutStepTwoPage\`.
Requirements:
1. Declare \`readonly firstNameInput: Locator\`, \`readonly lastNameInput: Locator\`, \`readonly postalCodeInput: Locator\`, and \`readonly continueButton: Locator\`.
2. Implement \`async submitInformation(first: string, last: string, zip: string): Promise<CheckoutStepTwoPage>\`.
3. Inside \`submitInformation\`, fill the three inputs, click \`continueButton\`, and return \`new CheckoutStepTwoPage(this.page)\`.`,
        starterCode: `import { type Page, type Locator } from '@playwright/test';
import { CheckoutStepTwoPage } from './CheckoutStepTwoPage';

export class CheckoutStepOnePage {
  readonly page: Page;
  // Declare input locators and continueButton

  constructor(page: Page) {
    this.page = page;
    // Initialize locators
  }

  async submitInformation(first: string, last: string, zip: string): Promise<CheckoutStepTwoPage> {
    // Fill fields, click continue, and return next page object
  }
}`,
        hints: {
          tier1Concept: 'Fluent POM methods return the next Page Object: return new CheckoutStepTwoPage(this.page).',
          tier2Partial: 'Initialize inputs with page.getByPlaceholder() or page.getByLabel(). In submitInformation, call .fill(), .click(), and return new CheckoutStepTwoPage(this.page).',
          tier3Solution: `import { type Page, type Locator } from '@playwright/test';
import { CheckoutStepTwoPage } from './CheckoutStepTwoPage';

export class CheckoutStepOnePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async submitInformation(first: string, last: string, zip: string): Promise<CheckoutStepTwoPage> {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
    return new CheckoutStepTwoPage(this.page);
  }
}`
        },
        validation: {
          forbiddenKeywords: ['waitForTimeout'],
          requiredKeywords: ['Promise<CheckoutStepTwoPage>', 'new CheckoutStepTwoPage(this.page)', 'firstNameInput.fill', 'continueButton.click()'],
          solutionCode: `import { type Page, type Locator } from '@playwright/test';
import { CheckoutStepTwoPage } from './CheckoutStepTwoPage';

export class CheckoutStepOnePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async submitInformation(first: string, last: string, zip: string): Promise<CheckoutStepTwoPage> {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(zip);
    await this.continueButton.click();
    return new CheckoutStepTwoPage(this.page);
  }
}`
        }
      },
      {
        id: 'drill-5-6',
        moduleId: 'pom',
        drillNumber: '5.6',
        title: 'Mastery Gate: Dynamic Scoped Selectors & Parameterized POM Actions',
        type: 'build-from-scratch',
        isMasteryGate: true,
        prompt: `When testing catalogs, tables, or item lists, creating separate hardcoded locators for each individual product is unmaintainable. Instead, write parameterized locator helper methods in the Page Object that scope locators to matching containers.
Requirements:
1. In \`CartPage\`, implement \`getCartItem(itemName: string): Locator\` returning \`this.page.locator('.cart_item').filter({ hasText: itemName })\`.
2. Implement \`async getItemPrice(itemName: string): Promise<string>\` that chains from \`getCartItem(itemName)\` to find \`.inventory_item_price\` and returns its \`innerText()\`.
3. Implement \`async removeItem(itemName: string): Promise<void>\` that clicks the 'Remove' button inside that item's scoped locator.
4. Mastery Requirement: Explain why scoping locators via \`locator.filter({ hasText })\` or \`parentLocator.locator(child)\` is superior to concatenating dynamic XPath or string template selectors (like \`//div[text()="\${name}"]/../button\`).`,
        starterCode: `import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 1. Return a scoped Locator for the item row
  getCartItem(itemName: string): Locator {
    // Your code
  }

  // 2. Return the price string from the scoped item
  async getItemPrice(itemName: string): Promise<string> {
    // Your code
  }

  // 3. Click remove on the scoped item
  async removeItem(itemName: string): Promise<void> {
    // Your code
  }
}`,
        hints: {
          tier1Concept: 'getCartItem(name) returns a Locator without awaiting. Other methods chain directly from it: this.getCartItem(itemName).getByRole(\'button\', { name: \'Remove\' }).',
          tier2Partial: 'Use this.page.locator(\'.cart_item\').filter({ hasText: itemName }). For price, await this.getCartItem(itemName).locator(\'.inventory_item_price\').innerText().',
          tier3Solution: `import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getCartItem(itemName: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: itemName });
  }

  async getItemPrice(itemName: string): Promise<string> {
    const item = this.getCartItem(itemName);
    return await item.locator('.inventory_item_price').innerText();
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.getCartItem(itemName);
    await item.getByRole('button', { name: 'Remove' }).click();
  }
}`
        },
        validation: {
          forbiddenKeywords: ['waitForTimeout', '//'],
          requiredKeywords: ['getCartItem(itemName: string): Locator', 'filter({ hasText: itemName })', 'getItemPrice', 'removeItem', 'innerText()'],
          expectedExplanationKeywords: ['scoped', 'chain', 'brittle', 'xpath', 'auto-waiting', 'resilient', 'locator'],
          solutionCode: `import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getCartItem(itemName: string): Locator {
    return this.page.locator('.cart_item').filter({ hasText: itemName });
  }

  async getItemPrice(itemName: string): Promise<string> {
    const item = this.getCartItem(itemName);
    return await item.locator('.inventory_item_price').innerText();
  }

  async removeItem(itemName: string): Promise<void> {
    const item = this.getCartItem(itemName);
    await item.getByRole('button', { name: 'Remove' }).click();
  }
}`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 5 No-Notes Checkpoint',
      scenario: 'You are refactoring a 20-step checkout script into Page Objects. Describe how you structure the classes, what goes in the constructor, and where test assertions belong.',
      successCriteria: [
        'Explains locators stored in constructor with readonly',
        'Demonstrates action methods (fill, click) inside the Page class',
        'Confirms assertions belong in the test spec for clear reporting'
      ]
    }
  },
  {
    id: 'fixtures',
    stage: 'Fixtures',
    title: 'Module 6: Fixtures & Auth Bypass (storageState)',
    subtitle: 'Eliminating repetitive setup and logging in once for the entire test suite',
    estimatedTime: '75 mins',
    targetApp: 'https://www.saucedemo.com (Enterprise Auth Bypass)',
    theorySections: [
      {
        title: 'Custom Fixtures: Dependency Injection in Playwright',
        content: `Notice how in Module 5 we still had to write:
\`const loginPage = new LoginPage(page);\` at the top of every test.
Playwright solves this through **Fixtures**. Instead of repetitive instantiations or flaky \`beforeEach\` hooks, Playwright provides a declarative Dependency Injection system using \`test.extend<MyFixtures>()\`.

Benefits of Fixtures:
1. **Lazy evaluation**: Only initialized if the test explicitly requests it in its arguments \`({ loginPage })\`.
2. **Automatic cleanup**: Teardown logic runs automatically after the test finishes.
3. **Composability**: Fixtures can depend on other fixtures.`,
        codeSnippet: {
          language: 'typescript',
          caption: 'fixtures/test-base.ts — Enterprise Test Fixtures',
          code: `import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';`
        }
      },
      {
        title: 'Advanced Industry Scenario: Auth Bypass via storageState',
        content: `Logging in through the UI on all 200 tests in your suite wastes 15+ minutes of CI time.
In modern test automation, we log in **exactly once** in an \`auth.setup.ts\` project, save the browser's cookies and local storage to \`playwright/.auth/user.json\`, and configure all tests to boot pre-authenticated via \`storageState\`.`,
        codeSnippet: {
          language: 'typescript',
          caption: 'tests/auth.setup.ts — Authenticate Once',
          code: `import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate standard user', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*inventory.html/);
  // Persist session tokens and cookies
  await page.context().storageState({ path: authFile });
});`
        }
      }
    ],
    justInTimeTs: {
      concept: 'TypeScript Generics (`extend<T>`) and Tuples',
      whyNow: 'Playwright`s `base.extend<MyFixtures>()` uses TypeScript Generics to inject your custom fixture types into test signatures.',
      explanation: 'The `<AppFixtures>` syntax informs TypeScript: "Add these keys and types to the test context parameter". Now when you type `test("...", ({ loginPage }) => {})`, VS Code gives full auto-complete on `loginPage`!',
      codeExample: `type MyFixtures = {
  authToken: string;
};

export const test = base.extend<MyFixtures>({
  authToken: async ({}, use) => {
    await use('secret-jwt-token-123');
  }
});`
    },
    ubuntuTerminalCommands: [
      {
        command: 'mkdir -p playwright/.auth && npx playwright test --project=setup',
        description: 'Run the authentication setup project and generate storageState JSON',
        expectedOutput: '1 passed (0.9s)\nWrote auth file to playwright/.auth/user.json'
      }
    ],
    drills: [
      {
        id: 'drill-6-1',
        moduleId: 'fixtures',
        drillNumber: '6.1',
        title: 'Spot and Fix: Missing `use()` in Custom Fixture',
        type: 'spot-and-fix',
        prompt: `Look at this broken fixture definition. What happens when a test runs with this fixture, and why is the \`await use(...)\` call mandatory? Fix the code.`,
        starterCode: `import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }) => {
    const loginPage = new LoginPage(page);
    // BUG: Missing the fixture handover! Test hangs forever!
  },
});`,
        hints: {
          tier1Concept: 'Playwright fixtures pass control to the test via `await use(fixtureInstance)`. Code before `use` is setup; code after `use` is teardown.',
          tier2Partial: 'Call `await use(loginPage);` so Playwright hands the instance to the test body.',
          tier3Solution: `import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});`
        },
        validation: {
          requiredKeywords: ['await use(loginPage)'],
          solutionCode: `import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});`
        }
      },
      {
        id: 'drill-6-2',
        moduleId: 'fixtures',
        drillNumber: '6.2',
        title: 'Mastery Gate: Authenticated Inventory Spec with Fixtures',
        type: 'build-from-scratch',
        isMasteryGate: true,
        prompt: `Write a test that uses our custom fixture \`test\` from \`../fixtures/test-base\`.
Requirements:
1. Consume \`{ inventoryPage }\` directly from the fixture arguments.
2. Directly navigate to \`/inventory.html\` (assuming storageState is loaded).
3. Assert that the inventory title is visible.
4. Add the backpack item to the cart using the page object method \`addItemToCart\`.
5. Assert \`cartBadge\` has text "1".
6. Mastery Requirement: Explain how \`storageState\` prevents test dependencies and database pollution compared to sharing a live browser instance across tests.`,
        starterCode: `import { test, expect } from '../fixtures/test-base';

test('authenticated user adds item using custom fixture', async ({ inventoryPage }) => {
  // Write test
});`,
        hints: {
          tier1Concept: 'With storageState, each test gets its own isolated browser context initialized with the pre-baked cookies. They run independently and in parallel!',
          tier2Partial: 'Use `await inventoryPage.page.goto("/inventory.html");` then call `addItemToCart` and assert cartBadge.',
          tier3Solution: `import { test, expect } from '../fixtures/test-base';

test('authenticated user adds item using custom fixture', async ({ inventoryPage }) => {
  await inventoryPage.page.goto('/inventory.html');
  await expect(inventoryPage.title).toBeVisible();
  
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await expect(inventoryPage.cartBadge).toHaveText('1');
});`
        },
        validation: {
          requiredKeywords: ['inventoryPage.addItemToCart', 'toHaveText(\'1\')', 'toBeVisible()'],
          expectedExplanationKeywords: ['isolated', 'context', 'parallel', 'cookies', 'session', 'clean'],
          solutionCode: `import { test, expect } from '../fixtures/test-base';

test('authenticated user adds item using custom fixture', async ({ inventoryPage }) => {
  await inventoryPage.page.goto('/inventory.html');
  await expect(inventoryPage.title).toBeVisible();
  
  await inventoryPage.addItemToCart('Sauce Labs Backpack');
  await expect(inventoryPage.cartBadge).toHaveText('1');
});`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 6 No-Notes Checkpoint',
      scenario: 'Explain the difference between a beforeEach hook and a Playwright fixture. How does Playwright storageState work in playwright.config.ts dependency projects?',
      successCriteria: [
        'Explains fixtures are lazy-loaded and self-contained with teardown',
        'Explains auth setup project runs first, saves storageState JSON',
        'Explains worker contexts load storageState to bypass UI login'
      ]
    }
  },
  {
    id: 'api',
    stage: 'API',
    title: 'Module 7: API Mocking & Network Interception',
    subtitle: 'Controlling backend responses with page.route() to test edge cases, error codes, and speed up runs',
    estimatedTime: '75 mins',
    targetApp: 'https://demoqa.com/books & Network Mocking Scenarios',
    theorySections: [
      {
        title: 'The Power of page.route()',
        content: `End-to-end tests frequently depend on third-party APIs (payment processors, SMS gateways, slow microservices). When those services go down, your test suite turns red through no fault of your frontend.

Playwright provides native socket-level routing via \`page.route(urlPattern, handler)\`:
1. **Mock Responses**: Fulfill requests with mock JSON payloads instantly.
2. **Simulate Outages**: Return HTTP 500, 403, or 504 gateway timeouts.
3. **Modify Payloads**: Intercept real server responses and modify only specific fields.`,
        codeSnippet: {
          language: 'typescript',
          caption: 'tests/api/network-mock.spec.ts — Simulating a 500 Server Error',
          code: `import { test, expect } from '@playwright/test';

test('handles server 500 error gracefully on inventory fetch', async ({ page }) => {
  // 1. Intercept any call matching the API endpoint
  await page.route('**/api/inventory', async (route) => {
    // 2. Fulfill with simulated backend crash
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Database connection failed' }),
    });
  });

  // 3. Navigate and verify UI error banner
  await page.goto('/inventory');
  await expect(page.getByRole('alert')).toHaveText('Unable to load catalog. Please try again.');
});`
        }
      }
    ],
    justInTimeTs: {
      concept: 'JSON serialization (`JSON.stringify` & `JSON.parse`) and TypeScript Interfaces',
      whyNow: 'API payloads require typed JSON structures when mocking responses.',
      explanation: 'We declare a TypeScript interface (e.g. `interface Book { title: string; author: string; }`) to guarantee our mock payload adheres to the real backend schema.',
      codeExample: `interface ProductPayload {
  id: number;
  name: string;
  price: number;
}

const mockProduct: ProductPayload = {
  id: 99,
  name: 'Playwright Mastery Course',
  price: 0,
};`
    },
    ubuntuTerminalCommands: [
      {
        command: 'npx playwright test tests/api/network-mock.spec.ts',
        description: 'Execute our network mocking test suite',
        expectedOutput: '1 passed (0.8s)'
      }
    ],
    drills: [
      {
        id: 'drill-7-1',
        moduleId: 'api',
        drillNumber: '7.1',
        title: 'Build from Scratch: Mocking an Empty State Payload',
        type: 'build-from-scratch',
        prompt: `Write a test that intercepts \`**/api/books\` and returns an empty list \`[]\` with status 200.
Requirements:
1. Register \`page.route('**/api/books', ...)\`.
2. Fulfill with status 200, contentType \`'application/json'\`, and body \`JSON.stringify([])\`.
3. Navigate to \`https://demoqa.com/books\`.
4. Assert that a message "No rows found" or empty table is visible.`,
        starterCode: `import { test, expect } from '@playwright/test';

test('displays empty state when books API returns zero results', async ({ page }) => {
  // Your code
});`,
        hints: {
          tier1Concept: 'Always register route handlers BEFORE triggering the navigation or action that initiates the network request.',
          tier2Partial: 'Use `await page.route("**/api/books", async route => { await route.fulfill({...}); });` then `await page.goto(...)`.',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('displays empty state when books API returns zero results', async ({ page }) => {
  await page.route('**/api/books', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ books: [] }),
    });
  });

  await page.goto('https://demoqa.com/books');
  await expect(page.getByText('No rows found')).toBeVisible();
});`
        },
        validation: {
          requiredKeywords: ['page.route', 'route.fulfill', 'status: 200', 'JSON.stringify'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('displays empty state when books API returns zero results', async ({ page }) => {
  await page.route('**/api/books', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ books: [] }),
    });
  });

  await page.goto('https://demoqa.com/books');
  await expect(page.getByText('No rows found')).toBeVisible();
});`
        }
      },
      {
        id: 'drill-7-2',
        moduleId: 'api',
        drillNumber: '7.2',
        title: 'Mastery Gate: Modify Real API Response with `route.fetch()`',
        type: 'build-from-scratch',
        isMasteryGate: true,
        prompt: `Sometimes you want to test what happens when a real response has one specific field altered (e.g. VIP discount).
Write a route handler that:
1. Calls \`const response = await route.fetch();\` to fetch the real backend response.
2. Parses the JSON.
3. Overrides the first item's price to \`0.01\`.
4. Fulfills the route with the modified JSON.
5. Mastery Requirement: Explain why \`route.fetch()\` is superior to making a separate unintercepted axios/fetch request inside the test.`,
        starterCode: `import { test, expect } from '@playwright/test';

test('modifies real response using route.fetch', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    // 1. Fetch real response
    // 2. Parse and modify
    // 3. Fulfill with modified payload
  });
});`,
        hints: {
          tier1Concept: '`route.fetch()` forwards the browser request with all original session cookies, auth headers, and query parameters intact.',
          tier2Partial: 'Call `const response = await route.fetch(); const json = await response.json(); json[0].price = 0.01; await route.fulfill({ response, json });`',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('modifies real response using route.fetch', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json[0].price = 0.01;
    await route.fulfill({ response, json });
  });
});`
        },
        validation: {
          requiredKeywords: ['route.fetch()', 'response.json()', 'route.fulfill'],
          expectedExplanationKeywords: ['headers', 'cookies', 'auth', 'credentials', 'forward', 'seamless'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('modifies real response using route.fetch', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json[0].price = 0.01;
    await route.fulfill({ response, json });
  });
});`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 7 No-Notes Checkpoint',
      scenario: 'Describe how you would simulate a 504 Gateway Timeout on a payment endpoint `/api/charge` and verify that the UI displays a retry button.',
      successCriteria: [
        'Uses page.route("**/api/charge", ...)',
        'Fulfills with status: 504 and error body',
        'Asserts retry button is visible via getByRole("button", { name: "Retry" })'
      ]
    }
  },
  {
    id: 'cicd',
    stage: 'CI/CD',
    title: 'Module 8: CI/CD on Ubuntu & GitHub Actions',
    subtitle: 'Automating headless execution on GitHub-hosted Ubuntu runners with reports & artifacts',
    estimatedTime: '60 mins',
    targetApp: 'GitHub Actions (.github/workflows/playwright.yml)',
    theorySections: [
      {
        title: 'The Default GitHub Actions Pattern on Ubuntu',
        content: `Continuous Integration ensures every pull request runs your automated suite before merging.
Per modern best practices, we use a plain GitHub-hosted Ubuntu runner (\`ubuntu-latest\`):
1. Checkout code.
2. Setup Node.js with dependency caching.
3. \`npm ci\` (clean reproducible install).
4. \`npx playwright install --with-deps\` (installs browsers and Ubuntu system shared libraries).
5. \`npx playwright test\`.
6. Upload \`playwright-report/\` and \`test-results/\` as artifacts on failure.

Why start with plain Ubuntu runner before Docker?
GitHub-hosted runners boot in seconds, caching works seamlessly, and maintenance overhead is near-zero. Docker is an advanced tool reserved for strict pixel-perfect visual regression parity.`,
        codeSnippet: {
          language: 'yaml',
          caption: '.github/workflows/playwright.yml — Industry Standard Workflow',
          code: `name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers & OS Dependencies
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npx playwright test
      env:
        CI: true
        
    - uses: actions/upload-artifact@v4
    if: ` + '${{ !cancelled() }}' + `
    with:
      name: playwright-report
      path: playwright-report/
      retention-days: 30`
        }
      }
    ],
    justInTimeTs: {
      concept: 'CI Environment Variables (`process.env.CI`)',
      whyNow: 'Playwright detects `process.env.CI` to automatically enable `forbidOnly`, configure retry counts, and generate HTML reports.',
      explanation: 'GitHub Actions automatically sets `CI=true` in its environment. In our TypeScript code, we can adjust behavior based on this flag.',
      codeExample: `// Adjust workers dynamically based on CI environment variable:
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
});`
    },
    ubuntuTerminalCommands: [
      {
        command: 'mkdir -p .github/workflows && touch .github/workflows/playwright.yml',
        description: 'Create the GitHub Actions workflow file in the repository',
        expectedOutput: ''
      },
      {
        command: 'git status',
        description: 'Verify all project files, configs, and workflow are tracked',
        expectedOutput: 'On branch main\nUntracked files: .github/workflows/playwright.yml'
      }
    ],
    drills: [
      {
        id: 'drill-8-1',
        moduleId: 'cicd',
        drillNumber: '8.1',
        title: 'Spot and Fix: Missing CI Dependency Step',
        type: 'spot-and-fix',
        prompt: `A team deployed this GitHub Actions workflow on Ubuntu, and the run crashed on the test step with:
"Host system is missing dependencies to run browsers".
Identify what step is missing or wrong, and fix the workflow snippet.`,
        starterCode: `- name: Install dependencies
  run: npm ci

# FIX ME: Missing browser OS dependencies command
- name: Run Playwright tests
  run: npx playwright test`,
        hints: {
          tier1Concept: 'A fresh GitHub Ubuntu runner does not have browser binaries or their required C/C++ graphical dependencies pre-installed.',
          tier2Partial: 'Add a step with `npx playwright install --with-deps` before running the tests.',
          tier3Solution: `- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers and OS Dependencies
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test`
        },
        validation: {
          requiredKeywords: ['npx playwright install --with-deps'],
          solutionCode: `- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers and OS Dependencies
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test`
        }
      },
      {
        id: 'drill-8-2',
        moduleId: 'cicd',
        drillNumber: '8.2',
        title: 'Mastery Gate: Artifact Retention & Conditional Uploads',
        type: 'build-from-scratch',
        isMasteryGate: true,
        prompt: `Write the YAML step that uploads the \`playwright-report/\` folder as an artifact.
Requirements:
1. Use \`actions/upload-artifact@v4\`.
2. It must run even if tests failed (use 'if: ' + '\${{ !cancelled() }}').
3. Set \`name: playwright-report\` and \`path: playwright-report/\`.
4. Mastery Requirement: Explain why conditional upload is critical for a QA team investigating build breakages.`,
        starterCode: `- name: Upload Playwright Report
  # Your YAML definition here`,
        hints: {
          tier1Concept: 'By default, if a prior step fails (like `npx playwright test`), GitHub Actions cancels subsequent steps. Without a condition, you will never get the test report of the failure!',
          tier2Partial: 'Use if condition with not cancelled to ensure the artifact uploads whether the tests pass or fail.',
          tier3Solution: `- name: Upload Playwright Report
  uses: actions/upload-artifact@v4
  if: ` + '${{ !cancelled() }}' + `
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30`
        },
        validation: {
          requiredKeywords: ['actions/upload-artifact@v4', '!cancelled()', 'playwright-report/'],
          expectedExplanationKeywords: ['fail', 'subsequent', 'skip', 'artifact', 'debug', 'investigate'],
          solutionCode: `- name: Upload Playwright Report
  uses: actions/upload-artifact@v4
  if: ` + '${{ !cancelled() }}' + `
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 8 No-Notes Checkpoint',
      scenario: 'Explain the difference between running Playwright directly on a GitHub-hosted Ubuntu runner vs inside the official Microsoft Playwright Docker container (`mcr.microsoft.com/playwright`). When would you actually need Docker?',
      successCriteria: [
        'Explains plain runner is faster to boot and simpler to maintain',
        'Explains Docker guarantees identical OS font rendering and pixel-perfect screenshot parity',
        'Identifies visual regression testing as the primary reason for Docker'
      ]
    }
  },
  {
    id: 'capstone',
    stage: 'Capstone',
    title: 'Module 9: Capstone Portfolio Suite',
    subtitle: 'Bringing it all together: POM, Fixtures, Auth Bypass, Network Interception & CI Badge',
    estimatedTime: '90 mins',
    targetApp: 'Full Production Suite: SauceDemo & The Internet',
    theorySections: [
      {
        title: 'The Portfolio-Ready Capstone Architecture',
        content: `Congratulations on reaching the final milestone!
Your portfolio project demonstrates to hiring managers that you write enterprise-grade test automation:

Suite Deliverables:
1. **POM Architecture**: Clean separation between locators, action methods, and test specifications.
2. **Fixture-Driven**: Custom test fixtures with zero boilerplate.
3. **Auth Bypass**: Fast execution using \`storageState\`.
4. **Network Interception**: Mocking edge cases and server error states via \`page.route()\`.
5. **Complex UI**: Handling iframes, dialogs, or file downloads without brittle pauses.
6. **Green CI Pipeline**: Automated GitHub Actions badge on a public repository README.`,
        codeSnippet: {
          language: 'markdown',
          caption: 'README.md — Portfolio Capstone Presentation',
          code: `# Playwright & TypeScript Enterprise Automation Suite

[![Playwright Tests](https://github.com/your-username/playwright-capstone/actions/workflows/playwright.yml/badge.svg)](https://github.com/your-username/playwright-capstone/actions)

An enterprise end-to-end test automation framework built with Playwright and TypeScript, implementing the Page Object Model (POM), custom dependency-injected fixtures, authentication state bypass, network mocking, and automated GitHub Actions CI pipelines on Ubuntu.

## Architecture Highlights
- **Web-First Locators**: 100% adherence to accessible roles (\`getByRole\`, \`getByLabel\`).
- **Zero Flakiness**: Eliminates all arbitrary timeouts through auto-retrying web-first assertions.
- **Session State Reuse**: Authenticates once via \`auth.setup.ts\` and reuses \`storageState\`.
- **Network Isolation**: Edge cases mocked with \`page.route()\` and \`route.fulfill()\`.`
        }
      }
    ],
    justInTimeTs: {
      concept: 'Full TypeScript Strict Mode & Type Safety',
      whyNow: 'Production suites enable `"strict": true` in `tsconfig.json` to prevent any implicit `any` types.',
      explanation: 'Strict mode catches undefined checks, missing return types, and ensures your test suite is maintainable by entire QA teams.',
      codeExample: `// Strict TypeScript interface contract:
export interface UserCredentials {
  username: string;
  role: 'standard' | 'locked_out' | 'problem';
}`
    },
    ubuntuTerminalCommands: [
      {
        command: 'npx playwright test --reporter=html',
        description: 'Generate full HTML report of our complete capstone suite',
        expectedOutput: '12 passed (6.4s)\nTo open last HTML report run: npx playwright show-report'
      }
    ],
    drills: [
      {
        id: 'drill-9-1',
        moduleId: 'capstone',
        drillNumber: '9.1',
        title: 'Complex UI: Handling Browser Dialogs & Iframes',
        type: 'build-from-scratch',
        prompt: `On \`https://the-internet.herokuapp.com/javascript_alerts\`:
1. Register a dialog handler \`page.once('dialog', async dialog => { ... })\` that accepts the alert.
2. Click the button with accessible role \`button\` and name "Click for JS Alert".
3. Assert that the result element has text "You successfully clicked an alert".`,
        starterCode: `import { test, expect } from '@playwright/test';

test('handles native javascript alert dialog', async ({ page }) => {
  // Implement dialog listener and action
});`,
        hints: {
          tier1Concept: 'Playwright auto-dismisses dialogs by default. To accept or provide text, you must register a dialog listener before clicking the trigger.',
          tier2Partial: 'Use `page.once("dialog", dialog => dialog.accept());` then click the button.',
          tier3Solution: `import { test, expect } from '@playwright/test';

test('handles native javascript alert dialog', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  
  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});`
        },
        validation: {
          requiredKeywords: ['page.once(\'dialog\'', 'dialog.accept()', 'Click for JS Alert', 'toHaveText'],
          solutionCode: `import { test, expect } from '@playwright/test';

test('handles native javascript alert dialog', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  
  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Click for JS Alert' }).click();
  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
});`
        }
      },
      {
        id: 'drill-9-2',
        moduleId: 'capstone',
        drillNumber: '9.2',
        title: 'Mastery Gate & Capstone Defense: Architecture Review',
        type: 'explain-concept',
        isMasteryGate: true,
        prompt: `Defend your automated test architecture as if presenting to a Principal QA Architect:
1. Explain how Page Object Model + Custom Fixtures achieved DRY principles in our cumulative suite.
2. Explain the execution speed and reliability difference between UI login vs \`storageState\`.
3. Explain why web-first locators and web-first assertions guarantee that your GitHub Actions CI runs on Ubuntu stay green without arbitrary timeouts.`,
        starterCode: `// Capstone Architecture Defense:
// 1. POM + Fixtures:
// 2. StorageState Performance:
// 3. Web-First Reliability on CI:`,
        hints: {
          tier1Concept: 'Synthesize the three pillars of modern Playwright: Architecture (POM & Fixtures), Performance (StorageState), and Reliability (Web-First Locators & Assertions).',
          tier2Partial: 'Discuss encapsulation, lazy fixture injection, bypassing repetitive UI HTTP requests, and auto-waiting.',
          tier3Solution: `1. POM encapsulates DOM locators and page actions in classes, while Fixtures inject them lazily without boilerplate, ensuring changes only touch one file.
2. StorageState bypasses repetitive UI login steps, saving minutes of CI execution and isolating tests from authentication flakiness.
3. Web-first locators mimic accessible user behavior, and web-first assertions automatically poll and retry until the DOM settles, completely eliminating arbitrary sleep timeouts.`
        },
        validation: {
          requiredKeywords: ['encapsulat', 'fixture', 'storageState', 'auto-wait', 'retry', 'accessible'],
          solutionCode: `1. POM encapsulates locators and actions; Fixtures inject them lazily.
2. StorageState saves minutes of CI time and isolates test contexts.
3. Web-first locators and auto-retrying assertions eliminate sleep-based flakiness.`
        }
      }
    ],
    checkpointScenario: {
      title: 'Module 9 Capstone Checkpoint',
      scenario: 'You are submitting your repository link to a senior hiring manager. State the 5 core highlights in your README that prove your test engineering seniority.',
      successCriteria: [
        'Page Object Model + TypeScript strict typing',
        'Custom fixtures with automatic setup/teardown',
        'Auth bypass with storageState',
        'Network route mocking for failure injection',
        'Passing GitHub Actions workflow on Ubuntu with HTML artifact uploads'
      ]
    }
  }
];

export const CUMULATIVE_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'playwright.config.ts',
    description: 'Central test runner configuration, browser matrix, base URL, and trace policy',
    language: 'typescript',
    moduleIntroduced: 'Setup',
    content: `import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup project for authentication bypass
    {
      name: 'setup',
      testMatch: /.*\\.setup\\.ts/,
    },
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Load authenticated state once Module 6 is reached:
        // storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
  ],
});`
  },
  {
    path: 'package.json',
    description: 'Project manifest with dependencies and npm test scripts',
    language: 'json',
    moduleIntroduced: 'Setup',
    content: `{
  "name": "playwright-mastery-capstone",
  "version": "1.0.0",
  "description": "Enterprise Playwright & TypeScript test automation suite",
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@types/node": "^22.0.0",
    "typescript": "^5.6.0"
  }
}`
  },
  {
    path: 'pages/LoginPage.ts',
    description: 'Page Object for SauceDemo authentication page',
    language: 'typescript',
    moduleIntroduced: 'POM',
    refactorNote: 'Refactored from tests/e2e/login.spec.ts in Module 5',
    content: `import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}`
  },
  {
    path: 'pages/InventoryPage.ts',
    description: 'Page Object for SauceDemo product catalog and cart operations',
    language: 'typescript',
    moduleIntroduced: 'POM',
    refactorNote: 'Introduced in Module 5 to encapsulate inventory interactions',
    content: `import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartBadge: Locator;
  readonly shoppingCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByText('Products');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
  }

  async addItemToCart(itemName: string) {
    await this.page
      .locator('.inventory_item')
      .filter({ hasText: itemName })
      .getByRole('button', { name: 'Add to cart' })
      .click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }
}`
  },
  {
    path: 'fixtures/test-base.ts',
    description: 'Custom test runner fixture extending standard Playwright test with Page Objects',
    language: 'typescript',
    moduleIntroduced: 'Fixtures',
    refactorNote: 'Introduced in Module 6 to eliminate manual new Page() boilerplate',
    content: `import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// Declare custom fixture types
type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

// Extend base test with lazy-loaded fixtures
export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';`
  },
  {
    path: 'tests/auth.setup.ts',
    description: 'Global authentication setup project creating storageState session',
    language: 'typescript',
    moduleIntroduced: 'Fixtures',
    content: `import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate standard user', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*inventory.html/);

  // Save signed-in state to disk for reuse by all subsequent tests
  await page.context().storageState({ path: authFile });
});`
  },
  {
    path: 'tests/e2e/login.spec.ts',
    description: 'E2E login specifications refactored through POM & custom fixtures',
    language: 'typescript',
    moduleIntroduced: 'Basics',
    refactorNote: 'Originally procedural script in Module 2, refactored to POM in Module 5 and Fixtures in Module 6',
    content: `import { test, expect } from '../../fixtures/test-base';

test.describe('SauceDemo Authentication Flow', () => {
  test('standard user can log in and view product catalog', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(inventoryPage.title).toBeVisible();
    await expect(loginPage.page).toHaveURL(/.*inventory.html/);
  });

  test('displays error message when credentials are invalid', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('invalid_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });
});`
  },
  {
    path: 'tests/api/network-mock.spec.ts',
    description: 'Network route interception and failure simulation tests',
    language: 'typescript',
    moduleIntroduced: 'API',
    content: `import { test, expect } from '@playwright/test';

test.describe('API Mocking & Resilience', () => {
  test('handles 500 internal server error with user-friendly alert', async ({ page }) => {
    // Intercept catalog API call and simulate server failure
    await page.route('**/api/catalog', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Database Crash' }),
      });
    });

    await page.goto('/catalog');
    await expect(page.getByRole('alert')).toBeVisible();
  });
});`
  },
  {
    path: '.github/workflows/playwright.yml',
    description: 'Production GitHub Actions workflow for Ubuntu CI runner with HTML artifacts',
    language: 'yaml',
    moduleIntroduced: 'CI/CD',
    content: `name: Playwright CI Suite
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    name: Run Headless Tests on Ubuntu
    timeout-minutes: 30
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js LTS
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Browsers & Linux OS Dependencies
        run: npx playwright install --with-deps

      - name: Run Playwright Test Suite
        run: npx playwright test
        env:
          CI: true

      - name: Upload HTML Test Report Artifact
        uses: actions/upload-artifact@v4
        if: ` + '${{ !cancelled() }}' + `
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30`
  }
];
