// // app/cart/page.tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import Header from "../../components/Header";
// import CartItem from "../../components/CartItem";

// export default function CartPage() {
//   const [cart, setCart] = useState<any>(null);
//   const [subtotal, setSubtotal] = useState<number>(0);
//   const [code, setCode] = useState("");

//   async function load() {
//     const res = await fetch("/api/cart/user1");
//     const j = await res.json();
//     setCart(j.cart);
//     setSubtotal(j.subtotal || 0);
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function doCheckout() {
//     const res = await fetch("/api/checkout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: "user1",
//         discountCode: code || undefined,
//       }),
//     });
//     const j = await res.json();
//     if (!res.ok) {
//       alert("Error: " + (j.error || "unknown"));
//       return;
//     }
//     alert(
//       "Order placed. ID: " +
//         j.order.id +
//         (j.newDiscount ? `\nNew discount: ${j.newDiscount.code}` : "")
//     );
//     setCode("");
//     load();
//   }

//   return (
//     <>
//       <Header />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <h1 className="text-2xl font-bold my-4">Cart</h1>
//         {!cart || cart.items.length === 0 ? (
//           <p>Cart is empty</p>
//         ) : (
//           <div className="bg-white p-4 rounded shadow">
//             {cart.items.map((it: any) => (
//               <CartItem key={it.itemId} it={it} />
//             ))}
//             <div className="mt-4">Subtotal: ₹{(subtotal / 100).toFixed(2)}</div>
//             <div className="mt-2 flex gap-2">
//               <input
//                 value={code}
//                 onChange={(e) => setCode(e.target.value)}
//                 placeholder="Discount code"
//                 className="border p-1 rounded"
//               />
//               <button onClick={doCheckout} className="px-3 py-1 border rounded">
//                 Checkout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// app/cart/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import CartItem from "../../components/CartItem";

export default function CartPage() {
  const USER = "user1";
  const [cart, setCart] = useState<any>(null);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // which coupon is applied (code string) or null
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [appliedMeta, setAppliedMeta] = useState<any | null>(null);

  async function loadCart() {
    try {
      const res = await fetch(`/api/cart/${USER}`);
      const j = await res.json();
      const c = j.cart ?? j;
      setCart(c);
      setSubtotal(j.subtotal ?? 0);
    } catch (e) {
      console.error("loadCart error", e);
      setCart({ items: [] });
      setSubtotal(0);
    }
  }

  async function loadCodes() {
    try {
      const res = await fetch("/api/discounts");
      const j = await res.json();
      setCodes(j.discountCodes ?? []);
    } catch (e) {
      console.error("loadCodes err", e);
      setCodes([]);
    }
  }

  useEffect(() => {
    loadCart();
    loadCodes();
  }, []);

  // toggle apply/remove coupon
  function toggleCoupon(coupon: any) {
    if (appliedCode === coupon.code) {
      // remove
      setAppliedCode(null);
      setAppliedMeta(null);
      return;
    }
    // apply
    setAppliedCode(coupon.code);
    setAppliedMeta(coupon);
  }

  function formatMoney(paise: number) {
    return `₹${(paise / 100).toFixed(2)}`;
  }

  // compute discount/final prices locally for preview
  const discountAmount = appliedMeta
    ? Math.floor((subtotal * (appliedMeta.amountPercent ?? 10)) / 100)
    : 0;
  const finalTotal = subtotal - discountAmount;

  async function doCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER,
          discountCode: appliedCode ?? undefined,
        }),
      });
      const j = await res.json();
      if (!res.ok) {
        alert("Checkout error: " + (j.error || "unknown"));
      } else {
        alert(
          `Order placed: ${j.order.id}` +
            (j.newDiscount ? `\nNew coupon: ${j.newDiscount.code}` : "")
        );
        // refresh after checkout
        setAppliedCode(null);
        setAppliedMeta(null);
        await loadCart();
        await loadCodes();
      }
    } catch (e: any) {
      console.error(e);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* <div className="max-w-4xl mx-auto px-4 py-6"> */}
        <h1 className="text-2xl font-bold mb-4">Cart</h1>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="p-6 bg-white rounded shadow text-center text-gray-600">
            Your cart is empty
          </div>
        ) : (
          <div className="bg-white p-4 rounded shadow space-y-4">
            {/* Cart items */}
            <div className="space-y-2">
              {cart.items.map((it: any) => (
                <CartItem key={it.itemId} it={it} />
              ))}
            </div>

            {/* Price summary */}
            <div className="flex items-center justify-between pt-3">
              <div className="text-sm text-gray-600">Subtotal</div>
              <div className="text-lg font-semibold">
                {formatMoney(subtotal)}
              </div>
            </div>

            {/* Available coupons */}
            <div>
              <div className="text-sm text-gray-600 mb-2">
                Available coupons
              </div>
              {codes.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No coupons available
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {codes.map((c) => {
                    const active = appliedCode === c.code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => toggleCoupon(c)}
                        className={`relative px-3 py-1 rounded border text-sm font-mono focus:outline-none transition ${
                          active
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                        }`}
                      >
                        {active && (
                          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs bg-red-500 text-white rounded-full">
                            ✕
                          </span>
                        )}
                        {c.code}
                        <span className="ml-2 text-xs font-normal text-gray-400">
                          ({c.amountPercent}% OFF)
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Applied coupon summary */}
            {appliedCode ? (
              <div className="p-3 bg-green-50 border border-green-100 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-700">
                      Coupon: <span className="font-mono">{appliedCode}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Discount: {appliedMeta?.amountPercent ?? 10}%
                    </div>
                    <div className="text-sm text-gray-600">
                      You save:{" "}
                      <span className="font-semibold">
                        {formatMoney(discountAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    Final: {formatMoney(finalTotal)}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Checkout row */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-xl font-bold">
                  {formatMoney(appliedCode ? finalTotal : subtotal)}
                </div>
              </div>

              <button
                onClick={doCheckout}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
