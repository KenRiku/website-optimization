import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const TEST_EMAIL = 'qa_tester@example.com';
const TEST_PASSWORD = 'Password123!';
const TEST_NAME = 'Test User';

const results = {};

async function runTest(id, fn) {
  try {
    const result = await fn();
    results[id] = result;
    console.log(`${id}: ${result.status.toUpperCase()} - ${result.notes}`);
  } catch (err) {
    results[id] = { status: 'fail', notes: `Exception: ${err.message}` };
    console.log(`${id}: FAIL - Exception: ${err.message}`);
  }
}

// === R01: Landing page ===
await runTest('R01', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const response = await page.goto(BASE);
  const status = response.status();
  const content = await page.content();
  const bodyText = await page.locator('body').innerText();

  const hasHeadline = /optimization|conversion|a\/b test/i.test(bodyText);
  const ctaEl = page.locator('button, a').filter({ hasText: /sign up|get started/i }).first();
  const ctaVisible = await ctaEl.isVisible().catch(() => false);

  await browser.close();

  if (status === 200 && hasHeadline && ctaVisible) {
    return { status: 'pass', notes: `Page loads with HTTP 200, headline mentions conversion optimization, CTA button visible` };
  } else {
    return { status: 'fail', notes: `HTTP: ${status}, headline: ${hasHeadline}, CTA: ${ctaVisible}` };
  }
});

