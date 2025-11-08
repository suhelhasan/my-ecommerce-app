// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { adminStats } from "../../../../lib/store";

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== "12345")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const s = adminStats();
  return NextResponse.json(s);
}
