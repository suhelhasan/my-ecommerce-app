// app/api/discounts/route.ts
import { NextResponse } from "next/server";
import { adminStats } from "../../../lib/store"; // reuses existing function

export async function GET() {
  try {
    // adminStats() returns discountCodes array among other stats
    const stats = adminStats();
    // return only unused codes (available to apply)
    const available = (stats.discountCodes || []).filter((d: any) => !d.used);
    return NextResponse.json({ discountCodes: available });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "failed" },
      { status: 500 }
    );
  }
}
