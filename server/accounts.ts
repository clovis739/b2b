import {
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { db } from "./database";
export type Account = {
  id: string;
  email: string;
  name: string;
  role: "buyer" | "supplier";
  emailVerified?: boolean;
  isAdmin?: boolean;
};
export const sessionCookie = "marketplace-session";
export const sessionAge = 60 * 60 * 24 * 7;
const digest = (text: string) =>
  createHash("sha256").update(text).digest("hex");
function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    ),
  );
}
export async function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${(await derive(password, salt)).toString("hex")}`;
}
export async function passwordMatches(password: string, hash: string) {
  const [salt, stored] = hash.split(":");
  const actual = await derive(password, salt);
  const expected = Buffer.from(stored, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function createAccount(
  email: string,
  name: string,
  role: Account["role"],
  hash: string,
): Account {
  const account = { id: randomUUID(), email, name, role };
  db()
    .prepare(
      "INSERT INTO users (id,email,name,role,password_hash,created_at) VALUES (?,?,?,?,?,?)",
    )
    .run(account.id, email, name, role, hash, Date.now());
  return accountDetails(account);
}
export function accountDetails(account: Account): Account {
  return {
    ...account,
    emailVerified: Boolean(
      db()
        .prepare("SELECT verified_at FROM account_security WHERE user_id=?")
        .get(account.id)?.verified_at,
    ),
    isAdmin: (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .includes(account.email.toLowerCase()),
  };
}
export function newSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db()
    .prepare("INSERT INTO sessions VALUES (?,?,?)")
    .run(digest(token), userId, Date.now() + sessionAge * 1000);
  return token;
}
export function accountFor(token: string | undefined): Account | null {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = db()
    .prepare(
      `SELECT u.id,u.email,u.name,u.role FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=? AND s.expires_at>?`,
    )
    .get(digest(token), Date.now());
  return row
    ? accountDetails({
        id: String(row.id),
        email: String(row.email),
        name: String(row.name),
        role: String(row.role) as Account["role"],
      })
    : null;
}
export function endSession(token: string) {
  db().prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(token));
}
export function allowAuth(email: string) {
  const now = Date.now();
  db().prepare("DELETE FROM auth_limits WHERE expires_at < ?").run(now);
  for (const [key, max] of [
    ["global", 200],
    [digest(email), 10],
  ] as const) {
    db()
      .prepare(
        `INSERT INTO auth_limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1`,
      )
      .run(key, now + 15 * 60 * 1000);
    if (
      Number(
        db().prepare("SELECT count FROM auth_limits WHERE key=?").get(key)
          ?.count,
      ) > max
    )
      return false;
  }
  return true;
}
