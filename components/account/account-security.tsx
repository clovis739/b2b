"use client";
import Link from "next/link";
import { useState } from "react";
import { accountRequest, useWorkspace } from "@/hooks/use-workspace";
import { Icon } from "@/components/ui/icon";
type Preview = {
  id: string;
  subject: string;
  content: string;
  created_at: number;
};
export default function AccountSecurity() {
  const { account, refreshAccount } = useWorkspace();
  const [messages, setMessages] = useState<Preview[]>([]),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [deleting, setDeleting] = useState(false);
  if (!account) return null;
  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await task();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="page-section security-panel">
      <h2>
        <Icon name="shield" /> Account security
      </h2>
      <p>
        {account.emailVerified
          ? "Email verified"
          : "Verify your email before publishing or sending messages."}
      </p>
      <div className="button-row">
        <button
          className="outline-button"
          disabled={busy || account.emailVerified}
          onClick={() =>
            run(async () => {
              const r = await accountRequest("/api/auth/send-verification", {});
              setNotice(r.message);
            })
          }
        >
          Send verification link
        </button>
        <Link className="outline-button" href="/auth/sign-in/reset-password">
          Recover password
        </Link>
        <button
          className="outline-button"
          disabled={busy}
          onClick={() =>
            run(async () => {
              const r = await fetch("/api/test-mailbox", { cache: "no-store" });
              const data = await r.json();
              if (!r.ok)
                throw new Error(
                  r.status === 404
                    ? "Test mailbox is disabled on this installation."
                    : data.error,
                );
              setMessages(data.messages);
              setNotice(
                data.messages.length
                  ? "Test mode: no external emails were sent."
                  : "No test emails yet. Request a verification link first.",
              );
            })
          }
        >
          Open test mailbox
        </button>
      </div>
      {notice && (
        <p className="page-notice" role="status">
          {notice}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="test-mailbox">
        {messages.map((m) => {
          const link = m.content.match(/https?:\/\/\S+/)?.[0];
          return (
            <article className="draft-card" key={m.id}>
              <h3>
                <Icon name="mail" /> {m.subject}
              </h3>
              <p>{new Date(m.created_at).toLocaleString()}</p>
              <p>
                This one-time link is visible only to your signed-in account in
                test mode.
              </p>
              {link && (
                <Link
                  className="primary"
                  href={new URL(link).pathname + new URL(link).hash}
                >
                  Open secure link <Icon name="arrow" size={16} />
                </Link>
              )}
            </article>
          );
        })}
      </div>
      <hr />
      <h3>Delete account</h3>
      <p>
        This permanently removes your profile, saved items, drafts, listings and
        conversations, including messages shared with other members. Browser
        guest drafts remain on this device.
      </p>
      <button
        className="outline-button danger"
        disabled={busy}
        onClick={() => setDeleting(!deleting)}
      >
        Delete my account
      </button>
      {deleting && (
        <form
          className="page-form"
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            run(async () => {
              await accountRequest("/api/auth/delete-account", {
                confirmEmail: data.get("email"),
                password: data.get("password"),
              });
              await refreshAccount();
            });
          }}
        >
          <label>
            Confirm account email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Current password
            <input
              name="password"
              type="password"
              required
              maxLength={128}
              autoComplete="current-password"
            />
          </label>
          <label className="consent-label">
            <input type="checkbox" required /> I understand this permanently
            deletes my account and shared conversations.
          </label>
          <button className="primary danger" disabled={busy}>
            Permanently delete account
          </button>
          <button
            type="button"
            className="outline-button"
            onClick={() => setDeleting(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </section>
  );
}
