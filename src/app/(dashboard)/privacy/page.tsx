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
  { version: "v1.4", date: "2026-06-01", author: "Admin", note: "Added GDPR compliance section" },
  { version: "v1.3", date: "2026-02-10", author: "Admin", note: "Updated cookie policy" },
  { version: "v1.2", date: "2025-11-15", author: "Admin", note: "Added data retention policy" },
  { version: "v1.1", date: "2025-07-01", author: "Admin", note: "Initial comprehensive privacy policy" },
];

const privacyContent = `1. INFORMATION WE COLLECT

We collect information you provide directly: name, email, shipping address, payment details, and purchase history.

2. HOW WE USE YOUR INFORMATION

Your data is used to process orders, send confirmations, provide customer support, and improve our services.

3. DATA SHARING

We do not sell your personal data. We share data only with service providers necessary to fulfill orders (couriers, payment processors).

4. COOKIES

We use cookies to enhance your shopping experience and analyze website traffic. You may disable cookies in your browser settings.

5. DATA SECURITY

We implement industry-standard security measures including SSL encryption to protect your personal information.

6. YOUR RIGHTS

You have the right to access, correct, or delete your personal data. Contact privacy@sportswearadmin.com to exercise these rights.

7. RETENTION

We retain your data for as long as your account is active and for 7 years after to comply with tax and legal obligations.`;

export default function PrivacyPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Manage and publish your store&apos;s Privacy Policy for customers.</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Content Editor */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-800">Current Privacy Policy</h2>
              <p className="text-sm text-slate-500 mt-0.5">Version 1.4 — Last updated June 1, 2026</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              Published
            </span>
          </div>
          <div className="p-6 space-y-4">
            <textarea
              rows={16}
              defaultValue={privacyContent}
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
