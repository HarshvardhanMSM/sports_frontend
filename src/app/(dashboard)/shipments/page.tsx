"use client";

import React, { useState, useMemo } from "react";
import { FiTruck, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { useShipments, useUpdateShipmentStatus } from "@/hooks/useShipments";
import type { ShipmentListItem } from "@/types/shipment.types";
import ShipmentStatsCards from "@/features/shipments/components/ShipmentStatsCards";
import ShipmentFilters from "@/features/shipments/components/ShipmentFilters";
import ShipmentsTable from "@/features/shipments/components/ShipmentsTable";
import UpdateShipmentStatusModal from "@/features/shipments/components/UpdateShipmentStatusModal";
import Pagination from "@/components/ui/pagination/Pagination";

export default function ShipmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [updateTarget, setUpdateTarget] = useState<ShipmentListItem | null>(null);

  const { data, isLoading, error, isRefetching, refetch } = useShipments();
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateShipmentStatus();

  const listData = data?.data;
  const allShipments = listData?.items ?? [];
  const metrics = listData?.metrics;
  const meta = listData?.meta;

  const PAGE_SIZE = meta?.limit ?? 10;

  const filtered = useMemo(() => {
    return allShipments.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch = !search
        || s.trackingId.toLowerCase().includes(q)
        || s.orderId.toLowerCase().includes(q)
        || s.customer.toLowerCase().includes(q);
      const matchesFilter = statusFilter === "All" || s.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allShipments, search, statusFilter]);

  const total = meta?.total ?? filtered.length;
  const totalPages = meta ? Math.max(1, Math.ceil(total / PAGE_SIZE)) : Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = meta ? allShipments : filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-[60] rounded-xl px-5 py-3 shadow-xl text-sm font-semibold text-white ${
          toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Fulfillment</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipments</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track shipments, manage fulfillment status, and monitor delivery performance.</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
        >
          <FiRefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

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
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
              <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FiTruck className="size-6 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {search || statusFilter !== "All" ? "No matching shipments" : "No shipments found"}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
                {search || statusFilter !== "All"
                  ? "No shipments match your current filters."
                  : "Shipments will appear here once orders are created and processed."}
              </p>
            </div>
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
