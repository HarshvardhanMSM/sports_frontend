"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPlus, FiFile, FiAlertCircle, FiCheckCircle, FiEdit } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { useCmsPages, useDeleteCmsPage } from "@/hooks/useCmsPages";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { CmsPageListParams, CmsPage } from "@/types/cms.types";
import CmsTable from "@/features/cms/components/CmsTable";
import DeleteCmsDialog from "@/features/cms/components/DeleteCmsDialog";
import Pagination from "@/components/ui/pagination/Pagination";

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
  const publishedCount = data?.data?.published ?? 0;
  const draftCount = data?.data?.draft ?? 0;

  const handleDelete = (id: string) => {
    const page = items.find((p) => p.id === id);
    if (page) setDeleteTarget(page);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deletePage(deleteTarget.id);
    setDeleteTarget(null);
  };

  const isFiltered = searchTerm !== "" || statusFilter !== "All";

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Content Management"
        title="CMS Pages"
        description="Manage static and dynamic content pages across your storefront."
        action={
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
        }
      />

      <StatsGrid columns={3}>
        <StatCard label="Total Pages" value={total} icon={FiFile} color="indigo" sub="All content pages" />
        <StatCard label="Published" value={publishedCount} icon={FiCheckCircle} color="emerald" sub="Live on storefront" />
        <StatCard label="Draft" value={draftCount} icon={FiEdit} color="amber" sub="Pending publication" />
      </StatsGrid>

      <DataFilterBar
        search={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        searchPlaceholder="Search pages by title or slug..."
        selectFilters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
            options: [
              { value: "All", label: "All Pages" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ],
          },
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

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
        <EmptyState
          icon={
            isFiltered ? (
              <FiAlertCircle className="size-6 text-slate-400" />
            ) : (
              <FiFile className="size-6 text-slate-400" />
            )
          }
          title={isFiltered ? "No matching pages" : "No pages found"}
          description={
            isFiltered
              ? "No pages match your current filters. Try refining your search query."
              : "Start by creating your first content page."
          }
          action={
            !isFiltered ? (
              <Link
                href="/cms/create"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
              >
                <FiPlus className="size-4" />
                New Page
              </Link>
            ) : undefined
          }
        />
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
