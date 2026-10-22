import type { NextRequest } from "next/server";
import { connection } from "next/server";
import { db } from "@/server/database";
import { member } from "@/server/trade";
import { testMode } from "@/server/mail";
import { ApiError, failure, json } from "@/server/http";
export async function GET(request: NextRequest) {
  await connection();
  try {
    if (!testMode()) throw new ApiError("Not found.", 404);
    const user = member(request);
    return json({
      messages: db()
        .prepare(
          "SELECT id,subject,content,status,created_at FROM mail_outbox WHERE user_id=? ORDER BY created_at DESC LIMIT 20",
        )
        .all(user.id),
    });
  } catch (error) {
    return failure(error);
  }
}
