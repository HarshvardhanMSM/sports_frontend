"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPlus, FiBriefcase, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { useBrands, useDeleteBrand } from "@/hooks/useBrands";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { BrandListParams } from "@/types/brand.types";
import BrandTable from "@/features/brands/components/BrandTable";
import DeleteBrandModal from "@/features/brands/components/DeleteBrandModal";
import Pagination from "@/components/ui/pagination/Pagination";
import type { Brand } from "@/types/brand.types";

export default function BrandsPage() {
  const { query: searchTerm, setQuery: setSearchTerm, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const params: BrandListParams = {
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    ...(statusFilter === "active" ? { isActive: true } : {}),
    ...(statusFilter === "inactive" ? { isActive: false } : {}),
  };

  const { data, isLoading, error, isRefetching, refetch } = useBrands(params);
  const { mutateAsync: deleteBrand, isPending: isDeleting } = useDeleteBrand();

  const items = data?.data?.items ?? [];
  const total = data?.data?.meta?.total ?? 0;
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const limit = data?.data?.meta?.limit ?? 10;
  const activeCount = items.filter((b) => b.isActive).length;
  const inactiveCount = items.filter((b) => !b.isActive).length;

  const handleDelete = (id: string) => {
    const brand = items.find((b) => b.id === id);
    if (brand) setDeleteTarget(brand);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteBrand(deleteTarget.id);
    setDeleteTarget(null);
  };

  const isFiltered = searchTerm !== "" || statusFilter !== "All";

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Brand Management"
        title="Brands"
        description="Manage sportswear brand partners and manufacturers."
        action={
          <Can permission="brand.create">
            <Link
              href="/brands/create"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              Add Brand
            </Link>
          </Can>
        }
      />

      <StatsGrid columns={3}>
        <StatCard label="Total Brands" value={total} icon={FiBriefcase} color="indigo" sub="All brand partners" />
        <StatCard label="Active" value={activeCount} icon={FiCheckCircle} color="emerald" sub="Currently live" />
        <StatCard label="Inactive" value={inactiveCount} icon={FiXCircle} color="rose" sub="Paused brands" />
      </StatsGrid>

      <DataFilterBar
        search={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        searchPlaceholder="Search brands by name, slug or description..."
        selectFilters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
            options: [
              { value: "All", label: "All Brands" },
              { value: "active", label: "Active Only" },
              { value: "inactive", label: "Inactive Only" },
            ],
          },
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading brands...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load brands</p>
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
          <BrandTable brands={items} onDelete={handleDelete} />
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
          icon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiBriefcase className="size-6 text-slate-400" />}
          title={isFiltered ? "No matching brands" : "No brands found"}
          description={isFiltered ? "No brands match your current filters. Try refining your search query." : "Start tagging your products by adding your first sportswear brand partner today."}
          action={!isFiltered ? (
            <Link
              href="/brands/create"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              Add Brand
            </Link>
          ) : undefined}
        />
      )}

      {deleteTarget && (
        <DeleteBrandModal
          brandName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
