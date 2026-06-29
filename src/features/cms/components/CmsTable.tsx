"use client";

import React from "react";
import { DataTable, type Column } from "@/components/common/table/DataTable";
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
  const columns: Column<CmsPage>[] = [
    { key: "title", header: "Title", render: (p) => <span className="font-semibold text-slate-800">{p.title}</span> },
    { key: "slug", header: "Slug", render: (p) => <span className="text-xs text-slate-400 font-mono">{p.slug}</span> },
    { key: "pageType", header: "Page Type", render: (p) => <span className="text-xs font-semibold text-slate-600">{formatPageType(p.pageType || "")}</span> },
    { key: "status", header: "Status", render: (p) => <CmsStatusBadge status={p.status} /> },
    { key: "updatedAt", header: "Last Modified", render: (p) => <span className="text-slate-500">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "-"}</span> },
    { key: "actions", header: "Actions", headerClassName: "text-right", cellClassName: "px-6 py-4 whitespace-nowrap text-right text-xs", render: (p) => <CmsRowActions id={p.id} onDelete={onDelete} /> },
  ];

  return <DataTable columns={columns} data={pages} keyExtractor={(p) => p.id} />;
}
