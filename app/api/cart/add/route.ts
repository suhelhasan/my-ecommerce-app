// app/api/cart/add/route.ts
import { NextResponse } from "next/server";
import { addToCart } from "../../../../lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, itemId, qty } = body;
    if (!userId || !itemId)
      return NextResponse.json(
        { error: "userId and itemId required" },
        { status: 400 }
      );
    const cart = addToCart(userId, itemId, typeof qty === "number" ? qty : 1);
    return NextResponse.json(cart);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "error" },
      { status: 400 }
    );
  }
}
