"use client";

import React from "react";
import type { CmsPage } from "@/types/cms.types";
import CmsRowActions from "./CmsRowActions";
import CmsStatusBadge from "./CmsStatusBadge";

const formatPageType = (type: string) => {
  const mapping: Record<string, string> = {
    ABOUT_US: "About Us",
    PRIVACY_POLICY: "Privacy Policy",
    TERMS_AND_CONDITIONS: "Terms & Conditions",
    SHIPPING_POLICY: "Shipping Policy",
    RETURN_POLICY: "Return Policy",
    CONTACT_US: "Contact Us",
    CUSTOM_PAGE: "Custom Page",
  };
  return mapping[type] || type;
};

interface CmsTableProps {
  pages: CmsPage[];
  onDelete: (id: string) => void;
}

export default function CmsTable({ pages, onDelete }: CmsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Slug</th>
            <th className="px-6 py-4">Page Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Last Modified</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pages.map((page) => (
            <tr key={page.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                {page.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                {page.slug}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                {formatPageType(page.pageType || "")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CmsStatusBadge status={page.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                <CmsRowActions id={page.id} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
