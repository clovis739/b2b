import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { accountFor, sessionCookie, type Account } from "./accounts";
import { db } from "./database";
import { ApiError } from "./http";

export function member(request: NextRequest, verified = false) {
  const user = accountFor(request.cookies.get(sessionCookie)?.value);
  if (!user) throw new ApiError("Sign in to continue.", 401);
  if (verified && !user.emailVerified)
    throw new ApiError("Verify your email in account settings first.", 403);
  return user;
}
function text(value: unknown, max: number, required = false) {
  if (value === undefined && !required) return "";
  if (
    typeof value !== "string" ||
    value.trim().length > max ||
    (required && !value.trim())
  )
    throw new ApiError(
      `Enter text between ${required ? 1 : 0} and ${max} characters.`,
      400,
    );
  return value.trim();
}
function listingFields(data: Record<string, unknown>) {
  const raw = data.fields;
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    throw new ApiError("Listing details are required.", 400);
  const f = raw as Record<string, unknown>;
  const fields = {
    description: text(f.description, 5000, true),
    category: text(f.category, 100, true),
    country: text(f.country, 100, true),
    quantity: text(f.quantity, 100, true),
    price: text(f.price, 100),
    unit: text(f.unit, 60, true),
  };
  if (fields.description.length < 20)
    throw new ApiError("Add a description of at least 20 characters.", 400);
  return fields;
}
function listingRow(id: string) {
  return db().prepare("SELECT * FROM listings WHERE id=?").get(id);
}
function burst(user: Account) {
  // Independent from login limits; persist across restarts and multiple processes.
  const key = `trade:${user.id}`,
    now = Date.now();
  const result = db()
    .prepare(
      "INSERT INTO auth_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<? THEN excluded.expires_at ELSE expires_at END RETURNING count",
    )
    .get(key, now + 60000, now, now);
  if (Number(result?.count) > 40)
    throw new ApiError("Please wait a minute before trying again.", 429);
}
export function readTrade(request: NextRequest) {
  const query = request.nextUrl.searchParams,
    scope = query.get("scope");
  if (scope === "workspace") {
    const user = member(request);
    const listings = db()
      .prepare(
        "SELECT l.*,u.name AS owner_name FROM listings l JOIN users u ON u.id=l.owner_id WHERE l.owner_id=? ORDER BY updated_at DESC LIMIT 200",
      )
      .all(user.id)
      .map(parseListing);
    const threads = db()
      .prepare(
        "SELECT c.id,c.listing_id,c.created_at,l.title,CASE WHEN c.owner_id=? THEN r.name ELSE o.name END AS partner FROM conversations c JOIN listings l ON l.id=c.listing_id JOIN users r ON r.id=c.requester_id JOIN users o ON o.id=c.owner_id WHERE c.owner_id=? OR c.requester_id=? ORDER BY c.created_at DESC LIMIT 200",
      )
      .all(user.id, user.id, user.id);
    return { listings, threads };
  }
  if (scope === "moderation") {
    const user = member(request, true);
    if (!user.isAdmin)
      throw new ApiError("Administrator access required.", 403);
    return {
      listings: db()
        .prepare(
          "SELECT l.*,u.name AS owner_name FROM listings l JOIN users u ON u.id=l.owner_id WHERE l.status='pending' ORDER BY l.updated_at LIMIT 200",
        )
        .all()
        .map(parseListing),
      audit: db()
        .prepare(
          "SELECT m.*,l.title FROM moderation_log m JOIN listings l ON l.id=m.listing_id ORDER BY m.created_at DESC LIMIT 100",
        )
        .all(),
    };
  }
  if (scope === "messages") {
    const user = member(request),
      id = text(query.get("id"), 100, true);
    const thread = db()
      .prepare(
        "SELECT * FROM conversations WHERE id=? AND (owner_id=? OR requester_id=?)",
      )
      .get(id, user.id, user.id);
    if (!thread) throw new ApiError("Conversation not found.", 404);
    return {
      messages: db()
        .prepare(
          "SELECT m.*,u.name AS sender_name FROM messages m JOIN users u ON u.id=m.sender_id WHERE conversation_id=? ORDER BY created_at,id LIMIT 500",
        )
        .all(id),
    };
  }
  const id = query.get("id");
  const rows = id
    ? db()
        .prepare(
          "SELECT l.*,u.name AS owner_name FROM listings l JOIN users u ON u.id=l.owner_id WHERE l.id=? AND l.status='approved'",
        )
        .all(id)
    : db()
        .prepare(
          "SELECT l.*,u.name AS owner_name FROM listings l JOIN users u ON u.id=l.owner_id WHERE l.status='approved' ORDER BY updated_at DESC LIMIT 200",
        )
        .all();
  if (id && !rows.length)
    throw new ApiError("Listing not found or not published.", 404);
  return { listings: rows.map(parseListing) };
}
function parseListing(row: Record<string, unknown>) {
  return { ...row, fields: JSON.parse(String(row.fields)) };
}
export function writeTrade(
  request: NextRequest,
  data: Record<string, unknown>,
) {
  const user = member(request, true);
  burst(user);
  const action = data.action,
    now = Date.now(),
    database = db();
  if (action === "create" || action === "edit") {
    const kind = data.kind;
    if (!["product", "rfq"].includes(String(kind)))
      throw new ApiError("Choose a product or RFQ.", 400);
    if (kind === "product" && user.role !== "supplier")
      throw new ApiError(
        "A supplier account is required to publish products.",
        403,
      );
    const title = text(data.title, 180, true),
      fields = JSON.stringify(listingFields(data));
    const id = action === "create" ? randomUUID() : text(data.id, 100, true);
    if (action === "create")
      database
        .prepare(
          "INSERT INTO listings (id,owner_id,kind,title,fields,created_at,updated_at) VALUES (?,?,?,?,?,?,?)",
        )
        .run(id, user.id, String(kind), title, fields, now, now);
    else {
      const changed = database
        .prepare(
          "UPDATE listings SET kind=?,title=?,fields=?,status='pending',review_note='',updated_at=? WHERE id=? AND owner_id=?",
        )
        .run(String(kind), title, fields, now, id, user.id);
      if (!Number(changed.changes))
        throw new ApiError("Listing not found.", 404);
    }
    return {
      id,
      message: "Submitted for moderation. It becomes public after approval.",
    };
  }
  const id = text(data.id, 100, true);
  if (action === "withdraw") {
    const changed = database
      .prepare(
        "UPDATE listings SET status='withdrawn',updated_at=? WHERE id=? AND owner_id=?",
      )
      .run(now, id, user.id);
    if (!Number(changed.changes)) throw new ApiError("Listing not found.", 404);
    return { message: "Listing withdrawn from the marketplace." };
  }
  if (action === "moderate") {
    if (!user.isAdmin)
      throw new ApiError("Administrator access required.", 403);
    if (!["approved", "rejected"].includes(String(data.status)))
      throw new ApiError("Choose approve or reject.", 400);
    const note = text(data.note, 1000, data.status === "rejected");
    database.exec("BEGIN IMMEDIATE");
    try {
      const row = listingRow(id);
      if (!row || row.status !== "pending")
        throw new ApiError(
          "This submission has already been reviewed or withdrawn.",
          409,
        );
      if (row.owner_id === user.id)
        throw new ApiError(
          "Another administrator must review your own submission.",
          403,
        );
      if (Number(data.updatedAt) !== Number(row.updated_at))
        throw new ApiError(
          "This listing changed. Reload before reviewing.",
          409,
        );
      database
        .prepare(
          "UPDATE listings SET status=?,review_note=?,updated_at=? WHERE id=?",
        )
        .run(String(data.status), note, now, id);
      database
        .prepare("INSERT INTO moderation_log VALUES (?,?,?,?,?,?)")
        .run(randomUUID(), id, user.id, String(data.status), note, now);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    return {
      message:
        data.status === "approved"
          ? "Listing published."
          : "Listing rejected. The owner can revise and resubmit.",
    };
  }
  if (action === "inquire" || action === "message") {
    const content = text(data.content, 5000, true);
    let amount: number | null = null,
      currency: string | null = null;
    if (data.quoteAmount !== undefined && data.quoteAmount !== "") {
      if (user.role !== "supplier")
        throw new ApiError("Only supplier accounts can send quotes.", 403);
      amount = Number(data.quoteAmount);
      currency = text(data.currency, 3, true);
      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 1e12 ||
        !["USD", "EUR", "GBP", "NGN", "INR", "CNY"].includes(currency)
      )
        throw new ApiError(
          "Enter a positive quote and supported currency.",
          400,
        );
    }
    database.exec("BEGIN IMMEDIATE");
    let threadId = id;
    try {
      if (action === "inquire") {
        const listing = listingRow(id);
        if (!listing || listing.status !== "approved")
          throw new ApiError("This listing is not accepting inquiries.", 404);
        if (listing.owner_id === user.id)
          throw new ApiError("You cannot inquire about your own listing.", 400);
        if (listing.kind === "rfq" && user.role !== "supplier")
          throw new ApiError(
            "A supplier account is required to quote on an RFQ.",
            403,
          );
        const existing = database
          .prepare(
            "SELECT id FROM conversations WHERE listing_id=? AND requester_id=?",
          )
          .get(id, user.id);
        threadId = existing ? String(existing.id) : randomUUID();
        if (!existing)
          database
            .prepare("INSERT INTO conversations VALUES (?,?,?,?,?)")
            .run(threadId, id, user.id, String(listing.owner_id), now);
      } else {
        const thread = database
          .prepare(
            "SELECT id FROM conversations WHERE id=? AND (owner_id=? OR requester_id=?)",
          )
          .get(id, user.id, user.id);
        if (!thread) throw new ApiError("Conversation not found.", 404);
        if (
          Number(
            database
              .prepare(
                "SELECT count(*) AS total FROM messages WHERE conversation_id=?",
              )
              .get(id)?.total,
          ) >= 500
        )
          throw new ApiError(
            "This conversation has reached its message limit. Start a new RFQ for further requirements.",
            409,
          );
      }
      database
        .prepare("INSERT INTO messages VALUES (?,?,?,?,?,?,?)")
        .run(randomUUID(), threadId, user.id, content, amount, currency, now);
      database.exec("COMMIT");
    } catch (error) {
      database.exec("ROLLBACK");
      throw error;
    }
    return {
      conversationId: threadId,
      message:
        amount === null
          ? "Message sent to the member inbox."
          : "Quote sent to the member inbox.",
    };
  }
  throw new ApiError("Unknown trading action.", 400);
}
