"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPlus, FiFile, FiAlertCircle, FiCheckCircle, FiEdit } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { useCmsPages, useDeleteCmsPage } from "@/hooks/useCmsPages";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { CmsPageListParams, CmsPage } from "@/types/cms.types";
import CmsTable from "@/features/cms/components/CmsTable";
import DeleteCmsDialog from "@/features/cms/components/DeleteCmsDialog";
import Pagination from "@/components/ui/pagination/Pagination";
import Select from "@/components/ui/select/Select";

const statusOptions = [
  { value: "All", label: "All Pages" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export default function CmsPagesPage() {
  const { query: searchTerm, setQuery: setSearchTerm, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<CmsPage | null>(null);
  
  const params: CmsPageListParams = {
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    ...(statusFilter === "published" ? { status: "PUBLISHED" } : {}),
    ...(statusFilter === "draft" ? { status: "DRAFT" } : {}),
  };

  const { data, isLoading, error, isRefetching, refetch } = useCmsPages(params);
  const { mutateAsync: deletePage, isPending: isDeleting } = useDeleteCmsPage();

  const items = data?.data?.items ?? [];
  const total = data?.data?.meta?.total ?? 0;
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const limit = data?.data?.meta?.limit ?? 10;
  const publishedCount = items.filter((p) => p.status === "PUBLISHED").length;
  const draftCount = items.filter((p) => p.status === "DRAFT").length;

  const handleDelete = (id: string) => {
    const page = items.find((p) => p.id === id);
    if (page) setDeleteTarget(page);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deletePage(deleteTarget.id);
    setDeleteTarget(null);
  };

  const STAT_CARDS = [
    { label: "Total Pages", value: total, icon: FiFile, bg: "from-indigo-500 to-indigo-600", sub: "All content pages" },
    { label: "Published", value: publishedCount, icon: FiCheckCircle, bg: "from-emerald-500 to-emerald-600", sub: "Live on storefront" },
    { label: "Draft", value: draftCount, icon: FiEdit, bg: "from-amber-500 to-amber-600", sub: "Pending publication" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Content Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">CMS Pages</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage static and dynamic content pages across your storefront.</p>
        </div>
        <Can permission="cms.manage">
          <Link
            href="/cms/create"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiPlus className="size-4" />
            New Page
          </Link>
        </Can>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, bg }) => (
          <div key={label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
            <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
            <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
              <Icon className="size-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <FiAlertCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search pages by title or slug..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
          <Select
            value={statusFilter}
            onChange={(val) => { setStatusFilter(val); setPage(1); }}
            options={statusOptions}
            className="min-w-[130px]"
          />
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
            title="Refresh"
          >
            <FiAlertCircle className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading pages...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load pages</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          <CmsTable pages={items} onDelete={handleDelete} />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            {searchTerm || statusFilter !== "All" ? (
              <FiAlertCircle className="size-6 text-slate-400" />
            ) : (
              <FiFile className="size-6 text-slate-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || statusFilter !== "All" ? "No matching pages" : "No pages found"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            {searchTerm || statusFilter !== "All"
              ? "No pages match your current filters. Try refining your search query."
              : "Start by creating your first content page."}
          </p>
          {!searchTerm && statusFilter === "All" && (
            <Link
              href="/cms/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              New Page
            </Link>
          )}
        </div>
      )}

      {deleteTarget && (
        <DeleteCmsDialog
          pageTitle={deleteTarget.title}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