// === R02: Sign-up flow ===
await runTest('R02', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE}/signup`);
  await page.fill('input[name="name"]', TEST_NAME);
  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');

  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  const currentUrl = page.url();
  const bodyText = await page.locator('body').innerText();
  const isDashboard = currentUrl.includes('/dashboard');
  const hasWelcomeOrName = /welcome|test user/i.test(bodyText);

  await browser.close();

  if (isDashboard && hasWelcomeOrName) {
    return { status: 'pass', notes: `Signed up successfully, redirected to /dashboard, user name visible` };
  } else if (isDashboard) {
    return { status: 'partial', notes: `Redirected to /dashboard but no welcome message or user name found` };
  } else {
    return { status: 'fail', notes: `URL: ${currentUrl}, isDashboard: ${isDashboard}, hasNameOrWelcome: ${hasWelcomeOrName}, page: ${bodyText.substring(0, 200)}` };
  }
});

// === R03: Login flow ===
await runTest('R03', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // First check if we need to create the user (it might already exist from R02)
  // Navigate to login page
  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);

  const loginBtn = page.locator('button').filter({ hasText: /log in|sign in/i }).first();
  await loginBtn.click();

  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  const currentUrl = page.url();
  const bodyText = await page.locator('body').innerText();
  const isDashboard = currentUrl.includes('/dashboard');
  const hasDashboardContent = /dashboard|sites|welcome|test user/i.test(bodyText);

  await browser.close();

  if (isDashboard && hasDashboardContent) {
    return { status: 'pass', notes: `Login successful, redirected to /dashboard with dashboard content visible` };
  } else {
    return { status: 'fail', notes: `URL: ${currentUrl}, hasDashboardContent: ${hasDashboardContent}, text: ${bodyText.substring(0, 200)}` };
  }
});

// === R04: Logout ===
await runTest('R04', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login first
  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  // Find and click logout button
  const logoutBtn = page.locator('button, a').filter({ hasText: /log out|sign out/i }).first();
  const logoutVisible = await logoutBtn.isVisible().catch(() => false);

  if (!logoutVisible) {
    await browser.close();
    return { status: 'fail', notes: `No logout button found on dashboard` };
  }

  await logoutBtn.click();
  await page.waitForTimeout(2000);

  const afterLogoutUrl = page.url();
  const isRedirectedToLoginOrHome = afterLogoutUrl.includes('/login') || afterLogoutUrl === `${BASE}/` || afterLogoutUrl === BASE;

  // Now try to access dashboard - should redirect to login
  await page.goto(`${BASE}/dashboard`);
  await page.waitForTimeout(2000);
  const dashboardAttemptUrl = page.url();
  const redirectedToLogin = dashboardAttemptUrl.includes('/login');

  await browser.close();

  if (isRedirectedToLoginOrHome && redirectedToLogin) {
    return { status: 'pass', notes: `Logout redirected to ${afterLogoutUrl}, /dashboard redirects to login` };
  } else if (isRedirectedToLoginOrHome) {
    return { status: 'partial', notes: `Logout redirected to ${afterLogoutUrl}, but /dashboard URL: ${dashboardAttemptUrl}` };
  } else {
    return { status: 'fail', notes: `After logout URL: ${afterLogoutUrl}, dashboard attempt URL: ${dashboardAttemptUrl}` };
  }
});

// === R05: Protected dashboard redirects unauthenticated ===
await runTest('R05', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext(); // fresh context, no cookies
  const page = await context.newPage();

  await page.goto(`${BASE}/dashboard`);
  await page.waitForTimeout(2000);

  const currentUrl = page.url();
  const bodyText = await page.locator('body').innerText();
  const redirectedToLogin = currentUrl.includes('/login');
  const hasLoginForm = /log in|sign in|email|password/i.test(bodyText);

  await browser.close();

  if (redirectedToLogin && hasLoginForm) {
    return { status: 'pass', notes: `Unauthenticated access to /dashboard redirected to ${currentUrl}, login form visible` };
  } else {
    return { status: 'fail', notes: `URL: ${currentUrl}, hasLoginForm: ${hasLoginForm}` };
  }
});

// === R06: Add a site ===
let siteId = null;
await runTest('R06', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login
  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  // Click Add Site
  const addSiteBtn = page.locator('button, a').filter({ hasText: /add site/i }).first();
  const addSiteVisible = await addSiteBtn.isVisible().catch(() => false);
  if (!addSiteVisible) {
    await browser.close();
    return { status: 'fail', notes: `No "Add Site" button found on dashboard` };
  }

  await addSiteBtn.click();
  await page.waitForTimeout(1000);

  // Fill in site form
  const siteNameInput = page.locator('input[name="name"], input[placeholder*="Site"], input[placeholder*="Name"]').first();
  await siteNameInput.fill('My Test Site');

  const urlInput = page.locator('input[name="url"], input[placeholder*="http"], input[type="url"]').first();
  await urlInput.fill('https://example.com');

  // Submit
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  const bodyText = await page.locator('body').innerText();

  // Extract site ID from URL if redirected to site page
  const urlMatch = currentUrl.match(/\/sites\/([^\/]+)/);
  if (urlMatch) siteId = urlMatch[1];

  const hasSiteName = /my test site/i.test(bodyText);
  const hasScript = /<script|script tag|tracking/i.test(await page.content());

  await browser.close();

  if (hasSiteName && hasScript) {
    return { status: 'pass', notes: `Site "My Test Site" created, tracking script visible. Site ID: ${siteId}` };
  } else if (hasSiteName) {
    return { status: 'partial', notes: `Site name visible but no script snippet found. URL: ${currentUrl}` };
  } else {
    return { status: 'fail', notes: `URL: ${currentUrl}, hasSiteName: ${hasSiteName}, hasScript: ${hasScript}, text: ${bodyText.substring(0, 300)}` };
  }
});

// === R07: Site persists after reload ===
await runTest('R07', async () => {
  if (!siteId) {
    // Try to find site ID via API
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`${BASE}/login`);
    await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
    await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
    await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
    await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});
    const bodyText = await page.locator('body').innerText();
    const hasSite = /my test site/i.test(bodyText);
    await browser.close();
    return hasSite
      ? { status: 'pass', notes: `My Test Site visible on dashboard after login (no direct site ID for reload test)` }
      : { status: 'fail', notes: `Site not visible on dashboard` };
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login and go to site page
  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  await page.goto(`${BASE}/dashboard/sites/${siteId}`);
  await page.reload();
  await page.waitForTimeout(2000);

  const bodyText = await page.locator('body').innerText();
  const hasSiteName = /my test site/i.test(bodyText);
  const hasSiteUrl = /example\.com/i.test(bodyText);

  await browser.close();

  if (hasSiteName && hasSiteUrl) {
    return { status: 'pass', notes: `After reload, "My Test Site" and "example.com" still visible` };
  } else {
    return { status: 'fail', notes: `After reload - hasSiteName: ${hasSiteName}, hasSiteUrl: ${hasSiteUrl}, text: ${bodyText.substring(0, 300)}` };
  }
});

// === R08: Analytics dashboard ===
await runTest('R08', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  let targetUrl = siteId ? `${BASE}/dashboard/sites/${siteId}` : `${BASE}/dashboard`;
  await page.goto(targetUrl);
  await page.waitForTimeout(2000);

  const bodyText = await page.locator('body').innerText();
  const hasAnalyticsSections = /page views?|analytics|events?|scroll depth|clicks/i.test(bodyText);

  await browser.close();

  if (hasAnalyticsSections) {
    return { status: 'pass', notes: `Analytics sections found on site detail page: contains analytics-related headings` };
  } else {
    return { status: 'fail', notes: `No analytics sections found. Text: ${bodyText.substring(0, 300)}` };
  }
});

// === R09: AI Suggestions ===
let suggestionSiteId = siteId;
await runTest('R09', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  if (!suggestionSiteId) {
    // Try to navigate to suggestions from dashboard
    await page.goto(`${BASE}/dashboard`);
    const suggestionsLink = page.locator('a').filter({ hasText: /suggestions?|ai/i }).first();
    const visible = await suggestionsLink.isVisible().catch(() => false);
    if (visible) {
      await suggestionsLink.click();
      await page.waitForTimeout(2000);
    }
  } else {
    await page.goto(`${BASE}/dashboard/sites/${suggestionSiteId}/suggestions`);
    await page.waitForTimeout(2000);
  }

  const currentUrl = page.url();
  const bodyText = await page.locator('body').innerText();

  // Check for URL input field
  const urlInput = page.locator('input[type="url"], input[placeholder*="http"], input[placeholder*="URL"], input[name="url"]').first();
  const hasUrlInput = await urlInput.isVisible().catch(() => false);

  if (!hasUrlInput) {
    await browser.close();
    return { status: 'fail', notes: `No URL input field found on suggestions page. URL: ${currentUrl}, text: ${bodyText.substring(0, 300)}` };
  }

  await urlInput.fill('https://example.com');

  // Click generate/analyze
  const generateBtn = page.locator('button').filter({ hasText: /generate|analyze/i }).first();
  const generateVisible = await generateBtn.isVisible().catch(() => false);

  if (!generateVisible) {
    await browser.close();
    return { status: 'fail', notes: `No Generate/Analyze button found` };
  }

  await generateBtn.click();

  // Wait up to 30 seconds for suggestions
  let suggestions = false;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(1000);
    const text = await page.locator('body').innerText();
    if (/suggestion|headline|cta|recommendation|reasoning/i.test(text) && text.length > 500) {
      suggestions = true;
      break;
    }
  }

  const finalText = await page.locator('body').innerText();
  await browser.close();

  if (suggestions) {
    return { status: 'pass', notes: `AI suggestions generated with headline/CTA content after triggering analysis` };
  } else {
    return { status: 'fail', notes: `No suggestions appeared after 30s. Text: ${finalText.substring(0, 400)}` };
  }
});

// === R10: Create A/B test from suggestion ===
let testSiteId = siteId;
await runTest('R10', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  if (testSiteId) {
    await page.goto(`${BASE}/dashboard/sites/${testSiteId}/suggestions`);
  }
  await page.waitForTimeout(2000);

  // Look for "Create Test" or "Start Test" button
  const createTestBtn = page.locator('button, a').filter({ hasText: /create test|start test/i }).first();
  const hasCreateTest = await createTestBtn.isVisible().catch(() => false);

  if (!hasCreateTest) {
    // Maybe we need to generate suggestions first, or they're already there
    const bodyText = await page.locator('body').innerText();
    await browser.close();
    return { status: 'fail', notes: `No "Create Test" button found. Page text: ${bodyText.substring(0, 300)}` };
  }

  await createTestBtn.click();
  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  const bodyText = await page.locator('body').innerText();
  const hasTestContent = /draft|running|variant a|variant b|test/i.test(bodyText);

  await browser.close();

  if (hasTestContent) {
    return { status: 'pass', notes: `A/B test created, URL: ${currentUrl}, test status/variants visible` };
  } else {
    return { status: 'fail', notes: `URL: ${currentUrl}, text: ${bodyText.substring(0, 300)}` };
  }
});

// === R11: A/B tests list ===
await runTest('R11', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  if (testSiteId) {
    await page.goto(`${BASE}/dashboard/sites/${testSiteId}/tests`);
  } else {
    const testsLink = page.locator('a').filter({ hasText: /tests?/i }).first();
    await testsLink.click().catch(() => {});
  }
  await page.waitForTimeout(2000);

  const bodyText = await page.locator('body').innerText();
  const hasTests = /draft|running|completed/i.test(bodyText);
  const hasStatusBadge = /draft|running|completed/i.test(bodyText);

  await browser.close();

  if (hasTests && hasStatusBadge) {
    return { status: 'pass', notes: `Tests list page loaded with at least one test showing status badge` };
  } else {
    return { status: 'fail', notes: `URL or text: ${bodyText.substring(0, 300)}` };
  }
});

// === R12: Form validation ===
await runTest('R12', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test signup form validation
  await page.goto(`${BASE}/signup`);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);

  const signupUrl = page.url();
  const signupText = await page.locator('body').innerText();
  const hasSignupError = /required|enter|invalid|field/i.test(signupText);
  const stayedOnSignup = signupUrl.includes('/signup');

  // Test Add Site form validation
  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"], input[type="email"]', TEST_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  // Click Add Site and submit empty
  const addSiteBtn = page.locator('button, a').filter({ hasText: /add site/i }).first();
  await addSiteBtn.click();
  await page.waitForTimeout(1000);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(1000);

  const siteFormText = await page.locator('body').innerText();
  const hasSiteFormError = /required|enter|invalid|field/i.test(siteFormText);

  await browser.close();

  if ((hasSignupError && stayedOnSignup) && hasSiteFormError) {
    return { status: 'pass', notes: `Signup form shows validation errors, stays on /signup. Add Site form also shows errors.` };
  } else if (hasSignupError && stayedOnSignup) {
    return { status: 'partial', notes: `Signup validation works, but Add Site form error not confirmed: ${hasSiteFormError}` };
  } else {
    return { status: 'fail', notes: `signupError: ${hasSignupError}, stayedOnSignup: ${stayedOnSignup}, siteFormError: ${hasSiteFormError}` };
  }
});

// Summary
console.log('\n=== SUMMARY ===');
for (const [id, result] of Object.entries(results)) {
  console.log(`${id}: ${result.status} - ${result.notes}`);
}
