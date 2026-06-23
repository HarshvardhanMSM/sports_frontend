"use client";

import React from "react";
import {
  FiPlus,
  FiFile,
  FiCheckCircle,
  FiEdit,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { Can } from "@/components/common/Can";

interface Page {
  id: string;
  title: string;
  slug: string;
  author: string;
  lastModified: string;
  views: number;
  status: "Published" | "Draft";
}

const pages: Page[] = [
  { id: "pg-1", title: "Homepage", slug: "/", author: "Admin", lastModified: "2026-06-10", views: 45230, status: "Published" },
  { id: "pg-2", title: "About Us", slug: "/about", author: "Admin", lastModified: "2026-05-20", views: 8920, status: "Published" },
  { id: "pg-3", title: "Contact Us", slug: "/contact", author: "Admin", lastModified: "2026-06-01", views: 3450, status: "Published" },
  { id: "pg-4", title: "Sale Landing Page", slug: "/sale", author: "Marketing Team", lastModified: "2026-06-05", views: 12340, status: "Published" },
  { id: "pg-5", title: "Delivery Information", slug: "/delivery", author: "Admin", lastModified: "2026-04-15", views: 6780, status: "Published" },
  { id: "pg-6", title: "Size Guide", slug: "/size-guide", author: "Admin", lastModified: "2026-03-22", views: 9870, status: "Published" },
  { id: "pg-7", title: "Sustainability Page", slug: "/sustainability", author: "Content Team", lastModified: "2026-06-12", views: 0, status: "Draft" },
  { id: "pg-8", title: "Careers", slug: "/careers", author: "HR Team", lastModified: "2026-06-08", views: 0, status: "Draft" },
];

function statusBadge(status: Page["status"]) {
  if (status === "Published") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";
}

export default function PagesPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pages</h1>
          <p className="text-sm text-slate-500">Manage static and dynamic content pages across your storefront.</p>
        </div>
        <Can permission="cms.manage">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <FiPlus className="size-4" /> New Page
          </button>
        </Can>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiFile className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pages</p>
            <p className="text-2xl font-bold text-slate-800">8</p>
            <p className="text-xs text-slate-500 mt-0.5">All content pages</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Published</p>
            <p className="text-2xl font-bold text-slate-800">6</p>
            <p className="text-xs text-slate-500 mt-0.5">Live on storefront</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50">
            <FiEdit className="size-6 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Draft</p>
            <p className="text-2xl font-bold text-slate-800">2</p>
            <p className="text-xs text-slate-500 mt-0.5">Pending publication</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Modified</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Views</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pages.map((pg) => (
              <tr key={pg.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4 text-sm font-semibold text-slate-800">{pg.title}</td>
                <td className="px-4 py-4">
                  <span className="font-mono text-xs text-slate-500">{pg.slug}</span>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{pg.author}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{pg.lastModified}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{pg.views.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(pg.status)}>{pg.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEye className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><FiEdit2 className="size-4" /></button>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><FiTrash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
