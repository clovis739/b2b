const { chromium, expect } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const origin = process.env.SITE_CHECK_URL || "http://localhost:3020";
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors = [];
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.setDefaultNavigationTimeout(20000);
    page.on("pageerror", (e) => errors.push(e.message));
    console.log('Checking card hover and keyboard focus');
    await page.goto(origin + "/b2bmarket/search?q=rice");
    await page.getByRole('button',{name:'Reject optional',exact:true}).click();
    await expect(page.locator('.workspace-status:visible')).toContainText('Guest workspace');
    await expect(page.locator('.filter-search input')).toHaveValue('rice');
    await expect(page.locator(".motion-page[data-motion]")).toHaveAttribute(
      "data-motion",
      "active",
    );
    const card = page.locator(".site-product").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await expect
      .poll(() =>
        card.evaluate((e) =>
          parseFloat(getComputedStyle(e).getPropertyValue("--card-lift")),
        ),
      )
      .toBeLessThan(-5);
    await page.mouse.move(5, 5);
    await expect
      .poll(() =>
        card.evaluate((e) =>
          Math.abs(
            parseFloat(getComputedStyle(e).getPropertyValue("--card-lift")),
          ),
        ),
      )
      .toBeLessThan(0.1);
    await card.locator("a").first().focus();
    await page.keyboard.press('Tab');
    await expect
      .poll(() =>
        card.evaluate((e) =>
          parseFloat(getComputedStyle(e).getPropertyValue("--card-lift")),
        ),
      )
      .toBeLessThan(-5);
    console.log('Checking scroll reveals');
    await page.goto(origin + "/site-map");
    const last = page.locator(".page-type-card").last();
    await expect(last).toHaveAttribute("data-motion-reveal", "pending");
    await last.scrollIntoViewIfNeeded();
    await expect(last).toHaveAttribute("data-motion-reveal", "complete");
    await expect(
      page.getByRole("button", { name: "Back to top", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Back to top", exact: true })
      .click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(5);
    console.log('Checking anchor scrolling');
    await page.goto(origin + "/offers/cotton-fabric-rotterdam");
    await page.locator('a[href="#cargo-inquiry"]').click();
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.id))
      .toBe("cargo-inquiry");
    await expect
      .poll(() =>
        page
          .locator("#cargo-inquiry")
          .evaluate((e) => Math.round(e.getBoundingClientRect().top)),
      )
      .toBeLessThan(110);
    console.log('Checking dialogs and reduced motion');
    await page.goto(origin + "/webinars");
    await page
      .getByRole("button", { name: /View agenda & notes/ })
      .first()
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".motion-page[data-motion]")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
    await page.goto(origin + "/b2bmarket/search?q=rice");
    await expect(page.locator(".motion-page[data-motion]")).toHaveAttribute(
      "data-motion",
      "reduced",
    );
    await page.locator(".site-product").first().hover();
    assert.equal(
      await page
        .locator(".site-product")
        .first()
        .evaluate((e) =>
          getComputedStyle(e).getPropertyValue("--card-lift").trim(),
        ),
      "",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".motion-page[data-motion]")).toHaveAttribute(
      "data-motion",
      "active",
    );
    assert.deepEqual(errors, []);
    await page.goto(origin+'/');
    await page.getByRole('tab',{name:'Freight Calculator',exact:true}).click();
    await expect(page.getByRole('tabpanel')).toContainText('Freight Calculator');
    await expect.poll(()=>page.getByRole('tabpanel').locator(':scope > div').first().evaluate(e=>getComputedStyle(e).opacity)).toBe('1');
    await page.locator('.clone-footer a[href="/about-us"]').first().click();
    await expect(page).toHaveURL(origin+'/about-us');
    await expect.poll(()=>page.locator('.motion-navigation-progress').evaluate(e=>getComputedStyle(e).opacity)).toBe('0');
    await page.screenshot({path:'reference/browser/motion-about-desktop.png'});
    fs.writeFileSync(
      "reference/motion-validation.json",
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          engine: "GSAP",
          passed: [
            "card hover/reset",
            "keyboard focus lift",
            "scroll reveal",
            "back to top",
            "anchor scrolling and focus",
            "dialog entrance/exit",
            "live reduced-motion changes",
            "no browser errors",
          "service panel transitions",
          "navigation progress resets",
          ],
        },
        null,
        2,
      ),
    );
    console.log(
      "Passed: GSAP hover, focus, scroll, dialog and reduced-motion checks.",
    );
    await context.close();
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e.stack);
  process.exitCode = 1;
});
