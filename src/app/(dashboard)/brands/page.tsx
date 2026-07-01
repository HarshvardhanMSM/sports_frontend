"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiPlus, FiBriefcase, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import ListPageLayout from "@/components/common/ListPageLayout";
import { useBrands, useDeleteBrand } from "@/hooks/useBrands";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { BrandListParams } from "@/types/brand.types";
import BrandTable from "@/features/brands/components/BrandTable";
import DeleteBrandModal from "@/features/brands/components/DeleteBrandModal";
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
  const activeCount = data?.data?.activeBrands ?? items.filter((b) => b.isActive).length;
  const inactiveCount = data?.data?.inactiveBrands ?? items.filter((b) => !b.isActive).length;

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
    <ListPageLayout
      badge="Brand Management"
      title="Brands"
      description="Manage sportswear brand partners and manufacturers."
      headerAction={
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
      stats={[
        { label: "Total Brands", value: total, icon: FiBriefcase, color: "indigo", sub: "All brand partners" },
        { label: "Active", value: activeCount, icon: FiCheckCircle, color: "emerald", sub: "Currently live" },
        { label: "Inactive", value: inactiveCount, icon: FiXCircle, color: "rose", sub: "Paused brands" },
      ]}
      statsColumns={3}
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
      isPending={isLoading}
      isError={!!error}
      error={error as Error}
      refetch={refetch}
      hasData={items.length > 0}
      tableComponent={<BrandTable brands={items} onDelete={handleDelete} />}
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPageChange={setPage}
      emptyIcon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiBriefcase className="size-6 text-slate-400" />}
      emptyTitle={isFiltered ? "No matching brands" : "No brands found"}
      emptyDescription={isFiltered ? "No brands match your current filters. Try refining your search query." : "Start tagging your products by adding your first sportswear brand partner today."}
      emptyAction={!isFiltered ? (
        <Link
          href="/brands/create"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          <FiPlus className="size-4" />
          Add Brand
        </Link>
      ) : undefined}
    >
      {deleteTarget && (
        <DeleteBrandModal
          brandName={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}
    </ListPageLayout>
  );
}

