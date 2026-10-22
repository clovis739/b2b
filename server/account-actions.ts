import { createHash, randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  accountFor,
  allowAuth,
  passwordHash,
  passwordMatches,
  sessionCookie,
} from "./accounts";
import { db } from "./database";
import { ApiError, json } from "./http";
import { mailConfigured, queueMail } from "./mail";
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const emailValue = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";
export async function sendAccountToken(
  user: { id: string; email: string },
  purpose: "verify" | "reset",
  request: NextRequest,
) {
  const token = randomBytes(32).toString("hex");
  db()
    .prepare("DELETE FROM account_tokens WHERE user_id=? AND purpose=?")
    .run(user.id, purpose);
  db()
    .prepare("INSERT INTO account_tokens VALUES (?,?,?,?)")
    .run(
      digest(token),
      user.id,
      purpose,
      Date.now() + (purpose === "reset" ? 30 : 1440) * 60000,
    );
  const configuredOrigin =
    process.env.APP_ORIGIN ||
    (process.env.NODE_ENV !== "production" ||
    ["localhost", "127.0.0.1"].includes(request.nextUrl.hostname)
      ? request.nextUrl.origin
      : "");
  if (!configuredOrigin)
    throw new ApiError("The site email origin must be configured.", 503);
  const link = `${configuredOrigin}/auth/${purpose === "verify" ? "verify-email" : "reset-password"}#token=${token}`;
  return queueMail(
    user.id,
    user.email,
    purpose === "verify"
      ? "Verify your marketplace email"
      : "Reset your marketplace password",
    `${purpose === "verify" ? "Verify your email address" : "Reset your password"} using this one-time link:\n\n${link}\n\nThis link expires in ${purpose === "reset" ? "30 minutes" : "24 hours"}. If you did not request this, ignore this message.`,
  );
}
export async function accountAction(
  action: string,
  data: Record<string, unknown>,
  request: NextRequest,
) {
  if (action === "request-reset") {
    const email = emailValue(data.email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
      throw new ApiError("Enter a valid email address.", 400);
    if (!allowAuth(`recovery:${email}`))
      throw new ApiError("Too many requests. Try again in 15 minutes.", 429);
    const user = db()
      .prepare("SELECT id,email FROM users WHERE email=?")
      .get(email);
    if (user)
      await sendAccountToken(
        { id: String(user.id), email: String(user.email) },
        "reset",
        request,
      );
    return json({
      ok: true,
      message: mailConfigured()
        ? "If this email is registered, a recovery email has been queued. Check your inbox and spam folder."
        : "Recovery request recorded. Email delivery is not configured on this installation; no email can be delivered yet.",
    });
  }
  if (action === "verify-email" || action === "reset-password") {
    const token = typeof data.token === "string" ? data.token : "";
    if (!/^[a-f0-9]{64}$/.test(token))
      throw new ApiError("This link is invalid or expired.", 400);
    const purpose = action === "verify-email" ? "verify" : "reset";
    let hash = "";
    if (purpose === "reset") {
      const password = typeof data.password === "string" ? data.password : "";
      if (password.length < 12 || password.length > 128)
        throw new ApiError("Use a password of 12–128 characters.", 400);
      if (!allowAuth(`token:${digest(token)}`))
        throw new ApiError("Too many attempts. Try again later.", 429);
      hash = await passwordHash(password);
    }
    const database = db();
    database.exec("BEGIN IMMEDIATE");
    try {
      const row = database
        .prepare(
          "SELECT * FROM account_tokens WHERE token_hash=? AND purpose=? AND expires_at>?",
        )
        .get(digest(token), purpose, Date.now());
      if (!row)
        throw new ApiError(
          "This link is invalid, expired or already used.",
          400,
        );
      const userId = String(row.user_id);
      if (purpose === "verify")
        database
          .prepare(
            "INSERT INTO account_security VALUES (?,?) ON CONFLICT(user_id) DO UPDATE SET verified_at=excluded.verified_at",
          )
          .run(userId, Date.now());
      else {
        database
          .prepare("UPDATE users SET password_hash=? WHERE id=?")
          .run(hash, userId);
        database.prepare("DELETE FROM sessions WHERE user_id=?").run(userId);
      }
      database
        .prepare("DELETE FROM account_tokens WHERE user_id=? AND purpose=?")
        .run(userId, purpose);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    return json({
      ok: true,
      message:
        purpose === "verify"
          ? "Email verified. You can now submit listings and contact registered members."
          : "Password updated. All previous sessions were signed out. Sign in with your new password.",
    });
  }
  const user = accountFor(request.cookies.get(sessionCookie)?.value);
  if (!user) throw new ApiError("Sign in to manage your account.", 401);
  if (action === "send-verification") {
    if (user.emailVerified)
      return json({ ok: true, message: "Your email is already verified." });
    if (!allowAuth(`verification:${user.email}`))
      throw new ApiError("Too many requests. Try again later.", 429);
    const result = await sendAccountToken(user, "verify", request);
    return json({
      ok: true,
      message: result.delivered
        ? "Verification email sent. Check your inbox."
        : "Verification email queued. Email delivery is not configured or is temporarily unavailable.",
    });
  }
  if (action === "delete-account") {
    if (!allowAuth(`deletion:${user.email}`))
      throw new ApiError("Too many attempts. Try again later.", 429);
    const password = typeof data.password === "string" ? data.password : "";
    const record = db()
      .prepare("SELECT password_hash FROM users WHERE id=?")
      .get(user.id);
    if (
      emailValue(data.confirmEmail) !== user.email ||
      !password ||
      password.length > 128 ||
      !record ||
      !(await passwordMatches(password, String(record.password_hash)))
    )
      throw new ApiError(
        "Confirm your account email and current password.",
        400,
      );
    db().prepare("DELETE FROM users WHERE id=?").run(user.id);
    const response = json({ ok: true });
    response.cookies.set(sessionCookie, "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
    });
    return response;
  }
  throw new ApiError("Unknown account action.", 404);
}
