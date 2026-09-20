import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:8080';
const OUT_DIR = path.join(process.cwd(), 'docs', 'screenshots');

const pagesToCapture = [
  { name: '00_login.png', path: '/login' },
  { name: '01_pos.png', path: '/' },
  { name: '02_dashboard.png', path: '/dashboard' },
  { name: '03_stock.png', path: '/stock' },
  { name: '04_settings.png', path: '/settings' }
];

async function captureScreenshots() {
  // Ensure directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1280, height: 800 } // Desktop view
  });

  const page = await browser.newPage();

  // 1. Take Login Screenshot
  console.log('Navigating to /login...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUT_DIR, '00_login.png'), fullPage: false });
  console.log('Saved screenshot: 00_login.png');

  // 2. Perform Login as Test User
  console.log('Logging in as test user...');
  // The fields are pre-filled, so we just click the submit button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to complete after login (should redirect to /)
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000)); // Wait for products to load
  
  await page.screenshot({ path: path.join(OUT_DIR, '01_pos.png'), fullPage: false });
  console.log('Saved screenshot: 01_pos.png');

  // 3. Capture other pages
  const remainingPages = [
    { name: '02_dashboard.png', path: '/dashboard' },
    { name: '03_stock.png', path: '/stock' },
    { name: '04_settings.png', path: '/settings' },
    { name: '05_feedback.png', path: '/feedback' }
  ];

  for (const target of remainingPages) {
    console.log(`Navigating to ${target.path}...`);
    try {
      await page.goto(`${BASE_URL}${target.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000)); // wait for data to load
      
      const outPath = path.join(OUT_DIR, target.name);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`Saved screenshot: ${target.name}`);
    } catch (e) {
      console.error(`Failed to capture ${target.path}:`, e.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

captureScreenshots();
