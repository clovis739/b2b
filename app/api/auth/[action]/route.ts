import { NextRequest } from "next/server";
import {
  accountFor,
  allowAuth,
  createAccount,
  endSession,
  newSession,
  passwordHash,
  passwordMatches,
  sessionAge,
  sessionCookie,
  accountDetails,
} from "../../../../server/accounts";
import {
  accountAction,
  sendAccountToken,
} from "../../../../server/account-actions";
import { db } from "../../../../server/database";
import { ApiError, body, failure, json } from "../../../../server/http";
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> },
) {
  try {
    const { action } = await context.params;
    const data = await body(request);
    if (
      [
        "request-reset",
        "verify-email",
        "reset-password",
        "send-verification",
        "delete-account",
      ].includes(action)
    )
      return await accountAction(action, data, request);
    if (action === "logout") {
      endSession(request.cookies.get(sessionCookie)?.value || "");
      const response = json({ ok: true });
      response.cookies.set(sessionCookie, "", {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
    if (action === "profile") {
      const account = accountFor(request.cookies.get(sessionCookie)?.value);
      if (!account) throw new ApiError("Sign in to update your account.", 401);
      const name = typeof data.name === "string" ? data.name.trim() : "";
      if (!name || name.length > 80)
        throw new ApiError("Enter a name up to 80 characters.", 400);
      db().prepare("UPDATE users SET name=? WHERE id=?").run(name, account.id);
      return json({ user: { ...account, name } });
    }
    if (!["register", "login"].includes(action))
      throw new ApiError("Unknown account action.", 404);
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const password = typeof data.password === "string" ? data.password : "";
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      password.length > 128 ||
      !password
    )
      throw new ApiError("Enter a valid email and password.", 400);
    if (!allowAuth(email))
      return json(
        { error: "Too many attempts. Try again in 15 minutes." },
        429,
      );
    let user: import("../../../../server/accounts").Account;
    if (action === "register") {
      const name = typeof data.name === "string" ? data.name.trim() : "";
      if (
        !name ||
        name.length > 80 ||
        password.length < 12 ||
        !["buyer", "supplier"].includes(String(data.role)) ||
        data.terms !== true
      )
        throw new ApiError(
          "Enter your name, accept the terms and use a password of 12–128 characters.",
          400,
        );
      const hash = await passwordHash(password);
      if (db().prepare("SELECT id FROM users WHERE email=?").get(email))
        throw new ApiError(
          "Unable to create this account. Try signing in or use another email.",
          409,
        );
      try {
        user = createAccount(
          email,
          name,
          data.role as "buyer" | "supplier",
          hash,
        );
      } catch (error) {
        if (String(error).includes("UNIQUE"))
          throw new ApiError(
            "Unable to create this account. Try signing in or use another email.",
            409,
          );
        throw error;
      }
    } else {
      const record = db()
        .prepare("SELECT * FROM users WHERE email=?")
        .get(email);
      // Perform the same expensive derivation for unknown email addresses.
      const hash = String(
        record?.password_hash || `${"0".repeat(32)}:${"0".repeat(128)}`,
      );
      if (!(await passwordMatches(password, hash)) || !record)
        throw new ApiError("Email or password is incorrect.", 401);
      user = {
        id: String(record.id),
        email: String(record.email),
        name: String(record.name),
        role: String(record.role) as "buyer" | "supplier",
      };
    }
    const oldToken = request.cookies.get(sessionCookie)?.value;
    if (oldToken) endSession(oldToken);
    const token = newSession(user.id);
    let verificationQueued = false;
    if (action === "register") {
      try {
        await sendAccountToken(user, "verify", request);
        verificationQueued = true;
      } catch {
        /* The account remains usable; verification can be requested again in settings. */
      }
    }
    const response = json({
      user: accountDetails(
        user as import("../../../../server/accounts").Account,
      ),
      verificationQueued,
    });
    response.cookies.set(sessionCookie, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: sessionAge,
    });
    return response;
  } catch (error) {
    return failure(error);
  }
}
