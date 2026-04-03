import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Listen for console errors
page.on('console', msg => console.log('Console:', msg.type(), msg.text()));
page.on('pageerror', err => console.log('Page error:', err));

// Navigate to signup
await page.goto('http://localhost:3000/signup');

// Check input fields
const inputs = await page.locator('input').all();
for (const input of inputs) {
  const type = await input.getAttribute('type');
  const name = await input.getAttribute('name');
  const id = await input.getAttribute('id');
  const placeholder = await input.getAttribute('placeholder');
  console.log('Input:', { type, name, id, placeholder });
}

// Fill in the form more carefully
const nameInput = await page.locator('input[name="name"]').first();
await nameInput.fill('Test User');

const emailInput = await page.locator('input[name="email"]').first();
await emailInput.fill('testuser@example.com');

const passwordInput = await page.locator('input[name="password"]').first();
await passwordInput.fill('Password123!');

console.log('Filled form, clicking submit...');
await page.click('button[type="submit"]');

// Wait a moment
await page.waitForTimeout(3000);

console.log('After submit URL:', page.url());
const bodyText = await page.locator('body').innerText();
console.log('Body text:', bodyText.substring(0, 1000));

await browser.close();
