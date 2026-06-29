"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiLayers, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import CategoryTable from "@/features/categories/components/CategoryTable";
import DeleteCategoryModal from "@/features/categories/components/DeleteCategoryModal";
import Pagination from "@/components/ui/pagination/Pagination";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const { query: search, setQuery: setSearch, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [isActive, setIsActive] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const limit = 10;

  const { data, isPending, isError, error, refetch, isRefetching } = useCategories({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: isActive !== "" ? isActive === "true" : undefined,
  });

  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, [setSearch]);

  const handleIsActive = useCallback((v: string) => {
    setIsActive(v);
    setPage(1);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await deleteCategory(deleteId);
      setDeleteId(null);
    } catch (err) {
      setDeleteError((err as Error)?.message ?? "Failed to delete category");
    }
  }, [deleteId, deleteCategory]);

  const categories = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.filter((c) => !c.isActive).length;
  const isFiltered = search !== "" || isActive !== "";

  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-indigo-100 rounded" />
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl" />)}
        </div>
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-72 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="size-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <FiAlertCircle className="size-7 text-rose-500" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Failed to load categories</h3>
        <p className="text-sm text-slate-500 mb-5 max-w-xs text-center">{(error as Error)?.message ?? "An unexpected error occurred."}</p>
        <button
          onClick={() => refetch()}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        badge="Catalog Management"
        title="Categories"
        description="Manage your sportswear product catalog categories."
        action={
          <Can permission="category.create">
            <Link
              href="/categories/create"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              Add Category
            </Link>
          </Can>
        }
      />

      <StatsGrid columns={3}>
        <StatCard label="Total Categories" value={total} icon={FiLayers} color="indigo" sub="All categories" />
        <StatCard label="Active" value={activeCount} icon={FiCheckCircle} color="emerald" sub="Currently live" />
        <StatCard label="Inactive" value={inactiveCount} icon={FiXCircle} color="rose" sub="Paused categories" />
      </StatsGrid>

      <DataFilterBar
        search={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Search categories by name, slug or description..."
        selectFilters={[
          {
            label: "Status",
            value: isActive,
            onChange: handleIsActive,
            options: [
              { value: "", label: "All Categories" },
              { value: "true", label: "Active Only" },
              { value: "false", label: "Inactive Only" },
            ],
          },
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

      {categories.length > 0 ? (
        <div className="space-y-4">
          <CategoryTable categories={categories} onDelete={(id) => setDeleteId(id)} />
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
            isLoading={isPending}
          />
        </div>
      ) : (
        <EmptyState
          icon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiLayers className="size-6 text-slate-400" />}
          title={isFiltered ? "No matching categories" : "No categories found"}
          description={isFiltered ? "Try refining your search or filter." : "Start organizing your products by adding your first sportswear category today."}
          action={!isFiltered ? (
            <Link
              href="/categories/create"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              Add Category
            </Link>
          ) : undefined}
        />
      )}

      {deleteId && (
        <DeleteCategoryModal
          categoryName={categories.find((c) => c.id === deleteId)?.name ?? ""}
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError ?? undefined}
        />
      )}
    </div>
  );
}
