import { NextRequest, NextResponse } from "next/server";
export const json = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export async function body(
  request: NextRequest,
): Promise<Record<string, unknown>> {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    throw new ApiError("Request origin is not allowed.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new ApiError("JSON is required.", 415);
  if (Number(request.headers.get("content-length")) > 512000)
    throw new ApiError("Request is too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError("Request body is required.", 400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 512000) {
      await reader.cancel();
      throw new ApiError("Request is too large.", 413);
    }
    chunks.push(value);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    return parsed;
  } catch {
    throw new ApiError("Invalid JSON body.", 400);
  }
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export function failure(error: unknown) {
  if (error instanceof ApiError)
    return json({ error: error.message }, error.status);
  console.error(
    "Account API failed",
    error instanceof Error ? error.name : "Unknown error",
  );
  return json(
    { error: "Could not complete this request. Please try again." },
    500,
  );
}
