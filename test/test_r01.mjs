import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

// Check HTTP status
const response = await page.goto('http://localhost:3000');
const status = response.status();
const content = await page.content();

// Check for headline mentioning optimization, conversion, or A/B test
const headlineRegex = /optimization|conversion|a\/b test/i;
const hasHeadline = headlineRegex.test(content);

// Check for visible CTA button
const ctaButton = await page.locator('button, a').filter({ hasText: /sign up|get started/i }).first();
const ctaVisible = await ctaButton.isVisible().catch(() => false);

const bodyText = await page.locator('body').innerText();
console.log('HTTP Status:', status);
console.log('Has headline (optimization/conversion/A/B test):', hasHeadline);
console.log('CTA button visible:', ctaVisible);
console.log('Body text preview:', bodyText.substring(0, 500));

if (status === 200 && hasHeadline && ctaVisible) {
  console.log('R01: PASS');
} else {
  console.log('R01: FAIL');
  console.log('Reasons:', { status, hasHeadline, ctaVisible });
}

await browser.close();
