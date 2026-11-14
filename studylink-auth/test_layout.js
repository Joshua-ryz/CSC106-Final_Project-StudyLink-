const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Test desktop 1920x1080
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'login-desktop-1920.png', fullPage: true });
  console.log('Desktop 1920x1080 screenshot saved');
  
  // Test tablet 768x1024
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'login-tablet-768.png', fullPage: true });
  console.log('Tablet 768x1024 screenshot saved');
  
  // Test mobile 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'login-mobile-390.png', fullPage: true });
  console.log('Mobile 390x844 screenshot saved');
  
  // Test signup page desktop
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/signup', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'signup-desktop-1920.png', fullPage: true });
  console.log('Signup desktop 1920x1080 screenshot saved');
  
  await browser.close();
})();
