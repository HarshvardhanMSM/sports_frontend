"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiLayers, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import ListPageLayout from "@/components/common/ListPageLayout";
import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import CategoryTable from "@/features/categories/components/CategoryTable";
import DeleteCategoryModal from "@/features/categories/components/DeleteCategoryModal";

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
  const total = data?.data?.meta?.total ?? 0;
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const totalCategories = data?.data?.totalCategories ?? 0;
  const activeCount = data?.data?.activeCategories ?? 0;
  const inactiveCount = data?.data?.inactiveCategories ?? 0;
  const isFiltered = search !== "" || isActive !== "";

  return (
    <ListPageLayout
      badge="Catalog Management"
      title="Categories"
      description="Manage your sportswear product catalog categories."
      headerAction={
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
      stats={[
        { label: "Total Categories", value: totalCategories, icon: FiLayers, color: "indigo", sub: "All categories" },
        { label: "Active", value: activeCount, icon: FiCheckCircle, color: "emerald", sub: "Currently live" },
        { label: "Inactive", value: inactiveCount, icon: FiXCircle, color: "rose", sub: "Paused categories" },
      ]}
      statsColumns={3}
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
      isPending={isPending}
      isError={isError}
      error={error as Error}
      refetch={refetch}
      hasData={categories.length > 0}
      tableComponent={<CategoryTable categories={categories} onDelete={(id) => setDeleteId(id)} />}
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPageChange={setPage}
      emptyIcon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiLayers className="size-6 text-slate-400" />}
      emptyTitle={isFiltered ? "No matching categories" : "No categories found"}
      emptyDescription={isFiltered ? "Try refining your search or filter." : "Start organizing your products by adding your first sportswear category today."}
      emptyAction={!isFiltered ? (
        <Link
          href="/categories/create"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
          style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
        >
          <FiPlus className="size-4" />
          Add Category
        </Link>
      ) : undefined}
    >
      {deleteId && (
        <DeleteCategoryModal
          categoryName={categories.find((c) => c.id === deleteId)?.name ?? ""}
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError ?? undefined}
        />
      )}
    </ListPageLayout>
  );
}

