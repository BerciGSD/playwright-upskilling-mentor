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
    "id": "setup",
    "stage": "Setup",
    "title": "Module 1: Setup & Ubuntu 24.04 Environment",
    "subtitle": "Laying your test automation foundation in Linux and VS Code",
    "estimatedTime": "45 mins",
    "targetApp": "Ubuntu Terminal & Local Node.js Runtime",
    "theorySections": [
      {
        "title": "The Modern Playwright Architecture",
        "content": "Playwright is an open-source test automation framework built by Microsoft. Unlike legacy tools (like Selenium WebDriver) that sent HTTP commands through browser drivers, Playwright communicates directly with browser rendering engines (Chromium, Firefox, and WebKit) via low-level WebSocket protocol connections (Chrome DevTools Protocol & internal browser channels).\n\nThis direct-pipe communication gives you:\n1. Zero flakiness from out-of-sync driver relays.\n2. Native support for multi-tabs, popups, worker threads, and iframes.\n3. True network request interception and mocking at the socket level.\n4. Auto-waiting on actionable elements before executing actions.",
        "callout": {
          "type": "ubuntu",
          "title": "Ubuntu 24.04 LTS Specifics",
          "text": "Ubuntu 24.04 (Noble Numbat) comes with Wayland display protocol by default. Playwright tests running headfully require Linux graphical libraries (libasound, libgbm, etc.). Always run `npx playwright install --with-deps` so Playwright pulls system packages via `apt` automatically."
        }
      },
      {
        "title": "Project Anatomy & playwright.config.ts",
        "content": "When you initialize a project using `npm init playwright@latest`, Playwright creates a minimal, battle-tested directory structure:\n\n- `playwright.config.ts`: The nerve center. Controls timeouts, parallel workers, browser matrix, base URLs, and test reporter configurations.\n- `package.json`: Declares `@playwright/test` and `typescript` dependencies.\n- `tests/`: Where your test specification files (`*.spec.ts`) reside.\n- `tests-examples/`: Demo tests (can be safely removed in our project).",
        "codeSnippet": {
          "language": "typescript",
          "caption": "playwright.config.ts — The production foundation",
          "code": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true, // Run test files in parallel across CPU cores\n  forbidOnly: !!process.env.CI, // Fail build if accidental test.only is committed\n  retries: process.env.CI ? 2 : 0, // Retry failed tests on CI runners\n  workers: process.env.CI ? 1 : undefined,\n  reporter: [['html', { open: 'never' }], ['list']],\n  \n  use: {\n    baseURL: 'https://www.saucedemo.com',\n    trace: 'on-first-retry', // Records execution trace with DOM snapshots on failure\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure',\n  },\n\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n    {\n      name: 'firefox',\n      use: { ...devices['Desktop Firefox'] },\n    },\n    {\n      name: 'webkit',\n      use: { ...devices['Desktop Safari'] },\n    },\n  ],\n});"
        }
      }
    ],
    "justInTimeTs": {
      "concept": "ES Modules & Configuration Typing",
      "whyNow": "Playwright configuration uses TypeScript exports (`defineConfig`) so VS Code can autocomplete every setting with zero guesswork.",
      "explanation": "In modern TypeScript, we import modules with `import { ... } from \"package\"` rather than old Node `require()`. Wrapping our config with `defineConfig({...})` enables compile-time type validation for all Playwright options.",
      "codeExample": "// Notice: defineConfig ensures your configuration keys are typo-free\nimport { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  timeout: 30_000, // TypeScript enforces number type here!\n});"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "node -v && npm -v",
        "description": "Verify Node.js (v18+ or v20+ recommended on Ubuntu 24.04)",
        "expectedOutput": "v20.12.0\n10.5.0"
      },
      {
        "command": "mkdir playwright-mastery && cd playwright-mastery && npm init -y",
        "description": "Initialize our cumulative root project directory",
        "expectedOutput": "Wrote to /home/ubuntu/playwright-mastery/package.json"
      },
      {
        "command": "npm init playwright@latest -- --yes --quiet",
        "description": "Scaffold Playwright with TypeScript and download core browser binaries",
        "expectedOutput": "✔ Success! Created a Playwright Test project at /home/ubuntu/playwright-mastery"
      },
      {
        "command": "npx playwright install --with-deps",
        "description": "Crucial on Ubuntu: installs native Linux shared system libraries required by Chromium/WebKit",
        "expectedOutput": "Installing dependencies for browsers... Done."
      },
      {
        "command": "npx playwright test",
        "description": "Run the default test suite headlessly across all configured browsers",
        "expectedOutput": "Running 6 tests using 4 workers\n  6 passed (4.2s)"
      }
    ],
    "drills": [
      {
        "id": "drill-1-1",
        "moduleId": "setup",
        "drillNumber": "1.1",
        "title": "Predict & Understand: Ubuntu Dependency Flag",
        "type": "predict",
        "prompt": "On your Ubuntu 24.04 machine, you clone a Playwright repository and run `npx playwright test`. You receive an error:\n\"Host system is missing dependencies to run browsers. Missing libraries: libasound2, libgbm1\".\n\nWhich single command resolves this on Ubuntu, and what does the `--with-deps` flag actually tell the system package manager to do?",
        "starterCode": "// Write the exact command and explain its Linux system action:\nconst command = \"npx playwright install --with-deps\";\n// Explanation:",
        "hints": {
          "tier1Concept": "Playwright headless and headed browser engines require Linux shared C libraries (.so files) that are not always bundled in standard desktop or server Ubuntu minimal installs.",
          "tier2Partial": "The command is `npx playwright install --with-deps`. It invokes `sudo apt-get install` internally for browser dependencies.",
          "tier3Solution": "Command: npx playwright install --with-deps\nExplanation: This command downloads the pinned browser binaries (Chromium, Firefox, WebKit) and automatically invokes Ubuntu's apt package manager to install required OS-level shared libraries (such as libasound, libgbm, libx11) needed to launch the browser engines."
        },
        "validation": {
          "requiredKeywords": [
            "--with-deps",
            "apt",
            "libraries"
          ],
          "solutionCode": "npx playwright install --with-deps\n// Invokes apt package manager to install missing Linux shared libraries."
        }
      },
      {
        "id": "drill-1-2",
        "moduleId": "setup",
        "drillNumber": "1.2",
        "title": "Spot and Fix: Risky playwright.config.ts",
        "type": "spot-and-fix",
        "prompt": "Review the flawed configuration snippet below. Identify the two major anti-patterns/bugs for an automated test setup, and fix them:\n1. What happens if a developer commits a forgotten `test.only` to GitHub CI?\n2. Why is hardcoding `workers: 1` on a powerful multi-core developer workstation undesirable?",
        "starterCode": "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  // BUG 1: test.only will pass on CI without warning\n  forbidOnly: false,\n  // BUG 2: unnecessarily restricts local CPU utilization\n  workers: 1,\n  use: {\n    baseURL: 'https://www.saucedemo.com',\n  },\n});",
        "hints": {
          "tier1Concept": "Continuous Integration environments require strict validation so one developer does not accidentally suppress the rest of the test suite.",
          "tier2Partial": "Set `forbidOnly: !!process.env.CI` and allow `workers` to be dynamic (e.g., `process.env.CI ? 1 : undefined`).",
          "tier3Solution": "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  forbidOnly: !!process.env.CI,\n  workers: process.env.CI ? 1 : undefined,\n  use: {\n    baseURL: 'https://www.saucedemo.com',\n  },\n});"
        },
        "validation": {
          "requiredKeywords": [
            "forbidOnly: !!process.env.CI",
            "process.env.CI ? 1 : undefined"
          ],
          "solutionCode": "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  forbidOnly: !!process.env.CI,\n  workers: process.env.CI ? 1 : undefined,\n  use: {\n    baseURL: 'https://www.saucedemo.com',\n  },\n});"
        }
      },
      {
        "id": "drill-1-3",
        "moduleId": "setup",
        "drillNumber": "1.3",
        "title": "Build from Scratch: Multi-Browser Device Matrix & BaseURL Config",
        "type": "build-from-scratch",
        "prompt": "Configure `playwright.config.ts` with a multi-browser project matrix and base URL.\nRequirements:\n1. Import `defineConfig` and `devices` from `@playwright/test`.\n2. Configure `testDir: './tests'`.\n3. Set `use: { baseURL: 'https://www.saucedemo.com' }`.\n4. Configure 3 browser projects: `chromium` (using `devices['Desktop Chrome']`), `firefox` (using `devices['Desktop Firefox']`), and `webkit` (using `devices['Desktop Safari']`).",
        "starterCode": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  // Your code here\n});",
        "hints": {
          "tier1Concept": "Playwright projects allow you to run the same test suite across Chromium, Firefox, and WebKit without modifying spec files.",
          "tier2Partial": "Spread the device preset inside `use: { ...devices[\"Desktop Chrome\"] }` for each named project.",
          "tier3Solution": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  use: {\n    baseURL: 'https://www.saucedemo.com',\n  },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'webkit', use: { ...devices['Desktop Safari'] } },\n  ],\n});"
        },
        "validation": {
          "requiredKeywords": [
            "baseURL",
            "Desktop Chrome",
            "Desktop Firefox",
            "Desktop Safari",
            "projects"
          ],
          "solutionCode": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  use: {\n    baseURL: 'https://www.saucedemo.com',\n  },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'webkit', use: { ...devices['Desktop Safari'] } },\n  ],\n});"
        }
      },
      {
        "id": "drill-1-4",
        "moduleId": "setup",
        "drillNumber": "1.4",
        "title": "Spot and Fix: Headless vs Headed Execution & CLI Flags",
        "type": "spot-and-fix",
        "prompt": "A developer wants to run Playwright tests locally on Ubuntu and visually inspect the browser while debugging an issue in Chromium only.\nThey ran `npx playwright test --headless --all` which ran headless across all browsers and exited before they could see anything.\n\nFix the command line invocation so it:\n1. Runs in headed mode with visible browser UI.\n2. Filters execution specifically to the `chromium` project.",
        "starterCode": "// Fix the CLI command for headed Chromium execution:\nconst runCommand = \"npx playwright test --headless --all\";",
        "hints": {
          "tier1Concept": "Playwright runs tests headlessly by default. Use `--headed` to display the browser window and `--project=<name>` to target a single browser.",
          "tier2Partial": "Replace `--headless --all` with `--headed --project=chromium`.",
          "tier3Solution": "const runCommand = \"npx playwright test --project=chromium --headed\";"
        },
        "validation": {
          "requiredKeywords": [
            "--headed",
            "--project=chromium"
          ],
          "solutionCode": "const runCommand = \"npx playwright test --project=chromium --headed\";"
        }
      },
      {
        "id": "drill-1-5",
        "moduleId": "setup",
        "drillNumber": "1.5",
        "title": "Mastery Gate: Complete Enterprise playwright.config.ts",
        "type": "build-from-scratch",
        "isMasteryGate": true,
        "prompt": "Write our cumulative project's complete `playwright.config.ts` from scratch.\nRequirements:\n1. Import `defineConfig` and `devices` from `@playwright/test`.\n2. Configure `testDir` to `'./tests'`.\n3. Enable `fullyParallel: true`.\n4. Set `forbidOnly: !!process.env.CI`.\n5. Under `use`, set `baseURL: 'https://www.saucedemo.com'`, `trace: 'on-first-retry'`, and `screenshot: 'only-on-failure'`.\n6. Define three projects: `chromium`, `firefox`, and `webkit` using `devices`.\n\nMastery Requirement: Explain in your own words why setting `trace: 'on-first-retry'` is superior to running traces on every passing test.",
        "starterCode": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  // Your code here\n});",
        "hints": {
          "tier1Concept": "Playwright traces record entire DOM snapshots, console logs, and network packets. Generating them on thousands of passing tests consumes huge disk space and slows CI execution.",
          "tier2Partial": "Use `trace: \"on-first-retry\"` so you only pay the performance cost when a test actually fails and is retried.",
          "tier3Solution": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  use: {\n    baseURL: 'https://www.saucedemo.com',\n    trace: 'on-first-retry',\n    screenshot: 'only-on-failure',\n  },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'webkit', use: { ...devices['Desktop Safari'] } },\n  ],\n});"
        },
        "validation": {
          "requiredKeywords": [
            "fullyParallel",
            "on-first-retry",
            "Desktop Chrome",
            "Desktop Firefox",
            "Desktop Safari",
            "baseURL"
          ],
          "expectedExplanationKeywords": [
            "disk",
            "performance",
            "slow",
            "space",
            "retry",
            "fail",
            "overhead"
          ],
          "solutionCode": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  use: {\n    baseURL: 'https://www.saucedemo.com',\n    trace: 'on-first-retry',\n    screenshot: 'only-on-failure',\n  },\n  projects: [\n    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },\n    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },\n    { name: 'webkit', use: { ...devices['Desktop Safari'] } },\n  ],\n});"
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 1 No-Notes Checkpoint",
      "scenario": "You are on an Ubuntu 24.04 cloud VM. Without consulting references, explain how you would initialize a brand-new Playwright TypeScript repository, configure base URL and trace collection, install the Linux headless dependencies, and execute tests across Chromium and Firefox.",
      "successCriteria": [
        "States npm init playwright@latest with TypeScript option",
        "Includes npx playwright install --with-deps for Linux dependencies",
        "Specifies trace: \"on-first-retry\" and baseURL in playwright.config.ts",
        "Runs npx playwright test --project=chromium,firefox"
      ]
    }
  },
  {
    "id": "basics",
    "stage": "Basics",
    "title": "Module 2: Basics — Web-First Locators & Actions",
    "subtitle": "Interacting with real web apps like a human user without brittle selectors",
    "estimatedTime": "60 mins",
    "targetApp": "https://www.saucedemo.com & https://the-internet.herokuapp.com",
    "theorySections": [
      {
        "title": "Web-First Locators: The Gold Standard",
        "content": "Playwright introduced a revolutionary philosophy: locate elements the same way assistive technologies and real human users find them — by accessible role, visible text, or semantic form labels.\n\nHierarchy of Locator Preference:\n1. `page.getByRole('button', { name: 'Login' })` (Accessible Role + Accessible Name) — #1 PREFERRED\n2. `page.getByLabel('Username')` (Associated Form Label) — #2 PREFERRED\n3. `page.getByPlaceholder('Enter your username')` (Input placeholder)\n4. `page.getByText('Products')` (Visible non-interactive text)\n5. `page.getByTestId('submit-btn')` (Resilient QA attribute)\n6. `page.locator('css or xpath')` — STRICTLY FALLBACK ONLY!\n\nWhy avoid XPath and nested CSS like `div > div.col-md-4:nth-child(2) > button`?\nBecause the moment a frontend designer wraps that button in a flexbox `<div>`, your entire test suite breaks. Accessible roles remain resilient.",
        "codeSnippet": {
          "language": "typescript",
          "caption": "tests/e2e/login.spec.ts — Cumulative Project Initial Test",
          "code": "import { test, expect } from '@playwright/test';\n\ntest('standard user can log in to SauceDemo successfully', async ({ page }) => {\n  // 1. Navigate using the configured baseURL\n  await page.goto('/');\n\n  // 2. Locate inputs by label/placeholder using web-first locators\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n\n  // 3. Click the login button by accessible role\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  // 4. Assert URL and visible heading\n  await expect(page).toHaveURL(/.*inventory.html/);\n  await expect(page.getByText('Products')).toBeVisible();\n});"
        },
        "callout": {
          "type": "warning",
          "title": "The Anti-Pattern Ban: waitForTimeout()",
          "text": "Playwright automatically waits for elements to be attached, visible, stable, enabled, and editable before clicking or typing. NEVER use `page.waitForTimeout(3000)`. It slows test runs, causes arbitrary CI flakiness, and violates modern test automation craftsmanship."
        }
      }
    ],
    "justInTimeTs": {
      "concept": "async / await and Promises",
      "whyNow": "Browsers run asynchronously. Every interaction with a web page (`goto`, `click`, `fill`, `expect`) takes time over the network or rendering engine.",
      "explanation": "In JavaScript/TypeScript, asynchronous functions return a `Promise`. The `await` keyword pauses execution of the test until that specific browser operation completes before moving to the next line. Missing an `await` causes tests to finish prematurely with unhandled promise rejections!",
      "codeExample": "// Bad: Missing await causes race condition\npage.goto('/'); \n\n// Correct: Always await asynchronous Playwright methods\nawait page.goto('/');\nawait page.getByRole('button', { name: 'Submit' }).click();"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "npx playwright test tests/e2e/login.spec.ts --headed",
        "description": "Run the login test in a visible browser window on Ubuntu",
        "expectedOutput": "1 passed (1.4s)"
      },
      {
        "command": "npx playwright codegen https://www.saucedemo.com",
        "description": "Launch the interactive Playwright test generator and locator inspector",
        "expectedOutput": "[Playwright Inspector launched]"
      }
    ],
    "drills": [
      {
        "id": "drill-2-1",
        "moduleId": "basics",
        "drillNumber": "2.1",
        "title": "Spot the Anti-Patterns: Brittle Locators & Arbitrary Waits",
        "type": "spot-and-fix",
        "prompt": "A junior QA wrote the following test for SauceDemo login. It has 3 severe issues:\n1. Uses brittle CSS/XPath instead of web-first locators.\n2. Uses the strictly forbidden `waitForTimeout` anti-pattern.\n3. Contains a missing `await` keyword.\n\nRefactor it to modern Playwright standards.",
        "starterCode": "import { test } from '@playwright/test';\n\ntest('login test', async ({ page }) => {\n  await page.goto('https://www.saucedemo.com');\n  \n  // FIX ME: Brittle selector\n  page.locator('#user-name').fill('standard_user');\n  \n  // FIX ME: Brittle selector and missing await\n  page.locator('xpath=//*[@id=\"password\"]').fill('secret_sauce');\n  \n  // FIX ME: FORBIDDEN anti-pattern\n  await page.waitForTimeout(2000);\n  \n  // FIX ME: Brittle CSS selector\n  await page.locator('.btn_action').click();\n});",
        "hints": {
          "tier1Concept": "Playwright auto-waits for elements to become actionable. Hardcoded pauses waste CI minutes. Prefer `getByPlaceholder` and `getByRole`.",
          "tier2Partial": "Replace `.locator(#user-name)` with `getByPlaceholder(\"Username\")`, remove `waitForTimeout`, and use `getByRole(\"button\", { name: \"Login\" })`. Ensure every line is awaited.",
          "tier3Solution": "import { test } from '@playwright/test';\n\ntest('login test', async ({ page }) => {\n  await page.goto('https://www.saucedemo.com');\n  \n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout",
            "xpath",
            "#user-name",
            ".btn_action"
          ],
          "requiredKeywords": [
            "getByPlaceholder",
            "getByRole",
            "await page.goto"
          ],
          "solutionCode": "import { test } from '@playwright/test';\n\ntest('login test', async ({ page }) => {\n  await page.goto('https://www.saucedemo.com');\n  \n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n});"
        }
      },
      {
        "id": "drill-2-2",
        "moduleId": "basics",
        "drillNumber": "2.2",
        "title": "Build from Scratch: The Internet Checkboxes",
        "type": "build-from-scratch",
        "prompt": "Write a test that navigates to `https://the-internet.herokuapp.com/checkboxes`.\nThe page contains two checkbox inputs inside a form `#checkboxes`.\nRequirements:\n1. Locate checkbox 1 by role `checkbox` or label.\n2. Check checkbox 1 using the `.check()` action.\n3. Uncheck checkbox 2 using the `.uncheck()` action.\n4. Do NOT use `waitForTimeout`. All actions must be properly awaited.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('should toggle checkboxes', async ({ page }) => {\n  // Your implementation here\n});",
        "hints": {
          "tier1Concept": "Playwright has dedicated `.check()` and `.uncheck()` actions for checkboxes and radio buttons that verify element readiness automatically.",
          "tier2Partial": "Use `page.getByRole(\"checkbox\").first()` or nth, or locate them through `page.getByRole(\"checkbox\")`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('should toggle checkboxes', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/checkboxes');\n  \n  const checkbox1 = page.getByRole('checkbox').first();\n  const checkbox2 = page.getByRole('checkbox').nth(1);\n\n  await checkbox1.check();\n  await checkbox2.uncheck();\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "check()",
            "uncheck()",
            "getByRole"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('should toggle checkboxes', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/checkboxes');\n  \n  const checkbox1 = page.getByRole('checkbox').first();\n  const checkbox2 = page.getByRole('checkbox').nth(1);\n\n  await checkbox1.check();\n  await checkbox2.uncheck();\n});"
        }
      },
      {
        "id": "drill-2-3",
        "moduleId": "basics",
        "drillNumber": "2.3",
        "title": "Build from Scratch: Select Dropdown & Dynamic Option Selection",
        "type": "build-from-scratch",
        "prompt": "Write a test that navigates to `https://the-internet.herokuapp.com/dropdown`.\nRequirements:\n1. Locate the dropdown select element using `page.locator('#dropdown')` or accessible role.\n2. Use Playwright's native `.selectOption()` method to select \"Option 2\" by value or label (`{ label: 'Option 2' }`).\n3. Assert that the selected option has value `\"2\"` using `await expect(dropdown).toHaveValue('2')`.\n4. Do NOT use arbitrary sleeps (`waitForTimeout`).",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('select option from dropdown', async ({ page }) => {\n  // Your implementation here\n});",
        "hints": {
          "tier1Concept": "Playwright has native `.selectOption()` which triggers native change and input events safely without raw click chains.",
          "tier2Partial": "Call `await dropdown.selectOption({ label: \"Option 2\" });` then assert `await expect(dropdown).toHaveValue(\"2\");`",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('select option from dropdown', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dropdown');\n  \n  const dropdown = page.locator('#dropdown');\n  await dropdown.selectOption({ label: 'Option 2' });\n  await expect(dropdown).toHaveValue('2');\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "selectOption",
            "toHaveValue",
            "dropdown"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('select option from dropdown', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dropdown');\n  \n  const dropdown = page.locator('#dropdown');\n  await dropdown.selectOption({ label: 'Option 2' });\n  await expect(dropdown).toHaveValue('2');\n});"
        }
      },
      {
        "id": "drill-2-4",
        "moduleId": "basics",
        "drillNumber": "2.4",
        "title": "Predict & Implement: Locator Chaining and Container Filtering",
        "type": "predict",
        "prompt": "On SauceDemo inventory page (`/inventory.html`), there are 6 item cards with class `.inventory_item`.\nWrite the locator expression that filters for the specific card containing the text `'Sauce Labs Backpack'` and clicks its 'Add to cart' button.\n\nExplain why using `.filter({ hasText: '...' })` is far more robust than selecting by index `.nth(0)`.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('add specific item using locator filtering', async ({ page }) => {\n  await page.goto('/inventory.html');\n  \n  // Write the filtered locator and click action:\n  \n  // Explanation of filter vs nth(0):\n});",
        "hints": {
          "tier1Concept": "Locator filtering scopes query operations inside matching parent containers, insulating against catalog re-ordering or sorting changes.",
          "tier2Partial": "Use `page.locator(\".inventory_item\").filter({ hasText: \"Sauce Labs Backpack\" }).getByRole(\"button\", { name: \"Add to cart\" }).click();`",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('add specific item using locator filtering', async ({ page }) => {\n  await page.goto('/inventory.html');\n  \n  await page\n    .locator('.inventory_item')\n    .filter({ hasText: 'Sauce Labs Backpack' })\n    .getByRole('button', { name: 'Add to cart' })\n    .click();\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "filter({ hasText:",
            "Add to cart",
            "click()"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('add specific item using locator filtering', async ({ page }) => {\n  await page.goto('/inventory.html');\n  \n  await page\n    .locator('.inventory_item')\n    .filter({ hasText: 'Sauce Labs Backpack' })\n    .getByRole('button', { name: 'Add to cart' })\n    .click();\n});"
        }
      },
      {
        "id": "drill-2-5",
        "moduleId": "basics",
        "drillNumber": "2.5",
        "title": "Mastery Gate: SauceDemo Complete E2E Add-to-Cart Flow",
        "type": "build-from-scratch",
        "isMasteryGate": true,
        "prompt": "Write a complete end-to-end test for SauceDemo in `tests/e2e/inventory.spec.ts`:\nScenario:\n1. Navigate to `/`\n2. Log in with `standard_user` and `secret_sauce` using user-facing placeholder locators.\n3. Click \"Add to cart\" on the \"Sauce Labs Backpack\" item using a web-first locator.\n4. Click the shopping cart link by role or accessible locator.\n5. In your submission, explain in one sentence why `page.getByRole('button', { name: 'Add to cart' })` is more resilient than `page.locator('#add-to-cart-sauce-labs-backpack')`.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('add backpack to cart and navigate to cart', async ({ page }) => {\n  // Implement full flow\n});",
        "hints": {
          "tier1Concept": "Combine the login sequence with product selection using accessible roles and button labels.",
          "tier2Partial": "Log in, then click `page.getByRole(\"button\", { name: \"Add to cart\" }).first()`, then click `page.locator(\".shopping_cart_link\")` or `page.getByRole(\"link\")`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('add backpack to cart and navigate to cart', async ({ page }) => {\n  await page.goto('/');\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await page.getByRole('button', { name: 'Add to cart' }).first().click();\n  await page.locator('.shopping_cart_link').click();\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "standard_user",
            "secret_sauce",
            "Add to cart",
            "click()"
          ],
          "expectedExplanationKeywords": [
            "accessible",
            "role",
            "user",
            "id",
            "change",
            "resilient",
            "assistive"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('add backpack to cart and navigate to cart', async ({ page }) => {\n  await page.goto('/');\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await page.getByRole('button', { name: 'Add to cart' }).first().click();\n  await page.locator('.shopping_cart_link').click();\n});"
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 2 No-Notes Checkpoint",
      "scenario": "Explain without notes how you would navigate to an e-commerce login page, fill email/password fields using accessibility-focused locators, submit, and click the first item in the catalog. Emphasize why wait statements are unnecessary.",
      "successCriteria": [
        "Mentions getByPlaceholder or getByLabel for inputs",
        "Uses getByRole(\"button\", { name: \"...\" }) for submission",
        "Highlights built-in auto-waiting for actionability (visible, stable, enabled)"
      ]
    }
  },
  {
    "id": "assertions",
    "stage": "Assertions",
    "title": "Module 3: Web-First Assertions & Auto-Retries",
    "subtitle": "Writing non-flaky assertions that automatically retry until the DOM settles",
    "estimatedTime": "60 mins",
    "targetApp": "https://the-internet.herokuapp.com/dynamic_loading/1",
    "theorySections": [
      {
        "title": "Auto-Retrying vs. Non-Retrying Assertions",
        "content": "In standard testing libraries (Jest, Chai), an assertion checks the value once. If an animation is taking 200ms, the test fails immediately.\n\nPlaywright features **Web-First Assertions** via `expect(locator)`. These assertions automatically poll and retry until the expected condition is met, or the timeout (default 5s) expires!\n\nComparison:\n- `expect(await locator.isVisible()).toBe(true)` ❌ DANGEROUS! Evaluates once immediately, no auto-retry.\n- `await expect(locator).toBeVisible()` ✅ WEB-FIRST! Polls repeatedly until the element appears.",
        "codeSnippet": {
          "language": "typescript",
          "caption": "Auto-retrying assertions table",
          "code": "// Auto-retrying Web-First Assertions (Always await expect(locator)):\nawait expect(page.getByRole('heading')).toHaveText('Welcome');\nawait expect(page.getByRole('button')).toBeEnabled();\nawait expect(page.getByRole('checkbox')).toBeChecked();\nawait expect(page).toHaveURL(/.*dashboard/);\nawait expect(page).toHaveTitle(/Store Catalog/);\nawait expect(page.getByTestId('cart-count')).toHaveText('1');\n\n// Inverting assertions (also auto-retries!):\nawait expect(page.getByText('Loading...')).not.toBeVisible();"
        }
      }
    ],
    "justInTimeTs": {
      "concept": "Regular Expressions (RegExp) in TypeScript",
      "whyNow": "URLs and dynamic headings often include session IDs or tokens. Using RegExp allows flexible pattern matching.",
      "explanation": "A regular expression in TypeScript is enclosed in slashes `/pattern/`. For example, `/.*inventory/` matches any string ending with \"inventory\".",
      "codeExample": "// Exact string match (rigid)\nawait expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');\n\n// Regular Expression match (flexible & environment-independent)\nawait expect(page).toHaveURL(/.*inventory.html/);"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "npx playwright test -g \"assertions\"",
        "description": "Run only tests matching the name \"assertions\"",
        "expectedOutput": "Running 3 tests using 3 workers\n  3 passed (2.1s)"
      }
    ],
    "drills": [
      {
        "id": "drill-3-1",
        "moduleId": "assertions",
        "drillNumber": "3.1",
        "title": "Spot the Flaky Assertion: Auto-Retry Violation",
        "type": "spot-and-fix",
        "prompt": "Look at this test targeting dynamic loading. Why will it intermittently fail on slow CI runners, and how do you rewrite it to be web-first?",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('dynamic loading test', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');\n  await page.getByRole('button', { name: 'Start' }).click();\n\n  // FIX ME: This evaluates synchronously once and does NOT auto-retry!\n  const isVisible = await page.getByRole('heading', { name: 'Hello World!' }).isVisible();\n  expect(isVisible).toBe(true);\n});",
        "hints": {
          "tier1Concept": "Calling `await locator.isVisible()` returns a boolean immediately at that exact millisecond. The loading bar is still active, so it returns false and fails.",
          "tier2Partial": "Wrap the locator in `expect(locator)` and await the auto-retrying matcher `toBeVisible()`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('dynamic loading test', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');\n  await page.getByRole('button', { name: 'Start' }).click();\n\n  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "isVisible()",
            "toBe(true)"
          ],
          "requiredKeywords": [
            "await expect(",
            "toBeVisible()"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('dynamic loading test', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');\n  await page.getByRole('button', { name: 'Start' }).click();\n\n  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();\n});"
        }
      },
      {
        "id": "drill-3-2",
        "moduleId": "assertions",
        "drillNumber": "3.2",
        "title": "Build from Scratch: Collection Assertions & Count Verification",
        "type": "build-from-scratch",
        "prompt": "On SauceDemo inventory page (`/inventory.html`), write web-first assertions to verify item collections:\nRequirements:\n1. Locate all items using `page.locator('.inventory_item')`.\n2. Assert that exactly 6 items are present using web-first `await expect(items).toHaveCount(6)`.\n3. Assert that the first item contains text `'Sauce Labs Backpack'` using `await expect(items.first()).toContainText('Sauce Labs Backpack')`.\n4. Do NOT use synchronous count checks (`expect(await items.count()).toBe(6)`).",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('verifies product list count and first item details', async ({ page }) => {\n  await page.goto('/inventory.html');\n  \n  // Write collection assertions here\n});",
        "hints": {
          "tier1Concept": "`await expect(locator).toHaveCount(n)` polls the DOM repeatedly until the expected number of elements appear.",
          "tier2Partial": "Use `const items = page.locator(\".inventory_item\");` then `await expect(items).toHaveCount(6);` and `await expect(items.first()).toContainText(...);`",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('verifies product list count and first item details', async ({ page }) => {\n  await page.goto('/inventory.html');\n  \n  const items = page.locator('.inventory_item');\n  await expect(items).toHaveCount(6);\n  await expect(items.first()).toContainText('Sauce Labs Backpack');\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout",
            "count()).toBe"
          ],
          "requiredKeywords": [
            "toHaveCount(6)",
            "toContainText",
            "inventory_item"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('verifies product list count and first item details', async ({ page }) => {\n  await page.goto('/inventory.html');\n  \n  const items = page.locator('.inventory_item');\n  await expect(items).toHaveCount(6);\n  await expect(items.first()).toContainText('Sauce Labs Backpack');\n});"
        }
      },
      {
        "id": "drill-3-3",
        "moduleId": "assertions",
        "drillNumber": "3.3",
        "title": "Predict & Implement: Soft Assertions for Comprehensive Form Validation",
        "type": "predict",
        "prompt": "When submitting an empty checkout form at `/checkout-step-one.html`, multiple error states appear.\nRefactor the hard assertions below into soft assertions (`expect.soft()`) so that all field assertions execute even if the first one fails.\nExplain why soft assertions improve test diagnostics.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('validates form errors with soft assertions', async ({ page }) => {\n  await page.goto('/checkout-step-one.html');\n  await page.getByRole('button', { name: 'Continue' }).click();\n\n  // FIX ME: Convert hard assertions to soft assertions\n  await expect(page.locator('[data-test=\"error\"]')).toBeVisible();\n  await expect(page.locator('[data-test=\"error\"]')).toContainText('First Name is required');\n});",
        "hints": {
          "tier1Concept": "Standard `expect()` stops test execution on failure. `expect.soft()` records failures and continues running remaining assertions.",
          "tier2Partial": "Replace `expect(...)` with `expect.soft(...)`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('validates form errors with soft assertions', async ({ page }) => {\n  await page.goto('/checkout-step-one.html');\n  await page.getByRole('button', { name: 'Continue' }).click();\n\n  await expect.soft(page.locator('[data-test=\"error\"]')).toBeVisible();\n  await expect.soft(page.locator('[data-test=\"error\"]')).toContainText('First Name is required');\n});"
        },
        "validation": {
          "requiredKeywords": [
            "expect.soft(",
            "toBeVisible()",
            "toContainText"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('validates form errors with soft assertions', async ({ page }) => {\n  await page.goto('/checkout-step-one.html');\n  await page.getByRole('button', { name: 'Continue' }).click();\n\n  await expect.soft(page.locator('[data-test=\"error\"]')).toBeVisible();\n  await expect.soft(page.locator('[data-test=\"error\"]')).toContainText('First Name is required');\n});"
        }
      },
      {
        "id": "drill-3-4",
        "moduleId": "assertions",
        "drillNumber": "3.4",
        "title": "Build from Scratch: Negative Assertions & State Settling",
        "type": "build-from-scratch",
        "prompt": "On `https://the-internet.herokuapp.com/dynamic_loading/1`:\n1. Click the \"Start\" button.\n2. Assert that the loading indicator (`#loading`) becomes NOT visible (`not.toBeVisible()`).\n3. Assert that the heading \"Hello World!\" becomes visible.\n4. Assert that the heading has exact text \"Hello World!\".",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('verifies loading indicator disappears and heading displays', async ({ page }) => {\n  // Write test\n});",
        "hints": {
          "tier1Concept": "Auto-retrying assertions also work with `.not`. Playwright will wait until the loading bar is detached or hidden.",
          "tier2Partial": "Use `await expect(page.locator(\"#loading\")).not.toBeVisible();` followed by `await expect(page.getByRole(\"heading\", { name: \"Hello World!\" })).toHaveText(\"Hello World!\");`",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('verifies loading indicator disappears and heading displays', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');\n  await page.getByRole('button', { name: 'Start' }).click();\n\n  await expect(page.locator('#loading')).not.toBeVisible();\n  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();\n  await expect(page.getByRole('heading', { name: 'Hello World!' })).toHaveText('Hello World!');\n});"
        },
        "validation": {
          "requiredKeywords": [
            "not.toBeVisible",
            "toHaveText",
            "toBeVisible"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('verifies loading indicator disappears and heading displays', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');\n  await page.getByRole('button', { name: 'Start' }).click();\n\n  await expect(page.locator('#loading')).not.toBeVisible();\n  await expect(page.getByRole('heading', { name: 'Hello World!' })).toBeVisible();\n  await expect(page.getByRole('heading', { name: 'Hello World!' })).toHaveText('Hello World!');\n});"
        }
      },
      {
        "id": "drill-3-5",
        "moduleId": "assertions",
        "drillNumber": "3.5",
        "title": "Mastery Gate: Asynchronous Polling & Dynamic Value Assertions",
        "type": "build-from-scratch",
        "isMasteryGate": true,
        "prompt": "On `https://the-internet.herokuapp.com/dynamic_loading/2` (where dynamic content is appended to the DOM after delay):\n1. Click the \"Start\" button.\n2. Using web-first assertions, assert that the finish heading (`#finish h4`) appears and has exact text `'Hello World!'`.\n3. Assert that the \"Start\" button is not visible or disabled once process finishes.\n4. Mastery Requirement: Explain why `expect(locator).toHaveText()` avoids flakiness compared to reading `locator.textContent()` into a variable first.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('asynchronous DOM attachment assertion', async ({ page }) => {\n  // Your code here\n});",
        "hints": {
          "tier1Concept": "Dynamic loading #2 renders DOM nodes asynchronously after start. Web-first `toHaveText` polls until attachment and stabilization.",
          "tier2Partial": "Click Start, then `await expect(page.locator(\"#finish h4\")).toHaveText(\"Hello World!\");`",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('asynchronous DOM attachment assertion', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');\n  await page.getByRole('button', { name: 'Start' }).click();\n\n  await expect(page.locator('#finish h4')).toBeVisible();\n  await expect(page.locator('#finish h4')).toHaveText('Hello World!');\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "toHaveText('Hello World!')",
            "toBeVisible()"
          ],
          "expectedExplanationKeywords": [
            "poll",
            "retry",
            "attach",
            "dynamic",
            "synchronous",
            "race"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('asynchronous DOM attachment assertion', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');\n  await page.getByRole('button', { name: 'Start' }).click();\n\n  await expect(page.locator('#finish h4')).toBeVisible();\n  await expect(page.locator('#finish h4')).toHaveText('Hello World!');\n});"
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 3 No-Notes Checkpoint",
      "scenario": "You have a checkout form that submits an asynchronous payment order. State the difference between `expect(await page.locator(\".success\").count() > 0).toBe(true)` and `await expect(page.locator(\".success\")).toBeVisible()`.",
      "successCriteria": [
        "Explains that count() > 0 evaluates immediately without polling",
        "Explains that toBeVisible() auto-retries until timeout",
        "Explains how this prevents timing bugs on network latency"
      ]
    }
  },
  {
    "id": "debugging",
    "stage": "Debugging",
    "title": "Module 4: Debugging — Trace Viewer, UI Mode & Error Stacks",
    "subtitle": "Mastering the time-travel debugger and diagnosing Ubuntu failures like a senior engineer",
    "estimatedTime": "60 mins",
    "targetApp": "Ubuntu Terminal, Playwright UI Mode & Trace Viewer",
    "theorySections": [
      {
        "title": "The Time-Traveling Trace Viewer",
        "content": "Trace Viewer is Playwright's superpower. It captures full DOM snapshots before and after every action, exact network request/response timing waterfall, console logs, and action filmstrips.\n\nOpening a trace on Ubuntu:\n`npx playwright show-trace test-results/.../trace.zip`\n\nIn the Trace Viewer UI, you can:\n1. Scrub through the timeline millisecond by millisecond.\n2. Click any action to inspect the exact live DOM tree at that moment.\n3. See exact network request headers and payload bodies.\n4. Verify why a locator timed out or matched multiple elements.",
        "callout": {
          "type": "ubuntu",
          "title": "Running UI Mode on Ubuntu Desktop",
          "text": "If you are running on an Ubuntu desktop with a graphical session (GNOME), `npx playwright test --ui` gives you an interactive watch mode with locator playground, time travel, and watch filters."
        }
      },
      {
        "title": "Reading Playwright Error Stacks",
        "content": "When a Playwright test fails, it provides an actionable error report:\n1. **Call log**: Every step Playwright attempted (waiting for selector, element found, checking if visible, checking if enabled, performing click).\n2. **Timeout error**: \"Timeout 30000ms exceeded while waiting for getByRole('button', { name: 'Submit' })\".\n3. **Strict mode violation**: \"Error: strict mode violation: locator resolved to 3 elements\". Playwright will refuse to guess which element you meant, forcing robust locators."
      }
    ],
    "justInTimeTs": {
      "concept": "Reading TypeScript Compilation Errors in Terminal",
      "whyNow": "Playwright compiles TypeScript before running. Syntax or typing mistakes are caught before the browser even opens.",
      "explanation": "Common errors like `Property \"clck\" does not exist on type \"Locator\". Did you mean \"click\"?` or `Argument of type \"number\" is not assignable to parameter of type \"string\"`. TypeScript protects you from silly typos at compile time.",
      "codeExample": "// TS error caught at compile-time:\n// await page.getByRole('button').clck(); \n// Error: TS2339: Property 'clck' does not exist on type 'Locator'. Did you mean 'click'?"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "npx playwright test --ui",
        "description": "Launch the interactive Playwright UI Mode for live debugging and watch-mode testing",
        "expectedOutput": "[UI Mode launched at localhost]"
      },
      {
        "command": "npx playwright show-trace trace.zip",
        "description": "Open the standalone Trace Viewer for a failed CI or local run artifact",
        "expectedOutput": "[Trace viewer opened in browser]"
      },
      {
        "command": "npx playwright test --debug",
        "description": "Run tests with the Playwright Inspector stepping through actions line by line",
        "expectedOutput": "[Playwright Inspector paused on line 1]"
      }
    ],
    "drills": [
      {
        "id": "drill-4-1",
        "moduleId": "debugging",
        "drillNumber": "4.1",
        "title": "Error Decoding: Strict Mode Violation",
        "type": "spot-and-fix",
        "prompt": "You run your suite on Ubuntu and receive this failure log:\n```\nError: strict mode violation: getByRole('button', { name: 'Delete' }) resolved to 5 elements:\n  1) <button class=\"btn-delete\">Delete</button> aka getByRole('row', { name: 'User 1' }).getByRole('button')\n  2) <button class=\"btn-delete\">Delete</button>\n  3) <button class=\"btn-delete\">Delete</button>\n  ...\n```\n1. Explain what Playwright Strict Mode means.\n2. Fix the test code below so it specifically clicks the Delete button for \"User 1\".",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('delete specific user', async ({ page }) => {\n  await page.goto('/users');\n  \n  // FIX ME: Currently causes strict mode violation\n  await page.getByRole('button', { name: 'Delete' }).click();\n});",
        "hints": {
          "tier1Concept": "Playwright locator actions enforce strict mode by default. If a locator matches more than one element, Playwright will throw an error rather than clicking an ambiguous element.",
          "tier2Partial": "Scope your locator to the row containing \"User 1\" using chaining or filtering: `page.getByRole(\"row\", { name: \"User 1\" }).getByRole(\"button\", { name: \"Delete\" })`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('delete specific user', async ({ page }) => {\n  await page.goto('/users');\n  \n  await page.getByRole('row', { name: 'User 1' }).getByRole('button', { name: 'Delete' }).click();\n});"
        },
        "validation": {
          "requiredKeywords": [
            "getByRole('row'",
            "User 1"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('delete specific user', async ({ page }) => {\n  await page.goto('/users');\n  \n  await page.getByRole('row', { name: 'User 1' }).getByRole('button', { name: 'Delete' }).click();\n});"
        }
      },
      {
        "id": "drill-4-2",
        "moduleId": "debugging",
        "drillNumber": "4.2",
        "title": "Spot and Fix: Debugging with `page.pause()` and Playwright Inspector",
        "type": "spot-and-fix",
        "prompt": "A developer tried to debug an elusive UI issue by littering the test with `console.log` statements and `await page.waitForTimeout(10000)`.\nRefactor the test to use Playwright's official debugging method: replace the arbitrary pause with `await page.pause()` to open the Playwright Inspector.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('debug checkout failure', async ({ page }) => {\n  await page.goto('/checkout-step-one.html');\n  \n  // FIX ME: Anti-patterns for debugging\n  console.log('Filling form...');\n  await page.waitForTimeout(10000);\n  await page.getByPlaceholder('First Name').fill('Alice');\n});",
        "hints": {
          "tier1Concept": "`await page.pause()` suspends test execution and launches the Playwright Inspector with live locator probing and stepping.",
          "tier2Partial": "Remove `console.log` and `waitForTimeout`, and insert `await page.pause();`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('debug checkout failure', async ({ page }) => {\n  await page.goto('/checkout-step-one.html');\n  \n  await page.pause();\n  await page.getByPlaceholder('First Name').fill('Alice');\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout",
            "console.log"
          ],
          "requiredKeywords": [
            "await page.pause()"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('debug checkout failure', async ({ page }) => {\n  await page.goto('/checkout-step-one.html');\n  \n  await page.pause();\n  await page.getByPlaceholder('First Name').fill('Alice');\n});"
        }
      },
      {
        "id": "drill-4-3",
        "moduleId": "debugging",
        "drillNumber": "4.3",
        "title": "Error Decoding: Actionability Timeout Due to Modal Backdrop Overlay",
        "type": "spot-and-fix",
        "prompt": "A test fails with:\n`TimeoutError: locator.click: Timeout 30000ms exceeded. waiting for element to be visible, enabled and stable - element is obscured by <div class=\"modal-backdrop fade show\">...</div>`\n\nFix the test properly by waiting for the modal backdrop to disappear with a web-first assertion rather than using the dangerous `{ force: true }` escape hatch.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('click button after modal closes', async ({ page }) => {\n  await page.goto('/dashboard');\n  await page.getByRole('button', { name: 'Close Modal' }).click();\n\n  // FIX ME: Avoid { force: true }; wait for backdrop to disappear!\n  await page.getByRole('button', { name: 'Save Changes' }).click({ force: true });\n});",
        "hints": {
          "tier1Concept": "Using `{ force: true }` bypasses actionability checks and clicks hidden elements, which causes false-positive test runs. Wait for overlays to detach.",
          "tier2Partial": "Add `await expect(page.locator(\".modal-backdrop\")).not.toBeVisible();` before clicking.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('click button after modal closes', async ({ page }) => {\n  await page.goto('/dashboard');\n  await page.getByRole('button', { name: 'Close Modal' }).click();\n\n  await expect(page.locator('.modal-backdrop')).not.toBeVisible();\n  await page.getByRole('button', { name: 'Save Changes' }).click();\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "force: true",
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "not.toBeVisible",
            "Save Changes"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('click button after modal closes', async ({ page }) => {\n  await page.goto('/dashboard');\n  await page.getByRole('button', { name: 'Close Modal' }).click();\n\n  await expect(page.locator('.modal-backdrop')).not.toBeVisible();\n  await page.getByRole('button', { name: 'Save Changes' }).click();\n});"
        }
      },
      {
        "id": "drill-4-4",
        "moduleId": "debugging",
        "drillNumber": "4.4",
        "title": "Build from Scratch: Programmatic Tracing Setup for Isolated Debugging",
        "type": "build-from-scratch",
        "prompt": "Write a test that programmatically records a Playwright trace archive for a critical checkout flow:\nRequirements:\n1. Start tracing with `await context.tracing.start({ screenshots: true, snapshots: true });`.\n2. Execute navigation to `/cart.html` and click checkout.\n3. In a `finally` block, stop tracing and save the file: `await context.tracing.stop({ path: 'trace.zip' });`.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('records trace file programmatically', async ({ context, page }) => {\n  // Start tracing, execute actions, and stop tracing in finally block\n});",
        "hints": {
          "tier1Concept": "Programmatic tracing captures exact DOM states, network packets, and screenshots between `start()` and `stop()`.",
          "tier2Partial": "Wrap actions in a `try...finally` block to ensure `context.tracing.stop({ path: \"trace.zip\" })` runs even if an assertion fails.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('records trace file programmatically', async ({ context, page }) => {\n  await context.tracing.start({ screenshots: true, snapshots: true });\n  try {\n    await page.goto('/cart.html');\n    await page.getByRole('button', { name: 'Checkout' }).click();\n  } finally {\n    await context.tracing.stop({ path: 'trace.zip' });\n  }\n});"
        },
        "validation": {
          "requiredKeywords": [
            "context.tracing.start",
            "context.tracing.stop",
            "trace.zip"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('records trace file programmatically', async ({ context, page }) => {\n  await context.tracing.start({ screenshots: true, snapshots: true });\n  try {\n    await page.goto('/cart.html');\n    await page.getByRole('button', { name: 'Checkout' }).click();\n  } finally {\n    await context.tracing.stop({ path: 'trace.zip' });\n  }\n});"
        }
      },
      {
        "id": "drill-4-5",
        "moduleId": "debugging",
        "drillNumber": "4.5",
        "title": "Mastery Gate: Trace Analysis & Flakiness Diagnosis",
        "type": "explain-concept",
        "isMasteryGate": true,
        "prompt": "A test failed on GitHub Actions Ubuntu runner with:\n\"Timeout 30000ms exceeded while waiting for locator('button.submit-order')\".\nYou download the `trace.zip` artifact and run `npx playwright show-trace trace.zip`.\nIn the Network tab of the trace, you see a POST request to `/api/validate-cart` returned HTTP 429 (Rate Limited).\n\nExplain:\n1. Why did the button never become actionable?\n2. What feature of Trace Viewer allowed you to identify the root cause without having to reproduce it blindly?\n3. How should this scenario be handled in modern test architecture?",
        "starterCode": "// Write your concise technical analysis and architectural fix:\n// 1. Root cause:\n// 2. Trace Viewer utility:\n// 3. Architectural fix:",
        "hints": {
          "tier1Concept": "Connect the frontend UI state to the backend HTTP response. If the API failed with 429, the frontend never unlocked the submit button.",
          "tier2Partial": "The button remained disabled. Trace Viewer recorded the exact network waterfall and response status code 429. The fix involves either network mocking or backoff.",
          "tier3Solution": "1. The button remained in a disabled state because the frontend form was waiting for the cart validation API call to succeed.\n2. Trace Viewer recorded every network request and response body synchronized with DOM snapshots, exposing the 429 status.\n3. Mock the rate-limited API route using page.route() in the test suite to insulate UI tests from external rate limits."
        },
        "validation": {
          "requiredKeywords": [
            "429",
            "network",
            "disabled",
            "mock",
            "trace"
          ],
          "solutionCode": "1. The button remained disabled because /api/validate-cart returned 429.\n2. Trace Viewer network waterfall revealed the exact HTTP status codes.\n3. Isolate the test with page.route() mocking."
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 4 No-Notes Checkpoint",
      "scenario": "You are handed a failed test log with a locator timeout. Describe the step-by-step workflow on Ubuntu terminal to inspect the trace artifact and locate the exact network failure.",
      "successCriteria": [
        "Mentions npx playwright show-trace path/to/trace.zip",
        "Explains inspecting the Network panel for 4xx/5xx responses",
        "Explains looking at DOM snapshot and Action Call log"
      ]
    }
  },
  {
    "id": "pom",
    "stage": "POM",
    "title": "Module 5: Page Object Model (POM) Refactoring",
    "subtitle": "Transforming procedural scripts into modular, maintainable, enterprise-grade architecture",
    "estimatedTime": "75 mins",
    "targetApp": "https://www.saucedemo.com (Refactoring tests/e2e/)",
    "theorySections": [
      {
        "title": "Why POM? Refactoring the Cumulative Project",
        "content": "Up to this point, our tests directly invoked `page.getByPlaceholder('Username').fill(...)`.\nWhat happens when your company has 80 test specs that log in, and the designer changes the login field?\nYou would have to edit 80 different files.\n\nThe **Page Object Model (POM)** encapsulates the UI structure and interactions of a specific page inside a dedicated TypeScript class:\n1. **Locators as class properties** (initialized in the constructor using `readonly`).\n2. **User action methods** (e.g. `login(user, pass)`, `addItemToCart(name)`).\n3. **Tests become pure high-level business logic.**",
        "codeSnippet": {
          "language": "typescript",
          "caption": "pages/LoginPage.ts — Clean Page Object",
          "code": "import { type Page, type Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly loginButton: Locator;\n  readonly errorMessage: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByPlaceholder('Username');\n    this.passwordInput = page.getByPlaceholder('Password');\n    this.loginButton = page.getByRole('button', { name: 'Login' });\n    this.errorMessage = page.locator('[data-test=\"error\"]');\n  }\n\n  async goto() {\n    await this.page.goto('/');\n  }\n\n  async login(username: string, password: string) {\n    await this.usernameInput.fill(username);\n    await this.passwordInput.fill(password);\n    await this.loginButton.click();\n  }\n}"
        }
      }
    ],
    "justInTimeTs": {
      "concept": "TypeScript Classes, Access Modifiers (`readonly`), and Types",
      "whyNow": "Page Objects are TypeScript classes. We use `readonly` and type imports (`type Page`, `type Locator`) to ensure locators cannot be accidentally mutated.",
      "explanation": "The `readonly` keyword prevents properties from being reassigned after construction. Using `type Page` imports only the interface for type checking, with zero runtime overhead.",
      "codeExample": "export class InventoryPage {\n  // readonly prevents accidental reassignment: this.title = somethingElse;\n  readonly title: Locator;\n\n  constructor(readonly page: Page) {\n    this.title = page.getByText('Products');\n  }\n}"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "mkdir -p pages && touch pages/LoginPage.ts pages/InventoryPage.ts",
        "description": "Create the Page Object Model directories in our cumulative project",
        "expectedOutput": ""
      },
      {
        "command": "npx playwright test tests/e2e/login.spec.ts",
        "description": "Run our refactored POM login test",
        "expectedOutput": "1 passed (1.2s)"
      }
    ],
    "drills": [
      {
        "id": "drill-5-1",
        "moduleId": "pom",
        "drillNumber": "5.1",
        "title": "Build from Scratch: InventoryPage Class",
        "type": "build-from-scratch",
        "prompt": "Create the `InventoryPage` class in `pages/InventoryPage.ts`.\nRequirements:\n1. Import `type Page` and `type Locator` from `@playwright/test`.\n2. Define class `InventoryPage`.\n3. Declare readonly locators: `page: Page`, `title: Locator`, `inventoryItems: Locator`, `cartBadge: Locator`.\n4. Initialize them in `constructor(page: Page)`.\n5. Implement method `async addItemToCart(itemName: string): Promise<void>`.\n6. Implement method `async getCartCount(): Promise<string>`.",
        "starterCode": "import { type Page, type Locator } from '@playwright/test';\n\nexport class InventoryPage {\n  // Your class implementation\n}",
        "hints": {
          "tier1Concept": "Locators should be initialized as readonly properties in the constructor. Actions like addItemToCart should encapsulate how the item is selected.",
          "tier2Partial": "In constructor: this.cartBadge = page.locator(\".shopping_cart_badge\"); In addItemToCart, use page.locator(\".inventory_item\").filter({ hasText: itemName }).getByRole(\"button\", { name: \"Add to cart\" }).click().",
          "tier3Solution": "import { type Page, type Locator } from '@playwright/test';\n\nexport class InventoryPage {\n  readonly page: Page;\n  readonly title: Locator;\n  readonly inventoryItems: Locator;\n  readonly cartBadge: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.title = page.locator('.title');\n    this.inventoryItems = page.locator('.inventory_item');\n    this.cartBadge = page.locator('.shopping_cart_badge');\n  }\n\n  async addItemToCart(itemName: string): Promise<void> {\n    await this.inventoryItems\n      .filter({ hasText: itemName })\n      .getByRole('button', { name: 'Add to cart' })\n      .click();\n  }\n\n  async getCartCount(): Promise<string> {\n    return await this.cartBadge.innerText();\n  }\n}"
        },
        "validation": {
          "requiredKeywords": [
            "readonly page: Page",
            "readonly title: Locator",
            "addItemToCart",
            "getCartCount"
          ],
          "solutionCode": "import { type Page, type Locator } from '@playwright/test';\n\nexport class InventoryPage {\n  readonly page: Page;\n  readonly title: Locator;\n  readonly inventoryItems: Locator;\n  readonly cartBadge: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.title = page.locator('.title');\n    this.inventoryItems = page.locator('.inventory_item');\n    this.cartBadge = page.locator('.shopping_cart_badge');\n  }\n\n  async addItemToCart(itemName: string): Promise<void> {\n    await this.inventoryItems\n      .filter({ hasText: itemName })\n      .getByRole('button', { name: 'Add to cart' })\n      .click();\n  }\n\n  async getCartCount(): Promise<string> {\n    return await this.cartBadge.innerText();\n  }\n}"
        }
      },
      {
        "id": "drill-5-2",
        "moduleId": "pom",
        "drillNumber": "5.2",
        "title": "Refactor Cumulative Test into POM",
        "type": "build-from-scratch",
        "prompt": "Refactor our original `tests/e2e/login.spec.ts` to consume `LoginPage` and `InventoryPage`.\nRequirements:\n1. Import `LoginPage` and `InventoryPage`.\n2. In the test, instantiate both page objects with `page`.\n3. Call `loginPage.goto()` and `loginPage.login('standard_user', 'secret_sauce')`.\n4. Assert that `inventoryPage.title` has text \"Products\".",
        "starterCode": "import { test, expect } from '@playwright/test';\n// Import your POM classes here\n\ntest('user can log in successfully', async ({ page }) => {\n  // Refactor test to use Page Objects\n});",
        "hints": {
          "tier1Concept": "The test file should read like a high-level business story, completely devoid of low-level CSS or XPath strings.",
          "tier2Partial": "Instantiate `const loginPage = new LoginPage(page);` and call `await loginPage.login(...)`. Keep assertions in the spec.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\nimport { LoginPage } from '../../pages/LoginPage';\nimport { InventoryPage } from '../../pages/InventoryPage';\n\ntest('user can log in successfully', async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  const inventoryPage = new InventoryPage(page);\n\n  await loginPage.goto();\n  await loginPage.login('standard_user', 'secret_sauce');\n\n  await expect(inventoryPage.title).toHaveText('Products');\n});"
        },
        "validation": {
          "requiredKeywords": [
            "new LoginPage(page)",
            "new InventoryPage(page)",
            "loginPage.login",
            "toHaveText('Products')"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\nimport { LoginPage } from '../../pages/LoginPage';\nimport { InventoryPage } from '../../pages/InventoryPage';\n\ntest('user can log in successfully', async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  const inventoryPage = new InventoryPage(page);\n\n  await loginPage.goto();\n  await loginPage.login('standard_user', 'secret_sauce');\n\n  await expect(inventoryPage.title).toHaveText('Products');\n});"
        }
      },
      {
        "id": "drill-5-3",
        "moduleId": "pom",
        "drillNumber": "5.3",
        "title": "Spot and Fix: Page Object Anti-Patterns",
        "type": "spot-and-fix",
        "prompt": "Refactor this flawed `CartPage` class to adhere strictly to Playwright POM principles:\n1. Remove hardcoded `waitForTimeout` calls.\n2. Remove `expect` assertion calls from inside the Page Object methods (assertions belong in test specs!).\n3. Move inline selector queries into `readonly` properties declared in the constructor.",
        "starterCode": "import { type Page, expect } from '@playwright/test';\n\nexport class CartPage {\n  page: Page;\n\n  constructor(page: Page) {\n    this.page = page;\n  }\n\n  // ANTI-PATTERN 1: Selector re-queried on every invocation\n  // ANTI-PATTERN 2: Assertion placed inside POM action method\n  // ANTI-PATTERN 3: Arbitrary timeout sleep\n  async clickCheckout() {\n    await this.page.waitForTimeout(2000);\n    const btn = this.page.locator('#checkout');\n    await btn.click();\n    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);\n  }\n}",
        "hints": {
          "tier1Concept": "POMs expose services and state locators; test specs assert outcomes. Page objects must NEVER assert or sleep.",
          "tier2Partial": "Declare `readonly checkoutButton: Locator` in constructor. `clickCheckout` should only contain `await this.checkoutButton.click()`.",
          "tier3Solution": "import { type Page, type Locator } from '@playwright/test';\n\nexport class CartPage {\n  readonly page: Page;\n  readonly checkoutButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });\n  }\n\n  async clickCheckout(): Promise<void> {\n    await this.checkoutButton.click();\n  }\n}"
        },
        "validation": {
          "forbiddenKeywords": [
            "expect(",
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "readonly checkoutButton: Locator",
            "Promise<void>"
          ],
          "solutionCode": "import { type Page, type Locator } from '@playwright/test';\n\nexport class CartPage {\n  readonly page: Page;\n  readonly checkoutButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });\n  }\n\n  async clickCheckout(): Promise<void> {\n    await this.checkoutButton.click();\n  }\n}"
        }
      },
      {
        "id": "drill-5-4",
        "moduleId": "pom",
        "drillNumber": "5.4",
        "title": "Component Object Model: Header & Cart Badge",
        "type": "build-from-scratch",
        "prompt": "Build a reusable Component Object `HeaderComponent` in `components/HeaderComponent.ts`.\nIn large-scale web apps, navigation headers appear on dozens of pages. Rather than duplicating locators in every page object, extract them into a component object.\nRequirements:\n1. Accept `page: Page` in constructor.\n2. Initialize `cartLink: Locator` (scoped to `.shopping_cart_link`).\n3. Initialize `cartBadge: Locator` (scoped to `.shopping_cart_badge`).\n4. Implement `async openCart(): Promise<void>`.\n5. Implement `async getCartCount(): Promise<number>`.",
        "starterCode": "import { type Page, type Locator } from '@playwright/test';\n\nexport class HeaderComponent {\n  // Implement component object\n}",
        "hints": {
          "tier1Concept": "Component objects represent recurring UI fragments (navbars, modals, tables) and can be embedded within full Page Objects via composition.",
          "tier2Partial": "Store locators as readonly, implement `openCart()` to click cartLink, and `getCartCount()` to parse parseInt(await cartBadge.innerText()).",
          "tier3Solution": "import { type Page, type Locator } from '@playwright/test';\n\nexport class HeaderComponent {\n  readonly page: Page;\n  readonly cartLink: Locator;\n  readonly cartBadge: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.cartLink = page.locator('.shopping_cart_link');\n    this.cartBadge = page.locator('.shopping_cart_badge');\n  }\n\n  async openCart(): Promise<void> {\n    await this.cartLink.click();\n  }\n\n  async getCartCount(): Promise<number> {\n    if (await this.cartBadge.isVisible()) {\n      const text = await this.cartBadge.innerText();\n      return parseInt(text, 10);\n    }\n    return 0;\n  }\n}"
        },
        "validation": {
          "requiredKeywords": [
            "readonly cartLink: Locator",
            "readonly cartBadge: Locator",
            "openCart",
            "getCartCount"
          ],
          "solutionCode": "import { type Page, type Locator } from '@playwright/test';\n\nexport class HeaderComponent {\n  readonly page: Page;\n  readonly cartLink: Locator;\n  readonly cartBadge: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.cartLink = page.locator('.shopping_cart_link');\n    this.cartBadge = page.locator('.shopping_cart_badge');\n  }\n\n  async openCart(): Promise<void> {\n    await this.cartLink.click();\n  }\n\n  async getCartCount(): Promise<number> {\n    if (await this.cartBadge.isVisible()) {\n      const text = await this.cartBadge.innerText();\n      return parseInt(text, 10);\n    }\n    return 0;\n  }\n}"
        }
      },
      {
        "id": "drill-5-5",
        "moduleId": "pom",
        "drillNumber": "5.5",
        "title": "Mastery Gate: Dynamic Scoped Selectors & Parameterized POM Actions",
        "type": "build-from-scratch",
        "isMasteryGate": true,
        "prompt": "When testing catalogs, tables, or item lists, creating separate hardcoded locators for each individual product is unmaintainable. Instead, write parameterized locator helper methods in the Page Object that scope locators to matching containers.\nRequirements:\n1. In `CartPage`, implement `getCartItem(itemName: string): Locator` returning `this.page.locator('.cart_item').filter({ hasText: itemName })`.\n2. Implement `async getItemPrice(itemName: string): Promise<string>` that chains from `getCartItem(itemName)` to find `.inventory_item_price` and returns its `innerText()`.\n3. Implement `async removeItem(itemName: string): Promise<void>` that clicks the 'Remove' button inside that item's scoped locator.\n4. Mastery Requirement: Explain why scoping locators via `locator.filter({ hasText })` or `parentLocator.locator(child)` is superior to concatenating dynamic XPath or string template selectors (like `//div[text()=\"${name}\"]/../button`).",
        "starterCode": "import { type Page, type Locator } from '@playwright/test';\n\nexport class CartPage {\n  readonly page: Page;\n\n  constructor(page: Page) {\n    this.page = page;\n  }\n\n  // 1. Return a scoped Locator for the item row\n  getCartItem(itemName: string): Locator {\n    // Your code\n  }\n\n  // 2. Return the price string from the scoped item\n  async getItemPrice(itemName: string): Promise<string> {\n    // Your code\n  }\n\n  // 3. Click remove on the scoped item\n  async removeItem(itemName: string): Promise<void> {\n    // Your code\n  }\n}",
        "hints": {
          "tier1Concept": "getCartItem(name) returns a Locator without awaiting. Other methods chain directly from it: this.getCartItem(itemName).getByRole('button', { name: 'Remove' }).",
          "tier2Partial": "Use this.page.locator('.cart_item').filter({ hasText: itemName }). For price, await this.getCartItem(itemName).locator('.inventory_item_price').innerText().",
          "tier3Solution": "import { type Page, type Locator } from '@playwright/test';\n\nexport class CartPage {\n  readonly page: Page;\n\n  constructor(page: Page) {\n    this.page = page;\n  }\n\n  getCartItem(itemName: string): Locator {\n    return this.page.locator('.cart_item').filter({ hasText: itemName });\n  }\n\n  async getItemPrice(itemName: string): Promise<string> {\n    const item = this.getCartItem(itemName);\n    return await item.locator('.inventory_item_price').innerText();\n  }\n\n  async removeItem(itemName: string): Promise<void> {\n    const item = this.getCartItem(itemName);\n    await item.getByRole('button', { name: 'Remove' }).click();\n  }\n}"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout",
            "//"
          ],
          "requiredKeywords": [
            "getCartItem(itemName: string): Locator",
            "filter({ hasText: itemName })",
            "getItemPrice",
            "removeItem",
            "innerText()"
          ],
          "expectedExplanationKeywords": [
            "scoped",
            "chain",
            "brittle",
            "xpath",
            "auto-waiting",
            "resilient",
            "locator"
          ],
          "solutionCode": "import { type Page, type Locator } from '@playwright/test';\n\nexport class CartPage {\n  readonly page: Page;\n\n  constructor(page: Page) {\n    this.page = page;\n  }\n\n  getCartItem(itemName: string): Locator {\n    return this.page.locator('.cart_item').filter({ hasText: itemName });\n  }\n\n  async getItemPrice(itemName: string): Promise<string> {\n    const item = this.getCartItem(itemName);\n    return await item.locator('.inventory_item_price').innerText();\n  }\n\n  async removeItem(itemName: string): Promise<void> {\n    const item = this.getCartItem(itemName);\n    await item.getByRole('button', { name: 'Remove' }).click();\n  }\n}"
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 5 No-Notes Checkpoint",
      "scenario": "You are refactoring a 20-step checkout script into Page Objects. Describe how you structure the classes, what goes in the constructor, and where test assertions belong.",
      "successCriteria": [
        "Explains locators stored in constructor with readonly",
        "Demonstrates action methods (fill, click) inside the Page class",
        "Confirms assertions belong in the test spec for clear reporting"
      ]
    }
  },
  {
    "id": "fixtures",
    "stage": "Fixtures",
    "title": "Module 6: Fixtures & Auth Bypass (storageState)",
    "subtitle": "Eliminating repetitive setup and logging in once for the entire test suite",
    "estimatedTime": "75 mins",
    "targetApp": "https://www.saucedemo.com (Enterprise Auth Bypass)",
    "theorySections": [
      {
        "title": "Custom Fixtures: Dependency Injection in Playwright",
        "content": "Notice how in Module 5 we still had to write:\n`const loginPage = new LoginPage(page);` at the top of every test.\nPlaywright solves this through **Fixtures**. Instead of repetitive instantiations or flaky `beforeEach` hooks, Playwright provides a declarative Dependency Injection system using `test.extend<MyFixtures>()`.\n\nBenefits of Fixtures:\n1. **Lazy evaluation**: Only initialized if the test explicitly requests it in its arguments `({ loginPage })`.\n2. **Automatic cleanup**: Teardown logic runs automatically after the test finishes.\n3. **Composability**: Fixtures can depend on other fixtures.",
        "codeSnippet": {
          "language": "typescript",
          "caption": "fixtures/test-base.ts — Enterprise Test Fixtures",
          "code": "import { test as base } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\nimport { InventoryPage } from '../pages/InventoryPage';\n\ntype AppFixtures = {\n  loginPage: LoginPage;\n  inventoryPage: InventoryPage;\n};\n\nexport const test = base.extend<AppFixtures>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await use(loginPage);\n  },\n  inventoryPage: async ({ page }, use) => {\n    const inventoryPage = new InventoryPage(page);\n    await use(inventoryPage);\n  },\n});\n\nexport { expect } from '@playwright/test';"
        }
      },
      {
        "title": "Advanced Industry Scenario: Auth Bypass via storageState",
        "content": "Logging in through the UI on all 200 tests in your suite wastes 15+ minutes of CI time.\nIn modern test automation, we log in **exactly once** in an `auth.setup.ts` project, save the browser's cookies and local storage to `playwright/.auth/user.json`, and configure all tests to boot pre-authenticated via `storageState`.",
        "codeSnippet": {
          "language": "typescript",
          "caption": "tests/auth.setup.ts — Authenticate Once",
          "code": "import { test as setup, expect } from '@playwright/test';\n\nconst authFile = 'playwright/.auth/user.json';\n\nsetup('authenticate standard user', async ({ page }) => {\n  await page.goto('/');\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await expect(page).toHaveURL(/.*inventory.html/);\n  // Persist session tokens and cookies\n  await page.context().storageState({ path: authFile });\n});"
        }
      }
    ],
    "justInTimeTs": {
      "concept": "TypeScript Generics (`extend<T>`) and Tuples",
      "whyNow": "Playwright`s `base.extend<MyFixtures>()` uses TypeScript Generics to inject your custom fixture types into test signatures.",
      "explanation": "The `<AppFixtures>` syntax informs TypeScript: \"Add these keys and types to the test context parameter\". Now when you type `test(\"...\", ({ loginPage }) => {})`, VS Code gives full auto-complete on `loginPage`!",
      "codeExample": "type MyFixtures = {\n  authToken: string;\n};\n\nexport const test = base.extend<MyFixtures>({\n  authToken: async ({}, use) => {\n    await use('secret-jwt-token-123');\n  }\n});"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "mkdir -p playwright/.auth && npx playwright test --project=setup",
        "description": "Run the authentication setup project and generate storageState JSON",
        "expectedOutput": "1 passed (0.9s)\nWrote auth file to playwright/.auth/user.json"
      }
    ],
    "drills": [
      {
        "id": "drill-6-1",
        "moduleId": "fixtures",
        "drillNumber": "6.1",
        "title": "Spot and Fix: Missing `use()` in Custom Fixture",
        "type": "spot-and-fix",
        "prompt": "Look at this broken fixture definition. What happens when a test runs with this fixture, and why is the `await use(...)` call mandatory? Fix the code.",
        "starterCode": "import { test as base } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntype Fixtures = {\n  loginPage: LoginPage;\n};\n\nexport const test = base.extend<Fixtures>({\n  loginPage: async ({ page }) => {\n    const loginPage = new LoginPage(page);\n    // BUG: Missing the fixture handover! Test hangs forever!\n  },\n});",
        "hints": {
          "tier1Concept": "Playwright fixtures pass control to the test via `await use(fixtureInstance)`. Code before `use` is setup; code after `use` is teardown.",
          "tier2Partial": "Call `await use(loginPage);` so Playwright hands the instance to the test body.",
          "tier3Solution": "import { test as base } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntype Fixtures = {\n  loginPage: LoginPage;\n};\n\nexport const test = base.extend<Fixtures>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await use(loginPage);\n  },\n});"
        },
        "validation": {
          "requiredKeywords": [
            "await use(loginPage)"
          ],
          "solutionCode": "import { test as base } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\n\ntype Fixtures = {\n  loginPage: LoginPage;\n};\n\nexport const test = base.extend<Fixtures>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await use(loginPage);\n  },\n});"
        }
      },
      {
        "id": "drill-6-2",
        "moduleId": "fixtures",
        "drillNumber": "6.2",
        "title": "Build from Scratch: Dependency Injection for Page Objects with `test.extend`",
        "type": "build-from-scratch",
        "prompt": "Write a custom test fixture file `fixtures/test-base.ts` using `test.extend`.\nRequirements:\n1. Define a type `MyFixtures` containing `inventoryPage: InventoryPage` and `cartPage: CartPage`.\n2. Extend `base` test from `@playwright/test`.\n3. Provide the fixture implementation for `inventoryPage` and `cartPage`, initializing each with `page` and yielding them with `await use(...)`.\n4. Export the customized `test` and `expect`.",
        "starterCode": "import { test as base, expect } from '@playwright/test';\nimport { InventoryPage } from '../pages/InventoryPage';\nimport { CartPage } from '../pages/CartPage';\n\n// Define MyFixtures and export extended test:",
        "hints": {
          "tier1Concept": "Fixtures allow specs to receive pre-instantiated page objects directly in test arguments `{ inventoryPage, cartPage }`.",
          "tier2Partial": "Use `base.extend<MyFixtures>({ inventoryPage: async ({ page }, use) => { await use(new InventoryPage(page)); } })`.",
          "tier3Solution": "import { test as base, expect } from '@playwright/test';\nimport { InventoryPage } from '../pages/InventoryPage';\nimport { CartPage } from '../pages/CartPage';\n\ntype MyFixtures = {\n  inventoryPage: InventoryPage;\n  cartPage: CartPage;\n};\n\nexport const test = base.extend<MyFixtures>({\n  inventoryPage: async ({ page }, use) => {\n    await use(new InventoryPage(page));\n  },\n  cartPage: async ({ page }, use) => {\n    await use(new CartPage(page));\n  },\n});\n\nexport { expect };"
        },
        "validation": {
          "requiredKeywords": [
            "base.extend<MyFixtures>",
            "await use(new InventoryPage(page))",
            "await use(new CartPage(page))"
          ],
          "solutionCode": "import { test as base, expect } from '@playwright/test';\nimport { InventoryPage } from '../pages/InventoryPage';\nimport { CartPage } from '../pages/CartPage';\n\ntype MyFixtures = {\n  inventoryPage: InventoryPage;\n  cartPage: CartPage;\n};\n\nexport const test = base.extend<MyFixtures>({\n  inventoryPage: async ({ page }, use) => {\n    await use(new InventoryPage(page));\n  },\n  cartPage: async ({ page }, use) => {\n    await use(new CartPage(page));\n  },\n});\n\nexport { expect };"
        }
      },
      {
        "id": "drill-6-3",
        "moduleId": "fixtures",
        "drillNumber": "6.3",
        "title": "Build from Scratch: Auth Setup Project with `storageState.json`",
        "type": "build-from-scratch",
        "prompt": "Write the authentication setup script `tests/auth.setup.ts`:\nRequirements:\n1. Navigate to `'/'`.\n2. Fill in credentials (`standard_user` and `secret_sauce`) and click Login.\n3. Assert that navigation reached `/inventory.html` using `await expect(page).toHaveURL(/.*inventory.html/)`.\n4. Save the authenticated storage state to file using `await page.context().storageState({ path: 'playwright/.auth/user.json' })`.",
        "starterCode": "import { test as setup, expect } from '@playwright/test';\n\nsetup('authenticate user once', async ({ page }) => {\n  // Implement auth flow and save storageState\n});",
        "hints": {
          "tier1Concept": "The setup project runs before other test projects in playwright.config.ts, creating the authentication cookie snapshot.",
          "tier2Partial": "Call `page.context().storageState({ path: \"playwright/.auth/user.json\" })` after verifying login success.",
          "tier3Solution": "import { test as setup, expect } from '@playwright/test';\n\nsetup('authenticate user once', async ({ page }) => {\n  await page.goto('/');\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await expect(page).toHaveURL(/.*inventory.html/);\n  await page.context().storageState({ path: 'playwright/.auth/user.json' });\n});"
        },
        "validation": {
          "requiredKeywords": [
            "storageState",
            "playwright/.auth/user.json",
            "standard_user",
            "secret_sauce"
          ],
          "solutionCode": "import { test as setup, expect } from '@playwright/test';\n\nsetup('authenticate user once', async ({ page }) => {\n  await page.goto('/');\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await expect(page).toHaveURL(/.*inventory.html/);\n  await page.context().storageState({ path: 'playwright/.auth/user.json' });\n});"
        }
      },
      {
        "id": "drill-6-4",
        "moduleId": "fixtures",
        "drillNumber": "6.4",
        "title": "Spot and Fix: Fixture Teardown and Cleanup Leakage",
        "type": "spot-and-fix",
        "prompt": "A developer created a custom fixture that inserts a temporary user record before the test, but forgot to implement cleanup after `use()`.\nFix the fixture definition so that after `await use(user)`, it calls `await deleteUser(user.id)` inside a `try...finally` pattern to ensure the database record is purged even if the test fails.",
        "starterCode": "import { test as base } from '@playwright/test';\n\nexport const test = base.extend<{ tempUser: { id: string; name: string } }>({\n  tempUser: async ({}, use) => {\n    const user = await createTestUser();\n    // FIX ME: Add teardown after use()\n    await use(user);\n  },\n});",
        "hints": {
          "tier1Concept": "Code placed after `await use(...)` in a fixture runs after test completion, acting as automatic teardown.",
          "tier2Partial": "Wrap in `try { await use(user); } finally { await deleteUser(user.id); }`.",
          "tier3Solution": "import { test as base } from '@playwright/test';\n\nexport const test = base.extend<{ tempUser: { id: string; name: string } }>({\n  tempUser: async ({}, use) => {\n    const user = await createTestUser();\n    try {\n      await use(user);\n    } finally {\n      await deleteUser(user.id);\n    }\n  },\n});"
        },
        "validation": {
          "requiredKeywords": [
            "finally",
            "deleteUser(user.id)",
            "await use(user)"
          ],
          "solutionCode": "import { test as base } from '@playwright/test';\n\nexport const test = base.extend<{ tempUser: { id: string; name: string } }>({\n  tempUser: async ({}, use) => {\n    const user = await createTestUser();\n    try {\n      await use(user);\n    } finally {\n      await deleteUser(user.id);\n    }\n  },\n});"
        }
      },
      {
        "id": "drill-6-5",
        "moduleId": "fixtures",
        "drillNumber": "6.5",
        "title": "Mastery Gate: Authenticated Inventory Spec with Custom Fixtures",
        "type": "build-from-scratch",
        "isMasteryGate": true,
        "prompt": "Write a test that uses our custom fixture `test` from `../fixtures/test-base`.\nRequirements:\n1. Consume `{ inventoryPage }` directly from the fixture arguments.\n2. Directly navigate to `/inventory.html` (assuming storageState is loaded).\n3. Assert that the inventory title is visible.\n4. Add the backpack item to the cart using the page object method `addItemToCart`.\n5. Assert `cartBadge` has text \"1\".\n6. Mastery Requirement: Explain how `storageState` prevents test dependencies and database pollution compared to sharing a live browser instance across tests.",
        "starterCode": "import { test, expect } from '../fixtures/test-base';\n\ntest('authenticated user adds item using custom fixture', async ({ inventoryPage }) => {\n  // Write test\n});",
        "hints": {
          "tier1Concept": "With storageState, each test gets its own isolated browser context initialized with the pre-baked cookies. They run independently and in parallel!",
          "tier2Partial": "Use `await inventoryPage.page.goto(\"/inventory.html\");` then call `addItemToCart` and assert cartBadge.",
          "tier3Solution": "import { test, expect } from '../fixtures/test-base';\n\ntest('authenticated user adds item using custom fixture', async ({ inventoryPage }) => {\n  await inventoryPage.page.goto('/inventory.html');\n  await expect(inventoryPage.title).toBeVisible();\n  \n  await inventoryPage.addItemToCart('Sauce Labs Backpack');\n  await expect(inventoryPage.cartBadge).toHaveText('1');\n});"
        },
        "validation": {
          "requiredKeywords": [
            "inventoryPage.addItemToCart",
            "toHaveText('1')",
            "toBeVisible()"
          ],
          "expectedExplanationKeywords": [
            "isolated",
            "context",
            "parallel",
            "cookies",
            "session",
            "clean"
          ],
          "solutionCode": "import { test, expect } from '../fixtures/test-base';\n\ntest('authenticated user adds item using custom fixture', async ({ inventoryPage }) => {\n  await inventoryPage.page.goto('/inventory.html');\n  await expect(inventoryPage.title).toBeVisible();\n  \n  await inventoryPage.addItemToCart('Sauce Labs Backpack');\n  await expect(inventoryPage.cartBadge).toHaveText('1');\n});"
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 6 No-Notes Checkpoint",
      "scenario": "Explain the difference between a beforeEach hook and a Playwright fixture. How does Playwright storageState work in playwright.config.ts dependency projects?",
      "successCriteria": [
        "Explains fixtures are lazy-loaded and self-contained with teardown",
        "Explains auth setup project runs first, saves storageState JSON",
        "Explains worker contexts load storageState to bypass UI login"
      ]
    }
  },
  {
    "id": "api",
    "stage": "API",
    "title": "Module 7: API Mocking & Network Interception",
    "subtitle": "Controlling backend responses with page.route() to test edge cases, error codes, and speed up runs",
    "estimatedTime": "75 mins",
    "targetApp": "https://demoqa.com/books & Network Mocking Scenarios",
    "theorySections": [
      {
        "title": "The Power of page.route()",
        "content": "End-to-end tests frequently depend on third-party APIs (payment processors, SMS gateways, slow microservices). When those services go down, your test suite turns red through no fault of your frontend.\n\nPlaywright provides native socket-level routing via `page.route(urlPattern, handler)`:\n1. **Mock Responses**: Fulfill requests with mock JSON payloads instantly.\n2. **Simulate Outages**: Return HTTP 500, 403, or 504 gateway timeouts.\n3. **Modify Payloads**: Intercept real server responses and modify only specific fields.",
        "codeSnippet": {
          "language": "typescript",
          "caption": "tests/api/network-mock.spec.ts — Simulating a 500 Server Error",
          "code": "import { test, expect } from '@playwright/test';\n\ntest('handles server 500 error gracefully on inventory fetch', async ({ page }) => {\n  // 1. Intercept any call matching the API endpoint\n  await page.route('**/api/inventory', async (route) => {\n    // 2. Fulfill with simulated backend crash\n    await route.fulfill({\n      status: 500,\n      contentType: 'application/json',\n      body: JSON.stringify({ error: 'Database connection failed' }),\n    });\n  });\n\n  // 3. Navigate and verify UI error banner\n  await page.goto('/inventory');\n  await expect(page.getByRole('alert')).toHaveText('Unable to load catalog. Please try again.');\n});"
        }
      }
    ],
    "justInTimeTs": {
      "concept": "JSON serialization (`JSON.stringify` & `JSON.parse`) and TypeScript Interfaces",
      "whyNow": "API payloads require typed JSON structures when mocking responses.",
      "explanation": "We declare a TypeScript interface (e.g. `interface Book { title: string; author: string; }`) to guarantee our mock payload adheres to the real backend schema.",
      "codeExample": "interface ProductPayload {\n  id: number;\n  name: string;\n  price: number;\n}\n\nconst mockProduct: ProductPayload = {\n  id: 99,\n  name: 'Playwright Mastery Course',\n  price: 0,\n};"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "npx playwright test tests/api/network-mock.spec.ts",
        "description": "Execute our network mocking test suite",
        "expectedOutput": "1 passed (0.8s)"
      }
    ],
    "drills": [
      {
        "id": "drill-7-1",
        "moduleId": "api",
        "drillNumber": "7.1",
        "title": "Build from Scratch: Mocking an Empty State Payload",
        "type": "build-from-scratch",
        "prompt": "Write a test that intercepts `**/api/books` and returns an empty list `[]` with status 200.\nRequirements:\n1. Register `page.route('**/api/books', ...)`.\n2. Fulfill with status 200, contentType `'application/json'`, and body `JSON.stringify({ books: [] })`.\n3. Navigate to `https://demoqa.com/books`.\n4. Assert that a message \"No rows found\" or empty table is visible.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('displays empty state when books API returns zero results', async ({ page }) => {\n  // Your code\n});",
        "hints": {
          "tier1Concept": "Always register route handlers BEFORE triggering the navigation or action that initiates the network request.",
          "tier2Partial": "Use `await page.route(\"**/api/books\", async route => { await route.fulfill({...}); });` then `await page.goto(...)`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('displays empty state when books API returns zero results', async ({ page }) => {\n  await page.route('**/api/books', async (route) => {\n    await route.fulfill({\n      status: 200,\n      contentType: 'application/json',\n      body: JSON.stringify({ books: [] }),\n    });\n  });\n\n  await page.goto('https://demoqa.com/books');\n  await expect(page.getByText('No rows found')).toBeVisible();\n});"
        },
        "validation": {
          "requiredKeywords": [
            "page.route",
            "route.fulfill",
            "status: 200",
            "JSON.stringify"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('displays empty state when books API returns zero results', async ({ page }) => {\n  await page.route('**/api/books', async (route) => {\n    await route.fulfill({\n      status: 200,\n      contentType: 'application/json',\n      body: JSON.stringify({ books: [] }),\n    });\n  });\n\n  await page.goto('https://demoqa.com/books');\n  await expect(page.getByText('No rows found')).toBeVisible();\n});"
        }
      },
      {
        "id": "drill-7-2",
        "moduleId": "api",
        "drillNumber": "7.2",
        "title": "Build from Scratch: Simulating Server Outages (HTTP 500 Fault Injection)",
        "type": "build-from-scratch",
        "prompt": "Write a test that verifies frontend error resilience when an endpoint crashes.\nRequirements:\n1. Intercept `**/api/checkout` using `page.route`.\n2. Fulfill with `status: 500`, `contentType: 'application/json'`, and `body: JSON.stringify({ error: 'Internal Server Error' })`.\n3. Trigger checkout on the page.\n4. Assert that an alert banner containing text \"Unable to process order\" or error toast is visible.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('handles server 500 error gracefully', async ({ page }) => {\n  // Your code here\n});",
        "hints": {
          "tier1Concept": "Fault injection with `route.fulfill({ status: 500 })` allows testing disaster-recovery UI paths without destabilizing real servers.",
          "tier2Partial": "Route `**/api/checkout` with status 500, then trigger submission and assert the error message.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('handles server 500 error gracefully', async ({ page }) => {\n  await page.route('**/api/checkout', async (route) => {\n    await route.fulfill({\n      status: 500,\n      contentType: 'application/json',\n      body: JSON.stringify({ error: 'Internal Server Error' }),\n    });\n  });\n\n  await page.goto('/checkout.html');\n  await page.getByRole('button', { name: 'Complete Order' }).click();\n  await expect(page.getByText('Unable to process order')).toBeVisible();\n});"
        },
        "validation": {
          "requiredKeywords": [
            "status: 500",
            "page.route",
            "route.fulfill",
            "JSON.stringify"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('handles server 500 error gracefully', async ({ page }) => {\n  await page.route('**/api/checkout', async (route) => {\n    await route.fulfill({\n      status: 500,\n      contentType: 'application/json',\n      body: JSON.stringify({ error: 'Internal Server Error' }),\n    });\n  });\n\n  await page.goto('/checkout.html');\n  await page.getByRole('button', { name: 'Complete Order' }).click();\n  await expect(page.getByText('Unable to process order')).toBeVisible();\n});"
        }
      },
      {
        "id": "drill-7-3",
        "moduleId": "api",
        "drillNumber": "7.3",
        "title": "Build from Scratch: Direct API Testing via `request` Context",
        "type": "build-from-scratch",
        "prompt": "Playwright can execute API requests directly without launching a browser window using the `request` context fixture.\nWrite a test that:\n1. Sends a POST request to `/api/users` with JSON body `{ name: 'Alice', role: 'engineer' }`.\n2. Asserts `response.status()` is `201` or `expect(response).toBeOK()`.\n3. Asserts the parsed JSON response contains `name: 'Alice'`.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('creates user via direct API request', async ({ request }) => {\n  // Your code here\n});",
        "hints": {
          "tier1Concept": "Playwright's `request` fixture provides a lightweight, blazing fast HTTP client with built-in assertion matchers like `toBeOK()`.",
          "tier2Partial": "Call `const response = await request.post(\"/api/users\", { data: { name: \"Alice\", role: \"engineer\" } });`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('creates user via direct API request', async ({ request }) => {\n  const response = await request.post('/api/users', {\n    data: { name: 'Alice', role: 'engineer' },\n  });\n\n  expect(response.status()).toBe(201);\n  const data = await response.json();\n  expect(data).toMatchObject({ name: 'Alice', role: 'engineer' });\n});"
        },
        "validation": {
          "requiredKeywords": [
            "request.post",
            "response.status()",
            "response.json()"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('creates user via direct API request', async ({ request }) => {\n  const response = await request.post('/api/users', {\n    data: { name: 'Alice', role: 'engineer' },\n  });\n\n  expect(response.status()).toBe(201);\n  const data = await response.json();\n  expect(data).toMatchObject({ name: 'Alice', role: 'engineer' });\n});"
        }
      },
      {
        "id": "drill-7-4",
        "moduleId": "api",
        "drillNumber": "7.4",
        "title": "Spot and Fix: Route Interception Order and Unhandled Route Fallthrough",
        "type": "spot-and-fix",
        "prompt": "A test attempts to route requests, but navigates before registering the route listener, and leaves non-matching routes unhandled causing hanging requests.\nFix the code below so the route is registered before navigation and unhandled routes call `route.continue()`.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('intercept user profile', async ({ page }) => {\n  // BUG 1: Navigating BEFORE route is registered\n  await page.goto('/profile');\n\n  // BUG 2: Hanging route without fulfillment or continue\n  await page.route('**/api/user/**', async (route) => {\n    if (route.request().url().includes('settings')) {\n      await route.fulfill({ status: 200, json: { theme: 'dark' } });\n    }\n  });\n});",
        "hints": {
          "tier1Concept": "Routes must always be registered before navigation. Any branch of a route handler that does not fulfill or abort MUST call `route.continue()`.",
          "tier2Partial": "Move `page.route` before `page.goto`. Add `else { await route.continue(); }`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('intercept user profile', async ({ page }) => {\n  await page.route('**/api/user/**', async (route) => {\n    if (route.request().url().includes('settings')) {\n      await route.fulfill({ status: 200, json: { theme: 'dark' } });\n    } else {\n      await route.continue();\n    }\n  });\n\n  await page.goto('/profile');\n});"
        },
        "validation": {
          "requiredKeywords": [
            "route.continue()",
            "route.fulfill",
            "page.route"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('intercept user profile', async ({ page }) => {\n  await page.route('**/api/user/**', async (route) => {\n    if (route.request().url().includes('settings')) {\n      await route.fulfill({ status: 200, json: { theme: 'dark' } });\n    } else {\n      await route.continue();\n    }\n  });\n\n  await page.goto('/profile');\n});"
        }
      },
      {
        "id": "drill-7-5",
        "moduleId": "api",
        "drillNumber": "7.5",
        "title": "Mastery Gate: Modify Real API Response with `route.fetch()`",
        "type": "build-from-scratch",
        "isMasteryGate": true,
        "prompt": "Sometimes you want to test what happens when a real response has one specific field altered (e.g. VIP discount).\nWrite a route handler that:\n1. Calls `const response = await route.fetch();` to fetch the real backend response.\n2. Parses the JSON.\n3. Overrides the first item's price to `0.01`.\n4. Fulfills the route with the modified JSON.\n5. Mastery Requirement: Explain why `route.fetch()` is superior to making a separate unintercepted axios/fetch request inside the test.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('modifies real response using route.fetch', async ({ page }) => {\n  await page.route('**/api/products', async (route) => {\n    // 1. Fetch real response\n    // 2. Parse and modify\n    // 3. Fulfill with modified payload\n  });\n});",
        "hints": {
          "tier1Concept": "`route.fetch()` forwards the browser request with all original session cookies, auth headers, and query parameters intact.",
          "tier2Partial": "Call `const response = await route.fetch(); const json = await response.json(); json[0].price = 0.01; await route.fulfill({ response, json });`",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('modifies real response using route.fetch', async ({ page }) => {\n  await page.route('**/api/products', async (route) => {\n    const response = await route.fetch();\n    const json = await response.json();\n    json[0].price = 0.01;\n    await route.fulfill({ response, json });\n  });\n});"
        },
        "validation": {
          "requiredKeywords": [
            "route.fetch()",
            "response.json()",
            "route.fulfill"
          ],
          "expectedExplanationKeywords": [
            "headers",
            "cookies",
            "auth",
            "credentials",
            "forward",
            "seamless"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('modifies real response using route.fetch', async ({ page }) => {\n  await page.route('**/api/products', async (route) => {\n    const response = await route.fetch();\n    const json = await response.json();\n    json[0].price = 0.01;\n    await route.fulfill({ response, json });\n  });\n});"
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 7 No-Notes Checkpoint",
      "scenario": "Describe how you would simulate a 504 Gateway Timeout on a payment endpoint `/api/charge` and verify that the UI displays a retry button.",
      "successCriteria": [
        "Uses page.route(\"**/api/charge\", ...)",
        "Fulfills with status: 504 and error body",
        "Asserts retry button is visible via getByRole(\"button\", { name: \"Retry\" })"
      ]
    }
  },
  {
    "id": "cicd",
    "stage": "CI/CD",
    "title": "Module 8: CI/CD on Ubuntu & GitHub Actions",
    "subtitle": "Automating headless execution on GitHub-hosted Ubuntu runners with reports & artifacts",
    "estimatedTime": "60 mins",
    "targetApp": "GitHub Actions (.github/workflows/playwright.yml)",
    "theorySections": [
      {
        "title": "The Default GitHub Actions Pattern on Ubuntu",
        "content": "Continuous Integration ensures every pull request runs your automated suite before merging.\nPer modern best practices, we use a plain GitHub-hosted Ubuntu runner (`ubuntu-latest`):\n1. Checkout code.\n2. Setup Node.js with dependency caching.\n3. `npm ci` (clean reproducible install).\n4. `npx playwright install --with-deps` (installs browsers and Ubuntu system shared libraries).\n5. `npx playwright test`.\n6. Upload `playwright-report/` and `test-results/` as artifacts on failure.\n\nWhy start with plain Ubuntu runner before Docker?\nGitHub-hosted runners boot in seconds, caching works seamlessly, and maintenance overhead is near-zero. Docker is an advanced tool reserved for strict pixel-perfect visual regression parity.",
        "codeSnippet": {
          "language": "yaml",
          "caption": ".github/workflows/playwright.yml — Industry Standard Workflow",
          "code": "name: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\n\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v4\n    \n    - uses: actions/setup-node@v4\n      with:\n        node-version: lts/*\n        cache: 'npm'\n        \n    - name: Install dependencies\n      run: npm ci\n      \n    - name: Install Playwright Browsers & OS Dependencies\n      run: npx playwright install --with-deps\n      \n    - name: Run Playwright tests\n      run: npx playwright test\n      env:\n        CI: true\n        \n    - uses: actions/upload-artifact@v4\n    if: ${{ !cancelled() }}\n    with:\n      name: playwright-report\n      path: playwright-report/\n      retention-days: 30"
        }
      }
    ],
    "justInTimeTs": {
      "concept": "CI Environment Variables (`process.env.CI`)",
      "whyNow": "Playwright detects `process.env.CI` to automatically enable `forbidOnly`, configure retry counts, and generate HTML reports.",
      "explanation": "GitHub Actions automatically sets `CI=true` in its environment. In our TypeScript code, we can adjust behavior based on this flag.",
      "codeExample": "// Adjust workers dynamically based on CI environment variable:\nexport default defineConfig({\n  workers: process.env.CI ? 1 : undefined,\n  retries: process.env.CI ? 2 : 0,\n});"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "mkdir -p .github/workflows && touch .github/workflows/playwright.yml",
        "description": "Create the GitHub Actions workflow file in the repository",
        "expectedOutput": ""
      },
      {
        "command": "git status",
        "description": "Verify all project files, configs, and workflow are tracked",
        "expectedOutput": "On branch main\nUntracked files: .github/workflows/playwright.yml"
      }
    ],
    "drills": [
      {
        "id": "drill-8-1",
        "moduleId": "cicd",
        "drillNumber": "8.1",
        "title": "Spot and Fix: Missing CI Dependency Step",
        "type": "spot-and-fix",
        "prompt": "A team deployed this GitHub Actions workflow on Ubuntu, and the run crashed on the test step with:\n\"Host system is missing dependencies to run browsers\".\nIdentify what step is missing or wrong, and fix the workflow snippet.",
        "starterCode": "- name: Install dependencies\n  run: npm ci\n\n# FIX ME: Missing browser OS dependencies command\n- name: Run Playwright tests\n  run: npx playwright test",
        "hints": {
          "tier1Concept": "A fresh GitHub Ubuntu runner does not have browser binaries or their required C/C++ graphical dependencies pre-installed.",
          "tier2Partial": "Add a step with `npx playwright install --with-deps` before running the tests.",
          "tier3Solution": "- name: Install dependencies\n  run: npm ci\n\n- name: Install Playwright Browsers and OS Dependencies\n  run: npx playwright install --with-deps\n\n- name: Run Playwright tests\n  run: npx playwright test"
        },
        "validation": {
          "requiredKeywords": [
            "npx playwright install --with-deps"
          ],
          "solutionCode": "- name: Install dependencies\n  run: npm ci\n\n- name: Install Playwright Browsers and OS Dependencies\n  run: npx playwright install --with-deps\n\n- name: Run Playwright tests\n  run: npx playwright test"
        }
      },
      {
        "id": "drill-8-2",
        "moduleId": "cicd",
        "drillNumber": "8.2",
        "title": "Build from Scratch: Matrix Test Sharding in GitHub Actions Workflow",
        "type": "build-from-scratch",
        "prompt": "Configure GitHub Actions matrix test sharding to split Playwright execution across 4 parallel Ubuntu jobs:\nRequirements:\n1. Define `strategy:` with `matrix:` containing `shard: [1, 2, 3, 4]`.\n2. In the test execution step, run Playwright with `npx playwright test --shard=${{ matrix.shard }}/4`.",
        "starterCode": "jobs:\n  test:\n    runs-on: ubuntu-24.04\n    # 1. Define matrix strategy for 4 shards:\n    \n    steps:\n      - uses: actions/checkout@v4\n      - name: Run Sharded Tests\n        # 2. Run test with shard parameter:",
        "hints": {
          "tier1Concept": "Sharding splits your test files evenly across multiple runner machines in parallel, dividing overall CI duration by the shard count.",
          "tier2Partial": "Use `strategy: matrix: shard: [1, 2, 3, 4]` and run with `--shard=${{ matrix.shard }}/4`.",
          "tier3Solution": "jobs:\n  test:\n    runs-on: ubuntu-24.04\n    strategy:\n      matrix:\n        shard: [1, 2, 3, 4]\n    steps:\n      - uses: actions/checkout@v4\n      - name: Run Sharded Tests\n        run: npx playwright test --shard=${{ matrix.shard }}/4"
        },
        "validation": {
          "requiredKeywords": [
            "matrix:",
            "shard: [1, 2, 3, 4]",
            "--shard="
          ],
          "solutionCode": "jobs:\n  test:\n    runs-on: ubuntu-24.04\n    strategy:\n      matrix:\n        shard: [1, 2, 3, 4]\n    steps:\n      - uses: actions/checkout@v4\n      - name: Run Sharded Tests\n        run: npx playwright test --shard=${{ matrix.shard }}/4"
        }
      },
      {
        "id": "drill-8-3",
        "moduleId": "cicd",
        "drillNumber": "8.3",
        "title": "Spot and Fix: Broken Trace Retention on Flaky CI Tests",
        "type": "spot-and-fix",
        "prompt": "A team has flaky tests in CI, but their `playwright.config.ts` has `trace: 'off'` and their workflow deletes traces on job exit.\nFix the configuration so that traces are captured whenever a test fails on retry (`'on-first-retry'`) and videos are retained on failure (`'retain-on-failure'`).",
        "starterCode": "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  use: {\n    // FIX ME: Missing trace forensics on failure\n    trace: 'off',\n    video: 'off',\n  },\n});",
        "hints": {
          "tier1Concept": "Capturing traces only when retrying saves CI disk bandwidth while providing the full DOM and network replay when a real test flakes.",
          "tier2Partial": "Set `trace: \"on-first-retry\"` and `video: \"retain-on-failure\"`.",
          "tier3Solution": "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  use: {\n    trace: 'on-first-retry',\n    video: 'retain-on-failure',\n  },\n});"
        },
        "validation": {
          "requiredKeywords": [
            "trace: 'on-first-retry'",
            "video: 'retain-on-failure'"
          ],
          "solutionCode": "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  use: {\n    trace: 'on-first-retry',\n    video: 'retain-on-failure',\n  },\n});"
        }
      },
      {
        "id": "drill-8-4",
        "moduleId": "cicd",
        "drillNumber": "8.4",
        "title": "Build from Scratch: Conditional Artifact Upload for Test Reports",
        "type": "build-from-scratch",
        "prompt": "Write the YAML step that uploads the `playwright-report/` folder as an artifact.\nRequirements:\n1. Use `actions/upload-artifact@v4`.\n2. It must run even if previous steps failed (use `if: always()`).\n3. Set `name: playwright-report` and `path: playwright-report/`.\n4. Set `retention-days: 30`.",
        "starterCode": "- name: Upload Playwright Report\n  # Your YAML definition here",
        "hints": {
          "tier1Concept": "By default, GitHub Actions cancels subsequent steps when a previous step fails. Using `if: always()` guarantees reports upload even on failure.",
          "tier2Partial": "Set `if: always()`, with `name: playwright-report` and `path: playwright-report/`.",
          "tier3Solution": "- name: Upload Playwright Report\n  uses: actions/upload-artifact@v4\n  if: always()\n  with:\n    name: playwright-report\n    path: playwright-report/\n    retention-days: 30"
        },
        "validation": {
          "requiredKeywords": [
            "actions/upload-artifact@v4",
            "always()",
            "playwright-report/"
          ],
          "solutionCode": "- name: Upload Playwright Report\n  uses: actions/upload-artifact@v4\n  if: always()\n  with:\n    name: playwright-report\n    path: playwright-report/\n    retention-days: 30"
        }
      },
      {
        "id": "drill-8-5",
        "moduleId": "cicd",
        "drillNumber": "8.5",
        "title": "Mastery Gate: Complete Production Ubuntu GitHub Actions Workflow",
        "type": "build-from-scratch",
        "isMasteryGate": true,
        "prompt": "Write the complete `.github/workflows/playwright.yml` workflow file:\nRequirements:\n1. Trigger on `push` and `pull_request` to branch `main`.\n2. Job runs on `ubuntu-24.04`.\n3. Steps: Checkout code (`actions/checkout@v4`), setup Node 20 (`actions/setup-node@v4`), install dependencies (`npm ci`), install browser dependencies (`npx playwright install --with-deps`), execute tests (`npx playwright test`), and upload report with `actions/upload-artifact@v4` with `if: always()`.\n4. Mastery Requirement: Explain why `npm ci` and `--with-deps` are mandatory on ephemeral Linux cloud runners.",
        "starterCode": "name: Playwright Tests\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  test:\n    # Implement complete job",
        "hints": {
          "tier1Concept": "A complete CI pipeline combines deterministic dependency resolution with system browser installation and guaranteed forensic artifact retention.",
          "tier2Partial": "Combine checkout, setup-node, npm ci, npx playwright install --with-deps, npx playwright test, and conditional artifact upload.",
          "tier3Solution": "name: Playwright Tests\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  test:\n    runs-on: ubuntu-24.04\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - name: Install dependencies\n        run: npm ci\n      - name: Install Playwright Browsers and OS Dependencies\n        run: npx playwright install --with-deps\n      - name: Run Playwright tests\n        run: npx playwright test\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: playwright-report\n          path: playwright-report/\n          retention-days: 30"
        },
        "validation": {
          "requiredKeywords": [
            "ubuntu-24.04",
            "npm ci",
            "npx playwright install --with-deps",
            "npx playwright test",
            "actions/upload-artifact@v4"
          ],
          "expectedExplanationKeywords": [
            "deterministic",
            "package-lock",
            "dependencies",
            "ephemeral",
            "clean",
            "linux"
          ],
          "solutionCode": "name: Playwright Tests\non:\n  push:\n    branches: [ main ]\n  pull_request:\n    branches: [ main ]\n\njobs:\n  test:\n    runs-on: ubuntu-24.04\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - name: Install dependencies\n        run: npm ci\n      - name: Install Playwright Browsers and OS Dependencies\n        run: npx playwright install --with-deps\n      - name: Run Playwright tests\n        run: npx playwright test\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: playwright-report\n          path: playwright-report/\n          retention-days: 30"
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 8 No-Notes Checkpoint",
      "scenario": "Explain the difference between running Playwright directly on a GitHub-hosted Ubuntu runner vs inside the official Microsoft Playwright Docker container (`mcr.microsoft.com/playwright`). When would you actually need Docker?",
      "successCriteria": [
        "Explains plain runner is faster to boot and simpler to maintain",
        "Explains Docker guarantees identical OS font rendering and pixel-perfect screenshot parity",
        "Identifies visual regression testing as the primary reason for Docker"
      ]
    }
  },
  {
    "id": "capstone",
    "stage": "Capstone",
    "title": "Module 9: Capstone Portfolio Suite",
    "subtitle": "Bringing it all together: POM, Fixtures, Auth Bypass, Network Interception & CI Badge",
    "estimatedTime": "90 mins",
    "targetApp": "Full Production Suite: SauceDemo & The Internet",
    "theorySections": [
      {
        "title": "The Portfolio-Ready Capstone Architecture",
        "content": "Congratulations on reaching the final milestone!\nYour portfolio project demonstrates to hiring managers that you write enterprise-grade test automation:\n\nSuite Deliverables:\n1. **POM Architecture**: Clean separation between locators, action methods, and test specifications.\n2. **Fixture-Driven**: Custom test fixtures with zero boilerplate.\n3. **Auth Bypass**: Fast execution using `storageState`.\n4. **Network Interception**: Mocking edge cases and server error states via `page.route()`.\n5. **Complex UI**: Handling iframes, dialogs, or file downloads without brittle pauses.\n6. **Green CI Pipeline**: Automated GitHub Actions badge on a public repository README.",
        "codeSnippet": {
          "language": "markdown",
          "caption": "README.md — Portfolio Capstone Presentation",
          "code": "# Playwright & TypeScript Enterprise Automation Suite\n\n[![Playwright Tests](https://github.com/your-username/playwright-capstone/actions/workflows/playwright.yml/badge.svg)](https://github.com/your-username/playwright-capstone/actions)\n\nAn enterprise end-to-end test automation framework built with Playwright and TypeScript, implementing the Page Object Model (POM), custom dependency-injected fixtures, authentication state bypass, network mocking, and automated GitHub Actions CI pipelines on Ubuntu.\n\n## Architecture Highlights\n- **Web-First Locators**: 100% adherence to accessible roles (`getByRole`, `getByLabel`).\n- **Zero Flakiness**: Eliminates all arbitrary timeouts through auto-retrying web-first assertions.\n- **Session State Reuse**: Authenticates once via `auth.setup.ts` and reuses `storageState`.\n- **Network Isolation**: Edge cases mocked with `page.route()` and `route.fulfill()`."
        }
      }
    ],
    "justInTimeTs": {
      "concept": "Full TypeScript Strict Mode & Type Safety",
      "whyNow": "Production suites enable `\"strict\": true` in `tsconfig.json` to prevent any implicit `any` types.",
      "explanation": "Strict mode catches undefined checks, missing return types, and ensures your test suite is maintainable by entire QA teams.",
      "codeExample": "// Strict TypeScript interface contract:\nexport interface UserCredentials {\n  username: string;\n  role: 'standard' | 'locked_out' | 'problem';\n}"
    },
    "ubuntuTerminalCommands": [
      {
        "command": "npx playwright test --reporter=html",
        "description": "Generate full HTML report of our complete capstone suite",
        "expectedOutput": "12 passed (6.4s)\nTo open last HTML report run: npx playwright show-report"
      }
    ],
    "drills": [
      {
        "id": "drill-9-1",
        "moduleId": "capstone",
        "drillNumber": "9.1",
        "title": "Complex UI: Handling Browser Dialogs & Native Alerts",
        "type": "build-from-scratch",
        "prompt": "On `https://the-internet.herokuapp.com/javascript_alerts`:\n1. Register a dialog handler `page.once('dialog', async dialog => { await dialog.accept(); })` that accepts the alert.\n2. Click the button with accessible role `button` and name \"Click for JS Alert\".\n3. Assert that the result element has text \"You successfully clicked an alert\".",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('handles native javascript alert dialog', async ({ page }) => {\n  // Implement dialog listener and action\n});",
        "hints": {
          "tier1Concept": "Playwright auto-dismisses dialogs by default. To accept or provide text, you must register a dialog listener before clicking the trigger.",
          "tier2Partial": "Use `page.once(\"dialog\", dialog => dialog.accept());` then click the button.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('handles native javascript alert dialog', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');\n  \n  page.once('dialog', async (dialog) => {\n    await dialog.accept();\n  });\n\n  await page.getByRole('button', { name: 'Click for JS Alert' }).click();\n  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');\n});"
        },
        "validation": {
          "requiredKeywords": [
            "page.once('dialog'",
            "dialog.accept()",
            "Click for JS Alert",
            "toHaveText"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('handles native javascript alert dialog', async ({ page }) => {\n  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');\n  \n  page.once('dialog', async (dialog) => {\n    await dialog.accept();\n  });\n\n  await page.getByRole('button', { name: 'Click for JS Alert' }).click();\n  await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');\n});"
        }
      },
      {
        "id": "drill-9-2",
        "moduleId": "capstone",
        "drillNumber": "9.2",
        "title": "Build from Scratch: Nested Iframes with `frameLocator`",
        "type": "build-from-scratch",
        "prompt": "When interacting with elements inside iframes, Playwright provides the modern `frameLocator()` API which retains full auto-waiting.\nWrite a test that:\n1. Navigates to a page containing an iframe `iframe#app-frame`.\n2. Scopes inside the frame using `const frame = page.frameLocator('#app-frame')`.\n3. Fills the input with placeholder \"Search query\" with `'Playwright architecture'`.\n4. Clicks the button with role `button` and name \"Search\".\n5. Asserts the result container inside the frame has text \"Found 12 results\".",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('interacts seamlessly with elements inside an iframe', async ({ page }) => {\n  // Your code here\n});",
        "hints": {
          "tier1Concept": "`page.frameLocator()` creates a frame locator that automatically waits for the iframe element to appear and its document to be ready.",
          "tier2Partial": "Call `const frame = page.frameLocator(\"#app-frame\");` then query locators directly from `frame.getByPlaceholder(...)`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('interacts seamlessly with elements inside an iframe', async ({ page }) => {\n  await page.goto('/iframe-demo');\n  \n  const frame = page.frameLocator('#app-frame');\n  await frame.getByPlaceholder('Search query').fill('Playwright architecture');\n  await frame.getByRole('button', { name: 'Search' }).click();\n\n  await expect(frame.locator('.search-results')).toHaveText('Found 12 results');\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout"
          ],
          "requiredKeywords": [
            "frameLocator",
            "getByPlaceholder",
            "getByRole"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('interacts seamlessly with elements inside an iframe', async ({ page }) => {\n  await page.goto('/iframe-demo');\n  \n  const frame = page.frameLocator('#app-frame');\n  await frame.getByPlaceholder('Search query').fill('Playwright architecture');\n  await frame.getByRole('button', { name: 'Search' }).click();\n\n  await expect(frame.locator('.search-results')).toHaveText('Found 12 results');\n});"
        }
      },
      {
        "id": "drill-9-3",
        "moduleId": "capstone",
        "drillNumber": "9.3",
        "title": "Build from Scratch: Multi-Tab & Popup Orchestration",
        "type": "build-from-scratch",
        "prompt": "When a user clicks a link with `target=\"_blank\"`, the browser opens a new tab.\nWrite a test that:\n1. Waits for the popup event while clicking the link:\n```ts\nconst [newPage] = await Promise.all([\n  context.waitForEvent('popup'),\n  page.getByRole('link', { name: 'Terms of Service' }).click(),\n]);\n```\n2. Asserts `await expect(newPage).toHaveURL(/.*terms/)`.\n3. Asserts that the new page heading displays \"Terms of Service\".",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('handles new browser window or popup tab', async ({ context, page }) => {\n  // Your implementation here\n});",
        "hints": {
          "tier1Concept": "To avoid race conditions, start waiting for the popup before triggering the action that opens it using `Promise.all`.",
          "tier2Partial": "Use `context.waitForEvent(\"popup\")` concurrently with the click action, then assert `newPage`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('handles new browser window or popup tab', async ({ context, page }) => {\n  await page.goto('/');\n\n  const [newPage] = await Promise.all([\n    context.waitForEvent('popup'),\n    page.getByRole('link', { name: 'Terms of Service' }).click(),\n  ]);\n\n  await expect(newPage).toHaveURL(/.*terms/);\n  await expect(newPage.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();\n});"
        },
        "validation": {
          "requiredKeywords": [
            "context.waitForEvent('popup')",
            "Promise.all",
            "newPage"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('handles new browser window or popup tab', async ({ context, page }) => {\n  await page.goto('/');\n\n  const [newPage] = await Promise.all([\n    context.waitForEvent('popup'),\n    page.getByRole('link', { name: 'Terms of Service' }).click(),\n  ]);\n\n  await expect(newPage).toHaveURL(/.*terms/);\n  await expect(newPage.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();\n});"
        }
      },
      {
        "id": "drill-9-4",
        "moduleId": "capstone",
        "drillNumber": "9.4",
        "title": "Spot and Fix: Flakiness Architecture Review",
        "type": "spot-and-fix",
        "prompt": "Review this legacy-style test and refactor it according to modern Playwright zero-flakiness standards:\n1. Eliminate `waitForTimeout(5000)`.\n2. Replace brittle deep XPath with semantic `getByRole` or `getByPlaceholder`.\n3. Add missing `await` keywords on actions.\n4. Replace synchronous `isVisible()` assertion with web-first auto-retrying `await expect(...).toBeVisible()`.",
        "starterCode": "import { test, expect } from '@playwright/test';\n\ntest('legacy flaky test', async ({ page }) => {\n  await page.goto('/checkout');\n  \n  // FIX ME: Brittle selector & missing await\n  page.locator('/html/body/div[1]/form/div[2]/input').fill('standard_user');\n  \n  // FIX ME: Sleep anti-pattern\n  await page.waitForTimeout(5000);\n  \n  // FIX ME: Brittle selector\n  await page.locator('.submit-btn').click();\n  \n  // FIX ME: Flaky synchronous boolean check\n  const ok = await page.locator('.success-banner').isVisible();\n  expect(ok).toBe(true);\n});",
        "hints": {
          "tier1Concept": "Zero-flakiness architecture requires web-first locators, awaiting all asynchronous actions, and auto-retrying web-first assertions.",
          "tier2Partial": "Use `getByPlaceholder`, await every line, remove `waitForTimeout`, and use `await expect(page.locator(\".success-banner\")).toBeVisible()`.",
          "tier3Solution": "import { test, expect } from '@playwright/test';\n\ntest('legacy flaky test', async ({ page }) => {\n  await page.goto('/checkout');\n  \n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByRole('button', { name: 'Submit' }).click();\n  \n  await expect(page.locator('.success-banner')).toBeVisible();\n});"
        },
        "validation": {
          "forbiddenKeywords": [
            "waitForTimeout",
            "/html/body",
            "expect(ok).toBe"
          ],
          "requiredKeywords": [
            "await page.",
            "toBeVisible()"
          ],
          "solutionCode": "import { test, expect } from '@playwright/test';\n\ntest('legacy flaky test', async ({ page }) => {\n  await page.goto('/checkout');\n  \n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByRole('button', { name: 'Submit' }).click();\n  \n  await expect(page.locator('.success-banner')).toBeVisible();\n});"
        }
      },
      {
        "id": "drill-9-5",
        "moduleId": "capstone",
        "drillNumber": "9.5",
        "title": "Mastery Gate & Capstone Defense: Architecture Review",
        "type": "explain-concept",
        "isMasteryGate": true,
        "prompt": "Defend your automated test architecture as if presenting to a Principal QA Architect:\n1. Explain how Page Object Model + Custom Fixtures achieved DRY principles in our cumulative suite.\n2. Explain the execution speed and reliability difference between UI login vs `storageState`.\n3. Explain why web-first locators and web-first assertions guarantee that your GitHub Actions CI runs on Ubuntu stay green without arbitrary timeouts.",
        "starterCode": "// Capstone Architecture Defense:\n// 1. POM + Fixtures:\n// 2. StorageState Performance:\n// 3. Web-First Reliability on CI:",
        "hints": {
          "tier1Concept": "Synthesize the three pillars of modern Playwright: Architecture (POM & Fixtures), Performance (StorageState), and Reliability (Web-First Locators & Assertions).",
          "tier2Partial": "Discuss encapsulation, lazy fixture injection, bypassing repetitive UI HTTP requests, and auto-waiting.",
          "tier3Solution": "1. POM encapsulates DOM locators and page actions in classes, while Fixtures inject them lazily without boilerplate, ensuring changes only touch one file.\n2. StorageState bypasses repetitive UI login steps, saving minutes of CI execution and isolating tests from authentication flakiness.\n3. Web-first locators mimic accessible user behavior, and web-first assertions automatically poll and retry until the DOM settles, completely eliminating arbitrary sleep timeouts."
        },
        "validation": {
          "requiredKeywords": [
            "encapsulat",
            "fixture",
            "storageState",
            "auto-wait",
            "retry",
            "accessible"
          ],
          "solutionCode": "1. POM encapsulates locators and actions; Fixtures inject them lazily.\n2. StorageState saves minutes of CI time and isolates test contexts.\n3. Web-first locators and auto-retrying assertions eliminate sleep-based flakiness."
        }
      }
    ],
    "checkpointScenario": {
      "title": "Module 9 Capstone Checkpoint",
      "scenario": "You are submitting your repository link to a senior hiring manager. State the 5 core highlights in your README that prove your test engineering seniority.",
      "successCriteria": [
        "Page Object Model + TypeScript strict typing",
        "Custom fixtures with automatic setup/teardown",
        "Auth bypass with storageState",
        "Network route mocking for failure injection",
        "Passing GitHub Actions workflow on Ubuntu with HTML artifact uploads"
      ]
    }
  }
];

export const CUMULATIVE_PROJECT_FILES: ProjectFile[] = [
  {
    "path": "playwright.config.ts",
    "description": "Central test runner configuration, browser matrix, base URL, and trace policy",
    "language": "typescript",
    "moduleIntroduced": "Setup",
    "content": "import { defineConfig, devices } from '@playwright/test';\n\n/**\n * See https://playwright.dev/docs/test-configuration.\n */\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 1 : undefined,\n  reporter: [\n    ['html', { open: 'never' }],\n    ['list']\n  ],\n  \n  use: {\n    baseURL: 'https://www.saucedemo.com',\n    trace: 'on-first-retry',\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure',\n  },\n\n  projects: [\n    // Setup project for authentication bypass\n    {\n      name: 'setup',\n      testMatch: /.*\\.setup\\.ts/,\n    },\n    {\n      name: 'chromium',\n      use: { \n        ...devices['Desktop Chrome'],\n        // Load authenticated state once Module 6 is reached:\n        // storageState: 'playwright/.auth/user.json',\n      },\n      dependencies: ['setup'],\n    },\n    {\n      name: 'firefox',\n      use: { ...devices['Desktop Firefox'] },\n      dependencies: ['setup'],\n    },\n    {\n      name: 'webkit',\n      use: { ...devices['Desktop Safari'] },\n      dependencies: ['setup'],\n    },\n  ],\n});"
  },
  {
    "path": "package.json",
    "description": "Project manifest with dependencies and npm test scripts",
    "language": "json",
    "moduleIntroduced": "Setup",
    "content": "{\n  \"name\": \"playwright-mastery-capstone\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Enterprise Playwright & TypeScript test automation suite\",\n  \"scripts\": {\n    \"test\": \"playwright test\",\n    \"test:ui\": \"playwright test --ui\",\n    \"test:headed\": \"playwright test --headed\",\n    \"test:debug\": \"playwright test --debug\",\n    \"report\": \"playwright show-report\"\n  },\n  \"devDependencies\": {\n    \"@playwright/test\": \"^1.49.0\",\n    \"@types/node\": \"^22.0.0\",\n    \"typescript\": \"^5.6.0\"\n  }\n}"
  },
  {
    "path": "pages/LoginPage.ts",
    "description": "Page Object for SauceDemo authentication page",
    "language": "typescript",
    "moduleIntroduced": "POM",
    "refactorNote": "Refactored from tests/e2e/login.spec.ts in Module 5",
    "content": "import { type Page, type Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly loginButton: Locator;\n  readonly errorMessage: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByPlaceholder('Username');\n    this.passwordInput = page.getByPlaceholder('Password');\n    this.loginButton = page.getByRole('button', { name: 'Login' });\n    this.errorMessage = page.locator('[data-test=\"error\"]');\n  }\n\n  async goto() {\n    await this.page.goto('/');\n  }\n\n  async login(username: string, password: string) {\n    await this.usernameInput.fill(username);\n    await this.passwordInput.fill(password);\n    await this.loginButton.click();\n  }\n}"
  },
  {
    "path": "pages/InventoryPage.ts",
    "description": "Page Object for SauceDemo product catalog and cart operations",
    "language": "typescript",
    "moduleIntroduced": "POM",
    "refactorNote": "Introduced in Module 5 to encapsulate inventory interactions",
    "content": "import { type Page, type Locator } from '@playwright/test';\n\nexport class InventoryPage {\n  readonly page: Page;\n  readonly title: Locator;\n  readonly cartBadge: Locator;\n  readonly shoppingCartLink: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.title = page.getByText('Products');\n    this.cartBadge = page.locator('.shopping_cart_badge');\n    this.shoppingCartLink = page.locator('.shopping_cart_link');\n  }\n\n  async addItemToCart(itemName: string) {\n    await this.page\n      .locator('.inventory_item')\n      .filter({ hasText: itemName })\n      .getByRole('button', { name: 'Add to cart' })\n      .click();\n  }\n\n  async goToCart() {\n    await this.shoppingCartLink.click();\n  }\n}"
  },
  {
    "path": "fixtures/test-base.ts",
    "description": "Custom test runner fixture extending standard Playwright test with Page Objects",
    "language": "typescript",
    "moduleIntroduced": "Fixtures",
    "refactorNote": "Introduced in Module 6 to eliminate manual new Page() boilerplate",
    "content": "import { test as base } from '@playwright/test';\nimport { LoginPage } from '../pages/LoginPage';\nimport { InventoryPage } from '../pages/InventoryPage';\n\n// Declare custom fixture types\ntype AppFixtures = {\n  loginPage: LoginPage;\n  inventoryPage: InventoryPage;\n};\n\n// Extend base test with lazy-loaded fixtures\nexport const test = base.extend<AppFixtures>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await use(loginPage);\n  },\n\n  inventoryPage: async ({ page }, use) => {\n    const inventoryPage = new InventoryPage(page);\n    await use(inventoryPage);\n  },\n});\n\nexport { expect } from '@playwright/test';"
  },
  {
    "path": "tests/auth.setup.ts",
    "description": "Global authentication setup project creating storageState session",
    "language": "typescript",
    "moduleIntroduced": "Fixtures",
    "content": "import { test as setup, expect } from '@playwright/test';\n\nconst authFile = 'playwright/.auth/user.json';\n\nsetup('authenticate standard user', async ({ page }) => {\n  await page.goto('/');\n  await page.getByPlaceholder('Username').fill('standard_user');\n  await page.getByPlaceholder('Password').fill('secret_sauce');\n  await page.getByRole('button', { name: 'Login' }).click();\n\n  await expect(page).toHaveURL(/.*inventory.html/);\n\n  // Save signed-in state to disk for reuse by all subsequent tests\n  await page.context().storageState({ path: authFile });\n});"
  },
  {
    "path": "tests/e2e/login.spec.ts",
    "description": "E2E login specifications refactored through POM & custom fixtures",
    "language": "typescript",
    "moduleIntroduced": "Basics",
    "refactorNote": "Originally procedural script in Module 2, refactored to POM in Module 5 and Fixtures in Module 6",
    "content": "import { test, expect } from '../../fixtures/test-base';\n\ntest.describe('SauceDemo Authentication Flow', () => {\n  test('standard user can log in and view product catalog', async ({ loginPage, inventoryPage }) => {\n    await loginPage.goto();\n    await loginPage.login('standard_user', 'secret_sauce');\n\n    await expect(inventoryPage.title).toBeVisible();\n    await expect(loginPage.page).toHaveURL(/.*inventory.html/);\n  });\n\n  test('displays error message when credentials are invalid', async ({ loginPage }) => {\n    await loginPage.goto();\n    await loginPage.login('invalid_user', 'wrong_password');\n\n    await expect(loginPage.errorMessage).toBeVisible();\n    await expect(loginPage.errorMessage).toContainText('Username and password do not match');\n  });\n});"
  },
  {
    "path": "tests/api/network-mock.spec.ts",
    "description": "Network route interception and failure simulation tests",
    "language": "typescript",
    "moduleIntroduced": "API",
    "content": "import { test, expect } from '@playwright/test';\n\ntest.describe('API Mocking & Resilience', () => {\n  test('handles 500 internal server error with user-friendly alert', async ({ page }) => {\n    // Intercept catalog API call and simulate server failure\n    await page.route('**/api/catalog', async (route) => {\n      await route.fulfill({\n        status: 500,\n        contentType: 'application/json',\n        body: JSON.stringify({ error: 'Internal Database Crash' }),\n      });\n    });\n\n    await page.goto('/catalog');\n    await expect(page.getByRole('alert')).toBeVisible();\n  });\n});"
  },
  {
    "path": ".github/workflows/playwright.yml",
    "description": "Production GitHub Actions workflow for Ubuntu CI runner with HTML artifacts",
    "language": "yaml",
    "moduleIntroduced": "CI/CD",
    "content": "name: Playwright CI Suite\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\n\njobs:\n  test:\n    name: Run Headless Tests on Ubuntu\n    timeout-minutes: 30\n    runs-on: ubuntu-latest\n    \n    steps:\n      - name: Checkout Code\n        uses: actions/checkout@v4\n\n      - name: Set up Node.js LTS\n        uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'npm'\n\n      - name: Install Dependencies\n        run: npm ci\n\n      - name: Install Playwright Browsers & Linux OS Dependencies\n        run: npx playwright install --with-deps\n\n      - name: Run Playwright Test Suite\n        run: npx playwright test\n        env:\n          CI: true\n\n      - name: Upload HTML Test Report Artifact\n        uses: actions/upload-artifact@v4\n        if: ${{ !cancelled() }}\n        with:\n          name: playwright-report\n          path: playwright-report/\n          retention-days: 30"
  }
];
