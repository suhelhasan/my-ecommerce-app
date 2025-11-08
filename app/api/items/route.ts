// app/api/items/route.ts
import { NextResponse } from "next/server";
import { listItems } from "../../../lib/store";

export async function GET() {
  return NextResponse.json({ items: listItems() });
}
