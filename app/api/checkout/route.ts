// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { checkout } from "../../../lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, discountCode } = body;
    if (!userId)
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    const result = checkout(userId, discountCode);
    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "error" },
      { status: 400 }
    );
  }
}
