import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const executablePath =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";
const outDir = "art-source/test-shots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// --- Structure, SEO and basic accessibility ---------------------------------
assert.equal(await page.locator("h1").count(), 1, "exactly one h1");
assert.equal(await page.title(), "The Eclipse Tee — Edition 01 | AUREL");
assert.match(await page.locator('meta[name="description"]').getAttribute("content"), /Eclipse Tee/);
assert.match(await page.locator('meta[property="og:image"]').getAttribute("content"), /og-image/);
assert.equal(
  await page.locator('link[rel="canonical"]').getAttribute("href"),
  "https://rashlakshan.github.io/single-product-tshirt-store/",
);
assert.equal(await page.locator('script[type="application/ld+json"]').count(), 0, "no unverified product schema");

const emptyAlt = await page.locator("img").evaluateAll((images) =>
  images.filter((image) => !image.hasAttribute("alt")).length,
);
assert.equal(emptyAlt, 0, "every image has an alt attribute");

const namelessButtons = await page.locator("button").evaluateAll((buttons) =>
  buttons.filter(
    (button) =>
      !button.textContent.trim() &&
      !button.getAttribute("aria-label") &&
      !button.getAttribute("title"),
  ).length,
);
assert.equal(namelessButtons, 0, "every button has an accessible name");

const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 1,
);
assert.equal(overflow, false, "desktop page has no horizontal overflow");

// --- Gallery ---------------------------------------------------------------
const galleryCaption = page.locator(".gallery__caption");
const captionBefore = await galleryCaption.textContent();
await page.locator(".gallery-arrow").last().click();
await page.waitForTimeout(350);
const captionAfter = await galleryCaption.textContent();
assert.notEqual(captionBefore, captionAfter, "gallery next button changes the image");
await page.getByRole("button", { name: /Open larger image/i }).click();
await page.waitForTimeout(450);
await page.screenshot({ path: `${outDir}/lightbox.png` });
assert.equal(await page.locator(".lightbox").isVisible(), true);
await page.keyboard.press("Escape");
await page.waitForTimeout(250);
assert.equal(await page.locator(".lightbox").count(), 0);

// --- Size guide toggle ------------------------------------------------------
const firstSizeCell = page.locator(".size-table tbody tr").first().locator("td").first();
const cmValue = (await firstSizeCell.textContent()).trim();
assert.match(cmValue, /54/);
await page.getByRole("button", { name: "Inches" }).click();
const inchValue = (await firstSizeCell.textContent()).trim();
assert.match(inchValue, /21.3/);
await page.getByRole("button", { name: "Centimetres" }).click();

// --- Product options -------------------------------------------------------
await page.locator(".size-pill").filter({ hasText: "M" }).click();
assert.equal(await page.locator('.size-pill input[value="M"]').isChecked(), true);
await page.locator(".color-swatch").nth(2).click();
assert.equal(await page.locator('.color-swatch input[value="Clay"]').isChecked(), true);

// --- Order form validation + WhatsApp URL ----------------------------------
await page.locator(".product-order").click();
await page.waitForTimeout(450);
assert.equal(await page.locator(".order-drawer").isVisible(), true);
await page.screenshot({ path: `${outDir}/order-open.png` });

await page.evaluate(() => {
  window.__openedWhatsApp = [];
  const originalOpen = window.open;
  window.open = (url, ...rest) => {
    window.__openedWhatsApp.push(String(url));
    return null;
  };
  window.__originalOpen = originalOpen;
});

await page.getByRole("dialog").getByRole("button", { name: "ORDER VIA WHATSAPP" }).click();
await page.waitForTimeout(350);
assert.equal(await page.locator(".form-alert").isVisible(), true, "empty fields show an alert");
assert.match(await page.locator("#order-name-error").textContent(), /full name/i);
assert.equal(
  await page.locator("#order-name").evaluate((input) => input === document.activeElement),
  true,
  "first invalid field receives focus",
);

await page.locator("#order-name").fill("Ada Lovelace");
await page.locator("#order-country").selectOption("United Kingdom");
await page.locator("#order-city").fill("London");
await page.locator("#order-postal").fill("SW1A 1AA");
await page.locator("#order-address").fill("12 Example Street, Flat 4");
await page.locator("#order-email").fill("ada@example.com");
await page.locator("#order-notes").fill("Please confirm the fit before payment.");
await page.getByRole("dialog").getByRole("button", { name: "Increase quantity" }).click();
await page.waitForTimeout(250);

