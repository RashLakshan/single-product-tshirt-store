import { chromium } from "playwright-core";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const executablePath =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4173";

const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

async function audit(name, page) {
  await page.addScriptTag({ content: axeSource });
  const result = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"],
      },
    });
  });

  const violations = result.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.slice(0, 4).map((node) => ({
      target: node.target,
      summary: node.failureSummary,
    })),
    count: violation.nodes.length,
  }));
  results.push({ name, violations });
  console.log(
    `\n${name}: ${violations.length} violations\n` +
      violations
        .map(
          (violation) =>
            `- [${violation.impact}] ${violation.id}: ${violation.help} (${violation.count})`,
        )
        .join("\n"),
  );
}

const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
await page.goto(baseUrl, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await audit("home desktop", page);

await page.locator(".product-order").click();
await page.waitForTimeout(500);
await audit("order drawer", page);
await page.keyboard.press("Escape");

await page.goto(`${baseUrl}/policies/privacy/`, { waitUntil: "networkidle" });
await audit("privacy policy", page);

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobile.newPage();
await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
await mobilePage.waitForTimeout(700);
await audit("home mobile", mobilePage);
await mobilePage.getByRole("button", { name: "Open menu" }).click();
await mobilePage.waitForTimeout(500);
await audit("mobile menu", mobilePage);

console.log("\n" + JSON.stringify(results, null, 2));
await browser.close();
