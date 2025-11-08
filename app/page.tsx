// // import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       Hello
//     </div>
//   );
// }
// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";

export default function HomePage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then((j) => setItems(j.items || []));
  }, []);

  async function onAdd(id: string) {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "user1", itemId: id, qty: 1 }),
    });
    // alert("Added to cart (user1)");
    toast("Item Added to cart");
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
          Products
        </h1>

        {/* <div
          className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-3
      gap-4 sm:gap-6 lg:gap-8
    "
        >
          {items.map((i) => (
            <ProductCard key={i.id} item={i} onAdd={onAdd} />
          ))}
        </div> */}
        <div
          className="
      bg-gray-50
      border border-gray-200
      rounded-lg
      p-4 sm:p-6
    "
        >
          <div
            className="
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-3
        gap-4 sm:gap-6 lg:gap-8
      "
          >
            {items.map((i) => (
              <ProductCard key={i.id} item={i} onAdd={onAdd} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
