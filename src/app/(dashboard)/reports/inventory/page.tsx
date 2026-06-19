"use client";

import React from "react";
import {
  FiDollarSign,
  FiRefreshCw,
  FiAlertTriangle,
  FiArchive,
  FiDownload,
} from "react-icons/fi";

interface StockHealthCard {
  label: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

interface InventoryCategory {
  category: string;
  skus: number;
  units: number;
  value: number;
  turnover: string;
  daysOfStock: number;
  status: "Healthy" | "Overstocked" | "At Risk";
}

interface StockMovement {
  product: string;
  inbound: number;
  outbound: number;
  returns: number;
  netChange: string;
  closingStock: number;
}

const stockHealth: StockHealthCard[] = [
  {
    label: "Healthy Stock",
    count: 134,
    percentage: 85.9,
    color: "emerald",
    description: "Items with stock above threshold",
  },
  {
    label: "Low Stock",
    count: 8,
    percentage: 5.1,
    color: "amber",
    description: "Items near reorder threshold",
  },
  {
    label: "Out of Stock",
    count: 5,
    percentage: 3.2,
    color: "red",
    description: "Items with zero inventory",
  },
];

const inventoryCategories: InventoryCategory[] = [
  {
    category: "Footwear",
    skus: 45,
    units: 892,
    value: 98450,
    turnover: "3.8x",
    daysOfStock: 96,
    status: "Healthy",
  },
  {
    category: "Apparel",
    skus: 38,
    units: 1240,
    value: 67800,
    turnover: "2.9x",
    daysOfStock: 126,
    status: "Healthy",
  },
  {
    category: "Accessories",
    skus: 28,
    units: 580,
    value: 23450,
    turnover: "2.1x",
    daysOfStock: 174,
    status: "Overstocked",
  },
  {
    category: "Equipment",
    skus: 12,
    units: 98,
    value: 45200,
    turnover: "1.4x",
    daysOfStock: 261,
    status: "Overstocked",
  },
  {
    category: "Footwear – Cleats",
    skus: 18,
    units: 320,
    value: 52300,
    turnover: "4.1x",
    daysOfStock: 89,
    status: "Healthy",
  },
];

const stockMovements: StockMovement[] = [
  {
    product: "Nike Air Zoom Pegasus 40",
    inbound: 100,
    outbound: 89,
    returns: 3,
    netChange: "+14",
    closingStock: 45,
  },
  {
    product: "Adidas Tiro Training Pants",
    inbound: 150,
    outbound: 134,
    returns: 4,
    netChange: "+20",
    closingStock: 120,
  },
  {
    product: "Under Armour Compression Tee",
    inbound: 200,
    outbound: 178,
    returns: 2,
    netChange: "+24",
    closingStock: 200,
  },
  {
    product: "Puma Future Ultimate FG",
    inbound: 20,
    outbound: 14,
    returns: 1,
    netChange: "+7",
    closingStock: 8,
  },
  {
    product: "Nike Elite Basketball Socks",
    inbound: 0,
    outbound: 12,
    returns: 0,
    netChange: "-12",
    closingStock: 0,
  },
];

const statusBadge: Record<string, string> = {
  Healthy:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700",
  Overstocked:
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700",
  "At Risk":
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700",
};

const ringColors: Record<string, string> = {
  emerald: "text-emerald-600",
  amber: "text-amber-600",
  red: "text-red-600",
};

const bgColors: Record<string, string> = {
  emerald: "bg-emerald-50 border-emerald-200",
  amber: "bg-amber-50 border-amber-200",
  red: "bg-red-50 border-red-200",
};

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
            Stock health, valuation, and movement analytics for smarter
            purchasing decisions.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors self-start sm:self-auto">
          <FiDownload className="size-4" />
          Export Report
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
              Total Stock Value
            </p>
            <p className="text-2xl font-bold text-slate-800">$245,380</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Current inventory value
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
            <p className="text-xs text-slate-500 mt-0.5">
              Annual turnover rate
            </p>
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
            <p className="text-xs text-slate-500 mt-0.5">Low or out of stock</p>
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
            <p className="text-xs text-slate-500 mt-0.5">Unsold 90+ days</p>
          </div>
        </div>
      </div>

      {/* Stock Health Summary */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">
          Stock Health Summary
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stockHealth.map((card) => (
            <div
              key={card.label}
              className={`rounded-xl border p-6 text-center ${bgColors[card.color]} shadow-sm`}
            >
              <p
                className={`text-4xl font-black mb-1 ${ringColors[card.color]}`}
              >
                {card.percentage}%
              </p>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {card.count} items
              </p>
              <p
                className={`text-sm font-semibold mb-1 ${ringColors[card.color]}`}
              >
                {card.label}
              </p>
              <p className="text-xs text-slate-500">{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory by Category */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">
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
                  Stock Value ($)
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Turnover Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Days of Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inventoryCategories.map((row) => (
                <tr
                  key={row.category}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                    {row.category}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.skus}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.units.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    ${row.value.toLocaleString("en-US")}
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                    {row.turnover}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.daysOfStock} days
                  </td>
                  <td className="px-4 py-4">
                    <span className={statusBadge[row.status]}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Stock Movements */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">
          Top Stock Movements – Last 30 Days
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Inbound
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Outbound
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Returns
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Net Change
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Closing Stock
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockMovements.map((row) => (
                <tr
                  key={row.product}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">
                    {row.product}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.inbound}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.outbound}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    {row.returns}
                  </td>
                  <td className="px-4 py-4 text-sm font-bold">
                    <span
                      className={
                        row.netChange.startsWith("+")
                          ? "text-emerald-600"
                          : "text-red-600"
                      }
                    >
                      {row.netChange}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <span
                      className={
                        row.closingStock === 0
                          ? "text-red-600 font-semibold"
                          : "text-slate-700"
                      }
                    >
                      {row.closingStock}
                    </span>
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
