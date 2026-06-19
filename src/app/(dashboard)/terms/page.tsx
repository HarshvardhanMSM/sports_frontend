"use client";

import React from "react";
import { FiEye } from "react-icons/fi";

interface Version {
  version: string;
  date: string;
  author: string;
  note: string;
}

const versions: Version[] = [
  { version: "v2.1", date: "2026-06-01", author: "Admin", note: "Added section on digital downloads" },
  { version: "v2.0", date: "2026-03-15", author: "Admin", note: "Major update: new return policy terms" },
  { version: "v1.3", date: "2025-12-01", author: "Admin", note: "Updated shipping section" },
  { version: "v1.2", date: "2025-09-10", author: "Admin", note: "Added dispute resolution clause" },
  { version: "v1.1", date: "2025-06-20", author: "Admin", note: "Minor corrections and clarifications" },
];

const termsContent = `1. ACCEPTANCE OF TERMS

By accessing and using the SportswearAdmin online store, you accept and agree to be bound by these Terms and Conditions.

2. PRODUCTS AND PRICING

All prices are displayed in USD and are subject to change without notice. We reserve the right to modify product descriptions, pricing, and availability at any time.

3. ORDERING PROCESS

Orders are confirmed via email upon successful payment. We reserve the right to refuse or cancel any order at our discretion.

4. SHIPPING AND DELIVERY

Delivery times are estimates and may vary. We are not responsible for delays caused by third-party couriers or customs clearance.

5. RETURNS AND REFUNDS

Items may be returned within 30 days of delivery in original, unworn condition with tags attached. Refunds are processed within 5–7 business days.

6. INTELLECTUAL PROPERTY

All content on this website is the property of SportswearAdmin and may not be reproduced without written permission.

7. CONTACT INFORMATION

For any questions regarding these terms, contact us at legal@sportswearadmin.com`;

export default function TermsPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Terms & Conditions</h1>
          <p className="text-sm text-slate-500">Manage and publish the Terms & Conditions for your storefront.</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Content Editor */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Current Terms & Conditions</h2>
              <p className="text-sm text-slate-500 mt-0.5">Version 2.1 — Last updated June 1, 2026</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              Published
            </span>
          </div>
          <div className="p-6 space-y-4">
            <textarea
              rows={16}
              defaultValue={termsContent}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 font-mono leading-relaxed resize-none"
            />
            <div className="flex justify-end gap-3">
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Save Draft
              </button>
              <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                Publish Update
              </button>
            </div>
          </div>
        </div>

        {/* Right: Version History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-800">Version History</h2>
          </div>
          <div className="p-4 space-y-3">
            {versions.map((v) => (
              <div key={v.version} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 font-mono">
                      {v.version}
                    </span>
                    <span className="text-xs text-slate-400">{v.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600">{v.author}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{v.note}</p>
                </div>
                <button className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <FiEye className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
