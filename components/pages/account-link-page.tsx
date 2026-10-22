"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PageEntry } from "@/app/route-map";
import { accountRequest, useWorkspace } from "@/hooks/use-workspace";
export default function AccountLinkPage({ entry }: { entry: PageEntry }) {
  const reset = entry.key === "complete-reset",
    { refreshAccount } = useWorkspace();
  const [token, setToken] = useState(""),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const value =
      new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    // The token lives only in this mounted form after it is read from the URL fragment.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(value);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);
  return (
    <form
      className="page-form account-link-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setError("");
        if (reset && data.get("password") !== data.get("confirm")) {
          setError("Passwords must match.");
          return;
        }
        setBusy(true);
        try {
          const result = await accountRequest(
            `/api/auth/${reset ? "reset-password" : "verify-email"}`,
            { token, password: data.get("password") },
          );
          setMessage(result.message);
          setToken("");
          await refreshAccount();
        } catch (e) {
          setError(
            e instanceof Error ? e.message : "Could not complete request.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <h1>{entry.title}</h1>
      <p>
        One-time links expire automatically. Request a new link if yours has
        expired.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="page-notice" role="status">
          {message}
        </p>
      )}
      {!message &&
        (!token ? (
          <p className="form-note">
            Open the complete link from your verification or recovery email.
          </p>
        ) : (
          <fieldset className="auth-fields" disabled={busy}>
            {reset && (
              <>
                <label>
                  New password
                  <input
                    name="password"
                    type="password"
                    minLength={12}
                    maxLength={128}
                    required
                    autoComplete="new-password"
                  />
                </label>
                <label>
                  Confirm new password
                  <input
                    name="confirm"
                    type="password"
                    minLength={12}
                    maxLength={128}
                    required
                    autoComplete="new-password"
                  />
                </label>
              </>
            )}
            <button className="primary">
              {busy
                ? "Please wait…"
                : reset
                  ? "Set new password"
                  : "Verify email"}
            </button>
          </fieldset>
        ))}
      <Link
        className="outline-button"
        href={reset ? "/auth/sign-in" : "/workspace/settings"}
      >
        {reset ? "Sign in" : "Account settings"}
      </Link>
      {reset && (
        <Link href="/auth/sign-in/reset-password">
          Request a new recovery link
        </Link>
      )}
    </form>
  );
}
