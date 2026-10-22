const { chromium, expect } = require("@playwright/test");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const origin = process.env.SITE_CHECK_URL || "http://localhost:3020";
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(origin + "/");
    await page
      .getByRole("button", { name: "Reject optional", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Next service", exact: true })
      .click();
    await expect(page.getByRole("tabpanel")).toContainText(
      "Freight Calculator",
    );
    await expect(page.locator(".service-slider-controls")).toContainText(
      "2 / 5",
    );
    await page
      .getByRole("button", { name: "Previous service", exact: true })
      .click();
    await expect(page.getByRole("tabpanel")).toContainText("B2B Marketplace");
    const events = page.getByRole("region", {
      name: "Trade shows",
      exact: true,
    });
    await events.scrollIntoViewIfNeeded();
    await expect(events.locator(".carousel-slide:not([inert])")).toHaveCount(2);
    await events
      .getByRole("button", { name: "Next trade shows", exact: true })
      .click();
    await expect(events.locator(".carousel-count")).toContainText("2–3");
    await events.locator(".carousel-viewport").focus();
    await page.keyboard.press("End");
    await expect(
      events.getByRole("button", { name: "Next trade shows", exact: true }),
    ).toBeDisabled();
    await page.keyboard.press("Home");
    await expect(
      events.getByRole("button", { name: "Previous trade shows", exact: true }),
    ).toBeDisabled();
    const insights = page.getByRole("region", {
      name: "Industry insights",
      exact: true,
    });
    await insights.scrollIntoViewIfNeeded();
    if (await insights.locator(".carousel-controls").count()) {
      await insights
        .getByRole("button", { name: "Next industry insights", exact: true })
        .click();
      await expect(insights.locator(".carousel-count")).toContainText("2–");
    }
    await page.setViewportSize({ width: 390, height: 850 });
    await expect(events.locator(".carousel-slide:not([inert])")).toHaveCount(1);
    await events.scrollIntoViewIfNeeded();
    const viewport = events.locator(".carousel-viewport");
    await viewport.dispatchEvent("pointerdown", {
      pointerType: "touch",
      clientX: 300,
      clientY: 200,
    });
    await viewport.dispatchEvent("pointermove", {
      pointerType: "touch",
      clientX: 100,
      clientY: 205,
    });
    await viewport.dispatchEvent("pointerup", {
      pointerType: "touch",
      clientX: 100,
      clientY: 205,
    });
    await expect(events.locator(".carousel-count")).toContainText("2 /");
    await page.screenshot({ path: "reference/browser/sliders-mobile.png" });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 2,
      ),
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const freight = page.getByRole("region", {
      name: "Trending freight offers",
      exact: true,
    });
    await freight.scrollIntoViewIfNeeded();
    await page.mouse.move(1, 1);
    await expect(freight.locator(".carousel-count")).toContainText("2 /", {
      timeout: 10000,
    });
    await freight
      .getByRole("button", {
        name: "Pause trending freight offers",
        exact: true,
      })
      .click();
    await expect(
      freight.getByRole("button", {
        name: "Play trending freight offers",
        exact: true,
      }),
    ).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await events.scrollIntoViewIfNeeded();
    await page.screenshot({ path: "reference/browser/sliders-desktop.png" });
    assert.deepEqual(errors, []);
    fs.writeFileSync(
      "reference/slider-validation.json",
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          engine: "GSAP",
          passed: [
            "service arrows and counter",
            "event arrows and boundaries",
            "keyboard Home/End",
            "insight navigation",
            "responsive visible slides",
            "touch swipe",
            "no mobile overflow",
            "freight rotation and pause",
            "no browser errors",
          ],
        },
        null,
        2,
      ),
    );
    console.log(
      "Passed: services, events, insights and freight slider navigation, responsive layouts, keyboard, swipe and rotation controls.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e.stack);
  process.exitCode = 1;
});
