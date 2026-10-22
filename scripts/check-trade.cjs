const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const origin = process.env.SITE_CHECK_URL,
  dbPath = process.env.SITE_TEST_DB;
if (!origin || !dbPath || !/^https?:\/\/(localhost|127\.0\.0\.1):/.test(origin))
  throw new Error(
    "Use an isolated local QA server with SITE_CHECK_URL and SITE_TEST_DB.",
  );
const password = "Test-only-passphrase!2042";
let checks = 0,
  database;
async function call(path, method = "GET", data, cookie = "", expected = 200) {
  const r = await fetch(origin + path, {
    method,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  const body = await r.json();
  assert.equal(
    r.status,
    expected,
    `${method} ${path}: ${JSON.stringify(body)}`,
  );
  checks++;
  return { body, cookie: r.headers.get("set-cookie")?.split(";")[0] };
}
const auth = (action, data, cookie, status = 200) =>
  call("/api/auth/" + action, "POST", data, cookie, status);
const trade = (data, cookie, status = 200) =>
  call("/api/trade", "POST", data, cookie, status);
async function register(role, email = `trade-${randomUUID()}@example.test`) {
  const r = await auth("register", {
    role,
    email,
    password,
    name: role === "supplier" ? "Test supplier" : "Test buyer",
    terms: true,
  });
  return { email, id: r.body.user.id, cookie: r.cookie };
}
async function tokenFor(user, purpose = "verify") {
  const result = await call("/api/test-mailbox", "GET", undefined, user.cookie);
  assert.ok(
    result.body.messages.every(
      (m) => !m.content.includes("live-mailbox-secret"),
    ),
  );
  const m = result.body.messages.find((m) =>
    m.subject.includes(purpose === "verify" ? "Verify" : "Reset"),
  );
  assert.ok(m, "A private test email should exist");
  return m.content.match(/#token=([a-f0-9]{64})/)[1];
}
async function verify(user) {
  const token = await tokenFor(user);
  await auth("verify-email", { token }, user.cookie);
  await auth("verify-email", { token }, user.cookie, 400);
  assert.equal(
    (await call("/api/workspace", "GET", undefined, user.cookie)).body.user
      .emailVerified,
    true,
  );
}
const fields = {
  description:
    "Synthetic test produce, created only for local workflow verification.",
  category: "Vegetables",
  country: "Nigeria",
  quantity: "20",
  price: "USD 325 per metric ton",
  unit: "Metric ton",
};
async function main() {
  const buyer = await register("buyer"),
    supplier = await register("supplier"),
    other = await register("buyer");
  const admin = await register(
    "buyer",
    process.env.SITE_TEST_ADMIN || "moderator@example.test",
  );
  database = new DatabaseSync(dbPath);
  database.exec("PRAGMA foreign_keys=ON;PRAGMA busy_timeout=5000;");
  assert.equal(
    (await call("/api/workspace", "GET", undefined, admin.cookie)).body.user
      .isAdmin,
    true,
    "QA administrator must be explicitly allowlisted",
  );
  await trade(
    { action: "create", kind: "product", title: "Unverified", fields },
    supplier.cookie,
    403,
  );
  await call("/api/test-mailbox", "GET", undefined, "", 401);
  const supplierMail = await tokenFor(supplier);
  const buyerMail = await call(
    "/api/test-mailbox",
    "GET",
    undefined,
    buyer.cookie,
  );
  assert.ok(
    !JSON.stringify(buyerMail.body).includes(supplierMail),
    "Other members cannot read tokens",
  );
  for (const u of [buyer, supplier, other, admin]) await verify(u);
  await trade(
    {
      action: "create",
      kind: "product",
      title: "Buyer cannot publish products",
      fields,
    },
    buyer.cookie,
    403,
  );
  await trade(
    {
      action: "create",
      kind: "product",
      title: "Invalid product",
      fields: { ...fields, description: "short" },
    },
    supplier.cookie,
    400,
  );
  const product = (
    await trade(
      {
        action: "create",
        kind: "product",
        title: "Test export onions",
        fields,
      },
      supplier.cookie,
    )
  ).body.id;
  const rfq = (
    await trade(
      {
        action: "create",
        kind: "rfq",
        title: "Test bulk onion request",
        fields,
      },
      buyer.cookie,
    )
  ).body.id;
  assert.ok(
    !(await call("/api/trade")).body.listings.some((l) => l.id === product),
    "Pending listings are not public",
  );
  await call("/api/trade?id=" + product, "GET", undefined, "", 404);
  await call(
    "/api/trade?scope=moderation",
    "GET",
    undefined,
    buyer.cookie,
    403,
  );
  await trade(
    { action: "moderate", id: product, status: "approved", updatedAt: 0 },
    supplier.cookie,
    403,
  );
  await trade(
    { action: "edit", id: product, kind: "rfq", title: "Hijacked", fields },
    other.cookie,
    404,
  );
  async function moderate(id, status = "approved", note = "") {
    const queue = (
      await call("/api/trade?scope=moderation", "GET", undefined, admin.cookie)
    ).body.listings;
    const listing = queue.find((l) => l.id === id);
    assert.ok(listing);
    return trade(
      { action: "moderate", id, status, note, updatedAt: listing.updated_at },
      admin.cookie,
    );
  }
  await moderate(product);
  await moderate(rfq);
  assert.ok(
    (await call("/api/trade")).body.listings.some((l) => l.id === product),
  );
  await trade(
    {
      action: "moderate",
      id: product,
      status: "rejected",
      note: "Already reviewed",
      updatedAt: 0,
    },
    admin.cookie,
    409,
  );
  await trade(
    { action: "inquire", id: product, content: "Self inquiry" },
    supplier.cookie,
    400,
  );
  await trade(
    { action: "inquire", id: rfq, content: "Buyer cannot quote" },
    other.cookie,
    403,
  );
  const thread = (
    await trade(
      {
        action: "inquire",
        id: product,
        content: "Can you supply 20 metric tons?",
      },
      buyer.cookie,
    )
  ).body.conversationId;
  const reply = (
    await trade(
      {
        action: "message",
        id: thread,
        content: "Yes. Shipment within seven days.",
        quoteAmount: 6500,
        currency: "USD",
      },
      supplier.cookie,
    )
  ).body;
  assert.equal(reply.conversationId, thread);
  const messages = (
    await call(
      "/api/trade?scope=messages&id=" + thread,
      "GET",
      undefined,
      buyer.cookie,
    )
  ).body.messages;
  assert.equal(messages.length, 2);
  assert.equal(messages[1].quote_amount, 6500);
  await call(
    "/api/trade?scope=messages&id=" + thread,
    "GET",
    undefined,
    other.cookie,
    404,
  );
  await trade(
    { action: "message", id: thread, content: "Unauthorized message" },
    other.cookie,
    404,
  );
  await trade(
    {
      action: "message",
      id: thread,
      content: "Invalid quote",
      quoteAmount: -1,
      currency: "USD",
    },
    supplier.cookie,
    400,
  );
  await trade(
    {
      action: "message",
      id: thread,
      content: "Invalid currency",
      quoteAmount: 1,
      currency: "ABC",
    },
    supplier.cookie,
    400,
  );
  await trade(
    {
      action: "message",
      id: thread,
      content: "Buyer quote forbidden",
      quoteAmount: 1,
      currency: "USD",
    },
    buyer.cookie,
    403,
  );
  const quoteThread = (
    await trade(
      {
        action: "inquire",
        id: rfq,
        content: "We can supply this request.",
        quoteAmount: 6200,
        currency: "USD",
      },
      supplier.cookie,
    )
  ).body.conversationId;
  assert.notEqual(thread, quoteThread);
  const repeated = (
    await trade(
      {
        action: "inquire",
        id: product,
        content: "What packaging is available?",
      },
      buyer.cookie,
    )
  ).body.conversationId;
  assert.equal(
    repeated,
    thread,
    "Repeated inquiries reuse the existing conversation",
  );
  await trade(
    {
      action: "edit",
      id: product,
      kind: "product",
      title: "Updated test export onions",
      fields,
    },
    supplier.cookie,
  );
  await call("/api/trade?id=" + product, "GET", undefined, "", 404);
  await moderate(product, "rejected", "Add packaging details");
  assert.equal(
    (
      await call(
        "/api/trade?scope=workspace",
        "GET",
        undefined,
        supplier.cookie,
      )
    ).body.listings.find((l) => l.id === product).review_note,
    "Add packaging details",
  );
  await trade(
    {
      action: "edit",
      id: product,
      kind: "product",
      title: "Updated test export onions",
      fields: {
        ...fields,
        description: fields.description + " Packed in mesh bags.",
      },
    },
    supplier.cookie,
  );
  await moderate(product);
  await trade({ action: "withdraw", id: product }, buyer.cookie, 404);
  await trade({ action: "withdraw", id: product }, supplier.cookie);
  await call("/api/trade?id=" + product, "GET", undefined, "", 404);
  const own = (
    await trade(
      {
        action: "create",
        kind: "rfq",
        title: "Moderator own submission",
        fields,
      },
      admin.cookie,
    )
  ).body.id;
  const ownListing = (
    await call("/api/trade?scope=moderation", "GET", undefined, admin.cookie)
  ).body.listings.find((l) => l.id === own);
  await trade(
    {
      action: "moderate",
      id: own,
      status: "approved",
      updatedAt: ownListing.updated_at,
    },
    admin.cookie,
    403,
  );
  // Recovery: hashed token at rest, one-time, expires, invalidates all sessions.
  await auth("request-reset", { email: buyer.email });
  const token = await tokenFor(buyer, "reset");
  assert.ok(
    !database
      .prepare(
        "SELECT token_hash FROM account_tokens WHERE user_id=? AND purpose=?",
      )
      .get(buyer.id, "reset")
      .token_hash.includes(token),
  );
  await auth("reset-password", { token, password: "short" }, "", 400);
  await auth("reset-password", { token, password: password + "-new" });
  await auth("reset-password", { token, password: password + "-new" }, "", 400);
  assert.equal(
    (await call("/api/workspace", "GET", undefined, buyer.cookie)).body.user,
    null,
  );
  buyer.cookie = (
    await auth("login", { email: buyer.email, password: password + "-new" })
  ).cookie;
  await auth("request-reset", { email: buyer.email });
  const expired = await tokenFor(buyer, "reset");
  database
    .prepare(
      "UPDATE account_tokens SET expires_at=0 WHERE user_id=? AND purpose='reset'",
    )
    .run(buyer.id);
  await auth(
    "reset-password",
    { token: expired, password: password + "-new" },
    "",
    400,
  );
  const known = await auth("request-reset", { email: buyer.email }),
    unknown = await auth("request-reset", {
      email: "unknown-" + randomUUID() + "@example.test",
    });
  assert.equal(known.body.message, unknown.body.message);
  await auth(
    "delete-account",
    { confirmEmail: buyer.email, password: "wrong" },
    buyer.cookie,
    400,
  );
  await auth(
    "delete-account",
    { confirmEmail: buyer.email, password: password + "-new" },
    buyer.cookie,
  );
  assert.equal(
    (await call("/api/workspace", "GET", undefined, buyer.cookie)).body.user,
    null,
  );
  for (const table of [
    "sessions",
    "workspaces",
    "account_tokens",
    "mail_outbox",
    "account_security",
  ])
    assert.equal(
      database
        .prepare(`SELECT count(*) AS n FROM ${table} WHERE user_id=?`)
        .get(buyer.id).n,
      0,
      table + " must cascade",
    );
  assert.equal(
    database
      .prepare("SELECT count(*) AS n FROM listings WHERE owner_id=?")
      .get(buyer.id).n,
    0,
  );
  assert.equal(
    database
      .prepare(
        "SELECT count(*) AS n FROM messages WHERE conversation_id IN (?,?)",
      )
      .get(thread, quoteThread).n,
    0,
  );
  await call(
    "/api/trade?scope=messages&id=" + thread,
    "GET",
    undefined,
    supplier.cookie,
    404,
  );
  const report = {
    passed: true,
    checks,
    flows: [
      "private test mailboxes",
      "verification gates and one-time links",
      "supplier products and buyer RFQs",
      "pending-public separation",
      "admin allowlist and review audit",
      "owner-only editing and withdrawal",
      "resubmission after rejection",
      "private inquiry/reply/quote threads",
      "invalid quote rejection",
      "password recovery, expiry and session revocation",
      "account deletion with cascades",
    ],
    externalEmailsSent: 0,
  };
  fs.mkdirSync("reference", { recursive: true });
  fs.writeFileSync(
    "reference/trade-validation.json",
    JSON.stringify(report, null, 2),
  );
  console.log(
    `Passed ${checks} trading/account API checks. No external emails sent.`,
  );
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => database?.close());
