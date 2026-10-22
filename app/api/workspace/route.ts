import { NextRequest } from "next/server";
import { accountFor, sessionCookie } from "../../../server/accounts";
import { db } from "../../../server/database";
import { ApiError, body, failure, json } from "../../../server/http";
import { normalizeDrafts } from "../../../lib/workspace";
export async function GET(request: NextRequest) {
  try {
    const user = accountFor(request.cookies.get(sessionCookie)?.value);
    if (!user) return json({ user: null });
    const row = db()
      .prepare("SELECT * FROM workspaces WHERE user_id=?")
      .get(user.id);
    return json({
      user,
      revision: Number(row?.revision || 0),
      ...(row ? JSON.parse(String(row.content)) : { drafts: [], saved: [] }),
    });
  } catch (error) {
    return failure(error);
  }
}
export async function PUT(request: NextRequest) {
  try {
    const data = await body(request);
    const user = accountFor(request.cookies.get(sessionCookie)?.value);
    if (!user)
      throw new ApiError(
        "Your session expired. Sign in before saving again.",
        401,
      );
    const drafts = normalizeDrafts(data.drafts);
    if (
      !Array.isArray(data.drafts) ||
      drafts.length !== data.drafts.length ||
      drafts.length > 200 ||
      !Array.isArray(data.saved) ||
      data.saved.length > 500 ||
      !data.saved.every(
        (v: unknown) => typeof v === "string" && v.length <= 180,
      ) ||
      !Number.isSafeInteger(data.revision) ||
      Number(data.revision) < 0
    )
      throw new ApiError(
        "Invalid workspace data or workspace limit exceeded.",
        400,
      );
    if (
      drafts.some(
        (d) =>
          d.title.length > 180 ||
          d.type.length > 80 ||
          Object.keys(d.fields).length > 80 ||
          Object.entries(d.fields).some(
            ([k, v]) =>
              /password|token|secret/i.test(k) ||
              k.length > 100 ||
              v.length > 10000,
          ),
      ) ||
      new Set(drafts.map((d) => d.id)).size !== drafts.length
    )
      throw new ApiError("Draft fields are invalid or too large.", 400);
    db()
      .prepare("INSERT OR IGNORE INTO workspaces (user_id) VALUES (?)")
      .run(user.id);
    const result = db()
      .prepare(
        "UPDATE workspaces SET content=?,revision=revision+1 WHERE user_id=? AND revision=?",
      )
      .run(
        JSON.stringify({ drafts, saved: [...new Set(data.saved)] }),
        user.id,
        Number(data.revision),
      );
    if (!Number(result.changes))
      throw new ApiError(
        "Your workspace changed in another tab. Download unsaved drafts, then reload to get the latest version.",
        409,
      );
    return json({ revision: Number(data.revision) + 1 });
  } catch (error) {
    return failure(error);
  }
}
