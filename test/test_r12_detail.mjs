import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const TEST_EMAIL = 'qa_tester@example.com';
const TEST_PASSWORD = 'Password123!';
const SITE_ID = 'cmngxijvm0002r0tvob2paoqr';

const browser = await chromium.launch();
const page = await browser.newPage();

// Test 1: Signup form with empty fields
await page.goto(`${BASE}/signup`);
console.log('=== Signup Form Validation ===');

// Click submit without filling anything
await page.click('button[type="submit"]');
await page.waitForTimeout(500);

const urlAfterEmpty = page.url();
const textAfterEmpty = await page.locator('body').innerText();
console.log('URL after empty submit:', urlAfterEmpty);

// Check if any input is in :invalid state (native HTML5 validation)
const invalidInputs = await page.locator('input:invalid').count();
console.log('Number of :invalid inputs:', invalidInputs);

// Check if native validation blocked submission
const formStillOnPage = urlAfterEmpty.includes('/signup');
console.log('Form stayed on signup page:', formStillOnPage);

// Check if there are any visible error messages in DOM
const errorDivs = await page.locator('[style*="dc2626"], [style*="fef2f2"]').count();
console.log('Error div count (red styled):', errorDivs);

// Check if native browser validation messages are detectable
const firstInput = page.locator('input[name="name"]');
const validationMessage = await firstInput.evaluate(el => el.validationMessage);
console.log('Native validation message:', validationMessage);

console.log('Body text:', textAfterEmpty.substring(0, 300));

// Now test Add Site form validation
console.log('\n=== Add Site Form Validation ===');
await page.goto(`${BASE}/login`);
await page.fill('input[name="email"]', TEST_EMAIL);
await page.fill('input[name="password"]', TEST_PASSWORD);
await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

// Click Add Site
await page.locator('button, a').filter({ hasText: /add site/i }).first().click();
await page.waitForTimeout(1000);

// Try to submit empty Add Site form
await page.locator('button[type="submit"]').first().click();
await page.waitForTimeout(500);

const siteFormText = await page.locator('body').innerText();
const siteInvalidInputs = await page.locator('input:invalid').count();
const siteErrorDivs = await page.locator('[style*="dc2626"], [style*="fef2f2"]').count();
const siteFirstInput = page.locator('input[name="name"]').first();
const siteValidationMsg = await siteFirstInput.evaluate(el => el.validationMessage).catch(() => 'N/A');

console.log('Invalid inputs count:', siteInvalidInputs);
console.log('Error divs count:', siteErrorDivs);
console.log('Native validation message:', siteValidationMsg);
console.log('Form text:', siteFormText.substring(0, 400));

await browser.close();
