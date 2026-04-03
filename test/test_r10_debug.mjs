import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const TEST_EMAIL = 'qa_tester@example.com';
const TEST_PASSWORD = 'Password123!';
const SITE_ID = 'cmngxijvm0002r0tvob2paoqr';

const browser = await chromium.launch({ headless: false }); // visible for debugging
const page = await browser.newPage();

await page.goto(`${BASE}/login`);
await page.fill('input[name="email"]', TEST_EMAIL);
await page.fill('input[name="password"]', TEST_PASSWORD);
await page.locator('button').filter({ hasText: /log in|sign in/i }).first().click();
await page.waitForURL(`${BASE}/dashboard`, { timeout: 10000 }).catch(() => {});

await page.goto(`${BASE}/dashboard/sites/${SITE_ID}/suggestions`);
await page.waitForTimeout(3000);

const bodyText = await page.locator('body').innerText();
console.log('Suggestions page text:');
console.log(bodyText);

// Look for any Create Test buttons
const allButtons = await page.locator('button').all();
for (const btn of allButtons) {
  const text = await btn.innerText().catch(() => '');
  console.log('Button:', text);
}

const allLinks = await page.locator('a').all();
for (const link of allLinks) {
  const text = await link.innerText().catch(() => '');
  const href = await link.getAttribute('href').catch(() => '');
  console.log('Link:', text, '->', href);
}

await browser.close();
