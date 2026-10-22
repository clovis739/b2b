import type { NextRequest } from "next/server";
import { connection } from "next/server";
import { body, failure, json } from "@/server/http";
import { readTrade, writeTrade } from "@/server/trade";
export async function GET(request: NextRequest) {
  await connection();
  try {
    return json(readTrade(request));
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: NextRequest) {
  try {
    return json(writeTrade(request, await body(request)));
  } catch (error) {
    return failure(error);
  }
}
