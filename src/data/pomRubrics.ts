export interface RubricCriterion {
  criterion: string;
  rationale: string;
  notes: string;
  badExample: string;
  goodExample: string;
}

export const DRILL_RUBRICS: Record<string, RubricCriterion[]> = {
  // ==========================================
  // LEVEL 1 DRILLS
  // ==========================================
  'pom-drill-1-1': [
    {
      criterion: 'Store Readonly Locators',
      rationale: 'Immutability & Refactoring Safety',
      notes: 'Locators are defined as `readonly` class properties. This guarantees that test scripts or other page methods cannot accidentally reassign locator definitions at runtime, preventing silent locator mutation bugs.',
      badExample: `// ❌ Mutable and untyped locators
export class LoginPage {
  usernameInput: any; // Untyped: no IDE autocomplete
  passwordInput: Locator; // Mutable: can accidentally be overwritten at runtime!
}`,
      goodExample: `// ✅ Immutability with readonly Locator
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
}`
    },
    {
      criterion: 'Constructor Dependency Injection',
      rationale: 'Decoupled Execution & Context Isolation',
      notes: 'The constructor accepts `(page: Page)` and resolves locators during instantiation. This preserves isolation across parallel Playwright browser contexts without relying on global state.',
      badExample: `// ❌ Assigning interface type or global page
constructor() {
  this.page = Page; // Error: 'Page' is a type, not a runtime object!
}`,
      goodExample: `// ✅ Context injection per test worker
constructor(page: Page) {
  this.page = page;
  this.usernameInput = page.getByLabel('Username');
}`
    },
    {
      criterion: 'Accessible & Resilient Locators',
      rationale: 'User-Centric & Refactor-Proof Selectors',
      notes: 'Employed `getByLabel` and `getByRole`. By querying the accessible accessibility tree rather than brittle DOM hierarchy or CSS classes (e.g. `.btn-primary`), your suite will not break during visual CSS redesigns.',
      badExample: `// ❌ Brittle CSS classes & DOM hierarchy
this.submitButton = page.locator('.btn-primary.btn-large');
this.usernameInput = page.locator('div > input:nth-child(2)');`,
      goodExample: `// ✅ User-facing accessible queries
this.submitButton = page.getByRole('button', { name: 'Sign in' });
this.usernameInput = page.getByLabel('Username');`
    },
    {
      criterion: 'Encapsulate Actions without Assertions',
      rationale: 'Single Responsibility & Reusability in Negative Testing',
      notes: 'Granular/composite actions (like `login()`) await low-level Playwright actionability checks without embedding `expect()` assertions inside the POM. This keeps the class reusable across positive and negative testing suites.',
      badExample: `// ❌ Assertion inside Page Object method
async login(u: string, p: string) {
  await this.usernameInput.fill(u);
  await expect(this.page).toHaveURL('/dashboard'); // Breaks negative tests!
}`,
      goodExample: `// ✅ Pure interaction; assertions stay in test spec (*.spec.ts)
async login(u: string, p: string): Promise<void> {
  await this.usernameInput.fill(u);
  await this.passwordInput.fill(p);
  await this.submitButton.click();
}`
    }
  ],

  'pom-drill-1-2': [
    {
      criterion: 'Page Object Instantiation & DI',
      rationale: 'Fixture Injection & Context Binding',
      notes: '`new LoginPage(page)` binds the Page Object to the test case\'s isolated browser context fixture. This guarantees thread-safety when running tests in parallel across worker processes.',
      badExample: `// ❌ Missing fixture dependency injection
test('login test', async () => {
  const loginPage = new LoginPage(); // Missing browser context!
});`,
      goodExample: `// ✅ Injecting Playwright's isolated { page } fixture
test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);
});`
    },
    {
      criterion: 'Awaited Navigation Synchronization',
      rationale: 'Race Condition Prevention',
      notes: '`await page.goto("/login")` properly awaits navigation commit and DOM readiness before delegating user actions to the POM instance, eliminating early-interaction race conditions.',
      badExample: `// ❌ Un-awaited navigation causes premature action race condition
page.goto('/login');
await loginPage.login('user', 'pass');`,
      goodExample: `// ✅ Explicitly awaited navigation synchronization
await page.goto('/login');
await loginPage.login('user', 'pass');`
    },
    {
      criterion: 'Action Delegation & Test Abstraction',
      rationale: 'High-Level Intent vs Low-Level Mechanics',
      notes: 'The test spec delegates execution to `await loginPage.login(...)`. The spec reads like a human business use-case rather than a script full of input fills and button clicks.',
      badExample: `// ❌ Test spec bypassed POM and manually executed raw clicks
await page.locator('#username').fill('alice');
await page.locator('#submit').click();`,
      goodExample: `// ✅ Test spec delegates high-level intent to POM
await loginPage.login('alice', 'secret');`
    },
    {
      criterion: 'Separation of POM & Web-First Assertions',
      rationale: 'Clear Error Attribution & Diagnostic Stack Traces',
      notes: '`await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible()` resides in the test spec file. When a failure occurs, the stack trace points directly to the failing business assertion in the test runner report rather than deep inside an internal Page Object method.',
      badExample: `// ❌ Asserting inside POM or non-retrying boolean check
assert(await page.title() === 'Dashboard'); // No auto-retry!`,
      goodExample: `// ✅ Web-first auto-retrying assertion in test spec
await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();`
    }
  ],

  'pom-drill-1-3': [
    {
      criterion: 'Composite Workflow Encapsulation',
      rationale: 'High-Level Abstraction for Multi-Step Journeys',
      notes: 'A composite method like `register(user)` groups sequential form fills into one high-level reusable call while preserving low-level granular methods.',
      badExample: `// ❌ Incomplete composite missing critical fields or hardcoding data
async register() {
  await this.nameInput.fill('Static Alice'); // Hardcoded values!
}`,
      goodExample: `// ✅ Parameterized composite action
async register(name: string, email: string, pass: string): Promise<void> {
  await this.nameInput.fill(name);
  await this.emailInput.fill(email);
  await this.passwordInput.fill(pass);
  await this.submitButton.click();
}`
    },
    {
      criterion: 'Strict Async / Await Discipline',
      rationale: 'Race Condition & Hanging Promise Elimination',
      notes: 'Every Playwright action (`fill`, `click`, `press`) returns a Promise and must be explicitly awaited in sequence.',
      badExample: `// ❌ Missing await on asynchronous actions
this.nameInput.fill(name);
this.submitButton.click(); // Fires before name is typed!`,
      goodExample: `// ✅ Explicitly awaited sequential steps
await this.nameInput.fill(name);
await this.submitButton.click();`
    },
    {
      criterion: 'Accessible Label & Role Strategy',
      rationale: 'Accessible Form Field Association',
      notes: 'Form inputs are queried by their associated `<label>` text via `getByLabel()`, verifying form accessibility.',
      badExample: `// ❌ Relying on input ID or name attribute
this.nameInput = page.locator('input[name="full_name"]');`,
      goodExample: `// ✅ Accessible query
this.nameInput = page.getByLabel('Full Name');`
    },
    {
      criterion: 'Assertion-Free Page Object Contract',
      rationale: 'Reusable Across Success and Error Scenarios',
      notes: 'The registration action does not assume success, allowing tests to verify validation error banners.',
      badExample: `// ❌ Assuming success in POM
await expect(this.page.getByText('Account created')).toBeVisible();`,
      goodExample: `// ✅ Assertions remain in test spec
// In test: await expect(page.getByRole('alert')).toHaveText(/email already exists/i);`
    }
  ],

  'pom-drill-1-4': [
    {
      criterion: 'Component Object Extraction',
      rationale: 'Modular UI Decomposition & DRY Principle',
      notes: 'Extract repeated UI sections (Navbar, Header, Footer) into separate Component Objects that take `page: Page` or container `locator: Locator`.',
      badExample: `// ❌ Duplicate navbar locators copied across 10 page objects
export class HomePage {
  readonly navHome: Locator;
  readonly navLogout: Locator;
}
export class DashboardPage {
  readonly navHome: Locator; // Duplication!
  readonly navLogout: Locator;
}`,
      goodExample: `// ✅ Modular Component Object
export class NavbarComponent {
  readonly page: Page;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }
}`
    },
    {
      criterion: 'Composition over Inheritance',
      rationale: 'Clean Object Modeling',
      notes: 'Parent Page Objects instantiate sub-components as properties (`this.navbar = new NavbarComponent(page)`).',
      badExample: `// ❌ Bloated inheritance tree
export class DashboardPage extends AbstractMasterBasePageWithEverything {}`,
      goodExample: `// ✅ Clean composition
export class DashboardPage {
  readonly navbar: NavbarComponent;
  constructor(page: Page) {
    this.navbar = new NavbarComponent(page);
  }
}`
    },
    {
      criterion: 'Action Delegation to Sub-Components',
      rationale: 'Intuitive API Boundaries',
      notes: 'Tests can cleanly chain actions via components: `await dashboardPage.navbar.logout();`.',
      badExample: `// ❌ Exposing internal sub-component locators to the wild
await page.locator('header nav button').click();`,
      goodExample: `// ✅ Clean delegation
await dashboardPage.navbar.logout();`
    },
    {
      criterion: 'Type Safety & Contract Integrity',
      rationale: 'Predictable Component Interfaces',
      notes: 'Component methods have clear parameter types and return `Promise<void>`.',
      badExample: `// ❌ Untyped component method
logout() { return this.btn.click(); }`,
      goodExample: `// ✅ Explicit typing
async logout(): Promise<void> { await this.logoutButton.click(); }`
    }
  ],

  'pom-drill-1-5': [
    {
      criterion: 'Complete POM Architecture Standard',
      rationale: 'Level 1 Mastery Synthesis',
      notes: 'Encapsulates all form fields (`name`, `email`, `message`, `submitButton`) cleanly with `readonly Locator` and accessible selectors.',
      badExample: `// ❌ Incomplete locators or direct DOM coupling
export class ContactUsPage {
  submitForm() { page.click('#submit'); }
}`,
      goodExample: `// ✅ Pristine Level 1 Page Object
export class ContactUsPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByLabel('Full Name');
    this.emailInput = page.getByLabel('Email Address');
    this.messageInput = page.getByPlaceholder('Message');
    this.submitButton = page.getByRole('button', { name: 'Send Message' });
  }
}`
    },
    {
      criterion: 'High-Level Action Encapsulation',
      rationale: 'Clean Test Spec Interface',
      notes: 'A single `submitForm(name, email, message): Promise<void>` executes all form fill and click operations.',
      badExample: `// ❌ Un-awaited actions or missing method arguments
async submitForm() {
  await this.nameInput.fill(); // Missing value!
}`,
      goodExample: `// ✅ Explicitly typed parameter fill sequence
async submitForm(name: string, email: string, message: string): Promise<void> {
  await this.nameInput.fill(name);
  await this.emailInput.fill(email);
  await this.messageInput.fill(message);
  await this.submitButton.click();
}`
    },
    {
      criterion: 'Zero Arbitrary Waits',
      rationale: 'Resilient Auto-Waiting Execution',
      notes: 'No `waitForTimeout` or artificial delays. Playwright handles actionability checks natively.',
      badExample: `// ❌ Artificial sleep anti-pattern
await this.page.waitForTimeout(2000);`,
      goodExample: `// ✅ Pure Playwright actionability
await this.submitButton.click();`
    },
    {
      criterion: 'Strict Assertion Separation',
      rationale: 'Negative Testing Reusability',
      notes: 'No `expect()` assertions inside the POM; verification of thank-you banner belongs in spec.',
      badExample: `// ❌ Assertion buried in POM
await expect(this.page.getByText('Thank you')).toBeVisible();`,
      goodExample: `// ✅ Test spec verifies outcome:
// await expect(page.getByRole('status')).toHaveText(/message sent/i);`
    }
  ],

  // ==========================================
  // LEVEL 2 DRILLS
  // ==========================================
  'pom-drill-2-1': [
    {
      criterion: 'Dynamic Parameterized Locators',
      rationale: 'Runtime Scoping & Multi-Element Disambiguation',
      notes: '`getProductCard(title: string): Locator` dynamically isolates target product cards using `.filter({ hasText: title })` without hardcoding indices or crashing the constructor with undeclared variables.',
      badExample: `// ❌ Parameter evaluated in constructor before call
constructor(page: Page) {
  this.card = page.getByRole('listitem').filter({ hasText: title }); // ReferenceError: title is not defined!
}`,
      goodExample: `// ✅ Scoping container via dynamic method
getProductCard(title: string): Locator {
  return this.productCards.filter({ hasText: title });
}`
    },
    {
      criterion: 'Container Scoping vs Strict Mode Violations',
      rationale: 'Playwright Strict Mode Resiliency',
      notes: 'Clicks the "Add to cart" button inside only the specific card container rather than querying the whole page where multiple buttons match simultaneously.',
      badExample: `// ❌ Global query triggers Strict Mode Violation
await page.getByRole('button', { name: 'Add to cart' }).click(); // Error: strict mode violation (6 elements)!`,
      goodExample: `// ✅ Scoped to the specific product card container
const card = this.getProductCard(title);
await card.getByRole('button', { name: 'Add to cart' }).click();`
    },
    {
      criterion: 'Type Safety & Contract Integrity',
      rationale: 'TypeScript Compile-Time Safety',
      notes: 'Explicit return types (`: Locator` and `: Promise<void>`) and string parameters guaranteeing compile-time validation in test specs.',
      badExample: `// ❌ Untyped parameters & missing return contracts
async addProductToCart(title) {
  await.this.productCards.click('button'); // Syntax error + untyped
}`,
      goodExample: `// ✅ Explicit return contracts and parameter types
async addProductToCart(title: string): Promise<void> {
  const card = this.getProductCard(title);
  await card.getByRole('button', { name: 'Add to cart' }).click();
}`
    },
    {
      criterion: 'Web-First Auto-Waiting & Resiliency',
      rationale: 'Zero Arbitrary Sleep Discipline',
      notes: 'Relies completely on Playwright built-in actionability checks before clicking, eliminating flaky timeouts.',
      badExample: `// ❌ Arbitrary wait anti-pattern
await this.page.waitForTimeout(2000); // Flaky and slow in CI
await card.click();`,
      goodExample: `// ✅ Built-in actionability checks
await card.getByRole('button', { name: 'Add to cart' }).click(); // Auto-waits for visible & enabled!`
    }
  ]
};

