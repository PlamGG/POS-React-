import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:8080';

async function runTest() {
  console.log('Launching browser to test receipt...');
  const browser = await puppeteer.launch({ headless: "new", defaultViewport: { width: 1280, height: 800 } });
  const page = await browser.newPage();

  try {
    // 1. Go to Login
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Logged in successfully.');

    // 2. Wait for items to load and click the first item
    await new Promise(r => setTimeout(r, 2000));
    const itemCards = await page.$$('.cursor-pointer');
    if (itemCards.length > 0) {
      await itemCards[0].click();
      console.log('Added first item to cart.');
    }

    // 3. Click Checkout / Confirm Bill (The green button)
    await new Promise(r => setTimeout(r, 1000));
    const buttons = await page.$$('button');
    for (let btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Confirm Order')) {
        await btn.click();
        console.log('Clicked Confirm Order.');
        break;
      }
    }

    // 4. Click Cash Payment
    await new Promise(r => setTimeout(r, 1000));
    const payBtns = await page.$$('button');
    for (let btn of payBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Complete Cash Payment')) {
        // Need to fill amount first
        await page.type('input[type="number"]', '1000');
        await btn.click();
        console.log('Entered cash and clicked Complete Cash Payment.');
        break;
      }
    }

    // 5. Wait for processing (1.5s) and receipt to show
    console.log('Waiting for receipt to render...');
    await new Promise(r => setTimeout(r, 2000));

    // 6. Check if receipt is rendered
    const receiptHTML = await page.evaluate(() => {
      const el = document.querySelector('#receipt-print-area') || document.querySelector('table');
      return el ? el.innerText : null;
    });

    if (receiptHTML) {
      console.log('\n--- RECEIPT EXTRACTED ---');
      console.log(receiptHTML);
      console.log('-------------------------\n');
      if (receiptHTML.includes('TOTAL') && !receiptHTML.includes('TOTAL\t฿0.00')) {
        console.log('✅ TEST PASSED: Receipt has items and total is NOT zero!');
      } else {
        console.log('❌ TEST FAILED: Receipt might be empty.');
      }
    } else {
      console.log('❌ Could not find receipt area.');
    }

  } catch (e) {
    console.error('Error during test:', e);
  } finally {
    await browser.close();
  }
}

runTest();
