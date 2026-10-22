const { chromium } = require("@playwright/test");
const fs = require("fs");
const coverage = [
  ...require("../reference/page-type-validation.json").coverage,
  { kind: "status", example: "/408" },
  {
    kind: "long-article",
    example:
      "/blog/the-ai-boom-is-reshaping-trans-pacific-trade-can-logistics-keep-up-94f05f",
  },
  { kind: "trade", example: "/trade" },
];
const origin = process.env.SITE_CHECK_URL || "http://localhost:3020";
const widths = (
  process.env.AUDIT_WIDTHS || "320,360,375,390,412,430,600,768,820,1024,1440"
)
  .split(",")
  .map(Number);
(async () => {
  const browser = await chromium.launch({
    channel: process.env.AUDIT_BROWSER || "chrome",
    headless: true,
  });
  const page = await browser.newPage({
    reducedMotion: "reduce",
    isMobile: true,
    hasTouch: true,
  });
  const failures = [];
  const checks = [];
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  try {
    for (const item of coverage) {
      await page.goto(origin + item.example);
      await page.locator("main").first().waitFor();
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(35);
        const result = await page.evaluate(() => ({
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
          offenders: [...document.querySelectorAll("body *")]
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.width > 0 &&
                r.right > document.documentElement.clientWidth + 2 &&
                getComputedStyle(e).position !== "fixed" &&
                !e.closest("[hidden]")
              );
            })
            .slice(0, 10)
            .map((e) => ({
              tag: e.tagName,
              cls: e.getAttribute("class"),
              right: Math.round(e.getBoundingClientRect().right),
            })),
        }));
        checks.push({
          kind: item.kind,
          width,
          overflow: result.scroll > width + 2,
        });
        if (result.scroll > width + 2) {
          failures.push({ path: item.example, kind: item.kind, ...result });
          console.log("OVERFLOW", item.kind, width, JSON.stringify(result));
        }
      }
      console.log("Checked", item.kind);
    }
    fs.writeFileSync(
      "reference/responsive-audit.json",
      JSON.stringify({ checks, failures, errors }, null, 2),
    );
    console.log(
      "DONE",
      checks.length,
      "checks",
      failures.length,
      "failures",
      errors.length,
      "errors",
    );
    if (failures.length || errors.length) process.exitCode = 1;
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
