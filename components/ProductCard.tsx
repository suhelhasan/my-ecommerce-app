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
