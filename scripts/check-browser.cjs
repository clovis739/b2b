const { chromium, expect } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const origin = process.env.SITE_CHECK_URL;
if (!origin) throw new Error("Set SITE_CHECK_URL to an isolated QA server.");
const artifacts = path.join(__dirname, "../reference/browser");
fs.mkdirSync(artifacts, { recursive: true });
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  page.setDefaultNavigationTimeout(20000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const goto = async (url) => {
    console.log("Checking " + url);
    await page.goto(origin + url);
    await page.getByRole("main").waitFor();
  };
  try {
    await goto("/");
    await page
      .getByRole("button", { name: "Reject optional", exact: true })
      .click();
    await page.screenshot({ path: path.join(artifacts, "home-desktop.png") });
    if (!process.env.RESPONSIVE_ONLY) {
      await page
        .getByRole("button", { name: "Freight", exact: true })
        .first()
        .click();
      await expect(
        page.getByRole("combobox", { name: "Freight origin" }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Products", exact: true })
        .first()
        .click();
      await page
        .getByRole("textbox", {
          name: "Search products and suppliers",
          exact: true,
        })
        .fill("rice");
      await page
        .locator(".clone-main-search")
        .getByRole("button", { name: "Search", exact: true })
        .click();
      await expect(page).toHaveURL(/b2bmarket\/search\?q=rice/);
      await expect(page.locator(".site-product").first()).toBeVisible();
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Guest workspace",
      );
      await page.locator(".favorite").first().click();
      await goto("/saved-products");
      await expect(page.locator(".site-product")).toHaveCount(1);
      await goto("/contact-us");
      await page.getByLabel("Contact name", { exact: true }).fill("QA guest");
      await page
        .getByLabel("Business email", { exact: true })
        .fill("guest@example.test");
      await page
        .getByLabel("Topic", { exact: true })
        .selectOption({ label: "Feedback" });
      await page
        .getByLabel("Subject", { exact: true })
        .fill("QA sourcing question");
      await page
        .getByLabel("Your message", { exact: true })
        .fill("Please prepare a useful sourcing response for this test.");
      await page.locator(".workflow-form button.primary").click();
      await expect(
        page.getByRole("status").filter({ hasText: "Draft saved" }),
      ).toBeVisible();
      await goto("/workspace/inquiries");
      await expect(page.locator(".draft-card")).toHaveCount(1);
      await page.getByRole("button", { name: "Edit", exact: true }).click();
      await page
        .getByLabel("Draft title", { exact: true })
        .fill("Edited sourcing question");
      await page
        .getByRole("button", { name: "Save changes", exact: true })
        .click();
      await expect(page.locator(".draft-card h3")).toHaveText(
        "Edited sourcing question",
      );
      await page.getByRole("button", { name: "Remove", exact: true }).click();
      await expect(page.locator(".draft-card")).toHaveCount(0);
      await page.getByRole("button", { name: "Undo", exact: true }).click();
      await expect(page.locator(".draft-card")).toHaveCount(1);
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        page.getByRole("button", { name: "Download", exact: true }).click(),
      ]);
      assert.match(download.suggestedFilename(), /globy-contact/);
      await goto("/auth/sign-up/buyer");
      await page.screenshot({
        path: path.join(artifacts, "registration-desktop.png"),
      });
      const email = `browser-${randomUUID()}@example.test`;
      const password = "Browser-test-passphrase!24";
      await page
        .getByLabel("Your name", { exact: true })
        .fill("QA browser buyer");
      await page.getByLabel("Email", { exact: true }).fill(email);
      await page.getByLabel("Password", { exact: true }).fill(password);
      await page
        .getByRole("button", { name: "Show password", exact: true })
        .click();
      await expect(page.locator('input[name="password"]')).toHaveAttribute(
        "type",
        "text",
      );
      await page.locator('input[name="terms"]').check();
      await page
        .getByRole("button", { name: "Create account", exact: true })
        .click();
      await expect(page).toHaveURL(origin + "/workspace");
      await expect(page.locator(".draft-card")).toHaveCount(0);
      const imported = page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/workspace") &&
          response.request().method() === "PUT",
      );
      await page
        .getByRole("button", {
          name: "Copy guest drafts to my account",
          exact: true,
        })
        .click();
      assert.equal((await imported).status(), 200);
      await expect(page.locator(".draft-card")).toHaveCount(1);
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Saved to your account",
      );
      await page.reload();
      await expect(page.locator(".draft-card h3")).toHaveText(
        "Edited sourcing question",
      );
      await goto("/b2bmarket/search?q=rice");
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Saved to your account",
      );
      const favoriteSaved = page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/workspace") &&
          response.request().method() === "PUT",
      );
      await page.locator(".favorite").first().click();
      assert.equal((await favoriteSaved).status(), 200);
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Saved to your account",
      );
      await goto("/workspace/settings");
      await page
        .getByLabel("Display name", { exact: true })
        .fill("Updated QA buyer");
      await page
        .getByRole("button", { name: "Save profile", exact: true })
        .click();
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Updated QA buyer",
      );
      await page.getByRole("button", { name: "Sign out", exact: true }).click();
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Guest workspace",
      );
      await goto("/auth/sign-in");
      await page.getByLabel("Email", { exact: true }).fill(email);
      await page.getByLabel("Password", { exact: true }).fill("wrong-password");
      await page
        .locator(".auth-form")
        .getByRole("button", { name: "Sign in", exact: true })
        .click();
      await expect(page.locator(".auth-form #auth-error")).toContainText(
        "Email or password is incorrect",
      );
      await page.getByLabel("Password", { exact: true }).fill(password);
      await page
        .locator(".auth-form")
        .getByRole("button", { name: "Sign in", exact: true })
        .click();
      await expect(page).toHaveURL(origin + "/workspace");
      await expect(page.locator(".draft-card")).toHaveCount(1);
      await goto("/saved-products");
      await expect(page.locator(".site-product")).toHaveCount(1);
      await goto("/rfqs/add-rfq");
      await page
        .locator('input[name="product"]')
        .fill("QA onion sourcing request");
      await expect(
        page.getByLabel("Product category", { exact: true }),
      ).toBeDisabled();
      await page
        .getByLabel("Product sector", { exact: true })
        .selectOption("agriculture");
      await page
        .getByLabel("Product category", { exact: true })
        .selectOption({ label: "Vegetables" });
      await page
        .locator('textarea[name="message"]')
        .fill("Export grade onions, packed in ventilated 25 kg mesh bags.");
      await page.getByLabel("Required quantity", { exact: true }).fill("20");
      await page
        .getByLabel("Unit", { exact: true })
        .selectOption("Metric tons");
      await page
        .getByLabel("Destination country", { exact: true })
        .fill("Nigeria");
      await page
        .getByLabel("Destination port / city", { exact: true })
        .fill("Apapa");
      await page
        .getByLabel("Preferred delivery terms", { exact: true })
        .selectOption("CIF");
      await page.getByLabel("Contact name", { exact: true }).fill("QA buyer");
      await page
        .getByLabel("Business email", { exact: true })
        .fill("qa@example.test");
      await page.getByLabel("Company name", { exact: true }).fill("QA Trading");
      await page.getByLabel("Company country", { exact: true }).fill("Nigeria");
      const requestSaved = page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/workspace") &&
          response.request().method() === "PUT",
      );
      await page
        .getByRole("button", { name: "Save RFQ draft", exact: true })
        .click();
      assert.equal((await requestSaved).status(), 200);
      await goto("/workspace/inquiries");
      await expect(page.locator(".draft-card")).toHaveCount(2);
      const accountData = await (
        await context.request.get(origin + "/api/workspace")
      ).json();
      const rfq = accountData.drafts.find(
        (draft) => draft.title === "QA onion sourcing request",
      );
      assert.equal(rfq.fields.quantity, "20");
      assert.equal(rfq.fields.unit, "Metric tons");
      assert.equal(rfq.fields.deliveryTerms, "CIF");
      await goto("/b2bmarket/search?q=rice");
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Saved to your account",
      );
      await page.route("**/api/workspace", (route) =>
        route.request().method() === "PUT"
          ? route.fulfill({
              status: 401,
              contentType: "application/json",
              body: JSON.stringify({
                error: "Your session expired. Sign in before saving again.",
              }),
            })
          : route.continue(),
      );
      await page.locator(".favorite").first().click();
      await expect(page.locator(".workspace-status:visible")).toContainText(
        "Your session expired",
      );
      await page.unroute("**/api/workspace");
      await page
        .getByRole("link", {
          name: "Sign in again to save your changes",
          exact: true,
        })
        .click();
      await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
        email,
      );
      await page.getByLabel("Password", { exact: true }).fill(password);
      const resumedSave = page.waitForResponse(
        (response) =>
          response.url().endsWith("/api/workspace") &&
          response.request().method() === "PUT",
      );
      await page
        .locator(".auth-form:visible")
        .getByRole("button", { name: "Sign in", exact: true })
        .click();
      assert.equal((await resumedSave).status(), 200);
      await expect(page).toHaveURL(origin + "/workspace");
      await expect(page.locator(".draft-card:visible")).toHaveCount(2);
      const resumed = await (
        await context.request.get(origin + "/api/workspace")
      ).json();
      assert.deepEqual(resumed.saved, []);
    }
    const coverage = require("../reference/page-type-validation.json").coverage;
    const results = [];
    const overflows = [];
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const item of coverage) {
        await goto(item.example);
        await page.getByRole("heading", { level: 1 }).first().waitFor();
        const overflow = await page.evaluate(() => ({
          width: innerWidth,
          content: document.documentElement.scrollWidth,
          offenders: [...document.querySelectorAll("main *")]
            .filter((e) => e.getBoundingClientRect().right > innerWidth + 2)
            .slice(0, 6)
            .map((e) => e.tagName + "." + e.className),
        }));
        if (overflow.content > width + 2) {
          overflows.push(
            `${item.kind} at ${width}px: ${JSON.stringify(overflow)}`,
          );
          await page.screenshot({
            path: path.join(artifacts, `overflow-${item.kind}-${width}.png`),
          });
        }
        results.push({
          kind: item.kind,
          width,
          overflow: overflow.content > width + 2,
        });
        if (["home", "request-form", "workspace", "load"].includes(item.kind))
          await page.screenshot({
            path: path.join(artifacts, `${item.kind}-${width}.png`),
          });
      }
    }
    assert.deepEqual(
      overflows,
      [],
      "Pages must fit desktop and mobile viewports",
    );
    await goto("/webinars");
    const agendaTrigger = page.getByRole("button", { name: /View agenda & notes/i }).first();
    await agendaTrigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.getByRole('dialog').evaluate((dialog) => dialog.contains(document.activeElement)), true);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(agendaTrigger).toBeFocused();
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeVisible();
    assert.deepEqual(errors, [], "Browser runtime errors");
    fs.writeFileSync(
      path.join(__dirname, "../reference/browser-validation.json"),
      JSON.stringify(
        {
          checkedAt: new Date().toISOString(),
          interactions: process.env.RESPONSIVE_ONLY ? ["modal Escape and focus restore", "mobile menu"] : [
            "search tabs and query",
            "saved products",
            "guest drafts",
            "edit/remove/undo/export",
            "registration",
            "guest draft import",
            "account persistence",
            "profile update",
            "logout",
            "invalid/valid login",
            "RFQ category selection and persisted sourcing fields",
            "session recovery preserves unsaved changes",
            "modal Escape",
          ],
          responsiveChecks: results,
        },
        null,
        2,
      ),
    );
    console.log(
      process.env.RESPONSIVE_ONLY ? "Passed: 40 page types at desktop and mobile widths, modal keyboard access, mobile menu and no browser runtime errors." : "Passed: browser sourcing/account/draft flows, 40 page types at desktop and mobile widths, and no browser runtime errors.",
    );
  } catch (error) {
    await page
      .screenshot({ path: path.join(artifacts, "failure.png") })
      .catch(() => {});
    throw error;
  } finally {
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e.stack);
  process.exitCode = 1;
});
