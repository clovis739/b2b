const { chromium, expect } = require("@playwright/test");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const p = await browser.newPage({
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const origin = process.env.SITE_CHECK_URL || "http://localhost:3020";
  const results = [];
  try {
    await p.goto(origin + "/");
    await p.getByRole("button", { name: "Reject optional", exact: true }).tap();
    for (const [width, height] of [
      [320, 740],
      [375, 812],
      [430, 932],
      [768, 1024],
      [1024, 768],
      [844, 390],
    ]) {
      await p.setViewportSize({ width, height });
      await p.goto(origin + "/");
      const consent = p.getByRole("button", {
        name: "Reject optional",
        exact: true,
      });
      if (await consent.isVisible()) await consent.tap();
      const toggle = p.getByRole("button", { name: "Open menu", exact: true });
      await expect(toggle).toBeVisible();
      const size = await toggle.boundingBox();
      if (size.width < 44 || size.height < 44)
        throw Error("Small toggle " + width);
      await toggle.tap();
      const nav = p.getByRole("navigation", {
        name: "Main navigation",
        exact: true,
      });
      await expect(nav).toBeVisible();
      await expect(
        p.getByRole("button", { name: "Close menu", exact: true }),
      ).toHaveAttribute("aria-expanded", "true");
      await nav.locator(".categories-menu summary").tap();
      await nav.getByRole("link", { name: "View all", exact: true }).waitFor();
      const last = nav.locator(".mega-sector-grid a").last();
      await last.scrollIntoViewIfNeeded();
      await expect(last).toBeInViewport();
      if (await nav.evaluate((el) => el.scrollWidth > el.clientWidth + 1))
        throw Error("Menu horizontal overflow " + width);
      await nav.locator(".categories-menu summary").focus();
      await p.keyboard.press("Escape");
      await expect(nav.locator(".categories-menu")).not.toHaveAttribute(
        "open",
        "",
      );
      await expect(nav.locator(".categories-menu summary")).toBeFocused();
      await p.keyboard.press("Escape");
      await expect(toggle).toBeFocused();
      await expect(nav).toBeHidden();
      await toggle.tap();
      await nav.getByRole("link", { name: "Help Center", exact: true }).tap();
      await p.waitForURL("**/help-center");
      await expect(nav).toBeHidden();
      await toggle.tap();
      await p.setViewportSize({ width: 1280, height: 900 });
      await expect(p.locator(".clone-mobile-toggle")).toBeHidden();
      await p.setViewportSize({ width, height });
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      results.push({
        width,
        height,
        menu: true,
        touchTarget: true,
        scrollableCategories: true,
        escapeFocus: true,
        localNavigation: true,
        resizeReset: true,
      });
      console.log("Menu passed", width, height);
    }
    await p.setViewportSize({ width: 390, height: 844 });
    await p.goto(origin + "/rfqs/add-rfq");
    const small = await p
      .locator(
        "main input:not([type=checkbox]):not([type=radio]),main select,main textarea",
      )
      .evaluateAll((els) =>
        els
          .filter(
            (e) =>
              e.getBoundingClientRect().width > 0 &&
              parseFloat(getComputedStyle(e).fontSize) < 16,
          )
          .map((e) => e.name),
      );
    if (small.length) throw Error("Small mobile field text " + small);
    await p.screenshot({
      path: "reference/mobile-rfq-390.png",
      fullPage: true,
    });
    await p.goto(origin + "/");
    await p.getByRole("button", { name: "Open menu", exact: true }).tap();
    await p.screenshot({ path: "reference/mobile-menu-390.png" });
    const fresh = await browser.newPage({
      viewport: { width: 844, height: 390 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: "reduce",
    });
    await fresh.goto(origin + "/");
    const cookie = fresh.locator(".clone-cookie");
    await expect(cookie).toBeVisible();
    await fresh.getByRole("button", { name: "Settings", exact: true }).tap();
    const cookieBounds = await cookie.boundingBox();
    if (cookieBounds.y < 0 || cookieBounds.y + cookieBounds.height > 390)
      throw Error("Landscape cookie notice exceeds viewport");
    await fresh
      .getByRole("button", { name: "Reject optional", exact: true })
      .tap();
    await expect(cookie).toBeHidden();
    await fresh.close();
    fs.writeFileSync(
      "reference/mobile-menu-validation.json",
      JSON.stringify(
        { results, inputZoomPrevention: true, landscapeCookieControls: true },
        null,
        2,
      ),
    );
    console.log("Passed all mobile menu interactions and form sizing");
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
