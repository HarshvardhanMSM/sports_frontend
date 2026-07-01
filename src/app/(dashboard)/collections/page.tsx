"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPlus, FiGrid, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Can } from "@/components/common/Can";
import ListPageLayout from "@/components/common/ListPageLayout";
import { useCollections, useDeleteCollection } from "@/hooks/useCollections";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import CollectionTable from "@/features/collections/components/CollectionTable";
import DeleteCollectionModal from "@/features/collections/components/DeleteCollectionModal";

export default function CollectionsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { query: search, setQuery: setSearch, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [isActive, setIsActive] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const limit = 10;

  const { data, isPending, isError, error, refetch, isRefetching } = useCollections({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: isActive !== "" ? isActive === "true" : undefined,
  });

  const { mutateAsync: deleteCollection, isPending: isDeleting } = useDeleteCollection();

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, [setSearch]);
  const handleIsActive = useCallback((v: string) => { setIsActive(v); setPage(1); }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleteError(null);
    try {
      await deleteCollection(deleteId);
      setDeleteId(null);
    } catch (err) {
      setDeleteError((err as Error)?.message ?? "Failed to delete collection");
    }
  }, [deleteId, deleteCollection]);

  const collections = data?.data?.items ?? [];
  const total = data?.data?.meta?.total ?? 0;
  const totalPages = data?.data?.meta?.totalPages ?? 1;
  const totalCollections = data?.data?.totalCollections ?? 0;
  const activeCount = data?.data?.activeCollections ?? 0;
  const inactiveCount = data?.data?.inactiveCollections ?? 0;
  const isFiltered = search !== "" || isActive !== "";

  return (
    <ListPageLayout
      title="Collections"
      description="Group products into curated collections and featured sets."
      headerAction={
        <Can permission="collection.create">
          <Link href="/collections/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
            <FiPlus className="size-4" /> Add Collection
          </Link>
        </Can>
      }
      stats={[
        { label: "Total Collections", value: totalCollections, icon: FiGrid, color: "indigo", variant: "simple" },
        { label: "Active", value: activeCount, icon: FiCheckCircle, color: "emerald", variant: "simple" },
        { label: "Inactive", value: inactiveCount, icon: FiXCircle, color: "red", variant: "simple" },
        { label: "Total Pages", value: totalPages, icon: FiGrid, color: "sky", variant: "simple" },
      ]}
      statsColumns={4}
      search={search}
      onSearchChange={handleSearch}
      searchPlaceholder="Search collections by name, slug..."
      selectFilters={[
        {
          label: "Status",
          value: isActive,
          onChange: handleIsActive,
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
      hasData={collections.length > 0}
      tableComponent={
        <CollectionTable
          collections={collections}
          onView={(id) => router.push(`/collections/${id}`)}
          onEdit={(id) => router.push(`/collections/${id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
        />
      }
      page={page}
      totalPages={totalPages}
      total={total}
      limit={limit}
      onPageChange={setPage}
      emptyIcon={isFiltered ? <FiAlertCircle className="size-6 text-slate-400" /> : <FiGrid className="size-6 text-slate-400" />}
      emptyTitle={isFiltered ? "No matching collections" : "No collections found"}
      emptyDescription={isFiltered ? "Try refining your search or filter." : "Start by adding your first collection."}
      emptyAction={!isFiltered ? (
        <Link href="/collections/create" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
          <FiPlus className="size-4" /> Add Collection
        </Link>
      ) : undefined}
    >
      {deleteId && (
        <DeleteCollectionModal
          collectionName={collections.find((c) => c.id === deleteId)?.name ?? ""}
          onClose={() => { setDeleteId(null); setDeleteError(null); }}
          onConfirm={handleDelete}
          isPending={isDeleting}
          error={deleteError ?? undefined}
        />
      )}
    </ListPageLayout>
  );
}

