"use client";

import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiFileText, FiToggleRight, FiSave, FiRotateCcw } from "react-icons/fi";

interface TaxRate {
  name: string;
  rate: string;
  appliesTo: string;
  region: string;
  status: "Active" | "Inactive";
}

const TAX_RATES: TaxRate[] = [
  { name: "GST – Standard", rate: "17%", appliesTo: "All Products", region: "Pakistan", status: "Active" },
  { name: "GST – Reduced", rate: "5%", appliesTo: "Essential Goods", region: "Pakistan", status: "Active" },
  { name: "VAT – UAE", rate: "5%", appliesTo: "All Products", region: "United Arab Emirates", status: "Active" },
  { name: "VAT – UK", rate: "20%", appliesTo: "All Products", region: "United Kingdom", status: "Active" },
  { name: "Sales Tax – US", rate: "8.5%", appliesTo: "All Products", region: "United States", status: "Inactive" },
];

export default function TaxSettingsPage() {
  const [enableTax, setEnableTax] = useState(true);
  const [pricesWithTax, setPricesWithTax] = useState(true);
  const [taxOnShipping, setTaxOnShipping] = useState(false);
  const [taxExemptWholesale, setTaxExemptWholesale] = useState(true);

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tax Settings</h1>
          <p className="text-sm text-slate-500">Configure sales tax, GST, and regional tax rules for your store.</p>
        </div>
      </div>

      {/* Section 1: Tax Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">Tax Configuration</h2>
          <p className="text-sm text-slate-500 mt-0.5">Global tax behaviour settings for your storefront and orders.</p>
        </div>
        <div className="p-6 space-y-0">
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-700">Enable Tax Calculation</p>
              <p className="text-xs text-slate-400 mt-0.5">Automatically calculate taxes on orders.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={enableTax} onChange={() => setEnableTax(!enableTax)} className="sr-only peer" />
              <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-700">Display Prices with Tax</p>
              <p className="text-xs text-slate-400 mt-0.5">Show tax-inclusive prices to customers.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={pricesWithTax} onChange={() => setPricesWithTax(!pricesWithTax)} className="sr-only peer" />
              <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-slate-700">Tax on Shipping</p>
              <p className="text-xs text-slate-400 mt-0.5">Apply tax to shipping charges.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={taxOnShipping} onChange={() => setTaxOnShipping(!taxOnShipping)} className="sr-only peer" />
              <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
            </label>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">Tax Exempt Orders from Wholesalers</p>
              <p className="text-xs text-slate-400 mt-0.5">Skip tax for the Wholesale Buyers customer group.</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" checked={taxExemptWholesale} onChange={() => setTaxExemptWholesale(!taxExemptWholesale)} className="sr-only peer" />
              <div className="h-5 w-10 rounded-full bg-slate-200 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-5 peer-focus:ring-2 peer-focus:ring-indigo-100"></div>
            </label>
          </div>
        </div>
        <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Reset</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">Save Changes</button>
        </div>
      </div>

      {/* Section 2: Tax Rates Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Tax Rates</h2>
            <p className="text-sm text-slate-500 mt-0.5">Manage tax rates per region and product category.</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <FiPlus className="size-4" />
            Add Tax Rate
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tax Name</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Rate (%)</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Applies To</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Region</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TAX_RATES.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">{row.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                      <FiPercent className="size-3" />
                      {row.rate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.appliesTo}</td>
                  <td className="px-6 py-4 text-slate-600">{row.region}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                        <FiEdit2 className="size-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <FiTrash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Tax Invoice Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">Tax Invoice Settings</h2>
          <p className="text-sm text-slate-500 mt-0.5">Configure legal and compliance details that appear on tax invoices.</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company Tax Number / GST Number</label>
              <input
                type="text"
                defaultValue="GST-2345678-9"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Invoice Prefix</label>
              <input
                type="text"
                defaultValue="INV-"
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Legal Name</label>
            <input
              type="text"
              defaultValue="SportswearAdmin (Pvt.) Ltd."
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tax Invoice Footer Note</label>
            <textarea
              rows={2}
              defaultValue="This is a computer-generated invoice and does not require a signature."
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none transition-all"
            />
          </div>
        </div>
        <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Reset</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
