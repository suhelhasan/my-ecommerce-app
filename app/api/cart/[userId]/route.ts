// // app/api/cart/[userId]/route.ts
// import { NextResponse } from "next/server";
// import { getCart, computeSubtotal } from "../../../../lib/store";

// export async function GET(req: Request, context: any) {
//   try {
//     const params = await context?.params; // <- await here
//     const userId = params?.userId ?? new URL(req.url).pathname.split("/").pop();
//     if (!userId)
//       return NextResponse.json({ error: "missing userId" }, { status: 400 });

//     const cart = getCart(userId);
//     const subtotal = computeSubtotal(cart);
//     return NextResponse.json({ cart, subtotal });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err?.message || "error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/cart/[userId]/route.ts
import { NextResponse } from "next/server";
import { getCart, computeSubtotal } from "../../../../lib/store";

export async function GET(req: Request, context: any) {
  try {
    // context.params can be a Promise or an object depending on runtime.
    const maybeParams = context?.params;
    const params =
      maybeParams && typeof maybeParams.then === "function"
        ? await maybeParams
        : maybeParams;
    const userId = params?.userId ?? new URL(req.url).pathname.split("/").pop();

    if (!userId) {
      return NextResponse.json({ error: "missing userId" }, { status: 400 });
    }

    const cart = getCart(userId);

    // Type assertion to satisfy TS if getCart returns a union.
    // computeSubtotal expects the Cart shape — cast to any (or to your Cart type).
    const subtotal = computeSubtotal(cart as any);

    return NextResponse.json({ cart, subtotal });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "error" },
      { status: 500 }
    );
  }
}
