"use client";

import React, { useState, useMemo } from "react";
import { FiRotateCcw, FiAlertCircle } from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useReturns, useApproveReturn, useRejectReturn, useSchedulePickup, useMarkInTransit, useMarkReceived, useProcessRefund, useCompleteReturn } from "@/hooks/useReturns";
import type { ReturnListItem, ReturnStatus } from "@/types/return.types";
import ReturnsTable from "@/features/returns/components/ReturnsTable";
import ReturnFilters from "@/features/returns/components/ReturnFilters";
import ApproveReturnModal from "@/features/returns/components/ApproveReturnModal";
import RejectReturnModal from "@/features/returns/components/RejectReturnModal";
import SchedulePickupModal from "@/features/returns/components/SchedulePickupModal";
import RefundModal from "@/features/returns/components/RefundModal";
import CompleteReturnModal from "@/features/returns/components/CompleteReturnModal";
import Pagination from "@/components/ui/pagination/Pagination";

const PAGE_SIZE = 10;

export default function ReturnsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [approveTarget, setApproveTarget] = useState<ReturnListItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ReturnListItem | null>(null);
  const [pickupTarget, setPickupTarget] = useState<ReturnListItem | null>(null);
  const [receivedTarget, setReceivedTarget] = useState<ReturnListItem | null>(null);
  const [inTransitTarget, setInTransitTarget] = useState<ReturnListItem | null>(null);
  const [refundTarget, setRefundTarget] = useState<ReturnListItem | null>(null);
  const [completeTarget, setCompleteTarget] = useState<ReturnListItem | null>(null);

  const { data, isLoading, error, isRefetching, refetch } = useReturns();
  const { mutateAsync: approveReturn, isPending: isApproving } = useApproveReturn();
  const { mutateAsync: rejectReturn, isPending: isRejecting } = useRejectReturn();
  const { mutateAsync: schedulePickup, isPending: isScheduling } = useSchedulePickup();
  const { mutateAsync: markInTransit, isPending: isMarkingInTransit } = useMarkInTransit();
  const { mutateAsync: markReceived, isPending: isMarking } = useMarkReceived();
  const { mutateAsync: processRefund, isPending: isRefunding } = useProcessRefund();
  const { mutateAsync: completeReturn, isPending: isCompleting } = useCompleteReturn();

  const allReturns = data?.data ?? [];

  const filtered = useMemo(() => {
    return allReturns.filter((r) => {
      const customerName = `${r.customer?.firstName ?? ""} ${r.customer?.lastName ?? ""}`.toLowerCase();
      const q = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm
        || r.returnNumber.toLowerCase().includes(q)
        || r.order.orderNumber.toLowerCase().includes(q)
        || customerName.includes(q);
      const matchesFilter = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesFilter;
    });
  }, [allReturns, searchTerm, statusFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    try {
      await approveReturn(approveTarget.id);
      showToast("success", `Return ${approveTarget.returnNumber} approved successfully.`);
      setApproveTarget(null);
    } catch { showToast("error", "Failed to approve return."); }
  };

  const handleReject = async (reason: string) => {
    if (!rejectTarget) return;
    try {
      await rejectReturn({ id: rejectTarget.id, reason });
      showToast("success", `Return ${rejectTarget.returnNumber} rejected.`);
      setRejectTarget(null);
    } catch { showToast("error", "Failed to reject return."); }
  };

  const handleSchedulePickup = async (d: { pickupDate: string; courierName?: string; notes?: string }) => {
    if (!pickupTarget) return;
    try {
      await schedulePickup({ id: pickupTarget.id, ...d });
      showToast("success", `Pickup scheduled for ${pickupTarget.returnNumber}.`);
      setPickupTarget(null);
    } catch { showToast("error", "Failed to schedule pickup."); }
  };

  const handleMarkInTransit = async () => {
    if (!inTransitTarget) return;
    try {
      await markInTransit(inTransitTarget.id);
      showToast("success", `Return ${inTransitTarget.returnNumber} marked in transit.`);
      setInTransitTarget(null);
    } catch { showToast("error", "Failed to mark in transit."); }
  };

  const handleMarkReceived = async () => {
    if (!receivedTarget) return;
    try {
      await markReceived(receivedTarget.id);
      showToast("success", `Return ${receivedTarget.returnNumber} marked as received.`);
      setReceivedTarget(null);
    } catch { showToast("error", "Failed to mark as received."); }
  };

  const handleProcessRefund = async (d: { amount: string; method: string }) => {
    if (!refundTarget) return;
    try {
      await processRefund({ id: refundTarget.id, ...d });
      showToast("success", `Refund processed for ${refundTarget.returnNumber}.`);
      setRefundTarget(null);
    } catch { showToast("error", "Failed to process refund."); }
  };

  const handleComplete = async () => {
    if (!completeTarget) return;
    try {
      await completeReturn(completeTarget.id);
      showToast("success", `Return ${completeTarget.returnNumber} completed.`);
      setCompleteTarget(null);
    } catch { showToast("error", "Failed to complete return."); }
  };

  const handleRefresh = () => { refetch(); };

  const isFiltered = searchTerm !== "" || statusFilter !== "All";

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
        badge="Returns & Refunds"
        title="Returns & Refunds"
        description="Process customer returns, review refund requests, and manage resolutions."
      />

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load returns</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={handleRefresh}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <ReturnFilters
            search={searchTerm}
            onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
            onRefresh={handleRefresh}
            isRefetching={isRefetching}
          />

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : paginated.length > 0 ? (
            <ReturnsTable
              returns={paginated}
              onApprove={setApproveTarget}
              onReject={setRejectTarget}
              onSchedulePickup={setPickupTarget}
               onMarkInTransit={setInTransitTarget}
               onMarkReceived={setReceivedTarget}
              onProcessRefund={setRefundTarget}
              onComplete={setCompleteTarget}
            />
          ) : (
            <EmptyState
              icon={<FiRotateCcw className="size-6 text-slate-400" />}
              title={isFiltered ? "No matching returns" : "No returns found"}
              description={isFiltered ? "No returns match your current filters." : "Returns will appear here once customers submit return requests."}
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

      {approveTarget && (
        <ApproveReturnModal
          returnNumber={approveTarget.returnNumber}
          onClose={() => setApproveTarget(null)}
          onConfirm={handleApprove}
          isPending={isApproving}
        />
      )}
      {rejectTarget && (
        <RejectReturnModal
          returnNumber={rejectTarget.returnNumber}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
          isPending={isRejecting}
        />
      )}
      {pickupTarget && (
        <SchedulePickupModal
          returnNumber={pickupTarget.returnNumber}
          onClose={() => setPickupTarget(null)}
          onConfirm={handleSchedulePickup}
          isPending={isScheduling}
        />
      )}
      {inTransitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setInTransitTarget(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-cyan-50">
                <span className="text-cyan-500 font-bold text-lg">🚚</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Mark In Transit</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Confirm item is in transit for <span className="font-semibold text-slate-800">{inTransitTarget.returnNumber}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setInTransitTarget(null)} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleMarkInTransit} disabled={isMarkingInTransit} className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50">
                {isMarkingInTransit ? "Updating..." : "Confirm In Transit"}
              </button>
            </div>
          </div>
        </div>
      )}
      {receivedTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setReceivedTarget(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50">
                <span className="text-indigo-500 font-bold text-lg">📦</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Mark as Received</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Confirm item received for <span className="font-semibold text-slate-800">{receivedTarget.returnNumber}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setReceivedTarget(null)} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleMarkReceived} disabled={isMarking} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                {isMarking ? "Updating..." : "Confirm Received"}
              </button>
            </div>
          </div>
        </div>
      )}
      {refundTarget && (
        <RefundModal
          returnNumber={refundTarget.returnNumber}
          refundAmount={refundTarget.totalRefundAmount}
          onClose={() => setRefundTarget(null)}
          onConfirm={handleProcessRefund}
          isPending={isRefunding}
        />
      )}
      {completeTarget && (
        <CompleteReturnModal
          returnNumber={completeTarget.returnNumber}
          onClose={() => setCompleteTarget(null)}
          onConfirm={handleComplete}
          isPending={isCompleting}
        />
      )}
    </div>
  );
}
