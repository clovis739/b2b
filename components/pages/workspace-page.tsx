"use client";
import Link from "next/link";
import { useState } from "react";
import { PageEntry } from "../../app/route-map";
import { Icon } from "../../app/ui";
import { Intro } from "../shared/presentation";
import { usePageController } from "../../hooks/use-page-controller";
import { ProductDraftForm } from "../forms/workflow-forms";
import { downloadDraft, WorkspaceDraft } from "../../lib/workspace";
import AccountSecurity from "../account/account-security";

export default function WorkspacePage({ entry }: { entry: PageEntry }) {
  const {
    saved,
    drafts,
    setDrafts,
    setNotice,
    setModal,
    profile,
    setProfile,
    save,
    account,
    ready,
    logout,
    updateProfile,
    guestCount,
    importGuestDrafts,
  } = usePageController();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [editing, setEditing] = useState<WorkspaceDraft | null>(null);
  const [removed, setRemoved] = useState<WorkspaceDraft | null>(null);
  const [pending, setPending] = useState(false);
  const list = drafts.filter(
    (d) =>
      (entry.key !== "products" || d.type === "product") &&
      (!type || d.type === type) &&
      `${d.title} ${Object.values(d.fields).join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <Intro
        entry={entry}
        description={`Welcome${profile ? `, ${profile}` : ""}. Keep your next opportunities together.`}
      />
      {account && guestCount > 0 && (
        <div className="page-notice">
          <span>{guestCount} guest drafts are available on this device.</span>
          <button
            type="button"
            className="text-button"
            onClick={importGuestDrafts}
          >
            Copy guest drafts to my account
          </button>
        </div>
      )}
      <fieldset className="workspace-fields" disabled={!ready || pending}>
        <nav className="workspace-tabs" aria-label="Workspace sections">
          {[
            ["Overview", "/workspace"],
            ["Inquiries", "/workspace/inquiries"],
            ["Products", "/workspace/products"],
            ["Published listings & RFQs", "/workspace/trading"],
            ["Messages", "/workspace/messages"],
            ["Settings", "/workspace/settings"],
          ].map(([t, h]) => (
            <Link
              key={h}
              href={h}
              aria-current={entry.path === h ? "page" : undefined}
              className={entry.path === h ? "active" : ""}
            >
              {t}
            </Link>
          ))}
        </nav>
        {entry.key === "settings" ? (
          <form
            className="page-form"
            onSubmit={async (e) => {
              e.preventDefault();
              setPending(true);
              try {
                await updateProfile(profile);
                setNotice(
                  account
                    ? "Account profile updated."
                    : "Profile saved on this device.",
                );
              } catch (e) {
                setNotice(
                  e instanceof Error ? e.message : "Could not save profile.",
                );
              } finally {
                setPending(false);
              }
            }}
          >
            <h2>Your profile</h2>
            {account && (
              <p className="form-note">
                {account.email} · {account.role} account
              </p>
            )}
            <label>
              Display name
              <input
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                maxLength={80}
                required
              />
            </label>
            <button className="primary">Save profile</button>
            {!account && (
              <button
                className="outline-button"
                type="button"
                onClick={() => setModal(true)}
              >
                Clear local data
              </button>
            )}
            {account && (
              <button
                className="outline-button"
                type="button"
                onClick={async () => {
                  setPending(true);
                  try {
                    await logout();
                    setNotice("Signed out. Guest workspace restored.");
                  } catch (e) {
                    setNotice(
                      e instanceof Error ? e.message : "Could not sign out.",
                    );
                  } finally {
                    setPending(false);
                  }
                }}
              >
                Sign out
              </button>
            )}
            <p className="form-note">
              {account
                ? "Your private drafts and saved products are stored in your account. Changes sync automatically. Drafts are not sent to suppliers or published."
                : "Guest profile and drafts stay in this browser. Sign in to use account storage."}
            </p>
          </form>
        ) : (
          <>
            <div className="workspace-stats">
              <Link href="/saved-products">
                <strong>{saved.length}</strong>
                <span>Saved products</span>
              </Link>
              <Link href="/workspace/inquiries">
                <strong>{drafts.length}</strong>
                <span>{account ? "Account drafts" : "Local drafts"}</span>
              </Link>
              <Link href="/rfqs/add-rfq">
                <Icon name="mail" size={29} />
                <span>Create a request <Icon name="arrow" size={16}/></span>
              </Link>
            </div>
            <section className="page-section">
              <div className="section-title">
                <h2>
                  {entry.key === "products"
                    ? "Your product drafts"
                    : "Your inquiries and requests"}
                </h2>
                <span className="form-note">{list.length} drafts</span>
              </div>
              <div className="listing-controls">
                <div className="filter-search">
                  <Icon name="search" size={17} />
                  <input
                    aria-label="Search saved drafts"
                    placeholder="Search saved drafts"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                {entry.key !== "products" && (
                  <select
                    aria-label="Filter draft type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">All draft types</option>
                    {[...new Set(drafts.map((d) => d.type))].sort().map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                )}
              </div>
              {removed && (
                <div className="page-notice" role="status">
                  <span>Removed “{removed.title}”.</span>
                  <button
                    className="text-button"
                    onClick={() => {
                      setDrafts((old) => [removed, ...old]);
                      setRemoved(null);
                    }}
                  >
                    Undo
                  </button>
                </div>
              )}
              {editing && (
                <form
                  className="page-form draft-editor"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    const title = String(data.get("draftTitle")).trim();
                    const fields = Object.fromEntries(
                      Object.keys(editing.fields).map((k) => [
                        k,
                        String(data.get(`field:${k}`) || ""),
                      ]),
                    );
                    setDrafts((old) =>
                      old.map((d) =>
                        d.id === editing.id ? { ...d, title, fields } : d,
                      ),
                    );
                    setEditing(null);
                    setNotice(
                      account
                        ? "Draft updated. See account sync status above."
                        : "Draft updated on this device.",
                    );
                  }}
                >
                  <h3>Edit draft</h3>
                  <label>
                    Draft title
                    <input
                      name="draftTitle"
                      required
                      maxLength={180}
                      defaultValue={editing.title}
                    />
                  </label>
                  {Object.entries(editing.fields).map(([k, v]) => (
                    <label key={k}>
                      {k.replace(/([A-Z])/g, " $1")}
                      {k === "message" ? (
                        <textarea
                          name={`field:${k}`}
                          defaultValue={v}
                          rows={5}
                        />
                      ) : (
                        <input name={`field:${k}`} defaultValue={v} />
                      )}
                    </label>
                  ))}
                  <div className="button-row">
                    <button className="primary">Save changes</button>
                    <button
                      className="outline-button"
                      type="button"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {list.length ? (
                <div className="drafts-grid">
                  {list.map((d) => (
                    <article className="draft-card" key={d.id}>
                      <span className="draft-badge">
                        {d.type} · {account ? "Private draft" : "Local draft"}
                      </span>
                      <h3>{d.title}</h3>
                      {Object.entries(d.fields)
                        .filter(([k]) => !["product", "subject"].includes(k))
                        .map(([k, v]) => (
                          <p key={k}>
                            <strong>{k.replace(/([A-Z])/g, " $1")}: </strong>
                            {v || "Not specified"}
                          </p>
                        ))}
                      <div className="draft-actions">
                        {["product","request-form"].includes(d.type)&&<Link className="text-button" href={`/workspace/trading?draft=${d.id}`}>Review for publication</Link>}
                        <button
                          className="text-button"
                          onClick={() => setEditing(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-button"
                          onClick={() => downloadDraft(d)}
                        >
                          Download
                        </button>
                        <button
                          className="text-button"
                          onClick={() => {
                            setDrafts((old) =>
                              old.filter((x) => x.id !== d.id),
                            );
                            setRemoved(d);
                            if (editing?.id === d.id) setEditing(null);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Icon name="mail" size={32} />
                  <h3>
                    {query || type
                      ? "No drafts match your filters."
                      : "Your next connection starts here."}
                  </h3>
                  <p>
                    {entry.key === "products"
                      ? "Use the form below to prepare your first product listing."
                      : "Create an inquiry or sourcing request to keep it in your workspace."}
                  </p>
                  {query || type ? (
                    <button
                      className="outline-button"
                      onClick={() => {
                        setQuery("");
                        setType("");
                      }}
                    >
                      Clear filters
                    </button>
                  ) : (
                    <Link className="primary" href="/rfqs/add-rfq">
                      Create an RFQ
                    </Link>
                  )}
                </div>
              )}
            </section>
            {entry.key === "products" && (
              <section className="page-section">
                <ProductDraftForm profile={profile} onSubmit={save} />
              </section>
            )}
          </>
        )}
      </fieldset>
      {entry.key === "settings" && <AccountSecurity/>}
    </>
  );
}
