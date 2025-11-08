// app/api/admin/generate-discount/route.ts
import { NextResponse } from "next/server";
import { adminGenerateDiscount } from "../../../../lib/store";

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== "admin-secret")
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const dc = adminGenerateDiscount();
  if (!dc)
    return NextResponse.json({ error: "not nth order yet" }, { status: 400 });
  return NextResponse.json(dc, { status: 201 });
}
