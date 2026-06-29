"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiGrid, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { useSubCategories, useDeleteSubCategory } from "@/hooks/useSubCategories";
import { useCategories } from "@/hooks/useCategories";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import SubCategoryTable from "@/features/sub-categories/components/SubCategoryTable";
import DeleteSubCategoryModal from "@/features/sub-categories/components/DeleteSubCategoryModal";
import Pagination from "@/components/ui/pagination/Pagination";

export default function SubCategoriesPage() {
  const [page, setPage] = useState(1);
  const { query: search, setQuery: setSearch, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [categoryId, setCategoryId] = useState("");
  const [isActive, setIsActive] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const limit = 10;

  const { data, isPending, isError, error, refetch, isRefetching } = useSubCategories({
    page,
    limit,
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
    isActive: isActive !== "" ? isActive === "true" : undefined,
  });

  const { mutateAsync: deleteSubCat, isPending: isDeleting } = useDeleteSubCategory();

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, [setSearch]);
  const handleCategory = useCallback((v: string) => { setCategoryId(v); setPage(1); }, []);
  const handleIsActive = useCallback((v: string) => { setIsActive(v); setPage(1); }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await deleteSubCat(deleteId);
      setDeleteId(null);
    } catch (err) {
      setDeleteError((err as Error)?.message ?? "Failed to delete sub category");
    }
  }, [deleteId, deleteSubCat]);

  const subCategories = data?.data?.items ?? [];
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const activeCount = subCategories.filter((sc) => sc.isActive).length;
  const inactiveCount = subCategories.filter((sc) => !sc.isActive).length;
  const isFiltered = search !== "" || categoryId !== "" || isActive !== "";

  const { data: catsData } = useCategories({ limit: 100 });

  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-72 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-lg" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
        </div>
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-50 mb-4">
          <FiAlertCircle className="size-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Failed to load sub categories</h3>
        <p className="text-sm text-slate-500 mb-4">{(error as Error)?.message ?? "An unexpected error occurred."}</p>
        <button onClick={() => refetch()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Sub Categories"
        description="Manage your product sub categories."
        action={
          <Link
            href="/sub-categories/create"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <FiPlus className="size-4" />
            Add Sub Category
          </Link>
        }
      />

      <StatsGrid columns={4}>
        <StatCard label="Total Sub Categories" value={total} icon={FiGrid} color="indigo" variant="simple" />
        <StatCard label="Active" value={activeCount} icon={FiCheckCircle} color="emerald" variant="simple" />
        <StatCard label="Inactive" value={inactiveCount} icon={FiXCircle} color="red" variant="simple" />
        <StatCard label="Categories Covered" value={new Set(subCategories.map((sc) => sc.categoryId)).size} icon={FiGrid} color="sky" variant="simple" />
      </StatsGrid>

      <DataFilterBar
        search={search}
        onSearchChange={handleSearch}
        searchPlaceholder="Search sub-categories by name, slug..."
        selectFilters={[
          {
            label: "Category",
            value: categoryId,
            onChange: handleCategory,
            selectClassName: "min-w-[160px]",
            options: [
              { value: "", label: "All Categories" },
              ...(catsData?.data?.items ?? []).map((c: { id: string; name: string }) => ({ value: c.id, label: c.name })),
            ],
          },
          {
            label: "Status",
            value: isActive,
            onChange: handleIsActive,
            selectClassName: "min-w-[130px]",
            options: [
              { value: "", label: "All" },
              { value: "true", label: "Active Only" },
              { value: "false", label: "Inactive Only" },
            ],
          },
        ]}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

      {subCategories.length > 0 ? (
        <div className="space-y-4">
          <SubCategoryTable subCategories={subCategories} onDelete={(id) => setDeleteId(id)} />
          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} isLoading={isPending} />
        </div>
      ) : (
        <EmptyState
          icon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiGrid className="size-6 text-slate-400" />}
          title={isFiltered ? "No matching sub categories" : "No sub categories found"}
          description={isFiltered ? "Try refining your search or filter." : "Start organizing your products by adding your first sub category."}
          action={!isFiltered ? (
            <Link href="/sub-categories/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              <FiPlus className="size-4" /> Add Sub Category
            </Link>
          ) : undefined}
        />
      )}

      {deleteId && (
        <DeleteSubCategoryModal
          subCategoryName={subCategories.find((sc) => sc.id === deleteId)?.name ?? ""}
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError ?? undefined}
        />
      )}
    </div>
  );
}
