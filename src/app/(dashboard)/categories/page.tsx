"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiLayers, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import CategoryTable from "@/features/categories/components/CategoryTable";
import CategoryFilters from "@/features/categories/components/CategoryFilters";
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

  const STAT_CARDS = [
    { icon: FiLayers, label: "Total Categories", value: total, bg: "from-indigo-500 to-indigo-600", sub: "All categories" },
    { icon: FiCheckCircle, label: "Active", value: activeCount, bg: "from-emerald-500 to-emerald-600", sub: "Currently live" },
    { icon: FiXCircle, label: "Inactive", value: inactiveCount, bg: "from-rose-500 to-rose-600", sub: "Paused categories" },
  ];

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
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Catalog Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your sportswear product catalog categories.</p>
        </div>
        <Link
          href="/categories/create"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          <FiPlus className="size-4" />
          Add Category
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STAT_CARDS.map(({ icon: Icon, label, value, bg, sub }) => (
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

      <CategoryFilters
        search={search}
        onSearchChange={handleSearch}
        isActive={isActive}
        onIsActiveChange={handleIsActive}
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            {search || isActive ? (
              <FiAlertCircle className="size-6 text-slate-400" />
            ) : (
              <FiLayers className="size-6 text-slate-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {search || isActive ? "No matching categories" : "No categories found"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            {search || isActive
              ? "Try refining your search or filter."
              : "Start organizing your products by adding your first sportswear category today."}
          </p>
          {!search && !isActive && (
            <Link
              href="/categories/create"
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
            >
              <FiPlus className="size-4" />
              Add Category
            </Link>
          )}
        </div>
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
