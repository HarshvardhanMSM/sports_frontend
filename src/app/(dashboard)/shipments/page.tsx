"use client";

import React, { useState } from "react";
import { FiTruck, FiAlertCircle } from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useShipments, useUpdateShipmentStatus } from "@/hooks/useShipments";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import type { ShipmentListItem, ShipmentListParams, ShipmentStatus } from "@/types/shipment.types";
import ShipmentStatsCards from "@/features/shipments/components/ShipmentStatsCards";
import ShipmentFilters from "@/features/shipments/components/ShipmentFilters";
import ShipmentsTable from "@/features/shipments/components/ShipmentsTable";
import UpdateShipmentStatusModal from "@/features/shipments/components/UpdateShipmentStatusModal";
import Pagination from "@/components/ui/pagination/Pagination";

export default function ShipmentsPage() {
  const { query: search, setQuery: setSearch, debouncedQuery: debouncedSearch } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [updateTarget, setUpdateTarget] = useState<ShipmentListItem | null>(null);

  const params: ShipmentListParams = {
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: statusFilter === "All" ? undefined : (statusFilter as ShipmentStatus),
  };

  const { data, isLoading, error, isRefetching, refetch } = useShipments(params);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateShipmentStatus();

  const listData = data?.data;
  const items = listData?.items ?? [];
  const metrics = listData?.metrics;
  const meta = listData?.meta;

  const PAGE_SIZE = meta?.limit ?? 10;
  const total = meta?.total ?? 0;
  const totalPages = meta?.totalPages ?? 1;
  const safePage = page;
  const paginated = items;

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async (d: { status: string; notes?: string }) => {
    if (!updateTarget) return;
    try {
      await updateStatus({ id: updateTarget.shipmentId, ...d });
      showToast("success", `Shipment ${updateTarget.trackingId} updated to ${d.status.replace(/_/g, " ")}.`);
      setUpdateTarget(null);
    } catch { showToast("error", "Failed to update shipment status."); }
  };

  const isFiltered = search !== "" || statusFilter !== "All";

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] rounded-xl px-5 py-3 shadow-xl text-sm font-semibold text-white ${
          toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
        }`}>
          {toast.message}
        </div>
      )}

      <PageHeader
        badge="Fulfillment"
        title="Shipments"
        description="Track shipments, manage fulfillment status, and monitor delivery performance."
      />

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load shipments</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {metrics && <ShipmentStatsCards {...metrics} />}

          <ShipmentFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
            onRefresh={() => refetch()}
            isRefetching={isRefetching}
          />

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <ShipmentsTable
              shipments={paginated}
              onUpdateStatus={setUpdateTarget}
            />
          ) : (
            <EmptyState
              icon={<FiTruck className="size-6 text-slate-400" />}
              title={isFiltered ? "No matching shipments" : "No shipments found"}
              description={isFiltered ? "No shipments match your current filters." : "Shipments will appear here once orders are created and processed."}
            />
          )}

          {totalPages > 1 && (
            <Pagination
              page={safePage}
              totalPages={totalPages}
              total={total}
              limit={PAGE_SIZE}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {updateTarget && (
        <UpdateShipmentStatusModal
          trackingNumber={updateTarget.trackingId}
          currentStatus={updateTarget.status}
          onClose={() => setUpdateTarget(null)}
          onConfirm={handleUpdateStatus}
          isPending={isUpdating}
        />
      )}
    </div>
  );
}
