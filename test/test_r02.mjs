import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Navigate to signup
await page.goto('http://localhost:3000/signup');
console.log('Signup page loaded, URL:', page.url());

// Fill in the form
await page.fill('input[name="name"], input[placeholder*="Name"], input[id*="name"]', 'Test User');
await page.fill('input[type="email"], input[name="email"]', 'testuser@example.com');
await page.fill('input[type="password"], input[name="password"]', 'Password123!');

// Click sign up button
await page.click('button[type="submit"], button:has-text("Sign Up")');

// Wait for navigation
await page.waitForURL('**/dashboard**', { timeout: 10000 }).catch(async () => {
  console.log('Did not redirect to dashboard. Current URL:', page.url());
  const content = await page.content();
  console.log('Page content preview:', content.substring(0, 1000));
});

const currentUrl = page.url();
const content = await page.content();
const isDashboard = currentUrl.includes('/dashboard');
const hasWelcomeOrName = /welcome|test user/i.test(content);

console.log('Current URL:', currentUrl);
console.log('Is dashboard:', isDashboard);
console.log('Has welcome or user name:', hasWelcomeOrName);

const bodyText = await page.locator('body').innerText();
console.log('Body text preview:', bodyText.substring(0, 500));

if (isDashboard && hasWelcomeOrName) {
  console.log('R02: PASS');
} else {
  console.log('R02: FAIL');
}

await browser.close();
