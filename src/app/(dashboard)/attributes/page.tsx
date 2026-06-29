"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { FiPlus, FiSliders, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import { PageHeader } from "@/components/common/PageHeader";
import { StatsGrid } from "@/components/common/stats/StatsGrid";
import { StatCard } from "@/components/common/stats/StatCard";
import { DataFilterBar } from "@/components/common/filters/DataFilterBar";
import { EmptyState } from "@/components/common/EmptyState";
import { useAttributes, useDeleteAttribute } from "@/hooks/useAttributes";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import AttributeTable from "@/features/attributes/components/AttributeTable";
import DeleteAttributeModal from "@/features/attributes/components/DeleteAttributeModal";
import Pagination from "@/components/ui/pagination/Pagination";

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
  const total = data?.data?.total ?? 0;
  const totalPages = data?.data?.totalPages ?? 1;
  const filterableCount = attributes.filter((a) => a.isFilterable).length;
  const requiredCount = attributes.filter((a) => a.isRequired).length;
  const isFiltered = search !== "" || isFilterable !== "";

  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between"><div className="space-y-2"><div className="h-8 w-48 bg-slate-200 rounded-lg" /><div className="h-4 w-72 bg-slate-100 rounded" /></div><div className="h-10 w-36 bg-slate-200 rounded-lg" /></div>
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map((i) => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}</div>
        <div className="h-12 bg-slate-100 rounded-xl" /><div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-50 mb-4"><FiAlertCircle className="size-6 text-red-500" /></div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Failed to load attributes</h3>
        <p className="text-sm text-slate-500 mb-4">{(error as Error)?.message ?? "An unexpected error occurred."}</p>
        <button onClick={() => refetch()} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Try Again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Product Attributes"
        description="Define configurable attributes like size, color, and material for products."
        action={
          <Can permission="attribute.create">
            <Link href="/attributes/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
              <FiPlus className="size-4" /> Add Attribute
            </Link>
          </Can>
        }
      />

      <StatsGrid columns={4}>
        <StatCard label="Total Attributes" value={total} icon={FiSliders} color="indigo" variant="simple" />
        <StatCard label="Filterable" value={filterableCount} icon={FiCheckCircle} color="emerald" variant="simple" />
        <StatCard label="Required" value={requiredCount} icon={FiCheckCircle} color="blue" variant="simple" />
        <StatCard label="Non-Filterable" value={total - filterableCount} icon={FiXCircle} color="slate" variant="simple" />
      </StatsGrid>

      <DataFilterBar
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
      />

      {attributes.length > 0 ? (
        <div className="space-y-4">
          <AttributeTable attributes={attributes} onDelete={(id) => setDeleteId(id)} />
          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} isLoading={isPending} />
        </div>
      ) : (
        <EmptyState
          icon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiSliders className="size-6 text-slate-400" />}
          title={isFiltered ? "No matching attributes" : "No attributes found"}
          description={isFiltered ? "Try refining your search or filter." : "Start by adding your first product attribute."}
          action={!isFiltered ? (
            <Link href="/attributes/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              <FiPlus className="size-4" /> Add Attribute
            </Link>
          ) : undefined}
        />
      )}

      {deleteId && (
        <DeleteAttributeModal
          attributeName={attributes.find((a) => a.id === deleteId)?.name ?? ""}
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError ?? undefined}
        />
      )}
    </div>
  );
}
