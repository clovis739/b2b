const { chromium, expect } = require("@playwright/test");
const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const fs = require("node:fs");
const origin = process.env.SITE_CHECK_URL;
if (!origin || !/^http:\/\/(localhost|127\.0\.0\.1):/.test(origin))
  throw new Error("Use the isolated local server after check:trade.");
const password = "Browser-test-password!2026",
  id = randomUUID().slice(0, 8),
  buyerEmail = `ui-buyer-${id}@example.test`,
  supplierEmail = `ui-supplier-${id}@example.test`,
  title = `Browser test onions ${id}`,
  rfqTitle = `Browser test RFQ ${id}`;
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const contexts = [],
    errors = [];
  let checks = 0;
  async function client() {
    const c = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    contexts.push(c);
    await c.addInitScript(() =>
      localStorage.setItem("globy-cookie-choice", "rejected"),
    );
    const p = await c.newPage();
    p.setDefaultTimeout(15000);
    p.on("pageerror", (e) => errors.push(e.message));
    return p;
  }
  async function goto(page, path) {
    await page.goto(origin + path);
    await expect(page.getByRole("main")).toBeVisible();
    if(["/trade","/workspace/trading","/workspace/messages","/workspace/moderation"].includes(path))await expect(page.getByRole("status").filter({hasText:"Loading trading workspace"})).toHaveCount(0);
  }
  async function login(page, email, pass = password) {
    await goto(page, "/auth/sign-in");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(pass);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("**/workspace");
    checks++;
  }
  async function api(page, path, data) {
    const r = await page.request.post(origin + path, {
      headers: { Origin: origin },
      data,
    });
    assert.equal(r.status(), 200, await r.text());
    return r.json();
  }
  async function create(page, kind, itemTitle) {
    await goto(page, "/workspace/trading");
    await page.getByRole("button", { name: "Create listing or RFQ" }).click();
    const form = page.locator(".trade-editor");
    await form.getByLabel("Submission type").selectOption(kind);
    await form.getByLabel("Title", { exact: true }).fill(itemTitle);
    await form
      .getByLabel("Description", { exact: true })
      .fill(
        "Synthetic browser workflow listing for fresh produce, packed in mesh bags.",
      );
    await form.getByLabel("Category", { exact: true }).fill("Vegetables");
    await form.getByLabel("Country", { exact: true }).fill("Nigeria");
    await form.getByLabel("Quantity", { exact: true }).fill("20");
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Submit for moderation" }).click();
    await expect(
      page.getByRole("status").filter({ hasText: "Submitted for moderation" }),
    ).toBeVisible();
    await expect(
      page
        .locator(".trade-card")
        .filter({ hasText: itemTitle })
        .locator(".trade-status"),
    ).toHaveText("pending");
    checks++;
  }
  try {
    const buyer = await client(),
      supplier = await client(),
      admin = await client();
    await goto(buyer, "/auth/sign-up/buyer");
    await buyer.getByLabel("Your name").fill("Browser test buyer");
    await buyer.getByLabel("Email", { exact: true }).fill(buyerEmail);
    await buyer.getByLabel("Password", { exact: true }).fill(password);
    await buyer.getByRole("checkbox").check();
    await buyer
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await buyer.waitForURL("**/workspace");
    await goto(buyer, "/workspace/settings");
    await buyer.getByRole("button", { name: "Open test mailbox" }).click();
    await buyer.getByRole("link", { name: "Open secure link" }).first().click();
    await buyer
      .getByRole("button", { name: "Verify email", exact: true })
      .click();
    await expect(
      buyer.getByRole("status").filter({ hasText: "Email verified" }),
    ).toBeVisible();
    checks++;
    await api(supplier, "/api/auth/register", {
      name: "Browser test supplier",
      email: supplierEmail,
      password,
      role: "supplier",
      terms: true,
    });
    const mailbox = await supplier.request.get(origin + "/api/test-mailbox");
    const mail = await mailbox.json();
    const token = mail.messages[0].content.match(/#token=([a-f0-9]{64})/)[1];
    await api(supplier, "/api/auth/verify-email", { token });
    await create(supplier, "product", title);
    await create(buyer, "rfq", rfqTitle);
    await login(admin, "moderator@example.test", "Test-only-passphrase!2042");
    await goto(admin, "/workspace/moderation");
    for (const t of [title, rfqTitle]) {
      const card = admin.locator(".trade-card").filter({ hasText: t });
      await card.getByLabel("Decision").selectOption("approved");
      await card.getByRole("button", { name: "Submit decision" }).click();
      await expect(card).toHaveCount(0);
      checks++;
    }
    await goto(buyer, "/trade");
    let card = buyer.locator(".trade-card").filter({ hasText: title });
    await card.locator("summary").click();
    await card
      .getByLabel("Message", { exact: true })
      .fill("Please quote for 20 metric tons in mesh bags.");
    await card.getByRole("button", { name: "Send to member inbox" }).click();
    await buyer.waitForURL("**/workspace/messages?conversation=*");
    await expect(buyer.locator(".trade-message")).toContainText([
      "Please quote for 20 metric tons",
    ]);
    checks++;
    await goto(supplier, "/workspace/messages");
    await supplier
      .locator(".trade-threads")
      .getByRole("button", { name: new RegExp(title) })
      .click();
    await supplier
      .getByLabel("Message", { exact: true })
      .fill("We can supply your request within seven days.");
    await supplier.getByLabel("Quote amount (optional)").fill("6500");
    await supplier.getByLabel("Currency").selectOption("USD");
    await supplier
      .getByRole("button", { name: "Send to member inbox" })
      .click();
    await expect(supplier.locator(".trade-quote")).toContainText("USD 6,500");
    checks++;
    await buyer.reload();
    await expect(buyer.locator(".trade-quote")).toContainText("USD 6,500");
    await goto(supplier, "/trade");
    card = supplier.locator(".trade-card").filter({ hasText: rfqTitle });
    await card.locator("summary").click();
    await card
      .getByLabel("Message", { exact: true })
      .fill("We can fulfill this sourcing request.");
    await card.getByLabel("Quote amount (optional)").fill("7200");
    await card.getByRole("button", { name: "Send to member inbox" }).click();
    await supplier.waitForURL("**/workspace/messages?conversation=*");
    await expect(supplier.locator(".trade-quote")).toContainText("USD 7,200");
    checks++;
    fs.mkdirSync("reference/browser", { recursive: true });
    await goto(buyer, "/trade");
    await buyer.screenshot({
      path: "reference/browser/trade-desktop.png",
      fullPage: true,
    });
    for (const width of [1440, 390]) {
      await buyer.setViewportSize({ width, height: 950 });
      for (const path of [
        "/trade",
        "/workspace/trading",
        "/workspace/messages",
        "/workspace/settings",
        "/auth/verify-email",
        "/auth/reset-password",
      ]) {
        await goto(buyer, path);
        await expect
          .poll(
            () =>
              buyer.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth + 1,
              ),
            { message: `No overflow ${path} at ${width}` },
          )
          .toBe(true);
        checks++;
      }
      if (width === 390) {
        await goto(buyer, "/trade");
        await buyer.screenshot({
          path: "reference/browser/trade-mobile.png",
          fullPage: true,
        });
      }
    }
    await buyer.setViewportSize({ width: 1440, height: 1000 });
    await goto(buyer, "/auth/sign-in/reset-password");
    await expect(buyer.getByLabel("Email", { exact: true })).toHaveValue(buyerEmail);
    await buyer.getByRole("button", { name: "Request recovery link" }).click();
    await expect(
      buyer
        .getByRole("status")
        .filter({ hasText: "Recovery request recorded" }),
    ).toBeVisible();
    await goto(buyer, "/workspace/settings");
    await buyer.getByRole("button", { name: "Open test mailbox" }).click();
    await buyer
      .locator(".test-mailbox article")
      .filter({ hasText: "Reset your Vantora password" })
      .getByRole("link")
      .click();
    await buyer
      .getByLabel("New password", { exact: true })
      .fill(password + "-new");
    await buyer.getByLabel("Confirm new password").fill(password + "-new");
    await buyer
      .getByRole("button", { name: "Set new password", exact: true })
      .click();
    await expect(
      buyer.getByRole("status").filter({ hasText: "Password updated" }),
    ).toBeVisible();
    await login(buyer, buyerEmail, password + "-new");
    checks++;
    await goto(buyer, "/workspace/settings");
    await buyer
      .getByRole("button", { name: "Delete my account", exact: true })
      .click();
    await buyer.getByLabel("Confirm account email").fill(buyerEmail);
    await buyer
      .getByLabel("Current password", { exact: true })
      .fill(password + "-new");
    await buyer.locator(".security-panel").getByRole("checkbox").check();
    await buyer
      .getByRole("button", { name: "Permanently delete account" })
      .click();
    await expect(
      buyer.getByRole("button", { name: "Delete my account", exact: true }),
    ).toHaveCount(0);
    checks++;
    assert.deepEqual(errors, [], "No browser runtime errors");
    fs.writeFileSync(
      "reference/trade-browser-validation.json",
      JSON.stringify(
        {
          passed: true,
          checks,
          viewports: [1440, 390],
          runtimeErrors: errors,
          flows: [
            "registration",
            "test email verification",
            "product and RFQ publication",
            "admin review",
            "buyer inquiry",
            "supplier quote",
            "RFQ quote",
            "password recovery",
            "account deletion",
          ],
        },
        null,
        2,
      ),
    );
    console.log(`Passed ${checks} browser flow and responsive checks.`);
  } catch(error) { for(let i=0;i<contexts.length;i++){const p=contexts[i].pages()[0];if(p){await p.screenshot({path:`reference/browser/trade-failure-${i}.png`}).catch(()=>{});const text=await p.locator("main").innerText().catch(()=>"");console.error("Failure context",i,text.slice(0,2500));}} throw error;
  } finally {
    for (const c of contexts) await c.close();
    await browser.close();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
