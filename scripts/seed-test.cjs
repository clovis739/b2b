const origin = process.env.SITE_CHECK_URL || "http://localhost:3003";
if (!/^http:\/\/(localhost|127\.0\.0\.1):/.test(origin))
  throw new Error("Test seeding is restricted to a local HTTP server.");
const password = "Marketplace-Test!2026";
async function request(path, data, cookie = "") {
  const r = await fetch(origin + path, {
    method: data ? "POST" : "GET",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
  return {
    status: r.status,
    body: await r.json(),
    cookie: r.headers.get("set-cookie")?.split(";")[0],
  };
}
async function requireOk(path, data, cookie) {
  const r = await request(path, data, cookie);
  if (r.status !== 200) throw new Error(`${path}: ${r.body.error}`);
  return r;
}
async function account(email, name, role) {
  let r = await request("/api/auth/register", {
    email,
    name,
    role,
    password,
    terms: true,
  });
  if (r.status === 409)
    r = await request("/api/auth/login", { email, password });
  if (r.status !== 200)
    throw new Error(
      `Could not create or sign into test account ${email}: ${r.body.error}`,
    );
  const cookie = r.cookie;
  if (!r.body.user.emailVerified) {
    await requireOk("/api/auth/send-verification", {}, cookie);
    const mail = await requireOk("/api/test-mailbox", undefined, cookie);
    const token = mail.body.messages
      .find((m) => m.subject.includes("Verify"))
      ?.content.match(/#token=([a-f0-9]{64})/)?.[1];
    if (!token) throw new Error("Test verification link unavailable.");
    await requireOk("/api/auth/verify-email", { token }, cookie);
  }
  return { cookie, email };
}
async function main() {
  const probe = await request("/api/test-mailbox");
  if (probe.status !== 401)
    throw new Error("MARKETPLACE_TEST_MODE must be enabled before seeding.");
  const admin = await account(
      "moderator@example.test",
      "Test moderator",
      "buyer",
    ),
    buyer = await account("buyer@example.test", "Test buyer", "buyer"),
    supplier = await account(
      "supplier@example.test",
      "Test supplier",
      "supplier",
    );
  const items = [
    {
      owner: supplier,
      kind: "product",
      title: "TEST — Export red onions",
      fields: {
        description:
          "Synthetic test listing for premium red onions, packed in 25 kg mesh bags. Created to demonstrate inquiries and supplier quotes.",
        category: "Vegetables",
        country: "Nigeria",
        quantity: "20",
        unit: "Metric ton",
        price: "USD 325 per metric ton",
      },
    },
    {
      owner: buyer,
      kind: "rfq",
      title: "TEST — Request for fresh potatoes",
      fields: {
        description:
          "Synthetic sourcing request for fresh potatoes. Please quote 40 metric tons with packaging specifications and estimated delivery times.",
        category: "Vegetables",
        country: "Nigeria",
        quantity: "40",
        unit: "Metric ton",
        price: "Requesting supplier quotations",
      },
    },
  ];
  for (const item of items) {
    const mine = await requireOk(
      "/api/trade?scope=workspace",
      undefined,
      item.owner.cookie,
    );
    if (!mine.body.listings.some((l) => l.title === item.title))
      await requireOk(
        "/api/trade",
        {
          action: "create",
          kind: item.kind,
          title: item.title,
          fields: item.fields,
        },
        item.owner.cookie,
      );
  }
  const queue = await requireOk(
    "/api/trade?scope=moderation",
    undefined,
    admin.cookie,
  );
  for (const l of queue.body.listings.filter((l) =>
    items.some((i) => i.title === l.title),
  ))
    await requireOk(
      "/api/trade",
      {
        action: "moderate",
        id: l.id,
        status: "approved",
        note: "Synthetic local testing content.",
        updatedAt: l.updated_at,
      },
      admin.cookie,
    );
  console.log(
    `Test marketplace ready at ${origin}/trade\nBuyer: buyer@example.test\nSupplier: supplier@example.test\nModerator: moderator@example.test\nShared TEST-ONLY password: ${password}\nAll messages remain in member inboxes; no external emails are sent.`,
  );
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
