// app/admin/stats/page.tsx
"use client";

import Header from "@/components/Header";
import React, { useState } from "react";

export default function AdminStatsPage() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadStats() {
    setError(null);
    setStats(null);
    if (!apiKey) {
      setError("Enter API key");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats", {
        method: "GET",
        headers: { "x-api-key": apiKey },
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.error || "Failed to load");
      } else {
        setStats(j);
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      {/* <div className="p-6 max-w-4xl mx-auto"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-4">Admin — Stats</h1>

        <div className="mb-4 flex gap-2">
          <input
            type="password"
            placeholder="Enter admin API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="border px-3 py-2 rounded flex-1"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            onClick={loadStats}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load Stats"}
          </button>
        </div>

        {error && <div className="mb-4 text-red-600">Error: {error}</div>}

        {stats && (
          <div className="bg-white p-4 rounded shadow">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total orders</div>
                <div className="text-lg font-semibold">{stats.totalOrders}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  Total items purchased
                </div>
                <div className="text-lg font-semibold">
                  {stats.totalItemsPurchased}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  Total purchase amount
                </div>
                <div className="text-lg font-semibold">
                  ₹{(stats.totalPurchaseAmount / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  Total discount amount
                </div>
                <div className="text-lg font-semibold">
                  ₹{(stats.totalDiscountAmount / 100).toFixed(2)}
                </div>
              </div>
            </div>

            <h3 className="mt-6 font-semibold">Discount codes</h3>
            <div className="mt-2 space-y-2">
              {Array.isArray(stats.discountCodes) &&
              stats.discountCodes.length ? (
                stats.discountCodes.map((d: any) => (
                  <div
                    key={d.code}
                    className="p-2 border rounded flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono text-sm">{d.code}</div>
                      <div className="text-xs text-gray-500">
                        {d.used
                          ? `Used by ${d.usedBy || "unknown"} at ${
                              d.usedAt
                                ? new Date(d.usedAt).toLocaleString()
                                : ""
                            }`
                          : `Unused — ${d.amountPercent}%`}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      {d.used ? "Used" : "Available"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No discount codes yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
