"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiGrid, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import ListPageLayout from "@/components/common/ListPageLayout";
import { useSubCategories, useDeleteSubCategory } from "@/hooks/useSubCategories";
import { useCategories } from "@/hooks/useCategories";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import SubCategoryTable from "@/features/sub-categories/components/SubCategoryTable";
import DeleteSubCategoryModal from "@/features/sub-categories/components/DeleteSubCategoryModal";

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
  const total = data?.data?.meta?.total ?? 0;
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const totalSubCategories = data?.data?.totalSubCategories ?? 0;
  const activeCount = data?.data?.activeSubCategories ?? 0;
  const inactiveCount = data?.data?.inactiveSubCategories ?? 0;
  const isFiltered = search !== "" || categoryId !== "" || isActive !== "";

  const { data: catsData } = useCategories({ limit: 100 });

  return (
    <ListPageLayout
      title="Sub Categories"
      description="Manage your product sub categories."
      headerAction={
        <Link
          href="/sub-categories/create"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="size-4" />
          Add Sub Category
        </Link>
      }
      stats={[
        { label: "Total Sub Categories", value: totalSubCategories, icon: FiGrid, color: "indigo", variant: "simple" },
        { label: "Active", value: activeCount, icon: FiCheckCircle, color: "emerald", variant: "simple" },
        { label: "Inactive", value: inactiveCount, icon: FiXCircle, color: "red", variant: "simple" },
        { label: "Categories Covered", value: new Set(subCategories.map((sc) => sc.categoryId)).size, icon: FiGrid, color: "sky", variant: "simple" },
      ]}
      statsColumns={4}
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
      isPending={isPending}
      isError={isError}
      error={error as Error}
      refetch={refetch}
      hasData={subCategories.length > 0}
      tableComponent={<SubCategoryTable subCategories={subCategories} onDelete={(id) => setDeleteId(id)} />}
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPageChange={setPage}
      emptyIcon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiGrid className="size-6 text-slate-400" />}
      emptyTitle={isFiltered ? "No matching sub categories" : "No sub categories found"}
      emptyDescription={isFiltered ? "Try refining your search or filter." : "Start organizing your products by adding your first sub category."}
      emptyAction={!isFiltered ? (
        <Link href="/sub-categories/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <FiPlus className="size-4" /> Add Sub Category
        </Link>
      ) : undefined}
    >
      {deleteId && (
        <DeleteSubCategoryModal
          subCategoryName={subCategories.find((sc) => sc.id === deleteId)?.name ?? ""}
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError ?? undefined}
        />
      )}
    </ListPageLayout>
  );
}

