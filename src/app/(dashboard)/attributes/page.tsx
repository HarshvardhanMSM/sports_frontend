"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiSliders, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";
import { useAttributes, useDeleteAttribute } from "@/hooks/useAttributes";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import AttributeTable from "@/features/attributes/components/AttributeTable";
import AttributeFilters from "@/features/attributes/components/AttributeFilters";
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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSearch = useCallback((v: string) => { setSearch(v); }, [setSearch]);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Product Attributes</h1>
          <p className="text-sm text-slate-500">Define configurable attributes like size, color, and material for products.</p>
        </div>
        <Link href="/attributes/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiPlus className="size-4" /> Add Attribute
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={<FiSliders className="size-5" />} label="Total Attributes" value={total} color="indigo" />
        <StatCard icon={<FiCheckCircle className="size-5" />} label="Filterable" value={filterableCount} color="emerald" />
        <StatCard icon={<FiCheckCircle className="size-5" />} label="Required" value={requiredCount} color="blue" />
        <StatCard icon={<FiXCircle className="size-5" />} label="Non-Filterable" value={total - filterableCount} color="slate" />
      </div>

      <AttributeFilters
        search={search}
        onSearchChange={handleSearch}
        isFilterable={isFilterable}
        onFilterableChange={handleFilterable}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

      {attributes.length > 0 ? (
        <div className="space-y-4">
          <AttributeTable attributes={attributes} onDelete={(id) => setDeleteId(id)} />
          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} isLoading={isPending} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="flex items-center justify-center size-12 bg-slate-100 rounded-full mb-4">
            {search || isFilterable ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiSliders className="size-6 text-slate-400" />}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {search || isFilterable ? "No matching attributes" : "No attributes found"}
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            {search || isFilterable ? "Try refining your search or filter." : "Start by adding your first product attribute."}
          </p>
          {!search && !isFilterable && (
            <Link href="/attributes/create" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              <FiPlus className="size-4" /> Add Attribute
            </Link>
          )}
        </div>
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

function StatCard({ icon, label, value, color: c }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${colors[c] ?? colors.indigo}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none mb-1">{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
    </div>
  );
}
