// Reference Approved Explanations for all Playwright Drills across all 9 Modules
// These provide rigorous, pedagogical, plain-English conceptual defenses
// explaining why the solution works and what anti-patterns were avoided.

export const DRILL_APPROVED_EXPLANATIONS: Record<string, string> = {
  // Module 1: Setup & Ubuntu Environment
  'drill-1-1':
    'On Ubuntu Linux, headless and headed browser engines depend on host OS shared libraries (.so files) such as libasound and libgbm that are omitted in minimal OS installations. Running `npx playwright install --with-deps` invokes Ubuntu\'s native `apt` package manager to automatically fetch and configure these missing OS-level dependencies alongside the pinned browser binaries.',

  'drill-1-2':
    'Setting `forbidOnly: !!process.env.CI` ensures CI builds immediately fail if a developer accidentally commits a focused `test.only`, preventing unattended test skipping. Configuring `workers: process.env.CI ? 1 : undefined` prevents resource thrashing and port collision on single-VM CI runners while allowing full multi-core parallel execution on local developer workstations.',

  'drill-1-3':
    'Configuring `trace: \'on-first-retry\'` records full DOM snapshots, console logs, and network waterfalls only when a test fails and is retried. This eliminates massive disk storage consumption and execution slowdown across hundreds of passing tests while ensuring zero-blindspot forensic diagnostics whenever a real failure occurs.',

  // Module 2: Basics — Web-First Locators & Actions
  'drill-2-1':
    'Replaced fragile CSS (#user-name, .btn_action) and XPath selectors with modern user-facing locators (`getByPlaceholder`, `getByRole`) that mirror accessibility tree semantics. Removed the forbidden `waitForTimeout` anti-pattern and added missing `await` statements so actions leverage Playwright\'s built-in auto-waiting for actionability (visible, stable, enabled) without arbitrary sleeps.',

  'drill-2-2':
    'Employs Playwright\'s dedicated `.check()` and `.uncheck()` actions which ensure elements are actionable checkboxes before clicking, verifying the target boolean state deterministically without manual conditional logic or arbitrary sleep delays.',

  'drill-2-3':
    '`page.getByRole(\'button\', { name: \'Add to cart\' })` queries the accessibility tree just like an end user or screen reader does. It remains resilient against CSS class restructuring or DOM hierarchy shifts, unlike fragile concatenated IDs or deep XPath expressions which break on minor frontend design tweaks.',

  // Module 3: Web-First Assertions & Auto-Retries
  'drill-3-1':
    'Calling `await locator.isVisible()` evaluates synchronously at a single millisecond without auto-retrying; because dynamic content takes time to render, it returns false immediately and fails. Refactoring to web-first assertion `await expect(locator).toBeVisible()` activates Playwright\'s continuous polling loop until the element satisfies visibility conditions or hits the timeout, eliminating race conditions.',

  'drill-3-2':
    'Web-first assertion `await expect(page.locator(\'#loading\')).not.toBeVisible()` auto-retries and polls the DOM until the loading indicator either detaches from the document or is hidden. This eliminates race conditions because Playwright continuously checks the DOM state instead of evaluating a one-off boolean snapshot before asynchronous operations settle.',

  // Module 4: Debugging — Trace Viewer & UI Mode
  'drill-4-1':
    'Playwright locator actions enforce strict mode by default. If a selector matches multiple elements (e.g. multiple "Delete" buttons in a table), Playwright throws an error rather than guessing. Scoping the locator by row name (`page.getByRole(\'row\', { name: \'User 1\' }).getByRole(\'button\', { name: \'Delete\' })`) creates an unambiguous, isolated target.',

  'drill-4-2':
    'The Trace Viewer network waterfall correlated the locator timeout directly with an HTTP 429 (Too Many Requests) response on `/api/validate-cart`. Because the API failed, the frontend never enabled the submit button. Intercepting and mocking the endpoint with `page.route()` isolates UI end-to-end tests from external rate limits and backend volatility.',

  // Module 5: Page Object Model (POM) Refactoring
  'drill-5-1':
    'The `InventoryPage` class isolates UI selectors and user interactions from test logic. Initializing `readonly` Locators in the constructor prevents recreation overhead and ensures re-locating occurs dynamically on demand. Encapsulating item filtering (`addItemToCart`) keeps specs readable and resilient.',

  'drill-5-2':
    'When refactoring scripts into the Page Object Model, create a separate Page Object for each page or meaningful step. The constructor receives the Playwright Page instance and initializes element locators as readonly so they cannot be accidentally reassigned. Action methods (like filling forms or clicking buttons) encapsulate page interactions and hide selector details, while assertions strictly remain in the test specification so test intent is unambiguous and failure stack traces point directly to the broken expectation.',

  'drill-5-3':
    'Removes assertions and `waitForTimeout` calls from inside page objects to adhere to single responsibility. Declares `readonly checkoutButton: Locator` in the constructor for fast reuse, relying entirely on Playwright\'s native auto-waiting when performing actions.',

  'drill-5-4':
    'Extracts repeated header elements and cart counters into a dedicated Component Object (`HeaderComponent`), preventing duplicate locator definitions across pages and enabling shared verification across multiple specs.',

  'drill-5-5':
    'Implements method chaining and fluent transitions where action methods return the subsequent Page Object (e.g. `login()` returning `InventoryPage`), providing strong compile-time typing and intuitive page progression in test specs.',

  'drill-5-6':
    'Uses dynamic locator filtering with `.filter({ hasText: itemName })` to scope buttons within individual product containers, preventing strict-mode collisions and decoupling selector logic from specific row ordering.',

  // Module 6: Fixtures & Auth Bypass (storageState)
  'drill-6-1':
    'Playwright custom fixtures rely on the `use()` callback to inject dependencies and control fixture lifecycle. Failing to call `await use(...)` halts the test runner because Playwright never hands control to the test function.',

  'drill-6-2':
    'Utilizes `storageState` to bypass UI login flows by reusing saved authentication cookies and local storage tokens. Custom fixtures inject pre-authenticated page contexts, dramatically accelerating execution and isolating tests from authentication flakiness.',

  // Module 7: API Mocking & Network Interception
  'drill-7-1':
    '`page.route()` intercepts network traffic at the browser process level before it reaches the network wire, allowing us to mock empty states or error payloads (`{ status: 200, json: [] }`) deterministically without requiring test database mutations.',

  'drill-7-2':
    'Uses `route.fetch()` to execute the real backend request, then modifies the returned response JSON on the fly before fulfilling it to the page. This allows testing frontend error handling or edge-case payloads against live service structures.',

  // Module 8: CI/CD on Ubuntu & GitHub Actions
  'drill-8-1':
    'Ubuntu CI runners require `npx playwright install --with-deps` in the GitHub Actions workflow to provision shared system libraries. Without this step, headless browser processes crash during launch on clean Linux virtual machines.',

  'drill-8-2':
    'Configures conditional artifact upload (`if: always()`) with `actions/upload-artifact` so test reports and traces are preserved whenever a build fails or tests flake, providing immediate access to forensic diagnostics without keeping unnecessary artifacts on passing runs.',

  // Module 9: Capstone Portfolio Suite
  'drill-9-1':
    'Dialogs (`page.on(\'dialog\', ...)`) must be registered before the triggering action is executed to avoid missing synchronous events. Iframes are accessed via `page.frameLocator()`, which retains full auto-waiting and assertion capabilities across boundary contexts.',

  'drill-9-2':
    'A production-grade test suite combines modular Page Objects, type-safe custom fixtures with authentication state reuse, web-first auto-retrying assertions, network interception for edge cases, and CI-optimized trace generation.'
};

export function getApprovedDrillExplanation(drillId: string): string {
  return DRILL_APPROVED_EXPLANATIONS[drillId] || 'Adheres to modern Playwright conventions: avoids arbitrary timeouts, relies on auto-waiting locators, and uses web-first assertions.';
}
