"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // cart count state
  const [count, setCount] = useState<number>(0);

  // fetch cart and compute item count (sum of qty)
  async function fetchCartCount() {
    try {
      const res = await fetch("/api/cart/user1");
      if (!res.ok) return;
      const j = await res.json();
      const cart = j.cart ?? j;
      const total = (cart?.items || []).reduce(
        (s: number, it: any) => s + (it.qty || 0),
        0
      );
      setCount(total);
    } catch (e) {
      // ignore errors in header
      console.debug("cart count fetch failed", e);
    }
  }

  useEffect(() => {
    // initial load
    fetchCartCount();
    // poll every 2.5s to keep it reasonably live
    const id = setInterval(fetchCartCount, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
              onClick={() => setOpen(false)}
            >
              T<span className="text-blue-600">Shirt</span> Store
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
            <Link
              href="/"
              className={`hover:text-blue-600 transition ${
                pathname === "/" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>

            <Link
              href="/cart"
              className={`relative hover:text-blue-600 transition ${
                pathname === "/cart" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <span className="relative inline-block">
                Cart
                {count > 0 && (
                  <span
                    aria-label={`${count} items in cart`}
                    className="absolute -top-2 -right-5 bg-blue-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  >
                    {count}
                  </span>
                )}
              </span>
            </Link>

            <Link
              href="/orders"
              className={`hover:text-blue-600 transition ${
                pathname === "/orders" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Orders & Discount(admin)
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {open ? (
                // X icon
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sliding panel */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-max-height duration-200 ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <nav className="px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`block text-base font-medium hover:text-blue-600 transition ${
              pathname === "/" ? "text-blue-600 font-semibold" : "text-gray-700"
            }`}
          >
            Home
          </Link>

          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className={`relative inline-block text-base font-medium hover:text-blue-600 transition ${
              pathname === "/cart"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
          >
            <span className="relative inline-block">
              Cart
              {count > 0 && (
                <span
                  aria-label={`${count} items in cart`}
                  className="absolute -top-2 -right-4 bg-blue-600 text-white text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {count}
                </span>
              )}
            </span>
          </Link>

          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className={`block text-base font-medium hover:text-blue-600 transition ${
              pathname === "/orders"
                ? "text-blue-600 font-semibold"
                : "text-gray-700"
            }`}
          >
            Orders & Discount(admin)
          </Link>
        </nav>
      </div>
    </header>
  );
}
