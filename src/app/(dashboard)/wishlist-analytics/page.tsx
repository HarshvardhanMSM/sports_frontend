"use client";

import React from "react";
import {
  FiHeart,
  FiShoppingBag,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";

interface WishlistProduct {
  rank: number;
  product: string;
  category: string;
  price: number;
  wishlists: number;
  conversionRate: string;
  revenue: number;
}

interface MonthlyActivity {
  month: string;
  newWishlists: number;
  removed: number;
  conversions: number;
}

const WISHLIST_PRODUCTS: WishlistProduct[] = [
  {
    rank: 1,
    product: "Nike Air Zoom Pegasus 40",
    category: "Footwear",
    price: 130.0,
    wishlists: 234,
    conversionRate: "22.3%",
    revenue: 6782.6,
  },
  {
    rank: 2,
    product: "Adidas Ultraboost 22",
    category: "Footwear",
    price: 180.0,
    wishlists: 198,
    conversionRate: "19.8%",
    revenue: 7098.0,
  },
  {
    rank: 3,
    product: "Puma Future Ultimate FG",
    category: "Footwear",
    price: 220.0,
    wishlists: 156,
    conversionRate: "15.4%",
    revenue: 5318.8,
  },
  {
    rank: 4,
    product: "Under Armour Compression Tee",
    category: "Apparel",
    price: 35.0,
    wishlists: 143,
    conversionRate: "28.7%",
    revenue: 1439.05,
  },
  {
    rank: 5,
    product: "Nike Dri-FIT Training Shorts",
    category: "Apparel",
    price: 42.0,
    wishlists: 128,
    conversionRate: "24.2%",
    revenue: 1299.84,
  },
  {
    rank: 6,
    product: "Adidas Tiro Training Pants",
    category: "Apparel",
    price: 45.0,
    wishlists: 112,
    conversionRate: "21.4%",
    revenue: 1076.4,
  },
  {
    rank: 7,
    product: "Puma Gym Bag Pro",
    category: "Accessories",
    price: 65.0,
    wishlists: 98,
    conversionRate: "16.3%",
    revenue: 1039.05,
  },
  {
    rank: 8,
    product: "Nike Elite Basketball Socks",
    category: "Accessories",
    price: 14.0,
    wishlists: 87,
    conversionRate: "31.0%",
    revenue: 377.58,
  },
];

const MONTHLY_ACTIVITY: MonthlyActivity[] = [
  { month: "Jan 2026", newWishlists: 89, removed: 23, conversions: 18 },
  { month: "Feb 2026", newWishlists: 112, removed: 34, conversions: 24 },
  { month: "Mar 2026", newWishlists: 134, removed: 28, conversions: 31 },
  { month: "Apr 2026", newWishlists: 98, removed: 19, conversions: 22 },
  { month: "May 2026", newWishlists: 156, removed: 41, conversions: 38 },
  { month: "Jun 2026", newWishlists: 78, removed: 12, conversions: 19 },
];

const CATEGORY_COLORS: Record<string, string> = {
  Footwear: "bg-indigo-50 text-indigo-700",
  Apparel: "bg-emerald-50 text-emerald-700",
  Accessories: "bg-amber-50 text-amber-700",
};

export default function WishlistAnalyticsPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Wishlist Analytics
          </h1>
          <p className="text-sm text-slate-500">
            Understand customer intent by analyzing wishlisted products and
            conversion patterns.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiHeart className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Wishlists
            </p>
            <p className="text-2xl font-bold text-slate-800">892</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Active customer wishlists
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiShoppingBag className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Products Wishlisted
            </p>
            <p className="text-2xl font-bold text-slate-800">2,340</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Unique product saves
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiBarChart2 className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Items / Wishlist
            </p>
            <p className="text-2xl font-bold text-slate-800">2.6</p>
            <p className="text-xs text-slate-500 mt-0.5">Items per customer</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
            <FiTrendingUp className="size-6 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Wishlist Conversion
            </p>
            <p className="text-2xl font-bold text-slate-800">18.4%</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Wishlist to purchase rate
            </p>
          </div>
        </div>
      </div>

      {/* Most Wishlisted Products */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800">
            Most Wishlisted Products
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by total wishlist saves
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Wishlists
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Conversion Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Est. Revenue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {WISHLIST_PRODUCTS.map((p) => (
              <tr
                key={p.rank}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      p.rank === 1
                        ? "bg-amber-100 text-amber-700"
                        : p.rank === 2
                          ? "bg-slate-100 text-slate-600"
                          : p.rank === 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-50 text-slate-500"
                    }`}
                  >
                    {p.rank}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                  {p.product}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[p.category] ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {p.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${Math.round((p.wishlists / 234) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {p.wishlists}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-semibold text-emerald-600">
                    {p.conversionRate}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                  ${p.revenue.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-800">
            Wishlist Activity by Month
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monthly breakdown of wishlist additions, removals, and conversions
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                New Adds
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Removed
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Conversions
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                Net Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MONTHLY_ACTIVITY.map((m) => {
              const net = m.newWishlists - m.removed;
              return (
                <tr
                  key={m.month}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                    {m.month}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-400"></span>
                      {m.newWishlists}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
                      {m.removed}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                      {m.conversions}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-sm font-bold ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {net >= 0 ? "+" : ""}
                      {net}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
