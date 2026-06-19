"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPlus, FiBriefcase, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useBrands, useDeleteBrand } from "@/hooks/useBrands";
import type { BrandListParams } from "@/types/brand.types";
import BrandTable from "@/features/brands/components/BrandTable";
import BrandFilters from "@/features/brands/components/BrandFilters";
import DeleteBrandModal from "@/features/brands/components/DeleteBrandModal";
import Pagination from "@/components/ui/pagination/Pagination";
import type { Brand } from "@/types/brand.types";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const params: BrandListParams = {
    page,
    limit: 10,
    search: searchTerm || undefined,
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

  const STAT_CARDS = [
    { label: "Total Brands", value: total, icon: FiBriefcase, bg: "from-indigo-500 to-indigo-600", sub: "All brand partners" },
    { label: "Active", value: activeCount, icon: FiCheckCircle, bg: "from-emerald-500 to-emerald-600", sub: "Currently live" },
    { label: "Inactive", value: inactiveCount, icon: FiXCircle, bg: "from-rose-500 to-rose-600", sub: "Paused brands" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Brand Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Brands</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage sportswear brand partners and manufacturers.</p>
        </div>
        <Link
          href="/brands/create"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          <FiPlus className="size-4" />
          Add Brand
        </Link>
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

      <BrandFilters
        search={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
        onRefresh={() => refetch()}
        isRefetching={isRefetching}
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            {searchTerm || statusFilter !== "All" ? (
              <FiAlertCircle className="size-6 text-slate-400" />
            ) : (
              <FiBriefcase className="size-6 text-slate-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || statusFilter !== "All" ? "No matching brands" : "No brands found"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            {searchTerm || statusFilter !== "All"
              ? "No brands match your current filters. Try refining your search query."
              : "Start tagging your products by adding your first sportswear brand partner today."}
          </p>
          {!searchTerm && statusFilter === "All" && (
            <Link
              href="/brands/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              Add Brand
            </Link>
          )}
        </div>
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
