// // components/ProductCard.tsx
// "use client";
// import Image from "next/image";
// import React, { useState } from "react";
// import { ToastContainer } from "react-toastify";

// export default function ProductCard({
//   item,
//   onAdd,
//   defaultQty = 1,
// }: {
//   item: any;
//   onAdd: (id: string, qty?: number) => Promise<void> | void;
//   defaultQty?: number;
// }) {
//   const [loading, setLoading] = useState(false);

//   async function handleAdd() {
//     try {
//       setLoading(true);
//       await onAdd(item.id, defaultQty);
//       // optional: show a little success UI here
//     } catch (e) {
//       // optional: show error UI
//       console.error("Add to cart failed", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div
//       className="
//         p-4 sm:p-5 md:p-6 mt-3 mb-3 sm:mt-0 sm:mb-0
//         border rounded bg-white
//         flex flex-col items-center text-center
//         w-full
//         max-w-[100%] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[300px]
//         mx-auto
//       "
//     >
//       <ToastContainer
//         position="bottom-right"
//         autoClose={2000}
//         hideProgressBar={true}
//         newestOnTop={false}
//         closeOnClick={true}
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="dark"
//       />
//       {/* Image: relative parent + responsive sizes */}
//       <div className="relative mb-3 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
//         <Image
//           src={item.image}
//           alt={item.name}
//           fill
//           style={{ objectFit: "contain" }}
//           sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, 160px"
//           priority={false}
//           loading="eager"
//         />
//       </div>

//       {/* Title + price */}
//       <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2">
//         {item.name}
//       </h3>

//       <p className="text-xs sm:text-sm md:text-base text-gray-700 mt-1">
//         ₹{(item.price / 100).toFixed(2)}
//       </p>

//       {/* Button: full width on small screens, auto on larger */}
//       <button
//         aria-label={`Add ${item.name} to cart`}
//         onClick={() => onAdd(item.id)}
//         disabled={loading}
//         className="
//         text-blue-600 cursor-pointer
//           mt-3
//           px-3 py-2 sm:px-4 sm:py-2
//           w-full
//           border rounded text-base
//           disabled:opacity-50 hover:bg-blue-100 transition
//         "
//       >
//         {loading ? "Adding..." : "Add to cart"}
//       </button>
//     </div>
//   );
// }
"use client";
import Image from "next/image";
import React, { useState } from "react";

export default function ProductCard({
  item,
  onAdd,
  defaultQty = 1,
}: {
  item: any;
  onAdd: (id: string, qty?: number) => Promise<void> | void;
  defaultQty?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAdd() {
    try {
      setLoading(true);
      await onAdd(item.id, defaultQty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch (e) {
      console.error("Add to cart failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <article
      className="bg-white border border-gray-200 hover:shadow-md transition-transform transform hover:-translate-y-1 p-5 sm:p-6 flex flex-col items-center text-center rounded-md w-full max-w-[340px] mx-auto"
      role="article"
      aria-label={item.name}
    >
      {/* Product image */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-4 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 192px, (max-width: 1024px) 224px, 256px"
          priority={false}
        />
      </div>

      {/* Product name */}
      <h3 className="font-semibold text-gray-900 text-base sm:text-lg md:text-xl line-clamp-2">
        {item.name}
      </h3>

      {/* Price */}
      <div className="mt-2 text-xl font-semibold text-gray-800">
        ₹{(item.price / 100).toFixed(2)}
      </div>

      {/* Add to Cart button */}
      <button
        aria-label={`Add ${item.name} to cart`}
        onClick={handleAdd}
        disabled={loading}
        className="w-full mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-60 transition"
      >
        {loading ? (
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="3"
            />
            <path
              d="M22 12a10 10 0 01-10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        ) : added ? (
          <svg
            className="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l1.6 8.6a2 2 0 001.98 1.4h7.84a2 2 0 001.98-1.6L21 6H6"
            />
            <circle cx="10" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
          </svg>
        )}

        <span className="text-base font-medium">
          {loading ? "Adding..." : added ? "Added" : "Add to cart"}
        </span>
      </button>

      {/* Shipping info */}
      <div className="mt-4 text-sm text-gray-500">
        Ships in <span className="font-medium text-gray-700">3 days</span>
      </div>
    </article>
  );
}
