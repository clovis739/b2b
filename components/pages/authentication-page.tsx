"use client";
import Link from "next/link";
import { useState } from "react";
import { PageEntry } from "../../app/route-map";

import { Icon } from "../../app/ui";
import { Photo } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";
import { accountRequest } from "../../hooks/use-workspace";

export default function AuthenticationPage({ entry }: { entry: PageEntry }) {
  const { router, profile, refreshAccount, account, resumeSession } =
    usePageController();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const isRegistration = ["buyer", "supplier"].includes(entry.key || "");
  return (
    <div className="auth-layout">
      <div className="auth-pitch">
        <span className="page-kicker">YOUR NEXT BUSINESS CONNECTION</span>
        <h1>A world of opportunities starts here.</h1>
        <p>
          Save products, prepare requests, and keep your sourcing plans
          together.
        </p>
        <Photo name="shipping" alt="International trade" />
      </div>
      <form
        className="page-form auth-form"
        aria-busy={pending}
        aria-describedby={error ? "auth-error" : "auth-description"}
        onSubmit={async (e) => {
          e.preventDefault();
          setError("");
          if (entry.key === "reset") {
            setPending(true);
            try { const result=await accountRequest("/api/auth/request-reset",{email:new FormData(e.currentTarget).get("email")}); setMessage(result.message); }
            catch(error){setError(error instanceof Error?error.message:"Recovery request failed.");}
            finally{setPending(false);}
            return;
          }
          const form = e.currentTarget;
          const data = new FormData(form);
          setPending(true);
          try {
            const result = await accountRequest(
              `/api/auth/${isRegistration ? "register" : "login"}`,
              {
                name: data.get("name"),
                email: data.get("email"),
                password: data.get("password"),
                role: entry.key === "supplier" ? "supplier" : "buyer",
                terms: data.get("terms") === "on",
              },
            );
            form.reset();
            if (account && result.user.id === account.id)
              resumeSession(result.user);
            else await refreshAccount();
            router.push("/workspace");
          } catch (e) {
            setError(
              e instanceof Error
                ? e.message
                : "Unable to sign in. Please try again.",
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <h2>{entry.title}</h2>
        <p className="form-note" id="auth-description">
          {entry.key === "reset"
            ? "Request a one-time password recovery link. In test mode, emails stay in your private test mailbox."
            : "Your account keeps private drafts and saved products together across devices."}
        </p>
        {account && (
          <p className="form-note">
            You are signed in as {account.email}.{" "}
            <Link href="/workspace">Open workspace</Link>
          </p>
        )}
        {message && <p role="status" className="page-notice">{message}</p>}
        {error && (
          <p className="form-error" id="auth-error" role="alert">
            {error}
          </p>
        )}
        <fieldset
          disabled={pending || (Boolean(account) && isRegistration)}
          className="auth-fields"
        >
          {["buyer", "supplier"].includes(entry.key || "") && (
            <label>
              Your name
              <input
                name="name"
                required
                maxLength={80}
                defaultValue={profile}
                autoComplete="name"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              name="email"
              defaultValue={account?.email}
              readOnly={Boolean(account)}
              required
              maxLength={254}
              autoComplete="email"
            />
          </label>
          {entry.key !== "reset" && (
            <div className="auth-password">
              <label htmlFor="account-password">Password</label>
              <div className="password-field">
                <input
                  id="account-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={isRegistration ? 12 : 1}
                  maxLength={128}
                  aria-describedby={
                    isRegistration ? "password-help" : undefined
                  }
                  required
                  autoComplete={
                    entry.key === "sign-in"
                      ? "current-password"
                      : "new-password"
                  }
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {isRegistration && (
                <small id="password-help">Use at least 12 characters.</small>
              )}
            </div>
          )}
          {entry.key === "sign-in" && (
            <Link className="text-button" href="/auth/sign-in/reset-password">
              Forgot password?
            </Link>
          )}
          {["buyer", "supplier"].includes(entry.key || "") && (
            <label className="consent-label">
              <input type="checkbox" name="terms" required />
              <span>
                I have read the{" "}
                <Link href="/terms-and-conditions">preview terms</Link> and{" "}
                <Link href="/privacy-policy">privacy information</Link>.
              </span>
            </label>
          )}
          <button className="primary">
            {pending
              ? "Please wait…"
              : entry.key === "reset"
                ? "Request recovery link"
                : isRegistration
                  ? "Create account"
                  : "Sign in"}
            <Icon name="arrow" size={16} />
          </button>
        </fieldset>
        <Link href="/workspace" className="outline-button">
          Explore workspace without an account
        </Link>
        <p className="form-note">
          {entry.key === "sign-in" ? (
            <>
              New here?{" "}
              <Link href="/auth/sign-up/buyer">Create a buyer profile <Icon name="arrow" size={16}/></Link>
            </>
          ) : (
            <>
              Already have a profile?{" "}
              <Link href="/auth/sign-in">Sign in <Icon name="arrow" size={16}/></Link>
            </>
          )}
        </p>
        <Link
          className="text-button"
          href={
            entry.key === "supplier"
              ? "/auth/sign-up/buyer"
              : "/auth/sign-up/supplier/create-account"
          }
        >
          {entry.key === "supplier" ? "Join as a buyer" : "Join as a supplier"}{" "}
          <Icon name="arrow" size={16}/>
        </Link>
      </form>
    </div>
  );
}
