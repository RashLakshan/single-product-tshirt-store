import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const executablePath =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
await mkdir("docs", { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
page.on("pageerror", (error) => errors.push(error.message));
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: "docs/preview-desktop.png" });

// Reveal page for a full-page editorial screenshot.
const height = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < height; y += 650) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(100);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);

await page.locator(".product-order").click();
await page.waitForTimeout(450);
await page.screenshot({ path: "docs/preview-order.png" });
await page.keyboard.press("Escape");

await page.goto(`${baseUrl}/policies/privacy/`, { waitUntil: "networkidle" });
await page.screenshot({ path: "docs/preview-policy.png", fullPage: true });

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
await mobilePage.waitForTimeout(700);
await mobilePage.screenshot({ path: "docs/preview-mobile.png" });
await mobilePage.locator(".hero__quick-button").click();
await mobilePage.waitForTimeout(500);
await mobilePage.screenshot({ path: "docs/preview-mobile-order.png" });

console.log(JSON.stringify({ ok: true, errors }, null, 2));
await browser.close();
