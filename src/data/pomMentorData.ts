export interface PomMentorDrill {
  id: string;
  level: number;
  levelTitle: string;
  drillNumber: string;
  title: string;
  scenario: string;
  startingCode: string;
  task: string;
  successCriteria: string[];
  hint: string;
  focusSkills?: string[];
  beginnerGuide?: {
    concept: string;
    whyItMatters: string;
    mentalModel: string;
    sampleCode: string;
    sampleDescription: string;
  };
  validation: {
    requiredKeywords: string[];
    forbiddenKeywords?: string[];
    regexPatterns?: { pattern: string; message: string }[];
    solutionCode: string;
    explanation: string;
    followUpQuestion: string;
  };
  isReviewChallenge?: boolean;
  isMasteryAssessment?: boolean;
}

export const POM_LEVELS = [
  {
    "level": 1,
    "title": "Beginner Fundamentals",
    "description": "Basic Page Object structure, readonly locators, constructor initialization, action methods, explicit return types, and simple tests.",
    "focusSkills": [
      "Store readonly locators",
      "Initialize locators in constructor",
      "Encapsulate fill and click actions",
      "Proper async/await and explicit return types",
      "Separation of POM and test assertions",
      "Web-first assertions in test specs",
      "Granular user action methods",
      "Refactoring brittle CSS to accessible locators"
    ]
  },
  {
    "level": 2,
    "title": "Locator and Action Fluency",
    "description": "Replacing brittle CSS with accessible locators, parameterized locators, scoping child elements in containers, lists, and dynamic buttons.",
    "focusSkills": [
      "Accessible locators (getByRole, getByLabel)",
      "Parameterized locator methods",
      "Table row filtering with hasText",
      "Cell-scoped action methods",
      "Container scoping (.locator / .filter)",
      "Chained modal dialog disambiguation",
      "Handling dynamic lists and element counts",
      "Iterating item collections (all(), count())",
      "Full locator fluency synthesis"
    ]
  },
  {
    "level": 3,
    "title": "Assertions and Page Transitions",
    "description": "Keeping assertions in tests, web-first assertions, methods returning the next Page Object, and multi-step workflow modeling.",
    "focusSkills": [
      "Fluent methods returning next Page Object",
      "Page transition method chaining",
      "Multi-step workflow orchestration",
      "Step-by-step wizard navigation modeling",
      "Exposing state locators for web-first assertions",
      "Keeping test assertions in test specs",
      "Conditional navigation branches",
      "Dynamic page object return types",
      "End-to-end multi-page flow orchestration",
      "Zero arbitrary timeouts"
    ]
  },
  {
    "level": 4,
    "title": "Reusable Architecture",
    "description": "Component Objects for shared navigation, headers, avoiding duplicate code, and refactoring procedural tests into modular POMs.",
    "focusSkills": [
      "Extracting Component Objects (composition over inheritance)",
      "Shared navigation and header component modeling",
      "Root-scoped component objects (root: Locator)",
      "Reusable modal and dialog encapsulation",
      "Widget component extraction & pagination actions",
      "Decoupling UI controls from page objects",
      "Eliminating bloated BasePage god objects",
      "Eliminating duplicate selectors across pages",
      "Enterprise composite page dashboard architecture",
      "Balancing component abstraction vs readability"
    ]
  },
  {
    "level": 5,
    "title": "Junior-Level Framework Skills",
    "description": "Custom test fixtures with test.extend(), pre-authenticated storageState reuse, and test isolation.",
    "focusSkills": [
      "Custom fixtures with test.extend()",
      "Page Object dependency injection",
      "storageState authentication bypass",
      "Session fixture context management",
      "Automatic fixture setup & teardown cleanup (use() lifecycle)",
      "Isolated test execution and data cleanup",
      "Configurable fixture options with test.use()",
      "Role-based test environment parametrization",
      "Enterprise fixture infrastructure and barrel exports",
      "End-to-end test fixture architecture"
    ]
  },
  {
    "level": 6,
    "title": "Junior-to-Mid-Level Reliability",
    "description": "Diagnosing flaky tests, missing awaits, race conditions, negative edge cases, and network mocking with page.route().",
    "focusSkills": [
      "Investigating race conditions and missing awaits",
      "Asynchronous locator call synchronization",
      "API route interception & mocking with page.route()",
      "Deterministic response virtualization",
      "Explicit spinner state synchronization (waitFor state: hidden)",
      "Eliminating flaky waitForTimeout sleeps",
      "Fault injection and 500 error state handling",
      "Error banner locator exposure for test specs",
      "Total flakiness elimination & assertion removal from POMs",
      "Rock-solid production SDET reliability hardening"
    ]
  },
  {
    "level": 7,
    "title": "CI and Architecture",
    "description": "Running headless test suites on Ubuntu runners in GitHub Actions, preserving traces on retry, and defending architecture.",
    "focusSkills": [
      "GitHub Actions CI pipeline configuration",
      "Headless browser installation with system dependencies",
      "Artifact and trace retention on failure (retain-on-failure)",
      "Failure-only diagnostic capture strategy",
      "Horizontal test sharding with matrix strategies (--shard)",
      "Parallel CI job distribution",
      "Architectural Decision Records (ADRs) defending POM standards",
      "SDET engineering trade-off justification",
      "Senior SDET production framework configuration & governance",
      "End-to-end test framework architecture defense"
    ]
  }
];

