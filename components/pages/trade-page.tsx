"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PageEntry } from "@/app/route-map";
import type { TradeListing, TradeMessage, Thread } from "@/lib/trade-types";
import { accountRequest, useWorkspace } from "@/hooks/use-workspace";
import { Icon } from "@/components/ui/icon";
const emptyFields = {
  description: "",
  category: "",
  country: "",
  quantity: "",
  price: "",
  unit: "Metric ton",
};
type EditingListing = Pick<TradeListing, "id" | "kind" | "title" | "fields">;
async function read(path: string) {
  const r = await fetch(path, { cache: "no-store" });
  const result = await r.json();
  if (!r.ok) throw new Error(result.error);
  return result;
}
export default function TradePage({ entry }: { entry: PageEntry }) {
  const { account } = useWorkspace();
  return <TradeWorkspace key={account?.id || "guest"} entry={entry} />;
}
function TradeWorkspace({ entry }: { entry: PageEntry }) {
  const { account, ready, drafts } = useWorkspace(),
    router = useRouter(),
    mode = entry.key || "market";
  const [listings, setListings] = useState<TradeListing[]>([]),
    [threads, setThreads] = useState<Thread[]>([]),
    [messages, setMessages] = useState<TradeMessage[]>([]);
  const [selected, setSelected] = useState(""),
    [editing, setEditing] = useState<EditingListing | null>(null),
    [creating, setCreating] = useState(false),
    [busy, setBusy] = useState(false),
    [loaded, setLoaded] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [kind, setKind] = useState("");
  const load = useCallback(async () => {
    const r = await read(
      `/api/trade${mode === "market" ? "" : `?scope=${mode === "moderation" ? "moderation" : "workspace"}`}`,
    );
    setListings(r.listings || []);
    setThreads(r.threads || []);
    setLoaded(true);
  }, [mode]);
  useEffect(() => {
    if (!ready) return;
    let live = true;
    // Populate this screen from the external account-scoped API after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().catch((e) => {
      if (live) {
        setError(e.message);
        setLoaded(true);
      }
    });
    return () => {
      live = false;
    };
  }, [load, ready, account?.id]);
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    // Hydration reads the external browser URL; this also supports links from existing private drafts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (mode === "messages") setSelected(params.get("conversation") || "");
    const draft = drafts.find((d) => String(d.id) === params.get("draft"));
    if (mode === "listings" && draft) {
      const f = draft.fields;
      setEditing({
        id: "",
        kind: draft.type === "product" ? "product" : "rfq",
        title: draft.title,
        fields: {
          description: f.message || f.description || "",
          category: f.sector || f.category || "",
          country: f.origin || f.destination || f.country || "",
          quantity: f.quantity || "",
          price: f.price || "",
          unit: f.unit || "Metric ton",
        },
      });
      setCreating(true);
    }
  }, [ready, mode, drafts]);
  const loadMessages = useCallback(async (id: string) => {
    const r = await read(
      `/api/trade?scope=messages&id=${encodeURIComponent(id)}`,
    );
    setMessages(r.messages);
  }, []);
  useEffect(() => {
    if (!selected) return;
    let live = true;
    const update = () =>
      loadMessages(selected).catch((e) => {
        if (live) setError(e.message);
      });
    update();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") update();
    }, 10000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [selected, loadMessages]);
  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await task();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setBusy(false);
    }
  }
  async function mutate(data: Record<string, unknown>) {
    const result = await accountRequest("/api/trade", data);
    setNotice(result.message);
    return result;
  }
  const show = listings.filter(
    (l) =>
      (!kind || l.kind === kind) &&
      `${l.title} ${l.fields.category} ${l.fields.country} ${l.owner_name}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="trade-heading">
        <div>
          <span className="page-kicker">MEMBER MARKETPLACE</span>
          <h1>{entry.title}</h1>
          <p>
            Publish products, request quotes and connect directly with
            registered members.
          </p>
        </div>
        <Icon name={mode === "messages" ? "message" : "globe"} size={44} />
      </div>
      <nav className="workspace-tabs" aria-label="Trading sections">
        {[
          ["Marketplace", "/trade"],
          ["My listings & RFQs", "/workspace/trading"],
          ["Messages", "/workspace/messages"],
          ["Account settings", "/workspace/settings"],
          ...(account?.isAdmin
            ? [["Moderation", "/workspace/moderation"]]
            : []),
        ].map(([label, path]) => (
          <Link
            key={path}
            href={path}
            aria-current={entry.path === path ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <p className="form-note">
        Test installation. Member listings are submitted here and reviewed by an
        administrator. Quotes are messages, with no payment or order processing.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="page-notice" role="status">
          {notice}
        </p>
      )}
      {!ready || !loaded ? (
        <p role="status">Loading trading workspace…</p>
      ) : (
        <>
          {!account && (
            <p className="page-notice">
              <Link href="/auth/sign-in">Sign in</Link> or{" "}
              <Link href="/auth/sign-up/buyer">create an account</Link> to
              publish and send inquiries.
            </p>
          )}
          {account && !account.emailVerified && (
            <p className="page-notice">
              Verify your email to publish or send messages.{" "}
              <Link href="/workspace/settings">
                Open account settings and test mailbox
              </Link>
            </p>
          )}
          {mode === "listings" && account && (
            <>
              <div className="button-row">
                <button
                  className="primary"
                  disabled={busy || !account.emailVerified}
                  onClick={() => {
                    setEditing(null);
                    setCreating(true);
                  }}
                >
                  Create listing or RFQ <Icon name="arrow" size={16} />
                </button>
                <button
                  className="outline-button"
                  disabled={busy}
                  onClick={() => run(load)}
                >
                  Refresh status
                </button>
              </div>
              {(creating || editing) && (
                <form
                  key={editing?.id || "new"}
                  className="page-form trade-editor"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = new FormData(e.currentTarget);
                    run(async () => {
                      await mutate({
                        action: editing?.id ? "edit" : "create",
                        id: editing?.id,
                        kind: data.get("kind"),
                        title: data.get("title"),
                        fields: Object.fromEntries(
                          Object.keys(emptyFields).map((k) => [k, data.get(k)]),
                        ),
                      });
                      setCreating(false);
                      setEditing(null);
                      await load();
                    });
                  }}
                >
                  <h2>
                    {editing ? "Revise and resubmit" : "Create a submission"}
                  </h2>
                  <fieldset className="auth-fields" disabled={busy}>
                    <label>
                      Submission type
                      <select name="kind" defaultValue={editing?.kind || "rfq"}>
                        <option value="rfq">Request for quotation</option>
                        {account.role === "supplier" && (
                          <option value="product">Product listing</option>
                        )}
                      </select>
                    </label>
                    <label>
                      Title
                      <input
                        name="title"
                        required
                        maxLength={180}
                        defaultValue={editing?.title}
                      />
                    </label>
                    <label>
                      Description
                      <textarea
                        name="description"
                        required
                        minLength={20}
                        maxLength={5000}
                        rows={5}
                        defaultValue={editing?.fields.description}
                      />
                    </label>
                    <div className="form-row">
                      {(
                        [
                          ["category", "Category"],
                          ["country", "Country"],
                          ["quantity", "Quantity"],
                          ["unit", "Unit"],
                          ["price", "Price or budget (optional)"],
                        ] as const
                      ).map(([name, label]) => (
                        <label key={name}>
                          {label}
                          <input
                            name={name}
                            required={name !== "price"}
                            maxLength={name === "unit" ? 60 : 100}
                            defaultValue={
                              editing?.fields[name] || emptyFields[name]
                            }
                          />
                        </label>
                      ))}
                    </div>
                    <p className="form-note">
                      Publishing requires moderation. Editing a published
                      listing returns it to review. Do not include private
                      contact information in public details.
                    </p>
                    <label className="consent-label">
                      <input type="checkbox" required /> I am authorized to
                      publish this content and the details are accurate.
                    </label>
                    <div className="button-row">
                      <button className="primary">Submit for moderation</button>
                      <button
                        type="button"
                        className="outline-button"
                        onClick={() => {
                          setCreating(false);
                          setEditing(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </fieldset>
                </form>
              )}
            </>
          )}
          {mode === "messages" ? (
            <div className="trade-inbox">
              <aside className="trade-threads">
                <h2>Conversations</h2>
                <button
                  className="text-button"
                  disabled={busy}
                  onClick={() => run(load)}
                >
                  Refresh inbox
                </button>
                {!threads.length && (
                  <p>
                    No conversations yet. Open a published listing to send an
                    inquiry.
                  </p>
                )}
                {threads.map((t) => (
                  <button
                    key={t.id}
                    className={selected === t.id ? "active" : ""}
                    aria-pressed={selected === t.id}
                    onClick={() => {
                      setSelected(t.id);
                      setMessages([]);
                      setError("");
                    }}
                  >
                    <strong>{t.title}</strong>
                    <span>{t.partner}</span>
                  </button>
                ))}
              </aside>
              <section className="trade-conversation">
                <h2>
                  {threads.find((t) => t.id === selected)?.title ||
                    "Choose a conversation"}
                </h2>
                {selected && (
                  <>
                    <div
                      className="trade-message-list"
                      aria-label="Conversation messages"
                    >
                      {messages.map((m) => (
                        <article
                          className={`trade-message ${m.sender_id === account?.id ? "own" : ""}`}
                          key={m.id}
                        >
                          <strong>{m.sender_name}</strong>
                          <p>{m.content}</p>
                          {m.quote_amount !== null && (
                            <p className="trade-quote">
                              <Icon name="file" size={16} /> Quote: {m.currency}{" "}
                              {m.quote_amount.toLocaleString()}
                            </p>
                          )}
                          <small>
                            {new Date(m.created_at).toLocaleString()}
                          </small>
                        </article>
                      ))}
                    </div>
                    <MessageForm
                      key={selected}
                      busy={busy}
                      supplier={account?.role === "supplier"}
                      onSubmit={(data, form) =>
                        run(async () => {
                          await mutate({
                            action: "message",
                            id: selected,
                            ...data,
                          });
                          form.reset();
                          await loadMessages(selected);
                        })
                      }
                    />
                  </>
                )}
              </section>
            </div>
          ) : (
            <>
              <div className="listing-controls">
                <label className="filter-search">
                  <Icon name="search" size={18} />
                  <input
                    aria-label="Search member listings"
                    placeholder="Search products, requests or members"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <select
                  aria-label="Listing type"
                  value={kind}
                  onChange={(e) => setKind(e.target.value)}
                >
                  <option value="">Products & RFQs</option>
                  <option value="product">Products</option>
                  <option value="rfq">RFQs</option>
                </select>
                <button
                  className="outline-button"
                  disabled={busy}
                  onClick={() => run(load)}
                >
                  Refresh
                </button>
              </div>
              {!show.length ? (
                <div className="empty-state">
                  <Icon name="box" size={36} />
                  <h2>
                    {mode === "moderation"
                      ? "No submissions awaiting review"
                      : "No listings found"}
                  </h2>
                  <p>
                    {mode === "market"
                      ? "Approved member products and RFQs will appear here. Create a test account to submit the first one."
                      : "Create a submission or adjust your filters."}
                  </p>
                </div>
              ) : (
                <div className="trade-listings">
                  {show.map((l) => (
                    <article className="trade-card" key={l.id}>
                      <div className="trade-card-top">
                        <span className="draft-badge">
                          {l.kind === "rfq"
                            ? "Request for quotation"
                            : "Product"}
                        </span>
                        {mode !== "market" && (
                          <span className={`trade-status ${l.status}`}>
                            {l.status}
                          </span>
                        )}
                      </div>
                      <h2>{l.title}</h2>
                      <p className="trade-byline">
                        <Icon name="user" size={16} />
                        {l.owner_name} <Icon name="location" size={16} />
                        {l.fields.country}
                      </p>
                      <p className="trade-description">
                        {l.fields.description}
                      </p>
                      <dl>
                        <div>
                          <dt>Category</dt>
                          <dd>{l.fields.category}</dd>
                        </div>
                        <div>
                          <dt>Quantity</dt>
                          <dd>
                            {l.fields.quantity} {l.fields.unit}
                          </dd>
                        </div>
                        <div>
                          <dt>{l.kind === "rfq" ? "Budget" : "Price"}</dt>
                          <dd>{l.fields.price || "Discuss with member"}</dd>
                        </div>
                      </dl>
                      {l.review_note && (
                        <p className="page-notice">
                          Moderator: {l.review_note}
                        </p>
                      )}
                      {mode === "listings" && (
                        <div className="button-row">
                          <button
                            className="outline-button"
                            disabled={busy}
                            onClick={() => {
                              setCreating(false);
                              setEditing(l);
                            }}
                          >
                            Edit & resubmit
                          </button>
                          {l.status !== "withdrawn" && (
                            <button
                              className="text-button"
                              disabled={busy}
                              onClick={() =>
                                run(async () => {
                                  await mutate({
                                    action: "withdraw",
                                    id: l.id,
                                  });
                                  await load();
                                })
                              }
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      )}
                      {mode === "moderation" && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget,
                              data = new FormData(form);
                            run(async () => {
                              await mutate({
                                action: "moderate",
                                id: l.id,
                                status: data.get("status"),
                                note: data.get("note"),
                                updatedAt: l.updated_at,
                              });
                              await load();
                            });
                          }}
                        >
                          <fieldset className="auth-fields" disabled={busy}>
                            <label>
                              Decision
                              <select name="status">
                                <option value="approved">
                                  Approve and publish
                                </option>
                                <option value="rejected">Reject</option>
                              </select>
                            </label>
                            <label>
                              Review note (required for rejection)
                              <textarea name="note" maxLength={1000} />
                            </label>
                            <button className="primary">Submit decision</button>
                          </fieldset>
                        </form>
                      )}
                      {mode === "market" &&
                        account &&
                        account.id !== l.owner_id && (
                          <details className="trade-inquiry">
                            <summary>
                              Send {l.kind === "rfq" ? "a quote" : "an inquiry"}{" "}
                              <Icon name="message" size={18} />
                            </summary>
                            <MessageForm
                              busy={
                                busy ||
                                !account.emailVerified ||
                                (l.kind === "rfq" &&
                                  account.role !== "supplier")
                              }
                              supplier={account.role === "supplier"}
                              onSubmit={(data, form) =>
                                run(async () => {
                                  const r = await mutate({
                                    action: "inquire",
                                    id: l.id,
                                    ...data,
                                  });
                                  form.reset();
                                  router.push(
                                    `/workspace/messages?conversation=${r.conversationId}`,
                                  );
                                })
                              }
                            />
                            {l.kind === "rfq" &&
                              account.role !== "supplier" && (
                                <p className="form-note">
                                  Switch to a supplier account to quote on RFQs.
                                </p>
                              )}
                          </details>
                        )}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
function MessageForm({
  busy,
  supplier,
  onSubmit,
}: {
  busy: boolean;
  supplier: boolean;
  onSubmit: (data: Record<string, unknown>, form: HTMLFormElement) => void;
}) {
  return (
    <form
      className="page-form trade-message-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSubmit(
          {
            content: data.get("content"),
            ...(supplier
              ? {
                  quoteAmount: data.get("quoteAmount"),
                  currency: data.get("currency"),
                }
              : {}),
          },
          e.currentTarget,
        );
      }}
    >
      <fieldset className="auth-fields" disabled={busy}>
        <label>
          Message
          <textarea name="content" required maxLength={5000} rows={4} />
        </label>
        {supplier && (
          <div className="form-row">
            <label>
              Quote amount (optional)
              <input
                type="number"
                name="quoteAmount"
                min="0.01"
                max="1000000000000"
                step="0.01"
              />
            </label>
            <label>
              Currency
              <select name="currency">
                {["USD", "EUR", "GBP", "NGN", "INR", "CNY"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        )}
        <button className="primary">
          {busy ? "Sending…" : "Send to member inbox"}{" "}
          <Icon name="send" size={16} />
        </button>
      </fieldset>
    </form>
  );
}
