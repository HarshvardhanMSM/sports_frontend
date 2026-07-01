"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiSliders, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import ListPageLayout from "@/components/common/ListPageLayout";
import { useAttributes, useDeleteAttribute } from "@/hooks/useAttributes";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import AttributeTable from "@/features/attributes/components/AttributeTable";
import DeleteAttributeModal from "@/features/attributes/components/DeleteAttributeModal";

export default function AttributesPage() {
  const [page, setPage] = useState(1);
  const { query: search, setQuery: setSearch, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [isFilterable, setIsFilterable] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const limit = 10;

  const { data, isPending, isError, error, refetch, isRefetching } = useAttributes({
    page,
    limit,
    search: debouncedSearch || undefined,
    isFilterable: isFilterable !== "" ? isFilterable === "true" : undefined,
  });

  const { mutateAsync: deleteAttribute, isPending: isDeleting } = useDeleteAttribute();

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, [setSearch]);
  const handleFilterable = useCallback((v: string) => { setIsFilterable(v); setPage(1); }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await deleteAttribute(deleteId);
      setDeleteId(null);
    } catch (err) {
      setDeleteError((err as Error)?.message ?? "Failed to delete attribute");
    }
  }, [deleteId, deleteAttribute]);

  const attributes = data?.data?.items ?? [];
  const total = data?.data?.meta?.total ?? 0;
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const totalAttributes = data?.data?.totalAttributes ?? 0;
  const requiredCount = data?.data?.required ?? 0;
  const nonFilterableCount = data?.data?.nonFilterable ?? 0;
  const filterableCount = totalAttributes - nonFilterableCount;
  const isFiltered = search !== "" || isFilterable !== "";

  return (
    <ListPageLayout
      title="Product Attributes"
      description="Define configurable attributes like size, color, and material for products."
      headerAction={
        <Can permission="attribute.create">
          <Link href="/attributes/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <FiPlus className="size-4" /> Add Attribute
          </Link>
        </Can>
      }
      stats={[
        { label: "Total Attributes", value: totalAttributes, icon: FiSliders, color: "indigo", variant: "simple" },
        { label: "Filterable", value: filterableCount, icon: FiCheckCircle, color: "emerald", variant: "simple" },
        { label: "Required", value: requiredCount, icon: FiCheckCircle, color: "blue", variant: "simple" },
        { label: "Non-Filterable", value: nonFilterableCount, icon: FiXCircle, color: "slate", variant: "simple" },
      ]}
      statsColumns={4}
      search={search}
      onSearchChange={handleSearch}
      searchPlaceholder="Search attributes by name or slug..."
      selectFilters={[
        {
          label: "Filterable",
          value: isFilterable,
          onChange: handleFilterable,
          selectClassName: "min-w-[150px]",
          options: [
            { value: "", label: "All" },
            { value: "true", label: "Filterable Only" },
            { value: "false", label: "Non-Filterable" },
          ],
        },
      ]}
      onRefresh={() => refetch()}
      isRefreshing={isRefetching}
      isPending={isPending}
      isError={isError}
      error={error as Error}
      refetch={refetch}
      hasData={attributes.length > 0}
      tableComponent={<AttributeTable attributes={attributes} onDelete={(id) => setDeleteId(id)} />}
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPageChange={setPage}
      emptyIcon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiSliders className="size-6 text-slate-400" />}
      emptyTitle={isFiltered ? "No matching attributes" : "No attributes found"}
      emptyDescription={isFiltered ? "Try refining your search or filter." : "Start by adding your first product attribute."}
      emptyAction={!isFiltered ? (
        <Link href="/attributes/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <FiPlus className="size-4" /> Add Attribute
        </Link>
      ) : undefined}
    >
      {deleteId && (
        <DeleteAttributeModal
          attributeName={attributes.find((a) => a.id === deleteId)?.name ?? ""}
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError ?? undefined}
        />
      )}
    </ListPageLayout>
  );
}