export const POM_MENTOR_DRILLS: PomMentorDrill[] = [
  {
    "id": "pom-drill-1-1",
    "level": 1,
    "levelTitle": "Level 1: Beginner Fundamentals",
    "drillNumber": "Drill 1.1",
    "title": "Create Your First Page Object (LoginPage)",
    "scenario": "You are testing an internal portal. The login page has a Username text input, a Password input, and a \"Sign in\" button.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\n// Task: Create the LoginPage class here.\n// Remember: Store locators as readonly, initialize them in the constructor,\n// and create a login method that accepts username and password.\n",
    "task": "Create a LoginPage class that:\n1. Receives the Playwright Page in its constructor.\n2. Defines readonly locators for usernameInput, passwordInput, and submitButton using accessible locators (getByLabel or getByRole).\n3. Implements an async login(username: string, password: string): Promise<void> action method that fills the inputs and clicks the submit button.",
    "successCriteria": [
      "Class is named LoginPage and exported.",
      "Locators are declared with the readonly modifier.",
      "Locators are initialized inside constructor(page: Page).",
      "Uses accessible locators (getByLabel, getByPlaceholder, or getByRole) — no brittle CSS selectors like #user.",
      "login() method has explicit : Promise<void> return type and properly awaits fill() and click() actions.",
      "No assertions inside the Page Object class."
    ],
    "hint": "Declare `readonly usernameInput: Locator;` inside the class body, assign `this.usernameInput = page.getByLabel('Username')` inside constructor(page: Page), and await each action inside `async login(...)`.",
    "beginnerGuide": {
      "concept": "What is a Page Object Model (POM)?",
      "whyItMatters": "Instead of scattering UI selectors like `page.getByLabel(\"Username\")` across 50 different test files, you wrap them into a single reusable Class. If a button name or label changes tomorrow, you only update ONE line in this class instead of fixing 50 broken tests!",
      "mentalModel": "Think of the Page Object as a \"remote control\" for the web page: the remote control has buttons and dials (properties/locators) and preset actions you can press (methods like login). The test spec is the user holding the remote control.",
      "sampleDescription": "Here is an analogous beginner sample for an \"OrderSearchPage\" so you can see the blueprint structure:",
      "sampleCode": "// 💡 Beginner Sample Blueprint: A Page Object for searching orders\nimport { Page, Locator } from '@playwright/test';\n\nexport class OrderSearchPage {\n  // 1. Declare properties as 'readonly' so they cannot be accidentally overwritten\n  readonly page: Page;\n  readonly searchInput: Locator;\n  readonly searchButton: Locator;\n\n  // 2. Receive 'page' in constructor and initialize all element queries\n  constructor(page: Page) {\n    this.page = page;\n    this.searchInput = page.getByPlaceholder('Search by order ID...');\n    this.searchButton = page.getByRole('button', { name: 'Search' });\n  }\n\n  // 3. Create action methods that execute user steps\n  // Notice: async keyword + Promise<void> return type + awaiting actions\n  async searchForOrder(orderId: string): Promise<void> {\n    await this.searchInput.fill(orderId);\n    await this.searchButton.click();\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "export class LoginPage",
        "readonly",
        "constructor",
        "this.page",
        "login",
        "Promise<void>"
      ],
      "forbiddenKeywords": [
        "expect(",
        "waitForTimeout"
      ],
      "regexPatterns": [
        {
          "pattern": "export\\s+class\\s+LoginPage",
          "message": "Must export a class named LoginPage"
        },
        {
          "pattern": "readonly\\s+\\w+Input:\\s*Locator",
          "message": "Element locators should be declared as readonly Locators"
        },
        {
          "pattern": "constructor\\s*\\(\\s*(?:public\\s+|private\\s+|readonly\\s+)?page:\\s*Page\\s*\\)",
          "message": "Constructor must accept the Playwright Page instance"
        },
        {
          "pattern": "async\\s+login\\s*\\(.*\\):\\s*Promise<void>",
          "message": "login() method must be async and have an explicit Promise<void> return type"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Sign in' });\n  }\n\n  async login(username: string, password: string): Promise<void> {\n    await this.usernameInput.fill(username);\n    await this.passwordInput.fill(password);\n    await this.submitButton.click();\n  }\n}",
      "explanation": "In Playwright POMs, locators are lazily-evaluated queries stored as `readonly` class properties. Action methods like `login()` encapsulate user interactions and return `Promise<void>`, keeping selector details hidden while leaving assertions for the test spec.",
      "followUpQuestion": "Why do we declare locators as `readonly Locator` instead of calling `page.getByLabel(...)` directly inside the `login()` method every time?"
    },
    "focusSkills": [
      "Store readonly locators",
      "Initialize locators in constructor",
      "Encapsulate fill and click actions",
      "Proper async/await and explicit return types"
    ]
  },
  {
    "id": "pom-drill-1-2",
    "level": 1,
    "levelTitle": "Level 1: Beginner Fundamentals",
    "drillNumber": "Drill 1.2",
    "title": "Writing the Test Spec for Your Page Object",
    "scenario": "Now that we have the LoginPage, we need to write a simple test spec that navigates to the page, uses the Page Object to log in, and verifies success.",
    "startingCode": "import { test, expect } from '@playwright/test';\nimport { LoginPage } from './LoginPage';\n\ntest('valid user can sign in successfully', async ({ page }) => {\n  // Task:\n  // 1. Instantiate the LoginPage.\n  // 2. Navigate to '/login'.\n  // 3. Perform login with 'standard_user' and 'secret_pass'.\n  // 4. Assert that the welcome heading \"Welcome back, standard_user\" is visible.\n});\n",
    "task": "Write the complete test body using LoginPage:\n1. Instantiate const loginPage = new LoginPage(page);\n2. Await page.goto('/login');\n3. Await loginPage.login('standard_user', 'secret_pass');\n4. Assert with expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();",
    "successCriteria": [
      "LoginPage is instantiated with the page fixture.",
      "page.goto is properly awaited.",
      "loginPage.login(...) is properly awaited.",
      "Assertion uses web-first expect(...).toBeVisible() and resides in the test spec, not the Page Object."
    ],
    "hint": "Instantiate the page object with `const loginPage = new LoginPage(page);` before calling its methods.",
    "beginnerGuide": {
      "concept": "How Test Specs and Page Objects Collaborate",
      "whyItMatters": "Page Objects ONLY know how to interact with the UI (click, fill, navigate). Test files (*.spec.ts) orchestrate the user story and perform the assertions (`expect(...)`). This keeps tests readable like English stories.",
      "mentalModel": "The Page Object is the actor on stage doing actions. The Test Spec is the director watching the actor and verifying that the scene succeeded.",
      "sampleDescription": "Here is a sample test spec verifying a \"Search\" workflow:",
      "sampleCode": "// 💡 Beginner Sample: How a test file imports and uses a Page Object\nimport { test, expect } from '@playwright/test';\nimport { SearchPage } from './SearchPage';\n\ntest('user can search for shoes', async ({ page }) => {\n  // Step 1: Create instance of the Page Object passing in Playwright's 'page'\n  const searchPage = new SearchPage(page);\n\n  // Step 2: Navigate to URL\n  await page.goto('/search');\n\n  // Step 3: Call action methods on the Page Object\n  await searchPage.searchForKeyword('running shoes');\n\n  // Step 4: Verify result in the test spec with web-first assertion\n  await expect(page.getByRole('heading', { name: 'Results for running shoes' })).toBeVisible();\n});"
    },
    "validation": {
      "requiredKeywords": [
        "LoginPage",
        "goto",
        "login",
        "expect",
        "toBeVisible"
      ],
      "regexPatterns": [
        {
          "pattern": "new\\s+LoginPage\\s*\\(\\s*page\\s*\\)",
          "message": "Instantiate LoginPage with the page fixture: new LoginPage(page)"
        },
        {
          "pattern": "expect\\s*\\(.*\\)\\.toBeVisible\\s*\\(",
          "message": "Use web-first assertion: await expect(...).toBeVisible()"
        }
      ],
      "solutionCode": "import { test, expect } from '@playwright/test';\nimport { LoginPage } from './LoginPage';\n\ntest('valid user can sign in successfully', async ({ page }) => {\n  const loginPage = new LoginPage(page);\n  await page.goto('/login');\n  await loginPage.login('standard_user', 'secret_pass');\n\n  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();\n});",
      "explanation": "Keeping assertions in the test specification gives clear test reports and stack traces pointing to business expectations, while the Page Object handles the mechanical page interactions.",
      "followUpQuestion": "If the welcome heading takes 1.5 seconds to render after clicking \"Sign in\", will `await expect(...).toBeVisible()` fail immediately? Why or why not?"
    },
    "focusSkills": [
      "Separation of POM and test assertions",
      "Web-first assertions in test specs",
      "Proper async/await and explicit return types"
    ]
  },
  {
    "id": "pom-drill-1-3",
    "level": 1,
    "levelTitle": "Level 1: Beginner Fundamentals",
    "drillNumber": "Drill 1.3",
    "title": "Adding Individual Granular Action Methods",
    "scenario": "In addition to a combined `login()` method, tests sometimes need granular actions (e.g. testing username validation errors before filling password). Add granular methods to `LoginPage`.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Sign in' });\n  }\n\n  // Task:\n  // 1. Add enterUsername(username: string): Promise<void>\n  // 2. Add enterPassword(password: string): Promise<void>\n  // 3. Add clickSubmit(): Promise<void>\n  // 4. Refactor login() to use these granular methods!\n}\n",
    "task": "Add granular methods enterUsername, enterPassword, and clickSubmit to LoginPage with explicit Promise<void> return types, and refactor login() to call them.",
    "successCriteria": [
      "enterUsername(username: string): Promise<void> is implemented.",
      "enterPassword(password: string): Promise<void> is implemented.",
      "clickSubmit(): Promise<void> is implemented.",
      "All action methods properly await their respective locator actions.",
      "login(...) reuses this.enterUsername, this.enterPassword, and this.clickSubmit."
    ],
    "hint": "Inside login(), use `await this.enterUsername(username); await this.enterPassword(password); await this.clickSubmit();`.",
    "beginnerGuide": {
      "concept": "Granular Atomic Actions vs Composite Workflows",
      "whyItMatters": "If you only have one big `login()` method, how will you test: \"User types username, leaves password blank, and clicks submit\"? You would have to duplicate code! By writing small building blocks (like `enterUsername`) and composing them in `login()`, you get the best of both worlds.",
      "mentalModel": "Lego bricks: small individual blocks (`enterUsername`, `enterPassword`, `clickSubmit`) that can either be used alone or snapped together into a bigger setpiece (`login`).",
      "sampleDescription": "Here is a sample showing atomic actions composed into a higher-level method:",
      "sampleCode": "// 💡 Beginner Sample: Breaking actions into building blocks\nexport class RegistrationPage {\n  // Small atomic methods\n  async enterEmail(email: string): Promise<void> {\n    await this.emailInput.fill(email);\n  }\n\n  async acceptTerms(): Promise<void> {\n    await this.termsCheckbox.check();\n  }\n\n  async clickRegister(): Promise<void> {\n    await this.registerButton.click();\n  }\n\n  // Composite method reusing the smaller methods!\n  async completeRegistration(email: string): Promise<void> {\n    await this.enterEmail(email);\n    await this.acceptTerms();\n    await this.clickRegister();\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "enterUsername",
        "enterPassword",
        "clickSubmit",
        "Promise<void>"
      ],
      "regexPatterns": [
        {
          "pattern": "enterUsername\\s*\\(.*\\):\\s*Promise<void>",
          "message": "enterUsername method should have explicit : Promise<void> return type"
        },
        {
          "pattern": "enterPassword\\s*\\(.*\\):\\s*Promise<void>",
          "message": "enterPassword method should have explicit : Promise<void> return type"
        },
        {
          "pattern": "clickSubmit\\s*\\(.*\\):\\s*Promise<void>",
          "message": "clickSubmit method should have explicit : Promise<void> return type"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Sign in' });\n  }\n\n  async enterUsername(username: string): Promise<void> {\n    await this.usernameInput.fill(username);\n  }\n\n  async enterPassword(password: string): Promise<void> {\n    await this.passwordInput.fill(password);\n  }\n\n  async clickSubmit(): Promise<void> {\n    await this.submitButton.click();\n  }\n\n  async login(username: string, password: string): Promise<void> {\n    await this.enterUsername(username);\n    await this.enterPassword(password);\n    await this.clickSubmit();\n  }\n}",
      "explanation": "Granular action methods give your test suite flexibility for testing negative scenarios (e.g. empty passwords, blur validations) without duplicating locator code.",
      "followUpQuestion": "How does providing both granular methods and a high-level composite `login()` method support both happy-path integration tests and granular edge-case tests?"
    },
    "focusSkills": [
      "Encapsulate fill and click actions",
      "Granular user action methods",
      "Proper async/await and explicit return types"
    ]
  },
  {
    "id": "pom-drill-1-4",
    "level": 1,
    "levelTitle": "Level 1: Beginner Fundamentals",
    "drillNumber": "Drill 1.4",
    "title": "Spot and Fix: Page Object Anti-Patterns",
    "scenario": "A junior QA engineer wrote this CheckoutPage. It contains three major anti-patterns: an assertion inside the POM, an arbitrary sleep wait, and non-readonly mutable locators.",
    "startingCode": "import { Page, Locator, expect } from '@playwright/test';\n\nexport class CheckoutPage {\n  page: Page;\n  firstNameInput: any;\n  continueBtn: any;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.firstNameInput = page.locator('#first-name');\n    this.continueBtn = page.locator('.btn-primary');\n  }\n\n  async enterDetails(name: string) {\n    await this.firstNameInput.fill(name);\n    await this.page.waitForTimeout(2000); // Wait for input\n    await this.continueBtn.click();\n    await expect(this.page).toHaveURL('/step-two'); // Verify next page\n  }\n}\n",
    "task": "Refactor this CheckoutPage to eliminate all three anti-patterns:\n1. Declare locators with 'readonly' and proper 'Locator' type.\n2. Replace brittle CSS selectors with accessible locators (getByLabel or getByRole).\n3. Remove the arbitrary 'waitForTimeout' call.\n4. Remove the 'expect' assertion from enterDetails.\n5. Add explicit return type Promise<void>.",
    "successCriteria": [
      "Locators are typed as readonly Locator (no any).",
      "Uses page.getByPlaceholder or page.getByLabel and page.getByRole('button').",
      "page.waitForTimeout is completely deleted.",
      "expect(...) assertion is completely removed from the Page Object.",
      "Method has explicit Promise<void> return type."
    ],
    "hint": "Remove the import of expect, eliminate waitForTimeout completely (Playwright auto-waits on click), and mark properties as `readonly firstNameInput: Locator;`.",
    "beginnerGuide": {
      "concept": "The Top 3 Anti-Patterns Every Beginner Must Avoid",
      "whyItMatters": "1) Never use `waitForTimeout(2000)`: Playwright has automatic waiting built into clicks and fills; artificial sleeps slow down CI runs and cause flaky tests.\n2) Never put `expect()` assertions inside Page Objects: if an assertion fails inside a page method, the test report blames the page instead of reporting which business rule failed.\n3) Never use `any`: strict TypeScript catches typos before you run your tests.",
      "mentalModel": "A Page Object is a dumb worker robot: it presses buttons and types characters when commanded. It never judges whether the outcome is right or wrong (no assertions), and it never takes naps (no timeouts).",
      "sampleDescription": "Here is what \"good clean code\" looks like compared to the anti-pattern:",
      "sampleCode": "// 💡 Beginner Sample: Clean Playwright POM (No Sleeps, No Asserts)\nimport { Page, Locator } from '@playwright/test';\n\nexport class SettingsPage {\n  readonly page: Page;\n  readonly saveButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    // ✅ Accessible locator\n    this.saveButton = page.getByRole('button', { name: 'Save Changes' });\n  }\n\n  // ✅ Clean async action: no waitForTimeout, no expect()\n  async save(): Promise<void> {\n    await this.saveButton.click(); // Playwright auto-waits for clickability!\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "readonly",
        "firstNameInput",
        "Promise<void>"
      ],
      "forbiddenKeywords": [
        "waitForTimeout",
        "expect(",
        ": any"
      ],
      "regexPatterns": [
        {
          "pattern": "readonly\\s+(?:continueBtn|continueButton):\\s*Locator",
          "message": "Declare continue button locator as readonly Locator"
        },
        {
          "pattern": "readonly\\s+firstNameInput:\\s*Locator",
          "message": "Declare firstNameInput as readonly Locator"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class CheckoutPage {\n  readonly page: Page;\n  readonly firstNameInput: Locator;\n  readonly continueButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.firstNameInput = page.getByPlaceholder('First Name');\n    this.continueButton = page.getByRole('button', { name: 'Continue' });\n  }\n\n  async enterDetails(name: string): Promise<void> {\n    await this.firstNameInput.fill(name);\n    await this.continueButton.click();\n  }\n}",
      "explanation": "Playwright natively waits for elements to become actionable (visible, enabled, stable) before executing `.fill()` or `.click()`, rendering `waitForTimeout()` redundant and harmful. Removing assertions from the POM keeps error diagnostics focused on test specs.",
      "followUpQuestion": "What happens in a CI pipeline when 50 tests each have a 2-second `waitForTimeout` call?"
    },
    "focusSkills": [
      "Store readonly locators",
      "Refactoring brittle CSS to accessible locators",
      "Separation of POM and test assertions"
    ]
  },
  {
    "id": "pom-drill-1-5",
    "level": 1,
    "levelTitle": "Level 1: Beginner Fundamentals",
    "drillNumber": "Drill 1.5",
    "title": "Review Challenge: Level 1 Mastery Gate",
    "scenario": "Review Challenge: Build a complete ContactUsPage from scratch without starter templates. The page has a \"Full Name\" input, \"Email Address\" input, \"Message\" textarea, and \"Send Message\" button.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\n// Task: Build the entire ContactUsPage class from scratch!\n// Follow all Level 1 rules:\n// - readonly locators initialized in constructor\n// - Accessible locators (getByLabel / getByRole)\n// - submitForm(name: string, email: string, message: string): Promise<void>\n",
    "task": "Create and export ContactUsPage:\n1. Declare readonly page, nameInput, emailInput, messageInput, and submitButton as Locators.\n2. Initialize them in constructor(page: Page) using getByLabel and getByRole.\n3. Implement submitForm(name: string, email: string, message: string): Promise<void> that fills all three fields and clicks submit.",
    "successCriteria": [
      "All locators declared readonly Locator.",
      "Accessible locators used throughout.",
      "submitForm method typed with Promise<void>.",
      "Clean separation: no assertions or arbitrary delays in the class."
    ],
    "hint": "Use `page.getByLabel('Full Name')`, `page.getByLabel('Email Address')`, `page.getByLabel('Message')`, and `page.getByRole('button', { name: 'Send Message' })`.",
    "beginnerGuide": {
      "concept": "Building a Full Page Object From Scratch",
      "whyItMatters": "In real interviews and day-to-day automation jobs, you will often receive an empty text file and a user story. Practicing the standard 4-step skeleton will make writing POMs automatic second nature.",
      "mentalModel": "The 4-Step POM Recipe:\n1. Import { Page, Locator } from '@playwright/test'\n2. Declare `export class PageName` with `readonly` locators\n3. Initialize with `constructor(page: Page)`\n4. Write async action methods returning `Promise<void>`",
      "sampleDescription": "Here is a reference sample of a feedback form built from scratch:",
      "sampleCode": "// 💡 Beginner Sample: FeedbackForm built from scratch\nimport { Page, Locator } from '@playwright/test';\n\nexport class FeedbackModal {\n  readonly page: Page;\n  readonly commentBox: Locator;\n  readonly submitBtn: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.commentBox = page.getByPlaceholder('Tell us what you think...');\n    this.submitBtn = page.getByRole('button', { name: 'Submit Feedback' });\n  }\n\n  async sendFeedback(comment: string): Promise<void> {\n    await this.commentBox.fill(comment);\n    await this.submitBtn.click();\n  }\n}"
    },
    "isReviewChallenge": true,
    "isMasteryAssessment": true,
    "validation": {
      "requiredKeywords": [
        "export class ContactUsPage",
        "readonly",
        "constructor",
        "submitForm",
        "Promise<void>"
      ],
      "forbiddenKeywords": [
        "expect(",
        "waitForTimeout"
      ],
      "regexPatterns": [
        {
          "pattern": "readonly\\s+(?:nameInput|emailInput|messageInput|submitButton):\\s*Locator",
          "message": "Declare locators as readonly Locator"
        },
        {
          "pattern": "async\\s+submitForm\\s*\\(.*\\):\\s*Promise<void>",
          "message": "submitForm method must have explicit : Promise<void> return type"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ContactUsPage {\n  readonly page: Page;\n  readonly nameInput: Locator;\n  readonly emailInput: Locator;\n  readonly messageInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.nameInput = page.getByLabel('Full Name');\n    this.emailInput = page.getByLabel('Email Address');\n    this.messageInput = page.getByLabel('Message');\n    this.submitButton = page.getByRole('button', { name: 'Send Message' });\n  }\n\n  async submitForm(name: string, email: string, message: string): Promise<void> {\n    await this.nameInput.fill(name);\n    await this.emailInput.fill(email);\n    await this.messageInput.fill(message);\n    await this.submitButton.click();\n  }\n}",
      "explanation": "This complete implementation adheres to all Level 1 standards: zero arbitrary waits, clean readonly encapsulation, accessible locators, and pure action delegation.",
      "followUpQuestion": "How would you write the test assertion to verify that submitting this form successfully shows a success banner?"
    },
    "focusSkills": [
      "Store readonly locators",
      "Initialize locators in constructor",
      "Encapsulate fill and click actions",
      "Proper async/await and explicit return types",
      "Separation of POM and test assertions",
      "Web-first assertions in test specs",
      "Granular user action methods",
      "Refactoring brittle CSS to accessible locators"
    ]
  },
  {
    "id": "pom-drill-2-1",
    "level": 2,
    "levelTitle": "Level 2: Locator and Action Fluency",
    "drillNumber": "Drill 2.1",
    "title": "Parameterized Locators: Dynamic Card Selection",
    "scenario": "An e-commerce catalog displays product cards. Each card has a title and an \"Add to cart\" button. In a realistic app, you cannot hardcode a single locator because the user can add ANY product.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class CatalogPage {\n  readonly page: Page;\n  readonly productCards: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.productCards = page.locator('.inventory_item'); // brittle!\n  }\n\n  // Task:\n  // 1. Refactor productCards to use an accessible container query.\n  // 2. Implement getProductCard(title: string): Locator that scopes to the card containing that title.\n  // 3. Implement addProductToCart(title: string): Promise<void> that clicks 'Add to cart' inside that card.\n}\n",
    "task": "Implement getProductCard and addProductToCart using container scoping with .filter({ hasText: title }) or .getByRole('button', { name: 'Add to cart' }).",
    "successCriteria": [
      "getProductCard(title: string): Locator returns page.locator('.inventory_item') or page.getByRole('listitem').filter({ hasText: title }).",
      "addProductToCart(title: string): Promise<void> scopes the button click specifically inside that product card.",
      "No global un-scoped button clicks that might click the wrong product."
    ],
    "hint": "Use `this.productCards.filter({ hasText: title })` and chain `.getByRole('button', { name: 'Add to cart' })` on that filtered locator.",
    "beginnerGuide": {
      "concept": "Locators with Parameters & Container Scoping",
      "whyItMatters": "If an app has 10 cards that all contain a button named \"Delete\", calling `page.getByRole(\"button\", { name: \"Delete\" }).click()` causes Playwright to throw a \"strict mode violation\" because 10 buttons matched! By filtering down to the specific card container first, you safely click the right button.",
      "mentalModel": "A two-stage searchlight: first point the light at the specific row or card (`.filter({ hasText: name })`), then find the button inside only that circle of light.",
      "sampleDescription": "Here is how to scope a button inside a specific user row in a table:",
      "sampleCode": "// 💡 Beginner Sample: Scoping actions inside a specific table row\nexport class UsersPage {\n  readonly userRows: Locator;\n\n  constructor(page: Page) {\n    this.userRows = page.getByRole('row');\n  }\n\n  // Parameterized locator: returns the single row matching username\n  getUserRow(username: string): Locator {\n    return this.userRows.filter({ hasText: username });\n  }\n\n  // Scoped action: clicks 'Delete' ONLY inside that user's row\n  async deleteUser(username: string): Promise<void> {\n    const row = this.getUserRow(username);\n    await row.getByRole('button', { name: 'Delete' }).click();\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "getProductCard",
        "addProductToCart",
        "filter",
        "hasText",
        "Promise<void>"
      ],
      "forbiddenKeywords": [
        "waitForTimeout",
        "expect(",
        ": any"
      ],
      "regexPatterns": [
        {
          "pattern": "getProductCard\\s*\\(\\s*title:\\s*string\\s*\\)\\s*:\\s*Locator",
          "message": "getProductCard(title: string) must have an explicit : Locator return type"
        },
        {
          "pattern": "(?:return\\s+)?(?:this\\.)?(?:productCards|page\\.[\\w]+(?:\\([^)]*\\))?)\\.filter\\s*\\(\\s*\\{\\s*['\"]?hasText['\"]?\\s*:\\s*title\\s*\\}",
          "message": "getProductCard must filter products using .filter({ hasText: title })"
        },
        {
          "pattern": "async\\s+addProductToCart\\s*\\(\\s*title:\\s*string\\s*\\)\\s*:\\s*Promise<void>",
          "message": "addProductToCart(title: string) must have an explicit : Promise<void> return type"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class CatalogPage {\n  readonly page: Page;\n  readonly productCards: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.productCards = page.getByRole('listitem');\n  }\n\n  getProductCard(title: string): Locator {\n    return this.productCards.filter({ hasText: title });\n  }\n\n  async addProductToCart(title: string): Promise<void> {\n    const card = this.getProductCard(title);\n    await card.getByRole('button', { name: 'Add to cart' }).click();\n  }\n}",
      "explanation": "Scoping locators with `.filter({ hasText: ... })` avoids strict-mode violations when multiple \"Add to cart\" buttons exist on the page.",
      "followUpQuestion": "What error does Playwright throw if you do `page.getByRole('button', { name: 'Add to cart' }).click()` when 6 products are displayed?"
    },
    "focusSkills": [
      "Accessible locators (getByRole, getByLabel)",
      "Parameterized locator methods"
    ]
  },
  {
    "id": "pom-drill-2-2",
    "level": 2,
    "levelTitle": "Level 2: Locator and Action Fluency",
    "drillNumber": "Drill 2.2",
    "title": "Scoping Inside Tables: Row Selection by Unique Text",
    "scenario": "An admin portal has a User Management table. Each table row contains a name, email address, role, and an \"Edit Role\" button. In a production app with hundreds of users, you must locate the row containing a specific email and interact only with that row.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class UsersPage {\n  readonly page: Page;\n  readonly tableRows: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.tableRows = page.getByRole('row');\n  }\n\n  // Task:\n  // 1. Implement getUserRow(email: string): Locator that filters this.tableRows by email.\n  // 2. Implement editUserRole(email: string, newRole: string): Promise<void>\n  //    Inside that row, click 'Edit Role', select the new role from dropdown, and click 'Save'.\n}\n",
    "task": "Implement getUserRow(email: string): Locator to scope down to the row matching the user's email, and editUserRole(email: string, newRole: string): Promise<void> to change their role without affecting any other row.",
    "successCriteria": [
      "getUserRow(email: string): Locator returns this.tableRows.filter({ hasText: email }).",
      "editUserRole accepts email and newRole with Promise<void> return type.",
      "Clicks Edit Role and saves within the scoped row."
    ],
    "hint": "Use `const row = this.getUserRow(email); await row.getByRole(\"button\", { name: \"Edit Role\" }).click();`.",
    "beginnerGuide": {
      "concept": "Table Row Scoping with .filter()",
      "whyItMatters": "Tables have identical buttons on every row (\"Edit\", \"Delete\", \"View\"). Searching for `page.getByRole(\"button\", { name: \"Edit\" })` fails because Playwright doesn't know which row you meant. Filtering by a unique identifier (like email) first guarantees strict mode compliance.",
      "mentalModel": "Find the horizontal strip first (the row), then search only within that strip for controls.",
      "sampleDescription": "Scoping buttons inside a transaction table:",
      "sampleCode": "export class TransactionPage {\n  readonly rows: Locator;\n  constructor(page: Page) { this.rows = page.getByRole('row'); }\n  getRow(id: string): Locator { return this.rows.filter({ hasText: id }); }\n  async refund(id: string): Promise<void> {\n    await this.getRow(id).getByRole('button', { name: 'Refund' }).click();\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "getUserRow",
        "editUserRole",
        "filter",
        "hasText",
        "Promise<void>"
      ],
      "regexPatterns": [
        {
          "pattern": "getUserRow\\s*\\(\\s*email:\\s*string\\s*\\)\\s*:\\s*Locator",
          "message": "getUserRow(email: string) must have explicit : Locator return type"
        },
        {
          "pattern": "\\.filter\\s*\\(\\s*\\{\\s*['\"]?hasText['\"]?\\s*:\\s*email\\s*\\}",
          "message": "Filter tableRows using { hasText: email }"
        },
        {
          "pattern": "async\\s+editUserRole\\s*\\(.*\\):\\s*Promise<void>",
          "message": "editUserRole must have explicit : Promise<void> return type"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class UsersPage {\n  readonly page: Page;\n  readonly tableRows: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.tableRows = page.getByRole('row');\n  }\n\n  getUserRow(email: string): Locator {\n    return this.tableRows.filter({ hasText: email });\n  }\n\n  async editUserRole(email: string, newRole: string): Promise<void> {\n    const row = this.getUserRow(email);\n    await row.getByRole('button', { name: 'Edit Role' }).click();\n    await row.getByRole('combobox').selectOption(newRole);\n    await row.getByRole('button', { name: 'Save' }).click();\n  }\n}",
      "explanation": "Container filtering with `.filter({ hasText: email })` narrows the search space to a single DOM subtree, ensuring actions never accidentally click buttons on adjacent rows.",
      "followUpQuestion": "Why is filtering by email safer than filtering by user full name?"
    },
    "focusSkills": [
      "Table row filtering with hasText",
      "Cell-scoped action methods"
    ]
  },
  {
    "id": "pom-drill-2-3",
    "level": 2,
    "levelTitle": "Level 2: Locator and Action Fluency",
    "drillNumber": "Drill 2.3",
    "title": "Disambiguating Modals with Chained Locators",
    "scenario": "When clicking \"Delete Project\", a modal popup titled \"Confirm Deletion\" appears. Both the background page and the modal contain a button named \"Cancel\". You must ensure clicks target only the modal dialog.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ProjectsPage {\n  readonly page: Page;\n  readonly modalDialog: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.modalDialog = page.getByRole('dialog');\n  }\n\n  // Task:\n  // 1. Implement confirmModalDeletion(): Promise<void>\n  //    Clicks the 'Delete' button located INSIDE this.modalDialog.\n  // 2. Implement cancelModal(): Promise<void>\n  //    Clicks the 'Cancel' button located INSIDE this.modalDialog.\n}\n",
    "task": "Implement confirmModalDeletion() and cancelModal() using chained locators on this.modalDialog to avoid clicking background buttons with identical names.",
    "successCriteria": [
      "modalDialog is used as the root locator for dialog buttons.",
      "confirmModalDeletion clicks Delete inside modalDialog.",
      "cancelModal clicks Cancel inside modalDialog."
    ],
    "hint": "Use `await this.modalDialog.getByRole(\"button\", { name: \"Delete\" }).click();`.",
    "beginnerGuide": {
      "concept": "Modal Dialog Scoping",
      "whyItMatters": "Web apps frequently overlay dialogs on top of page content. If both the page and the modal have \"Cancel\" buttons, querying `page.getByRole(\"button\", { name: \"Cancel\" })` causes Playwright to fail with a strict mode error. Chaining off `getByRole(\"dialog\")` isolates the modal.",
      "mentalModel": "Parent-child chaining: first grab the dialog box, then ask for buttons inside that box.",
      "sampleDescription": "Chaining off a dialog component:",
      "sampleCode": "async dismiss(): Promise<void> {\n  await this.page.getByRole('dialog').getByRole('button', { name: 'Close' }).click();\n}"
    },
    "validation": {
      "requiredKeywords": [
        "confirmModalDeletion",
        "cancelModal",
        "modalDialog",
        "Promise<void>"
      ],
      "regexPatterns": [
        {
          "pattern": "async\\s+confirmModalDeletion\\s*\\(\\s*\\):\\s*Promise<void>",
          "message": "confirmModalDeletion() must have explicit : Promise<void> return type"
        },
        {
          "pattern": "this\\.modalDialog\\.getByRole\\s*\\(\\s*['\"]button['\"]",
          "message": "Target buttons inside this.modalDialog using chained getByRole"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ProjectsPage {\n  readonly page: Page;\n  readonly modalDialog: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.modalDialog = page.getByRole('dialog');\n  }\n\n  async confirmModalDeletion(): Promise<void> {\n    await this.modalDialog.getByRole('button', { name: 'Delete' }).click();\n  }\n\n  async cancelModal(): Promise<void> {\n    await this.modalDialog.getByRole('button', { name: 'Cancel' }).click();\n  }\n}",
      "explanation": "Scoping queries through `this.modalDialog.getByRole(...)` ensures strict mode compliance and prevents interacting with deactivated background elements.",
      "followUpQuestion": "How does Playwright handle clicking elements when an overlay modal covers them?"
    },
    "focusSkills": [
      "Container scoping (.locator / .filter)",
      "Chained modal dialog disambiguation"
    ]
  },
  {
    "id": "pom-drill-2-4",
    "level": 2,
    "levelTitle": "Level 2: Locator and Action Fluency",
    "drillNumber": "Drill 2.4",
    "title": "Dynamic Lists & Element Counting",
    "scenario": "A task management application displays dynamic todo items in a list. The Page Object needs to return the total count of tasks and allow toggling a task checkbox by item title.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class TodoPage {\n  readonly page: Page;\n  readonly taskList: Locator;\n  readonly taskItems: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.taskList = page.getByRole('list');\n    this.taskItems = page.getByRole('listitem');\n  }\n\n  // Task:\n  // 1. Implement getTaskCount(): Promise<number> returning the count of taskItems.\n  // 2. Implement toggleTask(title: string): Promise<void> that checks the checkbox inside that task item.\n}\n",
    "task": "Implement getTaskCount(): Promise<number> and toggleTask(title: string): Promise<void> to query dynamic list items cleanly.",
    "successCriteria": [
      "getTaskCount returns this.taskItems.count() with Promise<number> return type.",
      "toggleTask filters this.taskItems by title and checks the checkbox.",
      "No hardcoded indexes."
    ],
    "hint": "Use `return this.taskItems.count();` and `await this.taskItems.filter({ hasText: title }).getByRole(\"checkbox\").check();`.",
    "beginnerGuide": {
      "concept": "Counting & Interacting with Dynamic Lists",
      "whyItMatters": "Lists change dynamically as items are added and deleted. Using `locator.count()` lets test specs verify item counts, while container filtering allows targeting specific items regardless of order.",
      "mentalModel": "Locators are lazy queries. Calling `.count()` or `.filter()` evaluates against the current DOM state automatically.",
      "sampleDescription": "Reading list counts:",
      "sampleCode": "async getCartCount(): Promise<number> {\n  return await this.cartItems.count();\n}"
    },
    "validation": {
      "requiredKeywords": [
        "getTaskCount",
        "toggleTask",
        "count()",
        "Promise<number>",
        "Promise<void>"
      ],
      "regexPatterns": [
        {
          "pattern": "getTaskCount\\s*\\(\\s*\\):\\s*Promise<number>",
          "message": "getTaskCount must have explicit : Promise<number> return type"
        },
        {
          "pattern": "toggleTask\\s*\\(.*\\):\\s*Promise<void>",
          "message": "toggleTask must have explicit : Promise<void> return type"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class TodoPage {\n  readonly page: Page;\n  readonly taskList: Locator;\n  readonly taskItems: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.taskList = page.getByRole('list');\n    this.taskItems = page.getByRole('listitem');\n  }\n\n  async getTaskCount(): Promise<number> {\n    return this.taskItems.count();\n  }\n\n  async toggleTask(title: string): Promise<void> {\n    const item = this.taskItems.filter({ hasText: title });\n    await item.getByRole('checkbox').check();\n  }\n}",
      "explanation": "Using `this.taskItems.count()` returns the number of currently rendered elements without brittle array indexes.",
      "followUpQuestion": "Why does locator.count() not auto-wait for elements to appear like click() does?"
    },
    "focusSkills": [
      "Handling dynamic lists and element counts",
      "Iterating item collections (all(), count())"
    ]
  },
  {
    "id": "pom-drill-2-5",
    "level": 2,
    "levelTitle": "Level 2: Locator and Action Fluency",
    "drillNumber": "Drill 2.5",
    "title": "Review Challenge: Level 2 Mastery Gate (OrdersPage)",
    "scenario": "Review Challenge: Build a complete OrdersPage from scratch. The page shows an order management dashboard with a search input, an orders table, order rows containing order IDs and status chips, and an action to cancel a specific order by ID.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\n// Task: Build the complete OrdersPage from scratch!\n// 1. Declare readonly page, searchInput, and orderRows locators.\n// 2. Initialize in constructor(page: Page) using accessible queries.\n// 3. Implement searchOrder(term: string): Promise<void>\n// 4. Implement getOrderRow(orderId: string): Locator\n// 5. Implement cancelOrder(orderId: string): Promise<void>\n",
    "task": "Create OrdersPage adhering to all Level 2 locator standards: accessible locators, container row filtering by orderId, and scoped cancel button clicks.",
    "successCriteria": [
      "All locators declared readonly Locator.",
      "getOrderRow(orderId: string): Locator returns row filtered by orderId.",
      "cancelOrder(orderId: string): Promise<void> clicks Cancel button inside that row.",
      "No un-scoped global queries."
    ],
    "hint": "Use `this.orderRows = page.getByRole('row');` and `getOrderRow(id: string): Locator { return this.orderRows.filter({ hasText: id }); }`.",
    "beginnerGuide": {
      "concept": "Synthesis: Dynamic Tables, Scoping & Search",
      "whyItMatters": "Mastering dynamic table interaction is a core requirement for any test automation engineer. Real dashboards have multiple rows and identical action buttons on each row.",
      "mentalModel": "Container query pattern: Table -> Filtered Row -> Scoped Action Button.",
      "sampleDescription": "Scoped action in dashboard:",
      "sampleCode": "getOrderRow(id: string): Locator {\n  return this.orderRows.filter({ hasText: id });\n}"
    },
    "isReviewChallenge": true,
    "isMasteryAssessment": true,
    "validation": {
      "requiredKeywords": [
        "export class OrdersPage",
        "readonly",
        "getOrderRow",
        "cancelOrder",
        "Promise<void>"
      ],
      "regexPatterns": [
        {
          "pattern": "getOrderRow\\s*\\(\\s*orderId:\\s*string\\s*\\)\\s*:\\s*Locator",
          "message": "getOrderRow(orderId: string) must return Locator"
        },
        {
          "pattern": "async\\s+cancelOrder\\s*\\(.*\\):\\s*Promise<void>",
          "message": "cancelOrder must return Promise<void>"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class OrdersPage {\n  readonly page: Page;\n  readonly searchInput: Locator;\n  readonly orderRows: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.searchInput = page.getByPlaceholder('Search orders...');\n    this.orderRows = page.getByRole('row');\n  }\n\n  async searchOrder(term: string): Promise<void> {\n    await this.searchInput.fill(term);\n    await this.searchInput.press('Enter');\n  }\n\n  getOrderRow(orderId: string): Locator {\n    return this.orderRows.filter({ hasText: orderId });\n  }\n\n  async cancelOrder(orderId: string): Promise<void> {\n    const row = this.getOrderRow(orderId);\n    await row.getByRole('button', { name: 'Cancel Order' }).click();\n  }\n}",
      "explanation": "This complete Level 2 Page Object demonstrates accessible form querying, parameterized row scoping, and resilient sub-tree action delegation.",
      "followUpQuestion": "What strategy would you use if order IDs appear in multiple columns of the same row?"
    },
    "focusSkills": [
      "Accessible locators (getByRole, getByLabel)",
      "Parameterized locator methods",
      "Table row filtering with hasText",
      "Cell-scoped action methods",
      "Container scoping (.locator / .filter)",
      "Chained modal dialog disambiguation",
      "Handling dynamic lists and element counts",
      "Iterating item collections (all(), count())",
      "Full locator fluency synthesis"
    ]
  },
  {
    "id": "pom-drill-3-1",
    "level": 3,
    "levelTitle": "Level 3: Assertions and Page Transitions",
    "drillNumber": "Drill 3.1",
    "title": "Fluent Page Transitions: Returning the Next Page Object",
    "scenario": "When a user logs in successfully, the application navigates to the Inventory dashboard. In a fluent Page Object Model, `login()` can return an instance of `InventoryPage` for fluid chaining and type safety.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\nimport { InventoryPage } from './InventoryPage';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Sign in' });\n  }\n\n  // Task:\n  // Implement loginAsValidUser(username: string, pass: string): Promise<InventoryPage>\n  // Fill inputs, click submit, and return new InventoryPage(this.page).\n}\n",
    "task": "Implement loginAsValidUser method that returns Promise<InventoryPage>, instantiating and returning the next page object after clicking submit.",
    "successCriteria": [
      "Method signature is async loginAsValidUser(username: string, pass: string): Promise<InventoryPage>.",
      "Awaits form filling and submit click.",
      "Returns new InventoryPage(this.page)."
    ],
    "hint": "Return `new InventoryPage(this.page);` at the end of the method.",
    "beginnerGuide": {
      "concept": "Fluent Page Object Transitions (Method Chaining)",
      "whyItMatters": "In a real user journey, clicking \"Sign in\" navigates to the Dashboard. If `loginAsValidUser()` returns `new DashboardPage(this.page)`, your test writer gets instant IDE autocomplete for dashboard actions on the next line without having to create the page manually!",
      "mentalModel": "A relay baton pass: the Login page does its job, hands you the baton for the next page (`return new DashboardPage(...)`), and your test flow continues seamlessly.",
      "sampleDescription": "Returning the next page object upon navigation:",
      "sampleCode": "async proceedToPayment(): Promise<CheckoutStepTwoPage> {\n  await this.continueButton.click();\n  return new CheckoutStepTwoPage(this.page);\n}"
    },
    "validation": {
      "requiredKeywords": [
        "loginAsValidUser",
        "InventoryPage"
      ],
      "regexPatterns": [
        {
          "pattern": "loginAsValidUser\\s*\\(.*\\):\\s*Promise<InventoryPage>",
          "message": "loginAsValidUser method should have explicit : Promise<InventoryPage> return type"
        },
        {
          "pattern": "return\\s+new\\s+InventoryPage\\s*\\(",
          "message": "Should return new InventoryPage(this.page)"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\nimport { InventoryPage } from './InventoryPage';\n\nexport class LoginPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Sign in' });\n  }\n\n  async loginAsValidUser(username: string, pass: string): Promise<InventoryPage> {\n    await this.usernameInput.fill(username);\n    await this.passwordInput.fill(pass);\n    await this.submitButton.click();\n    return new InventoryPage(this.page);\n  }\n}",
      "explanation": "Fluent transitions allow test specs to write readable step-by-step flows: `const inventoryPage = await loginPage.loginAsValidUser('user', 'pass'); await inventoryPage.addItem(...)`.",
      "followUpQuestion": "When should a method NOT return the next Page Object? (Hint: what if the login is expected to fail with an invalid password?)"
    },
    "focusSkills": [
      "Fluent methods returning next Page Object",
      "Page transition method chaining"
    ]
  },
  {
    "id": "pom-drill-3-2",
    "level": 3,
    "levelTitle": "Level 3: Assertions and Page Transitions",
    "drillNumber": "Drill 3.2",
    "title": "Multi-Step Checkout Wizard Transition",
    "scenario": "In an e-commerce checkout flow, clicking \"Checkout\" on CartPage navigates to CheckoutInformationPage. Model this multi-step wizard transition cleanly with typed returns.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\nimport { CheckoutInformationPage } from './CheckoutInformationPage';\n\nexport class CartPage {\n  readonly page: Page;\n  readonly checkoutButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });\n  }\n\n  // Task:\n  // Implement proceedToCheckout(): Promise<CheckoutInformationPage>\n  // Clicks checkoutButton and returns new CheckoutInformationPage(this.page).\n}\n",
    "task": "Implement proceedToCheckout(): Promise<CheckoutInformationPage> to transition from the cart to the first step of checkout.",
    "successCriteria": [
      "proceedToCheckout returns Promise<CheckoutInformationPage>.",
      "Clicks this.checkoutButton.",
      "Returns new CheckoutInformationPage(this.page)."
    ],
    "hint": "Use `await this.checkoutButton.click(); return new CheckoutInformationPage(this.page);`.",
    "beginnerGuide": {
      "concept": "Chaining Multi-Step Wizards",
      "whyItMatters": "Wizards (Step 1 -> Step 2 -> Confirmation) are prone to navigation bugs. Typing transitions ensures that Step 1 can only lead to Step 2, preventing invalid steps in tests.",
      "mentalModel": "State machine where actions trigger valid transitions.",
      "sampleDescription": "Wizard progression:",
      "sampleCode": "async nextStep(): Promise<StepTwoPage> {\n  await this.nextButton.click();\n  return new StepTwoPage(this.page);\n}"
    },
    "validation": {
      "requiredKeywords": [
        "proceedToCheckout",
        "CheckoutInformationPage",
        "Promise<CheckoutInformationPage>"
      ],
      "regexPatterns": [
        {
          "pattern": "proceedToCheckout\\s*\\(\\s*\\):\\s*Promise<CheckoutInformationPage>",
          "message": "proceedToCheckout must return Promise<CheckoutInformationPage>"
        },
        {
          "pattern": "return\\s+new\\s+CheckoutInformationPage\\s*\\(",
          "message": "Must return new CheckoutInformationPage(this.page)"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\nimport { CheckoutInformationPage } from './CheckoutInformationPage';\n\nexport class CartPage {\n  readonly page: Page;\n  readonly checkoutButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });\n  }\n\n  async proceedToCheckout(): Promise<CheckoutInformationPage> {\n    await this.checkoutButton.click();\n    return new CheckoutInformationPage(this.page);\n  }\n}",
      "explanation": "Returning typed Page Objects from transition actions eliminates the need for manual instantiations in test specs.",
      "followUpQuestion": "How does this pattern help catch broken URL changes in test code at compile time?"
    },
    "focusSkills": [
      "Multi-step workflow orchestration",
      "Step-by-step wizard navigation modeling"
    ]
  },
  {
    "id": "pom-drill-3-3",
    "level": 3,
    "levelTitle": "Level 3: Assertions and Page Transitions",
    "drillNumber": "Drill 3.3",
    "title": "Exposing State Locators for Web-First Test Assertions",
    "scenario": "A junior tester embedded `expect(page.getByText(\"Saved\")).toBeVisible()` inside a ProfilePage method. Refactor the class to remove the assertion from the POM and expose `readonly successBanner: Locator` and `readonly errorMessage: Locator` for the test spec to assert.",
    "startingCode": "import { Page, Locator, expect } from '@playwright/test'; // Remove expect!\n\nexport class ProfilePage {\n  readonly page: Page;\n  readonly saveButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.saveButton = page.getByRole('button', { name: 'Save Changes' });\n  }\n\n  // Refactor this! Page Objects must not assert internally.\n  async saveProfile(): Promise<void> {\n    await this.saveButton.click();\n    await expect(this.page.getByRole('status')).toBeVisible(); // ❌ Anti-pattern!\n  }\n}\n",
    "task": "Refactor ProfilePage to remove expect completely. Add readonly successBanner and readonly errorMessage locators, and make saveProfile purely execute the click action.",
    "successCriteria": [
      "expect import and calls are completely removed.",
      "Declares readonly successBanner and readonly errorMessage as Locators.",
      "saveProfile purely clicks saveButton and returns Promise<void>."
    ],
    "hint": "Declare `readonly successBanner: Locator;` and initialize in constructor using `page.getByRole('status')`.",
    "beginnerGuide": {
      "concept": "Exposing Locators vs Embedding Assertions",
      "whyItMatters": "If an assertion fails inside a Page Object, error reports point to the POM helper instead of explaining what business requirement failed. Exposing locators lets test specs write clear `await expect(page.successBanner).toBeVisible()` assertions.",
      "mentalModel": "The Page Object is the eyes and hands; the Test Spec is the brain making judgments.",
      "sampleDescription": "Exposing state locators:",
      "sampleCode": "export class AlertPage {\n  readonly alertBanner: Locator;\n  constructor(page: Page) { this.alertBanner = page.getByRole('alert'); }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "successBanner",
        "errorMessage",
        "saveProfile",
        "Promise<void>"
      ],
      "forbiddenKeywords": [
        "expect(",
        "waitForTimeout"
      ],
      "regexPatterns": [
        {
          "pattern": "readonly\\s+successBanner:\\s*Locator",
          "message": "Declare readonly successBanner: Locator"
        },
        {
          "pattern": "readonly\\s+errorMessage:\\s*Locator",
          "message": "Declare readonly errorMessage: Locator"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ProfilePage {\n  readonly page: Page;\n  readonly saveButton: Locator;\n  readonly successBanner: Locator;\n  readonly errorMessage: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.saveButton = page.getByRole('button', { name: 'Save Changes' });\n    this.successBanner = page.getByRole('status');\n    this.errorMessage = page.getByRole('alert');\n  }\n\n  async saveProfile(): Promise<void> {\n    await this.saveButton.click();\n  }\n}",
      "explanation": "Removing assertions preserves the Single Responsibility Principle: the Page Object exposes elements and interactions; test specs verify behavior.",
      "followUpQuestion": "Why can a POM with embedded assertions not be reused for testing negative error cases?"
    },
    "focusSkills": [
      "Exposing state locators for web-first assertions",
      "Keeping test assertions in test specs"
    ]
  },
  {
    "id": "pom-drill-3-4",
    "level": 3,
    "levelTitle": "Level 3: Assertions and Page Transitions",
    "drillNumber": "Drill 3.4",
    "title": "Handling Conditional Workflow Paths",
    "scenario": "When logging in, two outcomes can happen: valid credentials navigate to DashboardPage, while invalid credentials keep the user on LoginPage with an error message. Design clean methods for each intent.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\nimport { DashboardPage } from './DashboardPage';\n\nexport class AuthPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n  readonly errorAlert: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Sign In' });\n    this.errorAlert = page.getByRole('alert');\n  }\n\n  // Task:\n  // 1. Implement loginExpectingSuccess(u: string, p: string): Promise<DashboardPage>\n  // 2. Implement loginExpectingFailure(u: string, p: string): Promise<void>\n}\n",
    "task": "Implement loginExpectingSuccess (returning Promise<DashboardPage>) and loginExpectingFailure (returning Promise<void>) to handle branching flows without conditional if/else assertions in the POM.",
    "successCriteria": [
      "loginExpectingSuccess returns Promise<DashboardPage>.",
      "loginExpectingFailure returns Promise<void>.",
      "No conditional boolean checks or embedded expect assertions."
    ],
    "hint": "loginExpectingSuccess returns `new DashboardPage(this.page);`, loginExpectingFailure resolves void so tests can assert `errorAlert`.",
    "beginnerGuide": {
      "concept": "Explicit Workflow Intent vs Flaky if/else Branches",
      "whyItMatters": "Writing a single `login()` that uses `if (await page.url() === ...)` is an anti-pattern. Having explicit methods (`loginExpectingSuccess` vs `loginExpectingFailure`) makes test specs predictable and easy to read.",
      "mentalModel": "Intent-driven API design.",
      "sampleDescription": "Separating happy path from error path:",
      "sampleCode": "async checkoutSuccess(): Promise<ConfirmationPage> {\n  await this.payButton.click();\n  return new ConfirmationPage(this.page);\n}\nasync checkoutFailure(): Promise<void> {\n  await this.payButton.click();\n}"
    },
    "validation": {
      "requiredKeywords": [
        "loginExpectingSuccess",
        "loginExpectingFailure",
        "DashboardPage",
        "Promise<DashboardPage>"
      ],
      "regexPatterns": [
        {
          "pattern": "loginExpectingSuccess\\s*\\(.*\\):\\s*Promise<DashboardPage>",
          "message": "loginExpectingSuccess must return Promise<DashboardPage>"
        },
        {
          "pattern": "loginExpectingFailure\\s*\\(.*\\):\\s*Promise<void>",
          "message": "loginExpectingFailure must return Promise<void>"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\nimport { DashboardPage } from './DashboardPage';\n\nexport class AuthPage {\n  readonly page: Page;\n  readonly usernameInput: Locator;\n  readonly passwordInput: Locator;\n  readonly submitButton: Locator;\n  readonly errorAlert: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.usernameInput = page.getByLabel('Username');\n    this.passwordInput = page.getByLabel('Password');\n    this.submitButton = page.getByRole('button', { name: 'Sign In' });\n    this.errorAlert = page.getByRole('alert');\n  }\n\n  async loginExpectingSuccess(u: string, p: string): Promise<DashboardPage> {\n    await this.usernameInput.fill(u);\n    await this.passwordInput.fill(p);\n    await this.submitButton.click();\n    return new DashboardPage(this.page);\n  }\n\n  async loginExpectingFailure(u: string, p: string): Promise<void> {\n    await this.usernameInput.fill(u);\n    await this.passwordInput.fill(p);\n    await this.submitButton.click();\n  }\n}",
      "explanation": "Intent-specific methods clarify test intent and eliminate race conditions caused by inspecting URLs during mid-flight navigation.",
      "followUpQuestion": "Why is an if-else URL check inside a Page Object considered an anti-pattern in Playwright?"
    },
    "focusSkills": [
      "Conditional navigation branches",
      "Dynamic page object return types"
    ]
  },
  {
    "id": "pom-drill-3-5",
    "level": 3,
    "levelTitle": "Level 3: Assertions and Page Transitions",
    "drillNumber": "Drill 3.5",
    "title": "Review Challenge: Level 3 Mastery Gate (Checkout Flow)",
    "scenario": "Review Challenge: Build a complete CheckoutReviewPage that represents the final review step of an e-commerce order. It displays the total price, a \"Place Order\" button, and upon clicking \"Place Order\", transitions to ConfirmationPage.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\nimport { ConfirmationPage } from './ConfirmationPage';\n\n// Task: Build CheckoutReviewPage from scratch!\n// 1. Declare readonly page, totalAmount, and placeOrderButton locators.\n// 2. Initialize in constructor(page: Page).\n// 3. Implement placeOrder(): Promise<ConfirmationPage>\n",
    "task": "Create CheckoutReviewPage with proper readonly locators, zero embedded assertions, and a placeOrder method returning Promise<ConfirmationPage>.",
    "successCriteria": [
      "All locators declared readonly Locator.",
      "placeOrder method returns Promise<ConfirmationPage>.",
      "Returns new ConfirmationPage(this.page).",
      "No expect assertions or arbitrary delays."
    ],
    "hint": "Use `return new ConfirmationPage(this.page);` at the end of `placeOrder()`.",
    "beginnerGuide": {
      "concept": "Synthesis: Fluent Transitions & Clean Separation",
      "whyItMatters": "Putting all Level 3 concepts together: Page Objects return the next page on transition and expose locators for test specs to verify assertions.",
      "mentalModel": "Pipelining Page Objects through end-to-end user journeys.",
      "sampleDescription": "Final transition:",
      "sampleCode": "async placeOrder(): Promise<ConfirmationPage> {\n  await this.placeOrderButton.click();\n  return new ConfirmationPage(this.page);\n}"
    },
    "isReviewChallenge": true,
    "isMasteryAssessment": true,
    "validation": {
      "requiredKeywords": [
        "export class CheckoutReviewPage",
        "ConfirmationPage",
        "placeOrder",
        "Promise<ConfirmationPage>"
      ],
      "forbiddenKeywords": [
        "expect(",
        "waitForTimeout"
      ],
      "regexPatterns": [
        {
          "pattern": "placeOrder\\s*\\(\\s*\\):\\s*Promise<ConfirmationPage>",
          "message": "placeOrder must return Promise<ConfirmationPage>"
        },
        {
          "pattern": "return\\s+new\\s+ConfirmationPage\\s*\\(",
          "message": "Must return new ConfirmationPage(this.page)"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\nimport { ConfirmationPage } from './ConfirmationPage';\n\nexport class CheckoutReviewPage {\n  readonly page: Page;\n  readonly totalAmount: Locator;\n  readonly placeOrderButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.totalAmount = page.getByTestId('order-total');\n    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });\n  }\n\n  async placeOrder(): Promise<ConfirmationPage> {\n    await this.placeOrderButton.click();\n    return new ConfirmationPage(this.page);\n  }\n}",
      "explanation": "Clean Level 3 mastery implementation combining immutability, accessible querying, and fluent transition contracts.",
      "followUpQuestion": "How would you write a test verifying the order total before calling placeOrder()?"
    },
    "focusSkills": [
      "Fluent methods returning next Page Object",
      "Page transition method chaining",
      "Multi-step workflow orchestration",
      "Step-by-step wizard navigation modeling",
      "Exposing state locators for web-first assertions",
      "Keeping test assertions in test specs",
      "Conditional navigation branches",
      "Dynamic page object return types",
      "End-to-end multi-page flow orchestration",
      "Zero arbitrary timeouts"
    ]
  },
  {
    "id": "pom-drill-4-1",
    "level": 4,
    "levelTitle": "Level 4: Reusable Architecture",
    "drillNumber": "Drill 4.1",
    "title": "Component Object Model: Header & Cart Navigation",
    "scenario": "The primary header navigation appears on every single page (Dashboard, Catalog, Checkout, Settings). Instead of duplicating header locators in 5 different page objects, we extract a HeaderComponent.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\n// Task: Create the HeaderComponent class\n// It should receive page: Page in its constructor.\n// Store readonly locators for cartBadge and menuButton.\n// Provide openCart(): Promise<void> and getCartCount(): Promise<string>.\n",
    "task": "Create HeaderComponent and demonstrate embedding it as readonly header: HeaderComponent inside an InventoryPage class.",
    "successCriteria": [
      "HeaderComponent has readonly locators for cartBadge and menuButton.",
      "InventoryPage declares readonly header: HeaderComponent in its body and initializes this.header = new HeaderComponent(page).",
      "Zero duplicate selector logic between pages."
    ],
    "hint": "Inside InventoryPage's constructor, initialize `this.header = new HeaderComponent(page);`.",
    "beginnerGuide": {
      "concept": "Component Object Model (Composition Over Inheritance)",
      "whyItMatters": "Web apps have recurring components: navigation headers, sidebars, cookie banners, and footers. If 12 different pages have the same top navigation bar, creating a separate `HeaderComponent` and embedding it (`this.header = new HeaderComponent(page)`) ensures you write the locator only once in your whole company codebase.",
      "mentalModel": "Composition is like building a car: the car page has an engine, wheels, and stereo components embedded inside it, rather than every car reinventing how a wheel rolls.",
      "sampleDescription": "Embedding a shared component into a page:",
      "sampleCode": "export class DashboardPage {\n  readonly page: Page;\n  readonly sidebar: SidebarComponent;\n  constructor(page: Page) {\n    this.page = page;\n    this.sidebar = new SidebarComponent(page);\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "HeaderComponent",
        "InventoryPage",
        "cartBadge",
        "header"
      ],
      "regexPatterns": [
        {
          "pattern": "readonly\\s+header:\\s*HeaderComponent",
          "message": "Declare header component as readonly header: HeaderComponent"
        },
        {
          "pattern": "this\\.header\\s*=\\s*new\\s+HeaderComponent\\s*\\(\\s*page\\s*\\)",
          "message": "Initialize this.header = new HeaderComponent(page) in constructor"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class HeaderComponent {\n  readonly page: Page;\n  readonly cartBadge: Locator;\n  readonly menuButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.cartBadge = page.getByTestId('shopping-cart-badge');\n    this.menuButton = page.getByRole('button', { name: 'Open Menu' });\n  }\n\n  async openCart(): Promise<void> {\n    await this.cartBadge.click();\n  }\n}\n\nexport class InventoryPage {\n  readonly page: Page;\n  readonly header: HeaderComponent;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.header = new HeaderComponent(page);\n  }\n}",
      "explanation": "Component Objects follow composition over inheritance: pages compose shared components, preventing duplicate locators and single-point-of-failure maintenance headaches.",
      "followUpQuestion": "Why is composition (this.header = new HeaderComponent(page)) generally preferred over class inheritance (InventoryPage extends BasePageWithHeader)?"
    },
    "focusSkills": [
      "Extracting Component Objects (composition over inheritance)",
      "Shared navigation and header component modeling"
    ]
  },
  {
    "id": "pom-drill-4-2",
    "level": 4,
    "levelTitle": "Level 4: Reusable Architecture",
    "drillNumber": "Drill 4.2",
    "title": "Reusable Modal Component Objects",
    "scenario": "A confirmation dialog component is triggered across multiple settings pages (Delete Account, Discard Changes, Revoke Access). Create a standalone ConfirmModalComponent that accepts the modal root Locator.",
    "startingCode": "import { Locator } from '@playwright/test';\n\nexport class ConfirmModalComponent {\n  readonly root: Locator;\n  readonly confirmButton: Locator;\n  readonly cancelButton: Locator;\n\n  constructor(root: Locator) {\n    this.root = root;\n    // Task: Initialize confirmButton and cancelButton scoped inside this.root\n  }\n\n  // Task: Implement confirm(): Promise<void> and cancel(): Promise<void>\n}\n",
    "task": "Create ConfirmModalComponent taking a root Locator and scoping confirm and cancel button clicks within that root container.",
    "successCriteria": [
      "Constructor accepts root: Locator.",
      "confirmButton and cancelButton are scoped inside root.",
      "confirm() and cancel() return Promise<void>."
    ],
    "hint": "Use `this.confirmButton = root.getByRole('button', { name: 'Confirm' });`.",
    "beginnerGuide": {
      "concept": "Container-Scoped Components",
      "whyItMatters": "Instead of passing `page: Page`, passing a container `root: Locator` allows the component to work for any modal on the page regardless of its DOM ID or wrapper.",
      "mentalModel": "A component that knows only its internal world, rooted at a designated container.",
      "sampleDescription": "Scoping inside container:",
      "sampleCode": "export class CardComponent {\n  constructor(readonly root: Locator) {\n    this.title = root.getByRole('heading');\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "ConfirmModalComponent",
        "confirmButton",
        "cancelButton",
        "confirm()",
        "cancel()"
      ],
      "regexPatterns": [
        {
          "pattern": "constructor\\s*\\(\\s*root:\\s*Locator\\s*\\)",
          "message": "Constructor must accept root: Locator"
        },
        {
          "pattern": "async\\s+confirm\\s*\\(\\s*\\):\\s*Promise<void>",
          "message": "confirm() must return Promise<void>"
        }
      ],
      "solutionCode": "import { Locator } from '@playwright/test';\n\nexport class ConfirmModalComponent {\n  readonly root: Locator;\n  readonly confirmButton: Locator;\n  readonly cancelButton: Locator;\n\n  constructor(root: Locator) {\n    this.root = root;\n    this.confirmButton = root.getByRole('button', { name: 'Confirm' });\n    this.cancelButton = root.getByRole('button', { name: 'Cancel' });\n  }\n\n  async confirm(): Promise<void> {\n    await this.confirmButton.click();\n  }\n\n  async cancel(): Promise<void> {\n    await this.cancelButton.click();\n  }\n}",
      "explanation": "Scoping components to a `root: Locator` enables multiple instances of the same UI widget to coexist on a page without selector collisions.",
      "followUpQuestion": "How does passing Locator instead of Page improve component reusability?"
    },
    "focusSkills": [
      "Root-scoped component objects (root: Locator)",
      "Reusable modal and dialog encapsulation"
    ]
  },
  {
    "id": "pom-drill-4-3",
    "level": 4,
    "levelTitle": "Level 4: Reusable Architecture",
    "drillNumber": "Drill 4.3",
    "title": "Pagination Component Object",
    "scenario": "Data tables across the application feature identical pagination bars with \"Next\", \"Previous\", and page number indicators. Extract this into a reusable PaginationComponent.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class PaginationComponent {\n  readonly page: Page;\n  readonly nextButton: Locator;\n  readonly previousButton: Locator;\n  readonly pageIndicator: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    // Task: Initialize locators using accessible queries\n  }\n\n  // Task: Implement nextPage(): Promise<void> and prevPage(): Promise<void>\n}\n",
    "task": "Implement PaginationComponent with nextButton, previousButton, pageIndicator, nextPage(), and prevPage().",
    "successCriteria": [
      "Locators initialized with accessible queries (getByRole).",
      "nextPage and prevPage return Promise<void>.",
      "Encapsulates navigation actions cleanly."
    ],
    "hint": "Use `page.getByRole('button', { name: 'Next page' })` or similar accessible names.",
    "beginnerGuide": {
      "concept": "Widget Component Extraction",
      "whyItMatters": "Any repeated UI pattern with interactive behavior is a prime candidate for a component object. If pagination UI changes from buttons to an infinite scroll dropdown, you update one component.",
      "mentalModel": "Self-contained sub-controllers.",
      "sampleDescription": "Pagination component:",
      "sampleCode": "async nextPage(): Promise<void> {\n  await this.nextButton.click();\n}"
    },
    "validation": {
      "requiredKeywords": [
        "PaginationComponent",
        "nextButton",
        "previousButton",
        "nextPage",
        "prevPage"
      ],
      "regexPatterns": [
        {
          "pattern": "async\\s+nextPage\\s*\\(\\s*\\):\\s*Promise<void>",
          "message": "nextPage must return Promise<void>"
        },
        {
          "pattern": "async\\s+prevPage\\s*\\(\\s*\\):\\s*Promise<void>",
          "message": "prevPage must return Promise<void>"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class PaginationComponent {\n  readonly page: Page;\n  readonly nextButton: Locator;\n  readonly previousButton: Locator;\n  readonly pageIndicator: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.nextButton = page.getByRole('button', { name: 'Next' });\n    this.previousButton = page.getByRole('button', { name: 'Previous' });\n    this.pageIndicator = page.getByTestId('page-number');\n  }\n\n  async nextPage(): Promise<void> {\n    await this.nextButton.click();\n  }\n\n  async prevPage(): Promise<void> {\n    await this.previousButton.click();\n  }\n}",
      "explanation": "Encapsulating pagination behavior prevents spreading pagination selector logic across multiple test specifications.",
      "followUpQuestion": "How would you write a helper method in PaginationComponent to navigate to a specific page number?"
    },
    "focusSkills": [
      "Widget component extraction & pagination actions",
      "Decoupling UI controls from page objects"
    ]
  },
  {
    "id": "pom-drill-4-4",
    "level": 4,
    "levelTitle": "Level 4: Reusable Architecture",
    "drillNumber": "Drill 4.4",
    "title": "Composition vs Inheritance: Refactoring God BasePage",
    "scenario": "An existing codebase has an anti-pattern: a massive BasePage with 40 methods (login, cart, footer, navbar, export, notifications). Refactor a child page to use clean component composition instead of inheritance.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\nimport { NavbarComponent } from './NavbarComponent';\n\n// Refactor: Remove 'extends BasePage' and compose NavbarComponent instead!\nexport class SettingsPage {\n  readonly page: Page;\n  readonly navbar: NavbarComponent;\n  readonly saveSettingsButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.navbar = new NavbarComponent(page);\n    this.saveSettingsButton = page.getByRole('button', { name: 'Save Settings' });\n  }\n\n  async save(): Promise<void> {\n    await this.saveSettingsButton.click();\n  }\n}\n",
    "task": "Ensure SettingsPage cleanly composes NavbarComponent without inheriting from a bloated BasePage.",
    "successCriteria": [
      "SettingsPage does NOT extend BasePage.",
      "Declares readonly navbar: NavbarComponent.",
      "Initializes navbar in constructor.",
      "Clean separation of concerns."
    ],
    "hint": "Favor \"has-a\" relationship (SettingsPage HAS A NavbarComponent) over \"is-a\" relationship.",
    "beginnerGuide": {
      "concept": "The \"God Object\" Inheritance Anti-Pattern",
      "whyItMatters": "Beginners often put everything into a `BasePage` that every page extends. Soon, `BasePage` has 1,000 lines and changes to it break 50 unrelated tests. Composition keeps classes small and focused.",
      "mentalModel": "Legos vs Monolith: snap together small components rather than carving a giant statue.",
      "sampleDescription": "Clean composition:",
      "sampleCode": "export class ProfilePage {\n  readonly navbar: NavbarComponent;\n  constructor(page: Page) {\n    this.navbar = new NavbarComponent(page);\n  }\n}"
    },
    "validation": {
      "requiredKeywords": [
        "SettingsPage",
        "NavbarComponent",
        "readonly navbar"
      ],
      "forbiddenKeywords": [
        "extends BasePage"
      ],
      "regexPatterns": [
        {
          "pattern": "readonly\\s+navbar:\\s*NavbarComponent",
          "message": "Declare readonly navbar: NavbarComponent"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\nimport { NavbarComponent } from './NavbarComponent';\n\nexport class SettingsPage {\n  readonly page: Page;\n  readonly navbar: NavbarComponent;\n  readonly saveSettingsButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.navbar = new NavbarComponent(page);\n    this.saveSettingsButton = page.getByRole('button', { name: 'Save Settings' });\n  }\n\n  async save(): Promise<void> {\n    await this.saveSettingsButton.click();\n  }\n}",
      "explanation": "Composition decouples components, making code significantly easier to maintain, test in isolation, and refactor over time.",
      "followUpQuestion": "What are the main drawbacks of deep inheritance trees in test automation frameworks?"
    },
    "focusSkills": [
      "Eliminating bloated BasePage god objects",
      "Eliminating duplicate selectors across pages"
    ]
  },
  {
    "id": "pom-drill-4-5",
    "level": 4,
    "levelTitle": "Level 4: Reusable Architecture",
    "drillNumber": "Drill 4.5",
    "title": "Review Challenge: Level 4 Mastery Gate (Composite Dashboard)",
    "scenario": "Review Challenge: Build an AnalyticsDashboardPage that composes three distinct component objects: TopNavComponent, FilterSidebarComponent, and MetricsGridComponent.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\nimport { TopNavComponent } from './TopNavComponent';\nimport { FilterSidebarComponent } from './FilterSidebarComponent';\nimport { MetricsGridComponent } from './MetricsGridComponent';\n\n// Task: Build AnalyticsDashboardPage composing TopNavComponent,\n// FilterSidebarComponent, and MetricsGridComponent!\n",
    "task": "Create AnalyticsDashboardPage with topNav, sidebar, and metrics properties initialized in constructor with Page fixture.",
    "successCriteria": [
      "Declares readonly topNav: TopNavComponent.",
      "Declares readonly sidebar: FilterSidebarComponent.",
      "Declares readonly metrics: MetricsGridComponent.",
      "Initializes all three in constructor(page: Page)."
    ],
    "hint": "Initialize `this.topNav = new TopNavComponent(page);`, `this.sidebar = new FilterSidebarComponent(page);`, and `this.metrics = new MetricsGridComponent(page);`.",
    "beginnerGuide": {
      "concept": "Synthesis: Enterprise Component Architecture",
      "whyItMatters": "Real-world dashboards are complex compositions of navbars, sidebars, charts, and tables. Composing them in the parent Page Object provides tests with clean, readable access to any sub-system.",
      "mentalModel": "A modular dashboard assembled from precision components.",
      "sampleDescription": "Composite page:",
      "sampleCode": "await dashboard.topNav.logout();\nawait dashboard.sidebar.selectDateRange('Last 30 Days');"
    },
    "isReviewChallenge": true,
    "isMasteryAssessment": true,
    "validation": {
      "requiredKeywords": [
        "export class AnalyticsDashboardPage",
        "TopNavComponent",
        "FilterSidebarComponent",
        "MetricsGridComponent"
      ],
      "regexPatterns": [
        {
          "pattern": "readonly\\s+topNav:\\s*TopNavComponent",
          "message": "Declare readonly topNav: TopNavComponent"
        },
        {
          "pattern": "readonly\\s+sidebar:\\s*FilterSidebarComponent",
          "message": "Declare readonly sidebar: FilterSidebarComponent"
        },
        {
          "pattern": "readonly\\s+metrics:\\s*MetricsGridComponent",
          "message": "Declare readonly metrics: MetricsGridComponent"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\nimport { TopNavComponent } from './TopNavComponent';\nimport { FilterSidebarComponent } from './FilterSidebarComponent';\nimport { MetricsGridComponent } from './MetricsGridComponent';\n\nexport class AnalyticsDashboardPage {\n  readonly page: Page;\n  readonly topNav: TopNavComponent;\n  readonly sidebar: FilterSidebarComponent;\n  readonly metrics: MetricsGridComponent;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.topNav = new TopNavComponent(page);\n    this.sidebar = new FilterSidebarComponent(page);\n    this.metrics = new MetricsGridComponent(page);\n  }\n}",
      "explanation": "Clean Level 4 mastery implementation modeling a modern enterprise single-page application with composed component objects.",
      "followUpQuestion": "How does component composition simplify team collaboration when different squads own the sidebar vs the metrics grid?"
    },
    "focusSkills": [
      "Extracting Component Objects (composition over inheritance)",
      "Shared navigation and header component modeling",
      "Root-scoped component objects (root: Locator)",
      "Reusable modal and dialog encapsulation",
      "Widget component extraction & pagination actions",
      "Decoupling UI controls from page objects",
      "Eliminating bloated BasePage god objects",
      "Eliminating duplicate selectors across pages",
      "Enterprise composite page dashboard architecture",
      "Balancing component abstraction vs readability"
    ]
  },
  {
    "id": "pom-drill-5-1",
    "level": 5,
    "levelTitle": "Level 5: Junior-Level Framework Skills",
    "drillNumber": "Drill 5.1",
    "title": "Custom Fixtures: Injecting Page Objects with test.extend()",
    "scenario": "Instead of manually calling `const loginPage = new LoginPage(page)` at the start of every single test, create a custom fixture file that injects `loginPage` and `inventoryPage` directly into the test parameters.",
    "startingCode": "import { test as base } from '@playwright/test';\nimport { LoginPage } from './LoginPage';\nimport { InventoryPage } from './InventoryPage';\n\n// Task: Declare type AppFixtures and extend base test with loginPage and inventoryPage fixtures!\n",
    "task": "Use test.extend<AppFixtures>() to inject loginPage and inventoryPage, properly calling await use(...) for each fixture.",
    "successCriteria": [
      "Declares type or interface AppFixtures with loginPage: LoginPage and inventoryPage: InventoryPage.",
      "Calls base.extend<AppFixtures>({ ... }).",
      "Fixtures instantiate the Page Object and call await use(instance).",
      "Exports custom test and expect."
    ],
    "hint": "Use `{ loginPage: async ({ page }, use) => { await use(new LoginPage(page)); } }`.",
    "beginnerGuide": {
      "concept": "Dependency Injection with Custom Fixtures (test.extend)",
      "whyItMatters": "Writing `const loginPage = new LoginPage(page)` in 200 tests is repetitive boilerplate. Playwright's killer feature is test fixtures: with `test.extend()`, your tests just request `{ loginPage }` in their arguments, and Playwright automatically sets up and tears down the page object!",
      "mentalModel": "A room service cart: instead of going to the kitchen yourself every morning to cook eggs, you tell room service what you want (`{ loginPage }`), and it arrives at your door ready to eat.",
      "sampleDescription": "Custom fixture with test.extend:",
      "sampleCode": "export const test = base.extend<{ adminPage: AdminPage }>({\n  adminPage: async ({ page }, use) => {\n    await use(new AdminPage(page));\n  },\n});"
    },
    "validation": {
      "requiredKeywords": [
        "extend",
        "LoginPage",
        "InventoryPage",
        "use("
      ],
      "regexPatterns": [
        {
          "pattern": "base\\.extend|test\\.extend",
          "message": "Extend base test with custom fixtures using test.extend or base.extend"
        },
        {
          "pattern": "await\\s+use\\s*\\(",
          "message": "Pass page object instance to test using await use(...) inside fixture"
        }
      ],
      "solutionCode": "import { test as base, expect } from '@playwright/test';\nimport { LoginPage } from './LoginPage';\nimport { InventoryPage } from './InventoryPage';\n\ntype AppFixtures = {\n  loginPage: LoginPage;\n  inventoryPage: InventoryPage;\n};\n\nexport const test = base.extend<AppFixtures>({\n  loginPage: async ({ page }, use) => {\n    const loginPage = new LoginPage(page);\n    await use(loginPage);\n  },\n  inventoryPage: async ({ page }, use) => {\n    const inventoryPage = new InventoryPage(page);\n    await use(inventoryPage);\n  },\n});\n\nexport { expect };",
      "explanation": "Custom fixtures leverage Playwright's dependency injection. Tests simply declare `test(\"name\", async ({ loginPage }) => { ... })` and receive pre-instantiated, scoped page objects automatically.",
      "followUpQuestion": "What would happen if you forgot to call `await use(loginPage)` inside the fixture definition?"
    },
    "focusSkills": [
      "Custom fixtures with test.extend()",
      "Page Object dependency injection"
    ]
  },
  {
    "id": "pom-drill-5-2",
    "level": 5,
    "levelTitle": "Level 5: Junior-Level Framework Skills",
    "drillNumber": "Drill 5.2",
    "title": "Authenticated Session Fixture: Reusing storageState",
    "scenario": "Logging in via the UI before every test takes 3-5 seconds. By generating a `storageState.json` file in a global setup, we can create an `authedPage` fixture that opens browsers with cookies and localStorage pre-populated.",
    "startingCode": "import { test as base } from '@playwright/test';\n\n// Task: Extend base test with an 'authedPage' fixture that creates a new browser context\n// with storageState: 'playwright/.auth/user.json', creates a page, and yields it to use().\n",
    "task": "Create an authedPage fixture using browser.newContext({ storageState: 'playwright/.auth/user.json' }) and yield the page via await use(page).",
    "successCriteria": [
      "Creates new browser context with storageState path.",
      "Opens page in that context.",
      "Calls await use(authedPage).",
      "Closes context in teardown."
    ],
    "hint": "Use `const context = await browser.newContext({ storageState: \"...\" }); const page = await context.newPage(); await use(page); await context.close();`.",
    "beginnerGuide": {
      "concept": "Session Storage Authentication Bypass",
      "whyItMatters": "Logging in through the UI for 500 tests adds 25 minutes of unnecessary CI run time. Storing cookies and tokens once and reusing them via `storageState` cuts suite execution time by 80%.",
      "mentalModel": "VIP Fast Pass: you show your badge (saved cookies) at the door instead of filling out registration paperwork every single time.",
      "sampleDescription": "Authenticated context creation:",
      "sampleCode": "const context = await browser.newContext({ storageState: 'state.json' });\nconst page = await context.newPage();\nawait use(page);\nawait context.close();"
    },
    "validation": {
      "requiredKeywords": [
        "storageState",
        "newContext",
        "newPage",
        "use("
      ],
      "regexPatterns": [
        {
          "pattern": "browser\\.newContext\\s*\\(\\s*\\{[^}]*storageState",
          "message": "Create browser context with storageState"
        },
        {
          "pattern": "await\\s+use\\s*\\(",
          "message": "Yield authenticated page via await use(page)"
        }
      ],
      "solutionCode": "import { test as base, Page } from '@playwright/test';\n\ntype AuthFixtures = {\n  authedPage: Page;\n};\n\nexport const test = base.extend<AuthFixtures>({\n  authedPage: async ({ browser }, use) => {\n    const context = await browser.newContext({\n      storageState: 'playwright/.auth/user.json',\n    });\n    const page = await context.newPage();\n    await use(page);\n    await context.close();\n  },\n});",
      "explanation": "storageState reuse eliminates repetitive UI logins, speeding up test suites and reducing login endpoint throttling in CI.",
      "followUpQuestion": "When must a test NOT use storageState and test the actual login UI instead?"
    },
    "focusSkills": [
      "storageState authentication bypass",
      "Session fixture context management"
    ]
  },
  {
    "id": "pom-drill-5-3",
    "level": 5,
    "levelTitle": "Level 5: Junior-Level Framework Skills",
    "drillNumber": "Drill 5.3",
    "title": "Fixture with Automatic Setup & Teardown Lifecycle",
    "scenario": "Tests need a temporary workspace project. If tests create projects but fail halfway, garbage data accumulates. Create a fixture that creates a project before the test and automatically deletes it after `await use()`, even if the test fails!",
    "startingCode": "import { test as base } from '@playwright/test';\n\n// Task: Create a 'tempProject' fixture with automatic cleanup\n// Before use: create project via API or helper\n// await use(project)\n// After use (teardown): delete project to keep environment pristine!\n",
    "task": "Implement tempProject fixture that sets up a project object, yields it to use(), and ensures cleanup runs in a finally block or after use().",
    "successCriteria": [
      "Sets up project object before use.",
      "Calls await use(project).",
      "Executes cleanup/teardown logic after await use()."
    ],
    "hint": "Code after `await use(...)` runs after the test completes, guaranteed by Playwright.",
    "beginnerGuide": {
      "concept": "Fixture Lifecycle & Guaranteed Teardown",
      "whyItMatters": "If a test crashes in the middle, `afterEach` hooks might still run, but fixtures provide local encapsulation: setup happens before `await use()`, and teardown happens immediately after, keeping tests completely isolated.",
      "mentalModel": "Sandwich: Bread on top (Setup), Sandwich filling (Test runs in `use()`), Bread on bottom (Teardown).",
      "sampleDescription": "Automatic cleanup pattern:",
      "sampleCode": "user: async ({ request }, use) => {\n  const user = await createUser(request);\n  await use(user);\n  await deleteUser(request, user.id);\n}"
    },
    "validation": {
      "requiredKeywords": [
        "tempProject",
        "use(",
        "delete"
      ],
      "regexPatterns": [
        {
          "pattern": "await\\s+use\\s*\\(",
          "message": "Yield resource via await use(...)"
        }
      ],
      "solutionCode": "import { test as base } from '@playwright/test';\n\ntype Project = { id: string; name: string };\n\ntype ProjectFixtures = {\n  tempProject: Project;\n};\n\nexport const test = base.extend<ProjectFixtures>({\n  tempProject: async ({ request }, use) => {\n    // 1. Setup: Create temporary project\n    const res = await request.post('/api/projects', {\n      data: { name: `Test-Project-${Date.now()}` }\n    });\n    const project = await res.json();\n\n    // 2. Yield to test\n    await use(project);\n\n    // 3. Teardown: Always clean up after test finishes\n    await request.delete(`/api/projects/${project.id}`);\n  },\n});",
      "explanation": "Playwright fixtures guarantee that code after `await use()` executes even if assertions inside the test spec fail, preventing test data pollution.",
      "followUpQuestion": "Why is fixture-level cleanup more reliable than placing cleanup code at the end of the test body?"
    },
    "focusSkills": [
      "Automatic fixture setup & teardown cleanup (use() lifecycle)",
      "Isolated test execution and data cleanup"
    ]
  },
  {
    "id": "pom-drill-5-4",
    "level": 5,
    "levelTitle": "Level 5: Junior-Level Framework Skills",
    "drillNumber": "Drill 5.4",
    "title": "Parameterized & Configurable Fixture Options",
    "scenario": "Different test suites require testing as different user roles (e.g. Admin vs ReadOnly). Use `test.extend` with fixture options so tests can configure `userRole` dynamically.",
    "startingCode": "import { test as base } from '@playwright/test';\n\n// Task: Define TestOptions { userRole: 'admin' | 'viewer' }\n// Extend base test providing a default userRole and a roleUser fixture that adapts based on userRole option.\n",
    "task": "Create a configurable fixture option 'userRole' with default 'viewer' and inject roleUser based on the selected option.",
    "successCriteria": [
      "Declares userRole option with default value.",
      "Declares roleUser fixture that consumes userRole.",
      "Yields appropriate user session via await use(...)."
    ],
    "hint": "Use `userRole: ['viewer', { option: true }]` in base.extend.",
    "beginnerGuide": {
      "concept": "Fixture Options for Parameterized Testing",
      "whyItMatters": "Instead of creating separate test files for every permission level, fixture options let individual tests or describe blocks override options: `test.use({ userRole: \"admin\" })`.",
      "mentalModel": "A thermostat dial: test files turn the dial to set their environment configuration.",
      "sampleDescription": "Fixture options:",
      "sampleCode": "userRole: ['standard', { option: true }],"
    },
    "validation": {
      "requiredKeywords": [
        "userRole",
        "option: true",
        "use("
      ],
      "regexPatterns": [
        {
          "pattern": "userRole:[^]]*option:\\s*true",
          "message": "Define userRole as a configurable option using { option: true }"
        }
      ],
      "solutionCode": "import { test as base } from '@playwright/test';\n\ntype TestOptions = {\n  userRole: 'admin' | 'viewer';\n};\n\ntype RoleFixtures = {\n  roleUser: { username: string; permissions: string[] };\n};\n\nexport const test = base.extend<TestOptions & RoleFixtures>({\n  userRole: ['viewer', { option: true }],\n\n  roleUser: async ({ userRole }, use) => {\n    const user = userRole === 'admin'\n      ? { username: 'admin@corp.com', permissions: ['all'] }\n      : { username: 'viewer@corp.com', permissions: ['read'] };\n\n    await use(user);\n  },\n});",
      "explanation": "Configurable options enable declarative test parametrization with `test.use({ userRole: 'admin' })` at file or describe-block scope.",
      "followUpQuestion": "How does test.use() affect tests defined in the same file?"
    },
    "focusSkills": [
      "Configurable fixture options with test.use()",
      "Role-based test environment parametrization"
    ]
  },
  {
    "id": "pom-drill-5-5",
    "level": 5,
    "levelTitle": "Level 5: Junior-Level Framework Skills",
    "drillNumber": "Drill 5.5",
    "title": "Review Challenge: Level 5 Mastery Gate (Enterprise Fixtures)",
    "scenario": "Review Challenge: Build a complete enterprise fixture index file `test.ts` from scratch that exports custom `test` and `expect`. It must inject `loginPage: LoginPage` and `dashboardPage: DashboardPage`.",
    "startingCode": "import { test as base, expect } from '@playwright/test';\nimport { LoginPage } from './LoginPage';\nimport { DashboardPage } from './DashboardPage';\n\n// Task: Build the complete enterprise fixture definition from scratch!\n// 1. Declare type AppFixtures\n// 2. Export custom 'test' extended with loginPage and dashboardPage fixtures\n// 3. Re-export expect\n",
    "task": "Create complete fixture index providing pre-initialized loginPage and dashboardPage fixtures, exporting extended test and standard expect.",
    "successCriteria": [
      "Declares type AppFixtures with both page objects.",
      "Extends base test and yields instances via await use().",
      "Exports custom test and expect.",
      "No missing awaits or untyped parameters."
    ],
    "hint": "Use `export const test = base.extend<AppFixtures>({ ... }); export { expect };`.",
    "beginnerGuide": {
      "concept": "Synthesis: Complete Test Fixture Infrastructure",
      "whyItMatters": "In high-performing SDET teams, test authors never instantiate Page Objects manually. All pages are provided via the custom fixture barrel file.",
      "mentalModel": "The central power grid of your test automation framework.",
      "sampleDescription": "Framework entrypoint:",
      "sampleCode": "export const test = base.extend<Pages>({ ... });\nexport { expect };"
    },
    "isReviewChallenge": true,
    "isMasteryAssessment": true,
    "validation": {
      "requiredKeywords": [
        "base.extend",
        "LoginPage",
        "DashboardPage",
        "use(",
        "export { expect }"
      ],
      "regexPatterns": [
        {
          "pattern": "export\\s+const\\s+test\\s*=\\s*base\\.extend",
          "message": "Export custom test via base.extend"
        },
        {
          "pattern": "export\\s*\\{\\s*expect\\s*\\}",
          "message": "Re-export expect from @playwright/test"
        }
      ],
      "solutionCode": "import { test as base, expect } from '@playwright/test';\nimport { LoginPage } from './LoginPage';\nimport { DashboardPage } from './DashboardPage';\n\ntype AppFixtures = {\n  loginPage: LoginPage;\n  dashboardPage: DashboardPage;\n};\n\nexport const test = base.extend<AppFixtures>({\n  loginPage: async ({ page }, use) => {\n    await use(new LoginPage(page));\n  },\n  dashboardPage: async ({ page }, use) => {\n    await use(new DashboardPage(page));\n  },\n});\n\nexport { expect };",
      "explanation": "This clean Level 5 architecture consolidates page object instantiation into declarative dependency injection, creating concise, elegant test specifications.",
      "followUpQuestion": "How does this pattern make onboarding junior test writers significantly faster?"
    },
    "focusSkills": [
      "Custom fixtures with test.extend()",
      "Page Object dependency injection",
      "storageState authentication bypass",
      "Session fixture context management",
      "Automatic fixture setup & teardown cleanup (use() lifecycle)",
      "Isolated test execution and data cleanup",
      "Configurable fixture options with test.use()",
      "Role-based test environment parametrization",
      "Enterprise fixture infrastructure and barrel exports",
      "End-to-end test fixture architecture"
    ]
  },
  {
    "id": "pom-drill-6-1",
    "level": 6,
    "levelTitle": "Level 6: Junior-to-Mid-Level Reliability",
    "drillNumber": "Drill 6.1",
    "title": "Diagnosing Missing Awaits & Race Conditions",
    "scenario": "A test frequently passes on powerful developer laptops but fails 40% of the time in CI with \"Target closed\" or \"Element not found\". The culprit: an asynchronous locator action that was called without `await`.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class CheckoutPage {\n  readonly page: Page;\n  readonly cardInput: Locator;\n  readonly payButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.cardInput = page.getByLabel('Card Number');\n    this.payButton = page.getByRole('button', { name: 'Pay Now' });\n  }\n\n  // ❌ Flaky Bug: Find and fix the missing await race condition!\n  async submitPayment(cardNumber: string): Promise<void> {\n    this.cardInput.fill(cardNumber); // ❌ Missing await!\n    await this.payButton.click();\n  }\n}\n",
    "task": "Fix the race condition in submitPayment by properly awaiting this.cardInput.fill(cardNumber) before clicking payButton.",
    "successCriteria": [
      "await this.cardInput.fill(cardNumber) is properly awaited.",
      "await this.payButton.click() is properly awaited.",
      "Method returns Promise<void> with zero un-awaited async operations."
    ],
    "hint": "Add `await` before `this.cardInput.fill(cardNumber);`.",
    "beginnerGuide": {
      "concept": "The Silent Killer: Unawaited Promises in Test Code",
      "whyItMatters": "If you omit `await` on `input.fill()`, JavaScript immediately fires the next line (`button.click()`) before the text is finished typing! In fast local tests, the typing happens to complete in time. In slower CI runners, the click fires on an empty field, failing the build.",
      "mentalModel": "Shooting before aiming: always wait for the input to fill before pulling the submit trigger.",
      "sampleDescription": "Sequential awaiting:",
      "sampleCode": "await this.input.fill(value);\nawait this.submit.click();"
    },
    "validation": {
      "requiredKeywords": [
        "await this.cardInput.fill",
        "await this.payButton.click"
      ],
      "regexPatterns": [
        {
          "pattern": "await\\s+this\\.cardInput\\.fill\\s*\\(",
          "message": "Must await this.cardInput.fill(...)"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class CheckoutPage {\n  readonly page: Page;\n  readonly cardInput: Locator;\n  readonly payButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.cardInput = page.getByLabel('Card Number');\n    this.payButton = page.getByRole('button', { name: 'Pay Now' });\n  }\n\n  async submitPayment(cardNumber: string): Promise<void> {\n    await this.cardInput.fill(cardNumber);\n    await this.payButton.click();\n  }\n}",
      "explanation": "Every Playwright interaction returns a Promise. Missing an `await` creates non-deterministic race conditions that cause test flakiness in CI pipelines.",
      "followUpQuestion": "Why do missing awaits often pass on local development machines but fail in CI environments?"
    },
    "focusSkills": [
      "Investigating race conditions and missing awaits",
      "Asynchronous locator call synchronization"
    ]
  },
  {
    "id": "pom-drill-6-2",
    "level": 6,
    "levelTitle": "Level 6: Junior-to-Mid-Level Reliability",
    "drillNumber": "Drill 6.2",
    "title": "Network Mocking with page.route() in Page Objects",
    "scenario": "Testing live payment gateways or slow third-party recommendation engines causes slow, flaky tests. Implement a helper method `mockProductsEndpoint(products: any[])` that intercepts `**/api/v1/products` and returns a mock JSON response with status 200.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ProductsCatalogPage {\n  readonly page: Page;\n\n  constructor(page: Page) {\n    this.page = page;\n  }\n\n  // Task: Implement mockProductsEndpoint(mockData: any[]): Promise<void>\n  // Use page.route('**/api/v1/products', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockData) }))\n}\n",
    "task": "Implement mockProductsEndpoint to intercept network traffic and fulfill the request with mock data using page.route().",
    "successCriteria": [
      "mockProductsEndpoint accepts mockData array.",
      "Calls await this.page.route(urlPattern, handler).",
      "Fulfills with status 200 and JSON body.",
      "Returns Promise<void>."
    ],
    "hint": "Use `await this.page.route(\"**/api/v1/products\", route => route.fulfill({ status: 200, contentType: \"application/json\", body: JSON.stringify(mockData) }));`.",
    "beginnerGuide": {
      "concept": "Network Virtualization with page.route()",
      "whyItMatters": "Third-party APIs go down, have rate limits, or take 4 seconds to respond. Intercepting the network at the browser level allows you to test edge cases (empty states, 500 errors, special currencies) instantly and with 100% determinism.",
      "mentalModel": "A postal interceptor: before the letter leaves the browser, you replace the reply with your simulated response.",
      "sampleDescription": "Mocking API routes:",
      "sampleCode": "await page.route('**/api/users', route => route.fulfill({\n  status: 200,\n  json: [{ id: 1, name: 'Alice' }]\n}));"
    },
    "validation": {
      "requiredKeywords": [
        "page.route",
        "fulfill",
        "mockProductsEndpoint",
        "Promise<void>"
      ],
      "regexPatterns": [
        {
          "pattern": "this\\.page\\.route\\s*\\(",
          "message": "Intercept route using this.page.route(...)"
        },
        {
          "pattern": "route\\.fulfill\\s*\\(",
          "message": "Fulfill intercepted request with mock payload"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ProductsCatalogPage {\n  readonly page: Page;\n\n  constructor(page: Page) {\n    this.page = page;\n  }\n\n  async mockProductsEndpoint(mockData: unknown[]): Promise<void> {\n    await this.page.route('**/api/v1/products', async (route) => {\n      await route.fulfill({\n        status: 200,\n        contentType: 'application/json',\n        body: JSON.stringify(mockData),\n      });\n    });\n  }\n}",
      "explanation": "`page.route()` intercepts HTTP requests before they touch the network wire, enabling ultra-fast, deterministic testing of UI data states.",
      "followUpQuestion": "What is the key difference between using page.route() vs mocking an API in node server code?"
    },
    "focusSkills": [
      "API route interception & mocking with page.route()",
      "Deterministic response virtualization"
    ]
  },
  {
    "id": "pom-drill-6-3",
    "level": 6,
    "levelTitle": "Level 6: Junior-to-Mid-Level Reliability",
    "drillNumber": "Drill 6.3",
    "title": "Handling Dynamic Spinners & Detached DOM Elements",
    "scenario": "When clicking \"Refresh Reports\", a loading spinner appears. Clicking buttons while the spinner is active causes \"Element is not clickable at point\" or DOM detachment errors. Implement `waitForLoadingComplete(): Promise<void>`.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ReportsPage {\n  readonly page: Page;\n  readonly loadingSpinner: Locator;\n  readonly refreshButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.loadingSpinner = page.getByTestId('loading-spinner');\n    this.refreshButton = page.getByRole('button', { name: 'Refresh' });\n  }\n\n  // Task: Implement waitForLoadingComplete(): Promise<void>\n  // Wait for this.loadingSpinner to be detached or hidden using locator.waitFor({ state: 'hidden' })!\n}\n",
    "task": "Implement waitForLoadingComplete(): Promise<void> using this.loadingSpinner.waitFor({ state: 'hidden' }) to cleanly synchronize after operations.",
    "successCriteria": [
      "waitForLoadingComplete uses this.loadingSpinner.waitFor({ state: 'hidden' }).",
      "Zero arbitrary waitForTimeout() delays.",
      "Explicit Promise<void> return type."
    ],
    "hint": "Use `await this.loadingSpinner.waitFor({ state: \"hidden\" });`.",
    "beginnerGuide": {
      "concept": "Explicit State Synchronization (waitFor state: hidden)",
      "whyItMatters": "Using `page.waitForTimeout(3000)` to wait for a spinner is slow when the spinner takes 50ms and flaky when the server takes 3500ms. Waiting for `state: \"hidden\"` synchronizes precisely at the exact microsecond the spinner disappears.",
      "mentalModel": "Look at the traffic light: don't close your eyes and count to 5; wait until the red light turns off.",
      "sampleDescription": "Waiting for element disappearance:",
      "sampleCode": "await this.spinner.waitFor({ state: 'hidden' });"
    },
    "validation": {
      "requiredKeywords": [
        "waitForLoadingComplete",
        "loadingSpinner.waitFor",
        "state",
        "hidden"
      ],
      "forbiddenKeywords": [
        "waitForTimeout"
      ],
      "regexPatterns": [
        {
          "pattern": "this\\.loadingSpinner\\.waitFor\\s*\\(\\s*\\{[^}]*hidden",
          "message": "Wait for loadingSpinner with { state: \"hidden\" }"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class ReportsPage {\n  readonly page: Page;\n  readonly loadingSpinner: Locator;\n  readonly refreshButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.loadingSpinner = page.getByTestId('loading-spinner');\n    this.refreshButton = page.getByRole('button', { name: 'Refresh' });\n  }\n\n  async waitForLoadingComplete(): Promise<void> {\n    await this.loadingSpinner.waitFor({ state: 'hidden' });\n  }\n\n  async refreshReports(): Promise<void> {\n    await this.refreshButton.click();\n    await this.waitForLoadingComplete();\n  }\n}",
      "explanation": "`locator.waitFor({ state: \"hidden\" })` polls the DOM efficiently and resolves as soon as the element becomes detached or invisible, eliminating flaky delays.",
      "followUpQuestion": "Why is waiting for a loading indicator to hide more reliable than waiting for the content to appear?"
    },
    "focusSkills": [
      "Explicit spinner state synchronization (waitFor state: hidden)",
      "Eliminating flaky waitForTimeout sleeps"
    ]
  },
  {
    "id": "pom-drill-6-4",
    "level": 6,
    "levelTitle": "Level 6: Junior-to-Mid-Level Reliability",
    "drillNumber": "Drill 6.4",
    "title": "Negative Testing & API Error State Simulation",
    "scenario": "Production applications must gracefully display error alerts when the backend returns 500 Internal Server Error. Create a method on `ProfilePage` to simulate a server crash on the save endpoint and expose `errorBanner: Locator`.",
    "startingCode": "import { Page, Locator } from '@playwright/test';\n\nexport class UserProfilePage {\n  readonly page: Page;\n  readonly errorBanner: Locator;\n  readonly saveButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.errorBanner = page.getByRole('alert');\n    this.saveButton = page.getByRole('button', { name: 'Save' });\n  }\n\n  // Task: Implement simulateServerErrorOnSave(): Promise<void>\n  // Route '**/api/user/profile' to abort or fulfill with status 500!\n}\n",
    "task": "Implement simulateServerErrorOnSave using page.route() to return HTTP status 500 when saving user profile data.",
    "successCriteria": [
      "simulateServerErrorOnSave sets up page.route for profile endpoint.",
      "Fulfills with status 500.",
      "errorBanner locator is exposed for test assertions."
    ],
    "hint": "Use `await this.page.route(\"**/api/user/profile\", route => route.fulfill({ status: 500 }));`.",
    "beginnerGuide": {
      "concept": "Fault Injection & Chaos Testing",
      "whyItMatters": "Testing that your app handles 500 errors, timeouts, or network loss without crashing is essential for production grade quality. `page.route` lets you trigger real error handling UI on demand.",
      "mentalModel": "Simulating a blackout in a flight simulator to train the autopilot.",
      "sampleDescription": "Simulating 500 status:",
      "sampleCode": "await page.route('/api/*', route => route.fulfill({ status: 500 }));"
    },
    "validation": {
      "requiredKeywords": [
        "simulateServerErrorOnSave",
        "page.route",
        "500"
      ],
      "regexPatterns": [
        {
          "pattern": "simulateServerErrorOnSave\\s*\\(\\s*\\):\\s*Promise<void>",
          "message": "simulateServerErrorOnSave must return Promise<void>"
        },
        {
          "pattern": "status:\\s*500",
          "message": "Must fulfill route with status: 500"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class UserProfilePage {\n  readonly page: Page;\n  readonly errorBanner: Locator;\n  readonly saveButton: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.errorBanner = page.getByRole('alert');\n    this.saveButton = page.getByRole('button', { name: 'Save' });\n  }\n\n  async simulateServerErrorOnSave(): Promise<void> {\n    await this.page.route('**/api/user/profile', async (route) => {\n      await route.fulfill({\n        status: 500,\n        contentType: 'application/json',\n        body: JSON.stringify({ error: 'Internal Server Error' }),\n      });\n    });\n  }\n\n  async save(): Promise<void> {\n    await this.saveButton.click();\n  }\n}",
      "explanation": "Fault injection via `page.route` enables automated verification of user-friendly error banners during unexpected backend outages.",
      "followUpQuestion": "How can you simulate network latency or disconnects using route.abort()?"
    },
    "focusSkills": [
      "Fault injection and 500 error state handling",
      "Error banner locator exposure for test specs"
    ]
  },
  {
    "id": "pom-drill-6-5",
    "level": 6,
    "levelTitle": "Level 6: Junior-to-Mid-Level Reliability",
    "drillNumber": "Drill 6.5",
    "title": "Review Challenge: Level 6 Mastery Gate (Reliability Hardening)",
    "scenario": "Review Challenge: Audit and harden a flaky `BillingPage`. The original version contains three deadly flaws: a missing await, an arbitrary `waitForTimeout(3000)`, and an assertion embedded inside the POM. Eliminate all three flaws!",
    "startingCode": "import { Page, Locator, expect } from '@playwright/test'; // Remove expect!\n\nexport class BillingPage {\n  readonly page: Page;\n  readonly invoiceRows: Locator;\n  readonly downloadButton: Locator;\n  readonly statusMessage: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.invoiceRows = page.getByRole('row');\n    this.downloadButton = page.getByRole('button', { name: 'Download PDF' });\n    this.statusMessage = page.getByRole('status');\n  }\n\n  // Refactor:\n  // 1. Remove expect() assertion.\n  // 2. Remove waitForTimeout(3000).\n  // 3. Ensure all async operations are properly awaited.\n  async downloadInvoice(): Promise<void> {\n    this.page.waitForTimeout(3000); // ❌ Flaky sleep!\n    this.downloadButton.click(); // ❌ Missing await!\n    expect(this.statusMessage).toBeVisible(); // ❌ Assertion in POM!\n  }\n}\n",
    "task": "Refactor BillingPage: remove the expect import and call, remove waitForTimeout, and properly await the click on downloadButton.",
    "successCriteria": [
      "No expect import or assertions.",
      "No waitForTimeout() calls.",
      "downloadButton.click() is awaited properly.",
      "Pristine reliability standard."
    ],
    "hint": "`async downloadInvoice(): Promise<void> { await this.downloadButton.click(); }`.",
    "beginnerGuide": {
      "concept": "Synthesis: Total Flake Elimination",
      "whyItMatters": "Flaky tests erode team trust in automation. Eliminating arbitrary sleeps, ensuring every promise is awaited, and delegating assertions to test specs creates 100% reliable CI suites.",
      "mentalModel": "Zero tolerance for flaky code.",
      "sampleDescription": "Reliable action:",
      "sampleCode": "async downloadInvoice(): Promise<void> {\n  await this.downloadButton.click();\n}"
    },
    "isReviewChallenge": true,
    "isMasteryAssessment": true,
    "validation": {
      "requiredKeywords": [
        "export class BillingPage",
        "downloadButton",
        "Promise<void>"
      ],
      "forbiddenKeywords": [
        "expect(",
        "waitForTimeout"
      ],
      "regexPatterns": [
        {
          "pattern": "await\\s+this\\.downloadButton\\.click\\s*\\(",
          "message": "Must await this.downloadButton.click()"
        }
      ],
      "solutionCode": "import { Page, Locator } from '@playwright/test';\n\nexport class BillingPage {\n  readonly page: Page;\n  readonly invoiceRows: Locator;\n  readonly downloadButton: Locator;\n  readonly statusMessage: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.invoiceRows = page.getByRole('row');\n    this.downloadButton = page.getByRole('button', { name: 'Download PDF' });\n    this.statusMessage = page.getByRole('status');\n  }\n\n  async downloadInvoice(): Promise<void> {\n    await this.downloadButton.click();\n  }\n}",
      "explanation": "Removing arbitrary delays and internal assertions leaves a lean, rock-solid Page Object that never causes flakiness in CI pipelines.",
      "followUpQuestion": "How can you configure Playwright in CI to automatically capture traces only when a test fails?"
    },
    "focusSkills": [
      "Investigating race conditions and missing awaits",
      "Asynchronous locator call synchronization",
      "API route interception & mocking with page.route()",
      "Deterministic response virtualization",
      "Explicit spinner state synchronization (waitFor state: hidden)",
      "Eliminating flaky waitForTimeout sleeps",
      "Fault injection and 500 error state handling",
      "Error banner locator exposure for test specs",
      "Total flakiness elimination & assertion removal from POMs",
      "Rock-solid production SDET reliability hardening"
    ]
  },
  {
    "id": "pom-drill-7-1",
    "level": 7,
    "levelTitle": "Level 7: CI and Architecture",
    "drillNumber": "Drill 7.1",
    "title": "GitHub Actions CI Workflow for Playwright",
    "scenario": "Configure a production-grade GitHub Actions CI workflow file (`playwright.yml`). The workflow must trigger on push and pull_request to main, run on `ubuntu-latest`, install Node.js 20, install Playwright dependencies with `npx playwright install --with-deps`, run tests, and upload test results as an artifact.",
    "startingCode": "# Task: Complete the GitHub Actions workflow definition!\nname: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\n\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      # Task: Add Node.js setup, npm ci, playwright install, test execution, and artifact upload!\n",
    "task": "Provide the complete CI workflow configuration including actions/setup-node, npm ci, npx playwright install --with-deps, npx playwright test, and actions/upload-artifact.",
    "successCriteria": [
      "Runs on ubuntu-latest.",
      "Installs Playwright browser binaries with system dependencies (--with-deps).",
      "Executes npx playwright test.",
      "Uploads playwright-report artifact using always() condition."
    ],
    "hint": "Use `npx playwright install --with-deps` to ensure Linux system dependencies (libgtk, etc.) are installed on the Ubuntu runner.",
    "beginnerGuide": {
      "concept": "CI Pipeline Automation with GitHub Actions",
      "whyItMatters": "Tests that only run on local machines are useless for team quality gates. A fast, headless CI pipeline runs on every pull request to catch regressions before they reach production.",
      "mentalModel": "An automated robotic assembly line testing every car before it leaves the factory.",
      "sampleDescription": "GitHub Actions step:",
      "sampleCode": "- run: npx playwright install --with-deps\n- run: npx playwright test"
    },
    "validation": {
      "requiredKeywords": [
        "ubuntu-latest",
        "actions/setup-node",
        "playwright install --with-deps",
        "playwright test",
        "upload-artifact"
      ],
      "regexPatterns": [
        {
          "pattern": "playwright\\s+install\\s+--with-deps",
          "message": "Must include npx playwright install --with-deps"
        },
        {
          "pattern": "playwright\\s+test",
          "message": "Must include npx playwright test command"
        }
      ],
      "solutionCode": "name: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\n\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: 'npm'\n      - name: Install dependencies\n        run: npm ci\n      - name: Install Playwright Browsers\n        run: npx playwright install --with-deps\n      - name: Run Playwright tests\n        run: npx playwright test\n      - uses: actions/upload-artifact@v4\n        if: ${{ !cancelled() }}\n        with:\n          name: playwright-report\n          path: playwright-report/\n          retention-days: 30",
      "explanation": "`npx playwright install --with-deps` installs both browser binaries and underlying Linux OS libraries on the Ubuntu runner, preventing headless launch crashes.",
      "followUpQuestion": "Why is caching npm dependencies with cache: 'npm' recommended in GitHub Actions?"
    },
    "focusSkills": [
      "GitHub Actions CI pipeline configuration",
      "Headless browser installation with system dependencies"
    ]
  },
  {
    "id": "pom-drill-7-2",
    "level": 7,
    "levelTitle": "Level 7: CI and Architecture",
    "drillNumber": "Drill 7.2",
    "title": "Playwright Config: Retaining Traces and Video on Failure",
    "scenario": "Recording traces and videos for 1,000 passing tests wastes gigabytes of CI storage and slows down pipeline execution. Configure `playwright.config.ts` so traces, screenshots, and videos are saved ONLY when a test fails.",
    "startingCode": "import { defineConfig, devices } from '@playwright/test';\n\n// Task: Export Playwright configuration with retain-on-failure artifact strategy!\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  workers: process.env.CI ? 1 : undefined,\n  reporter: 'html',\n\n  use: {\n    baseURL: 'http://localhost:3000',\n    // Task: Configure trace, screenshot, and video to save ONLY on failure!\n  },\n});\n",
    "task": "Configure the use block with trace: 'retain-on-failure', screenshot: 'only-on-failure', and video: 'retain-on-failure'.",
    "successCriteria": [
      "trace set to \"retain-on-failure\".",
      "screenshot set to \"only-on-failure\".",
      "video set to \"retain-on-failure\" or \"on-first-retry\"."
    ],
    "hint": "Set `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, and `video: 'retain-on-failure'`.",
    "beginnerGuide": {
      "concept": "Smart Diagnostics: Retain-on-Failure Strategy",
      "whyItMatters": "Recording full video for all tests can slow test execution by 30-50% and flood disk space. `retain-on-failure` records silently in memory and only dumps the zip file to disk if an assertion fails.",
      "mentalModel": "Flight Black Box: records continuously in a ring buffer, but only saves the recording if an incident happens.",
      "sampleDescription": "Config settings:",
      "sampleCode": "use: {\n  trace: 'retain-on-failure',\n  screenshot: 'only-on-failure',\n  video: 'retain-on-failure',\n}"
    },
    "validation": {
      "requiredKeywords": [
        "retain-on-failure",
        "only-on-failure"
      ],
      "regexPatterns": [
        {
          "pattern": "trace:\\s*['\"]retain-on-failure['\"]",
          "message": "Set trace to \"retain-on-failure\""
        },
        {
          "pattern": "screenshot:\\s*['\"]only-on-failure['\"]",
          "message": "Set screenshot to \"only-on-failure\""
        }
      ],
      "solutionCode": "import { defineConfig, devices } from '@playwright/test';\n\nexport default defineConfig({\n  testDir: './tests',\n  fullyParallel: true,\n  forbidOnly: !!process.env.CI,\n  retries: process.env.CI ? 2 : 0,\n  reporter: 'html',\n\n  use: {\n    baseURL: 'http://localhost:3000',\n    trace: 'retain-on-failure',\n    screenshot: 'only-on-failure',\n    video: 'retain-on-failure',\n  },\n});",
      "explanation": "The `retain-on-failure` strategy gives you complete Playwright Trace Viewer zip files for debugging failed CI runs with zero performance overhead on passing tests.",
      "followUpQuestion": "What information does the Playwright Trace Viewer provide that screenshots and videos cannot show?"
    },
    "focusSkills": [
      "Artifact and trace retention on failure (retain-on-failure)",
      "Failure-only diagnostic capture strategy"
    ]
  },
  {
    "id": "pom-drill-7-3",
    "level": 7,
    "levelTitle": "Level 7: CI and Architecture",
    "drillNumber": "Drill 7.3",
    "title": "Test Sharding in Parallel CI Workflows",
    "scenario": "Your end-to-end test suite takes 40 minutes on a single CI machine. By using Playwright's built-in `--shard=x/y` flag and GitHub Actions matrix strategy, split the test suite across 4 parallel runners to finish in 10 minutes.",
    "startingCode": "# Task: Add matrix strategy to shard Playwright across 4 parallel jobs!\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        shardIndex: [1, 2, 3, 4]\n        shardTotal: [4]\n    steps:\n      - uses: actions/checkout@v4\n      # Task: Run playwright test passing --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}\n",
    "task": "Configure matrix strategy with 4 shards and pass --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }} to npx playwright test.",
    "successCriteria": [
      "Matrix declares shardIndex and shardTotal.",
      "playwright test uses --shard parameter.",
      "fail-fast is false so one shard failure does not cancel other shards."
    ],
    "hint": "Use `run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}`.",
    "beginnerGuide": {
      "concept": "Horizontal Scaling via Test Sharding",
      "whyItMatters": "As test suites grow to hundreds of tests, a single machine hits a wall. Sharding splits the test files evenly across multiple virtual machines without changing any test code.",
      "mentalModel": "Dividing a 400-page book among 4 people so each person reads 100 pages simultaneously.",
      "sampleDescription": "Sharded command:",
      "sampleCode": "run: npx playwright test --shard=${{ matrix.shard }}/4"
    },
    "validation": {
      "requiredKeywords": [
        "matrix",
        "shard",
        "shardIndex",
        "shardTotal"
      ],
      "regexPatterns": [
        {
          "pattern": "--shard=\\$\\{\\{\\s*matrix\\.shardIndex\\s*\\}/\\$\\{\\{\\s*matrix\\.shardTotal\\s*\\}",
          "message": "Pass --shard flag using matrix variables"
        }
      ],
      "solutionCode": "name: Playwright Tests\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        shardIndex: [1, 2, 3, 4]\n        shardTotal: [4]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n      - run: npm ci\n      - run: npx playwright install --with-deps\n      - name: Run Sharded Tests\n        run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}\n      - uses: actions/upload-artifact@v4\n        if: ${{ !cancelled() }}\n        with:\n          name: blob-report-${{ matrix.shardIndex }}\n          path: blob-report/",
      "explanation": "Sharding distributes test files across multiple independent CI runner instances, scaling execution speed horizontally.",
      "followUpQuestion": "How can you merge the separate blob reports from all 4 shards into a single unified HTML report at the end of the pipeline?"
    },
    "focusSkills": [
      "Horizontal test sharding with matrix strategies (--shard)",
      "Parallel CI job distribution"
    ]
  },
  {
    "id": "pom-drill-7-4",
    "level": 7,
    "levelTitle": "Level 7: CI and Architecture",
    "drillNumber": "Drill 7.4",
    "title": "Architectural Decision Record: Defending POM Standards",
    "scenario": "During team architectural review, a developer argues: \"Page Objects add too many classes; we should just write raw locators directly inside our test spec files.\" Write an SDET Architectural Decision Record (ADR) justifying the Page Object Model standard.",
    "startingCode": "/**\n * ADR-001: Adoption of Page Object Model (POM) and Component Architecture\n * Status: Accepted\n * Context:\n * Some team members proposed writing raw Playwright locators inside *.spec.ts files.\n *\n * Task:\n * Write the SDET Architectural Justification addressing:\n * 1. Maintenance & DRY: What happens when a button selector changes in 25 tests?\n * 2. Readability & Business Domain: Why should test specs read like user stories?\n * 3. Separation of Concerns: Why must Page Objects NEVER contain expect() assertions?\n */\n\nexport const ADR_POM_JUSTIFICATION = {\n  maintenanceImpact: '',\n  businessReadability: '',\n  assertionSeparation: ''\n};\n",
    "task": "Provide comprehensive justification entries for maintenanceImpact, businessReadability, and assertionSeparation articulating senior SDET principles.",
    "successCriteria": [
      "Articulates maintenance cost of raw selectors vs single point of update in POM.",
      "Explains readability benefit of human-domain method names.",
      "Defends separation of POM interactions from test spec assertions."
    ],
    "hint": "Explain that POM provides a single point of truth for selectors, preventing multi-file churn when UI designs change.",
    "beginnerGuide": {
      "concept": "Architectural Defense & SDET Leadership",
      "whyItMatters": "Senior SDETs do not just write code; they defend architectural standards in pull requests and team design reviews. Being able to explain WHY POM saves hundreds of engineering hours is a key promotion skill.",
      "mentalModel": "The architect explaining why a building requires steel foundations.",
      "sampleDescription": "Defending POM:",
      "sampleCode": "// In tests: await checkoutPage.pay(); // Speaks user domain language"
    },
    "validation": {
      "requiredKeywords": [
        "maintenanceImpact",
        "businessReadability",
        "assertionSeparation"
      ],
      "regexPatterns": [
        {
          "pattern": "maintenanceImpact:\\s*['\"`][\\s\\S]{20,}['\"`]",
          "message": "Provide a detailed explanation for maintenanceImpact"
        },
        {
          "pattern": "businessReadability:\\s*['\"`][\\s\\S]{20,}['\"`]",
          "message": "Provide a detailed explanation for businessReadability"
        },
        {
          "pattern": "assertionSeparation:\\s*['\"`][\\s\\S]{20,}['\"`]",
          "message": "Provide a detailed explanation for assertionSeparation"
        }
      ],
      "solutionCode": "export const ADR_POM_JUSTIFICATION = {\n  maintenanceImpact: 'Raw selectors in test specs create tight coupling between test logic and DOM implementation. If an input or button is modified in a redesign, developers must update 25+ test files. With POM, the locator is defined once as a readonly property, providing a single point of failure and instantaneous refactoring safety.',\n  businessReadability: 'Test specifications must describe expected business outcomes and user journeys, not low-level DOM mechanics. Encapsulating raw clicks and keystrokes into methods like loginAsValidUser() allows developers, QA, and product owners to immediately understand test intent without deciphering CSS selectors.',\n  assertionSeparation: 'Page Objects model the application interface and provide actions; test specs define behavioral contracts and assertions. Embedding expect() inside Page Objects breaks reuse in negative testing scenarios (e.g., verifying error states) and obscures failure attribution in CI error reports.'\n};",
      "explanation": "Senior SDET leadership requires articulating the engineering trade-offs of design patterns and defending maintainability against short-term shortcuts.",
      "followUpQuestion": "How does the Screenplay pattern differ from the Page Object Model, and when might a team choose Screenplay?"
    },
    "focusSkills": [
      "Architectural Decision Records (ADRs) defending POM standards",
      "SDET engineering trade-off justification"
    ]
  },
  {
    "id": "pom-drill-7-5",
    "level": 7,
    "levelTitle": "Level 7: CI and Architecture",
    "drillNumber": "Drill 7.5",
    "title": "Review Challenge: Level 7 Mastery Gate (Senior SDET Defense)",
    "scenario": "Review Challenge: You have reached the pinnacle of the Playwright POM Mastery Course. Synthesize everything you have mastered across all 7 levels: implement an enterprise-ready `FrameworkConfig` object that encapsulates CI concurrency, artifact retention, timeout governance, and strict locator policies.",
    "startingCode": "/**\n * Senior SDET Framework Architecture Blueprint\n * Synthesizes:\n * - Zero arbitrary timeouts\n * - Retain-on-failure diagnostics\n * - Headless Ubuntu CI execution\n * - Strict locator policies\n */\n\nexport interface SDETFrameworkConfig {\n  ciWorkers: number;\n  retries: number;\n  traceStrategy: 'off' | 'on' | 'retain-on-failure';\n  screenshotStrategy: 'off' | 'on' | 'only-on-failure';\n  actionTimeoutMs: number;\n  navigationTimeoutMs: number;\n}\n\n// Task: Export productionFrameworkConfig adhering to SDET best practices!\nexport const productionFrameworkConfig: SDETFrameworkConfig = {\n  // Configure best-practice values!\n};\n",
    "task": "Export productionFrameworkConfig with ciWorkers: 2 or 4, retries: 2, traceStrategy: 'retain-on-failure', screenshotStrategy: 'only-on-failure', actionTimeoutMs: 10000, and navigationTimeoutMs: 30000.",
    "successCriteria": [
      "traceStrategy is \"retain-on-failure\".",
      "screenshotStrategy is \"only-on-failure\".",
      "Config reflects production-ready SDET governance."
    ],
    "hint": "Set `traceStrategy: 'retain-on-failure'` and `screenshotStrategy: 'only-on-failure'`.",
    "beginnerGuide": {
      "concept": "Final Mastery: Production SDET Architecture",
      "whyItMatters": "Congratulations! You have mastered the entire spectrum of Playwright automation: from basic locators to component composition, custom fixtures, flaky test diagnostics, and CI pipelines.",
      "mentalModel": "Senior SDET Blueprint.",
      "sampleDescription": "Production framework config:",
      "sampleCode": "export const productionFrameworkConfig: SDETFrameworkConfig = { ... };"
    },
    "isReviewChallenge": true,
    "isMasteryAssessment": true,
    "validation": {
      "requiredKeywords": [
        "productionFrameworkConfig",
        "retain-on-failure",
        "only-on-failure"
      ],
      "regexPatterns": [
        {
          "pattern": "traceStrategy:\\s*['\"]retain-on-failure['\"]",
          "message": "Set traceStrategy to \"retain-on-failure\""
        },
        {
          "pattern": "screenshotStrategy:\\s*['\"]only-on-failure['\"]",
          "message": "Set screenshotStrategy to \"only-on-failure\""
        }
      ],
      "solutionCode": "export interface SDETFrameworkConfig {\n  ciWorkers: number;\n  retries: number;\n  traceStrategy: 'off' | 'on' | 'retain-on-failure';\n  screenshotStrategy: 'off' | 'on' | 'only-on-failure';\n  actionTimeoutMs: number;\n  navigationTimeoutMs: number;\n}\n\nexport const productionFrameworkConfig: SDETFrameworkConfig = {\n  ciWorkers: 2,\n  retries: 2,\n  traceStrategy: 'retain-on-failure',\n  screenshotStrategy: 'only-on-failure',\n  actionTimeoutMs: 10000,\n  navigationTimeoutMs: 30000,\n};",
      "explanation": "This framework configuration synthesizes the core principles of high-reliability automation: zero arbitrary sleeps, efficient parallel execution, and targeted failure artifact retention.",
      "followUpQuestion": "How would you measure the return on investment (ROI) of a reliable Playwright test automation framework to engineering leadership?"
    },
    "focusSkills": [
      "GitHub Actions CI pipeline configuration",
      "Headless browser installation with system dependencies",
      "Artifact and trace retention on failure (retain-on-failure)",
      "Failure-only diagnostic capture strategy",
      "Horizontal test sharding with matrix strategies (--shard)",
      "Parallel CI job distribution",
      "Architectural Decision Records (ADRs) defending POM standards",
      "SDET engineering trade-off justification",
      "Senior SDET production framework configuration & governance",
      "End-to-end test framework architecture defense"
    ]
  }
];

export function getDrillStarterCodeWithComments(drill: PomMentorDrill): string {
  const criteriaList = drill.successCriteria.map(c => ` *  - [ ] ${c}`).join('\n');
  const taskFormatted = drill.task.split('\n').map(line => ` *  ${line}`).join('\n');
  const scenarioFormatted = drill.scenario.split('\n').map(line => ` *  ${line}`).join('\n');

  const commentHeader = `/**
 * ==============================================================================
 * ${drill.drillNumber.toUpperCase()}: ${drill.title.toUpperCase()}
 * ==============================================================================
 *
 * 📖 SCENARIO:
${scenarioFormatted}
 *
 * 🎯 TASK INSTRUCTIONS:
${taskFormatted}
 *
 * ✅ SUCCESS CRITERIA:
${criteriaList}
 * ==============================================================================
 */

`;

  return commentHeader + drill.startingCode;
}
