import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import assert from "node:assert/strict";

const executablePath =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
const outDir = "art-source/responsive";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const viewports = [
  { name: "wide", width: 1920, height: 1080 },
  { name: "laptop", width: 1440, height: 900 },
  { name: "small-laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-small", width: 320, height: 568 },
];

const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.addInitScript(() => {
    window.__metrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.__metrics.lcp = entries[entries.length - 1]?.startTime || 0;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__metrics.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  await page.waitForTimeout(1000);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  assert.equal(overflow, false, `${viewport.name} has no horizontal overflow`);

  await page.screenshot({ path: `${outDir}/${viewport.name}-hero.png` });

  // Reveal all content, then verify every image loads.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 650) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(500);

  const brokenImages = await page.locator("img").evaluateAll((images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src),
  );
  assert.deepEqual(brokenImages, [], `${viewport.name} images load`);

  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    const byType = {};
    for (const entry of resources) {
      const type = entry.initiatorType || "other";
      byType[type] = byType[type] || { count: 0, bytes: 0 };
      byType[type].count += 1;
      byType[type].bytes += entry.transferSize || 0;
    }
    const totalBytes = resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
    const navigation = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0];
    return {
      lcp: Math.round(window.__metrics.lcp),
      cls: Number(window.__metrics.cls.toFixed(4)),
      fcp: Math.round(fcp?.startTime || 0),
      domContentLoaded: Math.round(navigation?.domContentLoadedEventEnd || 0),
      totalBytes,
      resourceCount: resources.length,
      byType,
    };
  });

  await page.screenshot({ path: `${outDir}/${viewport.name}-full.png`, fullPage: true });
  results.push({ viewport, errors, metrics });
  await context.close();
}

// Internal link integrity.
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
await page.goto(baseUrl, { waitUntil: "networkidle" });
const hrefs = await page.locator('a[href^="/"]').evaluateAll((links) =>
  Array.from(new Set(links.map((link) => link.getAttribute("href")).filter(Boolean))),
);
const linkStatus = [];
for (const href of hrefs) {
  const target = href.split("#")[0] || "/";
  const response = await page.request.get(new URL(target, baseUrl).href);
  linkStatus.push({ href, status: response.status() });
}
for (const link of linkStatus) {
  assert.ok(link.status < 400, `internal link ${link.href} returns ${link.status}`);
}

console.log(JSON.stringify({ results, linkStatus }, null, 2));
await browser.close();
