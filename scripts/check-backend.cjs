const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const origin = process.env.SITE_CHECK_URL;
if (!origin || !process.env.SITE_TEST_DB)
  throw new Error(
    "Use an isolated QA server and set SITE_CHECK_URL and SITE_TEST_DB.",
  );
async function call(path, method = "GET", data, cookie = "", extra = {}) {
  const response = await fetch(origin + path, {
    method,
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      Cookie: cookie,
      ...extra,
    },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }),
  });
  return {
    response,
    status: response.status,
    body: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
  };
}
const auth = (action, data, cookie) =>
  call("/api/auth/" + action, "POST", data, cookie);
async function main() {
  assert.equal((await call("/api/workspace")).body.user, null);
  assert.equal(
    (
      await call("/api/workspace", "PUT", {
        drafts: [],
        saved: [],
        revision: 0,
      })
    ).status,
    401,
  );
  const email = `qa-${randomUUID()}@example.test`;
  const password = "QA-only-long-passphrase!24";
  assert.equal(
    (
      await auth("register", {
        email,
        password: "short",
        name: "QA",
        role: "buyer",
        terms: true,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await auth("register", {
        email,
        password,
        name: "QA",
        role: "admin",
        terms: true,
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await call("/api/auth/register", "POST", { email }, "", {
        Origin: "https://untrusted.example",
      })
    ).status,
    403,
  );
  const first = await auth("register", {
    email,
    password,
    name: "QA buyer",
    role: "buyer",
    terms: true,
  });
  assert.equal(first.status, 200);
  assert.match(first.response.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(first.response.headers.get("set-cookie"), /SameSite=Lax/i);
  assert.match(first.response.headers.get("cache-control"), /no-store/);
  assert.equal(first.body.user.role, "buyer");
  assert.equal(first.body.user.password_hash, undefined);
  assert.equal(
    (
      await auth("register", {
        email,
        password,
        name: "QA",
        role: "buyer",
        terms: true,
      })
    ).status,
    409,
  );
  assert.equal(
    (await auth("login", { email, password: "incorrect-password" })).status,
    401,
  );
  const login = await auth("login", { email: email.toUpperCase(), password });
  assert.equal(login.status, 200);
  const cookie = login.cookie;
  assert.equal(
    (await call("/api/workspace", "GET", undefined, cookie)).body.user.email,
    email,
  );
  const draft = {
    id: 1,
    title: "Rice request",
    type: "request-form",
    fields: {
      product: "Rice",
      quantity: "20",
      unit: "Metric tons",
      destination: "Nigeria",
    },
  };
  const snapshot = { drafts: [draft], saved: ["rice-test"], revision: 0 };
  assert.equal(
    (await call("/api/workspace", "PUT", snapshot, cookie)).status,
    200,
  );
  const stored = await call("/api/workspace", "GET", undefined, cookie);
  assert.deepEqual(stored.body.drafts, [draft]);
  assert.deepEqual(stored.body.saved, ["rice-test"]);
  assert.equal(stored.body.revision, 1);
  assert.equal(
    (await call("/api/workspace", "PUT", snapshot, cookie)).status,
    409,
  );
  assert.equal(
    (
      await call(
        "/api/workspace",
        "PUT",
        {
          ...snapshot,
          revision: 1,
          drafts: [{ ...draft, fields: { password: "must-never-be-stored" } }],
        },
        cookie,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await call(
        "/api/workspace",
        "PUT",
        { ...snapshot, revision: 1, drafts: [draft, draft] },
        cookie,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await call(
        "/api/workspace",
        "PUT",
        { ...snapshot, revision: 1, saved: [42] },
        cookie,
      )
    ).status,
    400,
  );
  const second = await auth("register", {
    email: `qa-${randomUUID()}@example.test`,
    password,
    name: "QA supplier",
    role: "supplier",
    terms: true,
  });
  assert.equal(second.status, 200);
  const other = await call("/api/workspace", "GET", undefined, second.cookie);
  assert.deepEqual(other.body.drafts, []);
  assert.deepEqual(other.body.saved, []);
  assert.notEqual(other.body.user.id, stored.body.user.id);
  assert.equal(
    (await auth("profile", { name: "Updated buyer" }, cookie)).status,
    200,
  );
  assert.equal(
    (await call("/api/workspace", "GET", undefined, cookie)).body.user.name,
    "Updated buyer",
  );
  // A separate database connection verifies disk persistence and hashed secrets.
  const database = new DatabaseSync(process.env.SITE_TEST_DB);
  const user = database.prepare("SELECT * FROM users WHERE email=?").get(email);
  assert.notEqual(user.password_hash, password);
  assert.match(user.password_hash, /^[a-f0-9]{32}:[a-f0-9]{128}$/);
  const session = database
    .prepare("SELECT token_hash FROM sessions WHERE user_id=?")
    .get(user.id);
  assert.notEqual(session.token_hash, cookie.split("=")[1]);
  assert.equal(
    JSON.parse(
      database
        .prepare("SELECT content FROM workspaces WHERE user_id=?")
        .get(user.id).content,
    ).drafts[0].fields.quantity,
    "20",
  );
  database
    .prepare("UPDATE sessions SET expires_at=0 WHERE user_id=?")
    .run(other.body.user.id);
  database.close();
  assert.equal(
    (await call("/api/workspace", "GET", undefined, second.cookie)).body.user,
    null,
  );
  assert.equal((await auth("logout", {}, cookie)).status, 200);
  assert.equal(
    (await call("/api/workspace", "GET", undefined, cookie)).body.user,
    null,
  );
  assert.equal(
    (await auth("profile", { name: "Unauthorized" }, cookie)).status,
    401,
  );
  const rateEmail = `qa-rate-${randomUUID()}@example.test`;
  for (let i = 0; i < 10; i++)
    assert.equal(
      (await auth("login", { email: rateEmail, password })).status,
      401,
    );
  assert.equal(
    (await auth("login", { email: rateEmail, password })).status,
    429,
  );
  console.log(
    "Passed: registration, login, hashed credentials/sessions, CSRF rejection, account isolation, persisted drafts, conflict/field validation, profile updates, logout and rate limits.",
  );
}
main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
