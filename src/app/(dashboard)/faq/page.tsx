"use client";

import React, { useState } from "react";
import {
  FiPlus,
  FiHelpCircle,
  FiLayers,
  FiEye,
  FiSearch,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { Can } from "@/components/common/Can";

interface FAQ {
  id: string;
  question: string;
  category: string;
  views: number;
  status: "Published" | "Draft";
  lastUpdated: string;
}

const faqs: FAQ[] = [
  { id: "faq-1", question: "What is your return policy?", category: "Returns & Refunds", views: 4560, status: "Published", lastUpdated: "2026-05-10" },
  { id: "faq-2", question: "How long does shipping take?", category: "Shipping", views: 3890, status: "Published", lastUpdated: "2026-05-12" },
  { id: "faq-3", question: "How do I find the right shoe size?", category: "Products", views: 3210, status: "Published", lastUpdated: "2026-04-20" },
  { id: "faq-4", question: "Can I change or cancel my order?", category: "Orders", views: 2890, status: "Published", lastUpdated: "2026-05-08" },
  { id: "faq-5", question: "What payment methods do you accept?", category: "Payments", views: 2450, status: "Published", lastUpdated: "2026-04-15" },
  { id: "faq-6", question: "Do you offer international shipping?", category: "Shipping", views: 1980, status: "Published", lastUpdated: "2026-05-01" },
  { id: "faq-7", question: "How do I use a coupon code?", category: "Payments", views: 1650, status: "Published", lastUpdated: "2026-05-05" },
  { id: "faq-8", question: "Are your products authentic?", category: "Products", views: 1430, status: "Published", lastUpdated: "2026-04-10" },
  { id: "faq-9", question: "What is your warranty policy?", category: "Returns & Refunds", views: 1230, status: "Draft", lastUpdated: "2026-06-10" },
  { id: "faq-10", question: "How do I track my shipment?", category: "Shipping", views: 980, status: "Published", lastUpdated: "2026-03-28" },
];

const categoryColors: Record<string, string> = {
  "Returns & Refunds": "bg-rose-50 text-rose-700",
  Shipping: "bg-blue-50 text-blue-700",
  Products: "bg-indigo-50 text-indigo-700",
  Orders: "bg-amber-50 text-amber-700",
  Payments: "bg-emerald-50 text-emerald-700",
};

const categories = ["All", "Returns & Refunds", "Shipping", "Products", "Orders", "Payments"];

function statusBadge(status: FAQ["status"]) {
  if (status === "Published") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = faqs.filter((f) => {
    const matchSearch = f.question.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || f.category === categoryFilter;
    const matchStatus = statusFilter === "All" || f.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">FAQ Management</h1>
          <p className="text-sm text-slate-500">Manage frequently asked questions displayed on your storefront.</p>
        </div>
        <Can permission="cms.manage">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <FiPlus className="size-4" /> Add Question
          </button>
        </Can>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiHelpCircle className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total FAQs</p>
            <p className="text-2xl font-bold text-slate-800">28</p>
            <p className="text-xs text-slate-500 mt-0.5">All questions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiLayers className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Categories</p>
            <p className="text-2xl font-bold text-slate-800">5</p>
            <p className="text-xs text-slate-500 mt-0.5">Question categories</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <FiEye className="size-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Views</p>
            <p className="text-2xl font-bold text-slate-800">23,450</p>
            <p className="text-xs text-slate-500 mt-0.5">Across all FAQs</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Question</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Views</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((faq) => (
              <tr key={faq.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm text-slate-700 max-w-sm">
                  <span title={faq.question}>
                    {faq.question.length > 60 ? faq.question.slice(0, 60) + "…" : faq.question}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[faq.category] ?? "bg-slate-100 text-slate-600"}`}>
                    {faq.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{faq.views.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(faq.status)}>{faq.status}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{faq.lastUpdated}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No FAQs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
