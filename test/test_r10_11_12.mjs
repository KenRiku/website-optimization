import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const TEST_EMAIL = 'qa_tester@example.com';
const TEST_PASSWORD = 'Password123!';
const SITE_ID = 'cmngxijvm0002r0tvob2paoqr';

// === R10: Create A/B test from suggestion ===
console.log('\n=== Testing R10 ===');
{
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  await page.goto(`${BASE}/dashboard/sites/${SITE_ID}/suggestions`);
  await page.waitForTimeout(2000);

  // Look for "Create A/B Test" button
  const createTestBtn = page.locator('button').filter({ hasText: /create a\/b test|create test|start test/i }).first();
  const hasCreateTest = await createTestBtn.isVisible().catch(() => false);
  console.log('Has Create A/B Test button:', hasCreateTest);

  if (hasCreateTest) {
    await createTestBtn.click();
    await page.waitForTimeout(3000);

    const currentUrl = page.url();
    const bodyText = await page.locator('body').innerText();
    console.log('After click URL:', currentUrl);
    console.log('Body text preview:', bodyText.substring(0, 500));

    const hasTestContent = /draft|running|variant/i.test(bodyText);
    console.log('Has test content:', hasTestContent);

    if (hasTestContent) {
      console.log('R10: PASS');
    } else {
      // Navigate to tests list to check
      await page.goto(`${BASE}/dashboard/sites/${SITE_ID}/tests`);
      await page.waitForTimeout(2000);
      const testsText = await page.locator('body').innerText();
      console.log('Tests page:', testsText.substring(0, 500));
      const hasTestInList = /draft|running|completed/i.test(testsText);
      console.log('R10:', hasTestInList ? 'PASS' : 'FAIL - no test status found');
    }
  } else {
    const bodyText = await page.locator('body').innerText();
    console.log('R10: FAIL - No Create A/B Test button. Body:', bodyText.substring(0, 400));
  }

  await browser.close();
}

// === R11: Tests list ===
console.log('\n=== Testing R11 ===');
{
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(`${BASE}/login`);
  await page.fill('input[name="email"]', TEST_EMAIL);
  await page.fill('input[name="password"]', TEST_PASSWORD);
  await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

  await page.goto(`${BASE}/dashboard/sites/${SITE_ID}/tests`);
  await page.waitForTimeout(2000);

  const bodyText = await page.locator('body').innerText();
  console.log('Tests list page:', bodyText);

  const hasTestEntry = /draft|running|completed/i.test(bodyText);
  const noErrors = !bodyText.includes('Error') && !bodyText.includes('error');
  console.log('Has test entry:', hasTestEntry);
  console.log('R11:', (hasTestEntry && noErrors) ? 'PASS' : 'FAIL');

  await browser.close();
}

// === R12: Form validation ===
console.log('\n=== Testing R12 ===');
{
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test signup form with empty fields
  await page.goto(`${BASE}/signup`);

  // Log form before click
  const beforeText = await page.locator('body').innerText();
  console.log('Before click text:', beforeText.substring(0, 200));

  // Click submit without filling
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  const afterText = await page.locator('body').innerText();
  const afterUrl = page.url();
  console.log('After click URL:', afterUrl);
  console.log('After click text:', afterText.substring(0, 400));

  // Check for HTML5 validation (required attribute)
  const nameInput = page.locator('input[name="name"]');
  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');

  const nameRequired = await nameInput.getAttribute('required');
  const emailRequired = await emailInput.getAttribute('required');
  const passwordRequired = await passwordInput.getAttribute('required');

  console.log('Input required attrs:', { name: nameRequired, email: emailRequired, password: passwordRequired });

  // Try checking for any error messages on the page
  const errorMessages = await page.locator('[class*="error"], [class*="Error"], .text-red, [class*="red"]').all();
  console.log('Error elements count:', errorMessages.length);

  const hasValidationError = /required|enter|invalid|field|error/i.test(afterText) || afterText !== beforeText;
  const stayedOnSignup = afterUrl.includes('/signup');

  console.log('Has validation error:', hasValidationError);
  console.log('Stayed on signup:', stayedOnSignup);

  await browser.close();
}
