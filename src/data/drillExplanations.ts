// Reference Approved Explanations for all Playwright Drills across all 9 Modules
// These provide rigorous, pedagogical, plain-English conceptual defenses
// explaining why the solution works and what anti-patterns were avoided.

export const DRILL_APPROVED_EXPLANATIONS: Record<string, string> = {
  // ==========================================
  // Module 1: Setup & Ubuntu Environment
  // ==========================================
  'drill-1-1':
    'On Ubuntu Linux, headless and headed browser engines depend on host OS shared libraries (.so files) such as libasound and libgbm that are omitted in minimal OS installations. Running `npx playwright install --with-deps` invokes Ubuntu\'s native `apt` package manager to automatically fetch and configure these missing OS-level dependencies alongside the pinned browser binaries.',

  'drill-1-2':
    'Setting `forbidOnly: !!process.env.CI` ensures CI builds immediately fail if a developer accidentally commits a focused `test.only`, preventing unattended test skipping. Configuring `workers: process.env.CI ? 1 : undefined` prevents resource thrashing and port collision on single-VM CI runners while allowing full multi-core parallel execution on local developer workstations.',

  'drill-1-3':
    'Using `defineConfig` provides compile-time type validation for Playwright options. Defining a unified `baseURL` eliminates repetitive hardcoded domains across specs, and configuring multiple browser projects (`chromium`, `firefox`, `webkit`) with device presets ensures cross-browser parity across rendering engines.',

  'drill-1-4':
    'Playwright runs headless by default on all platforms. Passing the `--headed` flag instructs the browser process to spawn a visible GUI window, while `--project=chromium` filters the execution specifically to the Chromium rendering engine, allowing engineers to visually step through animations and layout state without executing across all matrix workers.',

  'drill-1-5':
    'Configuring `trace: \'on-first-retry\'` records full DOM snapshots, console logs, and network waterfalls only when a test fails and is retried. This eliminates massive disk storage consumption and execution slowdown across hundreds of passing tests while ensuring zero-blindspot forensic diagnostics whenever a real failure occurs.',

  // ==========================================
  // Module 2: Basics — Web-First Locators & Actions
  // ==========================================
  'drill-2-1':
    'Replaced fragile CSS (#user-name, .btn_action) and XPath selectors with modern user-facing locators (`getByPlaceholder`, `getByRole`) that mirror accessibility tree semantics. Removed the forbidden `waitForTimeout` anti-pattern and added missing `await` statements so actions leverage Playwright\'s built-in auto-waiting for actionability (visible, stable, enabled) without arbitrary sleeps.',

  'drill-2-2':
    'Employs Playwright\'s dedicated `.check()` and `.uncheck()` actions which ensure elements are actionable checkboxes before clicking, verifying the target boolean state deterministically without manual conditional logic or arbitrary sleep delays.',

  'drill-2-3':
    'Playwright\'s `.selectOption()` interacts directly with HTML `<select>` elements using semantic values or user-visible labels. It automatically waits for the dropdown to be visible and enabled, dispatching standard change and input events without brittle element clicking.',

  'drill-2-4':
    'Using `.filter({ hasText: \'...\' })` scopes actions to a specific container card or row based on readable content rather than brittle array indices (`nth(0)`) or deep XPath hierarchies. This guarantees test resilience even if product ordering shifts or additional cards are injected dynamically.',

  'drill-2-5':
    '`page.getByRole(\'button\', { name: \'Add to cart\' })` queries the accessibility tree just like an end user or screen reader does. It remains resilient against CSS class restructuring or DOM hierarchy shifts, unlike fragile concatenated IDs or deep XPath expressions which break on minor frontend design tweaks.',

  // ==========================================
  // Module 3: Web-First Assertions & Auto-Retries
  // ==========================================
  'drill-3-1':
    'Calling `await locator.isVisible()` evaluates synchronously at a single millisecond without auto-retrying; because dynamic content takes time to render, it returns false immediately and fails. Refactoring to web-first assertion `await expect(locator).toBeVisible()` activates Playwright\'s continuous polling loop until the element satisfies visibility conditions or hits the timeout, eliminating race conditions.',

  'drill-3-2':
    '`await expect(items).toHaveCount(n)` continuously polls the DOM until the collection matches the expected quantity, preventing premature failures while elements are fetched from asynchronous backend APIs. Verifying container content with `toContainText()` confirms item payload integrity.',

  'drill-3-3':
    'Standard hard assertions fail immediately and abort test execution at the first broken expectation, hiding subsequent validation bugs. Soft assertions (`expect.soft()`) record assertion failures while allowing the test to continue validating remaining form inputs, compiling all broken rules into a single diagnostic report.',

  'drill-3-4':
    'Web-first assertion `await expect(page.locator(\'#loading\')).not.toBeVisible()` auto-retries and polls the DOM until the loading indicator either detaches from the document or is hidden. This eliminates race conditions because Playwright continuously checks the DOM state instead of evaluating a one-off boolean snapshot before asynchronous operations settle.',

  'drill-3-5':
    'Web-first assertion `expect(locator).toHaveText()` automatically polls until the asynchronous DOM element is attached and its text content stabilizes. Evaluating text via synchronous `textContent()` before asserting evaluates too early, causing intermittent flakiness on variable CI networks.',

  // ==========================================
  // Module 4: Debugging — Trace Viewer, UI Mode & Error Stacks
  // ==========================================
  'drill-4-1':
    'Playwright locator actions enforce strict mode by default. If a selector matches multiple elements (e.g. multiple "Delete" buttons in a table), Playwright throws an error rather than guessing. Scoping the locator by row name (`page.getByRole(\'row\', { name: \'User 1\' }).getByRole(\'button\', { name: \'Delete\' })`) creates an unambiguous, isolated target.',

  'drill-4-2':
    'Using `await page.pause()` suspends execution and launches the Playwright Inspector, allowing developers to inspect the live accessibility tree, record actions, and step through locators interactively without resorting to print statements or hardcoded sleep delays.',

  'drill-4-3':
    'Actionability checks fail when an element is covered by a modal backdrop or spinner overlay. Rather than bypassing checks with `{ force: true }` (which can click hidden DOM nodes and mask real user-facing bugs), waiting for the modal or overlay to detach with `await expect(overlay).not.toBeVisible()` allows the browser to settle naturally.',

  'drill-4-4':
    'Programmatic tracing via `context.tracing.start()` and `stop()` creates self-contained diagnostic archives (`trace.zip`) capturing before/after DOM snapshots, network waterfalls, and console logs, enabling offline debugging of intermittent production or CI failures.',

  'drill-4-5':
    'The Trace Viewer network waterfall correlated the locator timeout directly with an HTTP 429 (Too Many Requests) response on `/api/validate-cart`. Because the API failed, the frontend never enabled the submit button. Intercepting and mocking the endpoint with `page.route()` isolates UI end-to-end tests from external rate limits and backend volatility.',

  // ==========================================
  // Module 5: Page Object Model (POM) Refactoring
  // ==========================================
  'drill-5-1':
    'The `InventoryPage` class isolates UI selectors and user interactions from test logic. Initializing `readonly` Locators in the constructor prevents recreation overhead and ensures re-locating occurs dynamically on demand. Encapsulating item filtering (`addItemToCart`) keeps specs readable and resilient.',

  'drill-5-2':
    'When refactoring scripts into the Page Object Model, create a separate Page Object for each page or meaningful step. The constructor receives the Playwright Page instance and initializes element locators as readonly so they cannot be accidentally reassigned. Action methods encapsulate page interactions and hide selector details, while assertions strictly remain in the test specification for clear diagnostics.',

  'drill-5-3':
    'Removes assertions and `waitForTimeout` calls from inside page objects to adhere to single responsibility. Declares `readonly checkoutButton: Locator` in the constructor for fast reuse, relying entirely on Playwright\'s native auto-waiting when performing actions.',

  'drill-5-4':
    'Extracts repeated header elements and cart counters into a dedicated Component Object (`HeaderComponent`), preventing duplicate locator definitions across pages and enabling shared verification across multiple specs through composition over inheritance.',

  'drill-5-5':
    'Uses dynamic locator filtering with `.filter({ hasText: itemName })` to scope buttons and prices within individual product containers, preventing strict-mode collisions and decoupling selector logic from specific row ordering without fragile XPath string interpolation.',

  'drill-5-6':
    'Uses dynamic locator filtering with `.filter({ hasText: itemName })` to scope buttons within individual product containers, preventing strict-mode collisions and decoupling selector logic from specific row ordering.',

  // ==========================================
  // Module 6: Fixtures & Auth Bypass (storageState)
  // ==========================================
  'drill-6-1':
    'Playwright custom fixtures rely on the `use()` callback to inject dependencies and control fixture lifecycle. Failing to call `await use(...)` halts the test runner because Playwright never hands control to the test function.',

  'drill-6-2':
    'Using `test.extend<MyFixtures>` provides type-safe dependency injection. Instantiating Page Objects inside fixture setup passes initialized page instances directly into test function arguments, eliminating repetitive `new PageObject(page)` boilerplate across spec files.',

  'drill-6-3':
    'The `auth.setup.ts` project performs authentication once in a global setup step and saves the resulting browser context cookies and localStorage tokens to a JSON file via `storageState`. Subsequent tests consume this state instantly without repeating UI logins.',

  'drill-6-4':
    'Fixtures execute setup before `await use(resource)` and teardown immediately after. Placing cleanup logic after `use()` guarantees that temporary database records, uploaded files, or cart sessions are purged even if test assertions fail.',

  'drill-6-5':
    'Utilizes `storageState` to bypass UI login flows by reusing saved authentication cookies and local storage tokens. Custom fixtures inject pre-authenticated page contexts, dramatically accelerating execution and isolating tests from authentication flakiness.',

  // ==========================================
  // Module 7: API Mocking & Network Interception
  // ==========================================
  'drill-7-1':
    '`page.route()` intercepts network traffic at the browser process level before it reaches the network wire, allowing us to mock empty states or error payloads (`{ status: 200, json: [] }`) deterministically without requiring test database mutations.',

  'drill-7-2':
    'Simulating HTTP 500 server errors and network aborts via `route.fulfill({ status: 500 })` validates frontend error-boundary handling, user alert toasts, and retry buttons without destabilizing or taking down live backend microservices.',

  'drill-7-3':
    'Playwright\'s `request` API context executes HTTP requests directly without launching a browser window, allowing lightning-fast backend API validation, test data seeding, and database teardown with full TypeScript type safety.',

  'drill-7-4':
    'Route handlers must be registered before navigating or triggering the action that emits requests. Calling `route.continue()` passes unhandled traffic through to the real server, preventing unexpected request hanging or connection drops.',

  'drill-7-5':
    'Uses `route.fetch()` to execute the real backend request, then modifies the returned response JSON on the fly before fulfilling it to the page. This allows testing frontend error handling or edge-case payloads against live service structures.',

  // ==========================================
  // Module 8: CI/CD on Ubuntu & GitHub Actions
  // ==========================================
  'drill-8-1':
    'Ubuntu CI runners require `npx playwright install --with-deps` in the GitHub Actions workflow to provision shared system libraries. Without this step, headless browser processes crash during launch on clean Linux virtual machines.',

  'drill-8-2':
    'GitHub Actions test matrix sharding (`--shard=\${{ matrix.shard }}/4`) splits test suites across parallel Ubuntu virtual machines. This reduces total pipeline run times by 75% on large test suites while isolating failures to specific worker shards.',

  'drill-8-3':
    'Retaining trace files only on failure (`trace: \'on-first-retry\'`) prevents CI storage exhaustion while ensuring engineers have full execution recordings for diagnosing flakiness. Workflows should upload traces under conditional failure flags.',

  'drill-8-4':
    'Configures conditional artifact upload (`if: always()`) with `actions/upload-artifact` so test reports and traces are preserved whenever a build fails or tests flake, providing immediate access to forensic diagnostics without keeping unnecessary artifacts on passing runs.',

  'drill-8-5':
    'A production-grade CI pipeline on Ubuntu 24.04 orchestrates `npm ci` for deterministic dependencies, `npx playwright install --with-deps` for Linux shared libraries, parallel test execution, and unconditional HTML report upload for instant team visibility.',

  // ==========================================
  // Module 9: Capstone Portfolio Suite
  // ==========================================
  'drill-9-1':
    'Dialogs (`page.once(\'dialog\', ...)`) must be registered before the triggering action is executed to avoid missing synchronous events. Calling `dialog.accept()` handles native browser alert, confirm, and prompt modals deterministically.',

  'drill-9-2':
    'Iframes must be accessed via `page.frameLocator()`, which retains full auto-waiting and assertion capabilities across boundary contexts, avoiding obsolete frame switching handles that introduce timing race conditions.',

  'drill-9-3':
    'Handling multi-tab links requires `context.waitForEvent(\'popup\')` registered concurrently with the click action via `Promise.all`. This captures the new page reference safely before subsequent assertions run on the target window.',

  'drill-9-4':
    'Production test hardening refactors arbitrary sleeps into web-first assertions, resolves unawaited promises, and replaces brittle nth-child CSS with semantic accessibility locators, achieving zero-tolerance flakiness across environments.',

  'drill-9-5':
    'A production-grade test suite combines modular Page Objects, type-safe custom fixtures with authentication state reuse, web-first auto-retrying assertions, network interception for edge cases, and CI-optimized trace generation.'
};

export function getApprovedDrillExplanation(drillId: string): string {
  return (
    DRILL_APPROVED_EXPLANATIONS[drillId] ||
    'Adheres to modern Playwright conventions: avoids arbitrary timeouts, relies on auto-waiting locators, and uses web-first assertions.'
  );
}