export const DEFAULT_SDET_RUBRICS: RubricCriterion[] = [
  {
    criterion: 'Page Object Model Architecture',
    rationale: 'SDET Maintainability Standard',
    notes: 'Clean encapsulation of locators and methods adhering to strict POM separation of concerns. Page Objects model interactions, while test specs model business assertions.',
    badExample: `// ❌ Mixing assertions or sleep routines into POM
export class CheckoutPage {
  async finish() {
    await this.btn.click();
    await expect(this.page).toHaveURL('/done'); // Assertions belong in spec!
  }
}`,
    goodExample: `// ✅ Pure interaction model
export class CheckoutPage {
  async finish(): Promise<void> {
    await this.continueButton.click();
  }
}`
  },
  {
    criterion: 'Type Safety & Contract Integrity',
    rationale: 'TypeScript Compile-Time Safety',
    notes: 'Explicit return types and proper parameter typing ensuring predictable IDE autocomplete and zero runtime type mismatches.',
    badExample: `// ❌ Using : any or implicit returns
enterDetails(name: any) {
  await this.input.fill();
}`,
    goodExample: `// ✅ Explicit return types and typesafe parameters
async enterDetails(name: string): Promise<void> {
  await this.nameInput.fill(name);
}`
  },
  {
    criterion: 'Web-First Auto-Waiting & Resiliency',
    rationale: 'Zero Arbitrary Sleep Discipline',
    notes: 'Eliminates arbitrary timeouts (`waitForTimeout`) by leveraging Playwright\'s built-in actionability checks and auto-retrying assertions.',
    badExample: `// ❌ Arbitrary sleeps
await this.button.click();
await this.page.waitForTimeout(2000);`,
    goodExample: `// ✅ Native auto-waiting
await this.button.click(); // Auto-waits for actionability`
  },
  {
    criterion: 'Specification Compliance',
    rationale: 'Task Verification',
    notes: 'All requirements, accessible queries, and expected business flows have been verified against SDET production standards.',
    badExample: `// ❌ Brittle CSS or missing accessible roles
this.submitBtn = page.locator('#btn-continue');`,
    goodExample: `// ✅ Accessible query meeting specification
this.submitBtn = page.getByRole('button', { name: 'Continue' });`
  }
];

export function getRubricForDrill(drillId: string): RubricCriterion[] {
  return DRILL_RUBRICS[drillId] || DEFAULT_SDET_RUBRICS;
}
