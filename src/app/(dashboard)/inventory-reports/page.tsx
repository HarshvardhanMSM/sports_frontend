"use client";

import React from "react";
import {
  FiDollarSign,
  FiRefreshCw,
  FiAlertTriangle,
  FiArchive,
  FiDownload,
} from "react-icons/fi";

interface CategoryReport {
  category: string;
  skus: number;
  totalUnits: number;
  value: number;
  avgTurnover: string;
  lowStockItems: number;
}

interface SlowMovingProduct {
  product: string;
  sku: string;
  stock: number;
  daysSinceLastSale: number;
  value: number;
}

const CATEGORY_REPORTS: CategoryReport[] = [
  {
    category: "Footwear",
    skus: 45,
    totalUnits: 892,
    value: 98450,
    avgTurnover: "3.8x",
    lowStockItems: 4,
  },
  {
    category: "Apparel",
    skus: 38,
    totalUnits: 1240,
    value: 67800,
    avgTurnover: "2.9x",
    lowStockItems: 3,
  },
  {
    category: "Accessories",
    skus: 28,
    totalUnits: 580,
    value: 23450,
    avgTurnover: "2.1x",
    lowStockItems: 5,
  },
  {
    category: "Equipment",
    skus: 12,
    totalUnits: 98,
    value: 45200,
    avgTurnover: "1.4x",
    lowStockItems: 1,
  },
  {
    category: "Footwear – Cleats",
    skus: 18,
    totalUnits: 320,
    value: 52300,
    avgTurnover: "4.1x",
    lowStockItems: 0,
  },
];

const SLOW_MOVING: SlowMovingProduct[] = [
  {
    product: "Nike React Infinity Run 3",
    sku: "NK-RIR3-005",
    stock: 45,
    daysSinceLastSale: 67,
    value: 5850,
  },
  {
    product: "Adidas Response Run Shoes",
    sku: "AD-RSP-RUN-04",
    stock: 38,
    daysSinceLastSale: 54,
    value: 2470,
  },
  {
    product: "Equipment – Resistance Band Set",
    sku: "EQ-RBS-001",
    stock: 22,
    daysSinceLastSale: 89,
    value: 880,
  },
  {
    product: "Puma Softride Premier Slip-On",
    sku: "PM-SRPO-002",
    stock: 0,
    daysSinceLastSale: 120,
    value: 0,
  },
  {
    product: "Under Armour Cold Gear Hoodie",
    sku: "UA-CGH-003",
    stock: 17,
    daysSinceLastSale: 45,
    value: 1190,
  },
];

export default function InventoryReportsPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Inventory Reports
          </h1>
          <p className="text-sm text-slate-500">
            Comprehensive inventory valuation, turnover, and performance
            analysis.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiDownload className="size-4" /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiDollarSign className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Inventory Value
            </p>
            <p className="text-2xl font-bold text-slate-800">$245,380</p>
            <p className="text-xs text-slate-500 mt-0.5">
              current stock valuation
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiRefreshCw className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Stock Turnover
            </p>
            <p className="text-2xl font-bold text-slate-800">3.2x</p>
            <p className="text-xs text-slate-500 mt-0.5">average annual rate</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiAlertTriangle className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Items at Risk
            </p>
            <p className="text-2xl font-bold text-slate-800">13</p>
            <p className="text-xs text-slate-500 mt-0.5">low / out of stock</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiArchive className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Dead Stock Value
            </p>
            <p className="text-2xl font-bold text-slate-800">$8,920</p>
            <p className="text-xs text-slate-500 mt-0.5">unsold for 90+ days</p>
          </div>
        </div>
      </div>

      {/* Inventory by Category */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">
          Inventory by Category
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  SKUs
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Units
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Value ($)
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Avg Turnover
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Low Stock Items
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CATEGORY_REPORTS.map((row) => (
                <tr
                  key={row.category}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-800">
                    {row.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.skus}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.totalUnits.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    ${row.value.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {row.avgTurnover}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {row.lowStockItems > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                        {row.lowStockItems}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        0
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slow-Moving Products */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 mb-3">
          Top 5 Slow-Moving Products
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Days Since Last Sale
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Est. Value ($)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SLOW_MOVING.map((row) => (
                <tr
                  key={row.sku}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-800">
                    {row.product}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500 font-mono">
                    {row.sku}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-800">
                    {row.stock}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-sm font-semibold ${row.daysSinceLastSale > 60 ? "text-red-600" : "text-slate-700"}`}
                    >
                      {row.daysSinceLastSale} days
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    ${row.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
