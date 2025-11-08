// // components/CartItem.tsx
// "use client";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";

// export default function CartItem({ it }: { it: any }) {
//   const [items, setItems] = useState<any[]>([]);
//   useEffect(() => {
//     fetch("/api/items")
//       .then((r) => r.json())
//       .then((j) => setItems(j.items || []));
//   }, []);
//   console.log("it", items);
//   console.log("it", it);
//   return (
//     <div className="flex justify-between p-2 border-b">
//       {/* <Image
//         src={items[] it.image}
//         alt={it.name}
//         fill
//         style={{ objectFit: "contain" }}
//         sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
//         priority={false}
//       /> */}
//       <div>{it.itemId}</div>
//       <div>Qty: {it.qty}</div>
//     </div>
//   );
// }
// components/CartItem.tsx
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function CartItem({ it }: { it: any }) {
  const [product, setProduct] = useState<any | null>(null);

  useEffect(() => {
    // Fetch all items once and find the matching product
    fetch("/api/items")
      .then((res) => res.json())
      .then((data) => {
        const items = data.items || [];
        const matched = items.find((p: any) => p.id === it.itemId);
        setProduct(matched || null);
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, [it.itemId]);

  if (!product) {
    return (
      <div className="flex justify-between items-center p-2 border-b text-gray-500">
        <div>Loading...</div>
        <div>Qty: {it.qty}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border-b bg-white">
      {/* Product image */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain rounded"
            sizes="64px"
          />
        </div>

        {/* Product details */}
        <div>
          <h4 className="font-semibold text-gray-800">{product.name}</h4>
          <p className="text-sm text-gray-600">
            ₹{(product.price / 100).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity */}
      <div className="text-sm text-gray-700">Qty: {it.qty}</div>
    </div>
  );
}