const subtotal = await page.locator(".order-summary__product > span").textContent();
assert.match(subtotal, /\$116/);

await page.getByRole("dialog").getByRole("button", { name: "ORDER VIA WHATSAPP" }).click();
await page.waitForTimeout(450);
assert.equal(await page.getByText("One last step.").isVisible(), true);
assert.equal(await page.getByText(/Not confirmed yet/i).isVisible(), true);
await page.screenshot({ path: `${outDir}/order-success.png` });

const opened = await page.evaluate(() => window.__openedWhatsApp || []);
assert.equal(opened.length, 1, "one WhatsApp URL is opened");
const whatsappUrl = new URL(opened[0]);
assert.equal(whatsappUrl.origin + whatsappUrl.pathname, "https://wa.me/12025550147");
const message = whatsappUrl.searchParams.get("text");
assert.ok(message, "prefilled message exists");
for (const expected of [
  "Product: The Eclipse Tee — Edition 01",
  "Size: M",
  "Colour: Clay",
  "Quantity: 2",
  "Price: $58 USD each",
  "Estimated product total: $116 USD",
  "Customer Name: Ada Lovelace",
  "Country: United Kingdom",
  "City: London",
  "Address: 12 Example Street, Flat 4",
  "Postal Code: SW1A 1AA",
  "Email: ada@example.com",
  "Please confirm availability, shipping cost, and payment instructions.",
  "not confirmed until the studio replies",
]) {
  assert.ok(message.includes(expected), `message includes: ${expected}`);
}
assert.ok(!message.toLowerCase().includes("order confirmed"), "message never claims confirmation");

await page.getByRole("dialog").getByRole("button", { name: "Close order form" }).click();
await page.waitForTimeout(250);
assert.equal(await page.locator(".order-drawer").count(), 0);

// --- FAQ -------------------------------------------------------------------
await page.locator(".faq-item").first().locator("summary").click();
assert.equal(await page.locator(".faq-item").first().getAttribute("open"), "");

// --- Mobile flow -----------------------------------------------------------
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobile.newPage();
const mobileErrors = [];
mobilePage.on("console", (message) => {
  if (message.type() === "error") mobileErrors.push(message.text());
});
mobilePage.on("pageerror", (error) => mobileErrors.push(error.message));
await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
await mobilePage.waitForTimeout(600);
await mobilePage.screenshot({ path: `${outDir}/mobile-hero.png` });
assert.equal(
  await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
  false,
  "mobile page has no horizontal overflow",
);
const quickCtaBox = await mobilePage.locator(".hero__quick-button").boundingBox();
assert.ok(quickCtaBox && quickCtaBox.y + quickCtaBox.height <= 844, "mobile hero CTA is in the first screen");
await mobilePage.getByRole("button", { name: "Open menu" }).click();
await mobilePage.waitForTimeout(450);
await mobilePage.screenshot({ path: `${outDir}/mobile-menu.png` });
assert.equal(await mobilePage.locator(".mobile-menu").isVisible(), true);
await mobilePage.locator(".mobile-menu__nav a").first().click();
await mobilePage.waitForTimeout(600);
assert.equal(await mobilePage.locator(".mobile-menu").count(), 0);

await mobilePage.evaluate(() => window.scrollTo(0, 1600));
await mobilePage.waitForTimeout(700);
assert.equal(await mobilePage.locator(".sticky-order").isVisible(), true, "mobile sticky CTA shows");
await mobilePage.screenshot({ path: `${outDir}/mobile-product.png` });
await mobilePage.locator(".sticky-order .button").click();
await mobilePage.waitForTimeout(500);
await mobilePage.screenshot({ path: `${outDir}/mobile-order.png` });
assert.equal(await mobilePage.locator(".order-drawer").isVisible(), true);

// No-JS content is still visible.
const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
const noJsPage = await noJs.newPage();
await noJsPage.goto(baseUrl, { waitUntil: "networkidle" });
assert.equal(await noJsPage.locator(".noscript-banner").isVisible(), true);
assert.equal(await noJsPage.locator(".hero__title").isVisible(), true);

console.log(
  JSON.stringify(
    {
      ok: true,
      consoleErrors,
      mobileErrors,
      whatsappUrl: opened[0],
      message,
    },
    null,
    2,
  ),
);

await browser.close();
