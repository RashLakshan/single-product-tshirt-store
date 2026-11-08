import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const executablePath =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
const outDir = "art-source/screens";

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.screenshot({ path: `${outDir}/desktop-hero.png` });

const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 700) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/desktop-full.png`, fullPage: true });

for (const [name, selector] of [
  ["product", ".product-section"],
  ["why", ".why"],
  ["size", ".size-guide"],
  ["story", ".story"],
  ["reviews", ".reviews"],
  ["faq", ".faq"],
  ["final", ".final-cta"],
  ["footer", ".site-footer"],
]) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await element.screenshot({ path: `${outDir}/desktop-${name}.png` });
}

console.log(JSON.stringify({ height, errors }, null, 2));
await browser.close();
