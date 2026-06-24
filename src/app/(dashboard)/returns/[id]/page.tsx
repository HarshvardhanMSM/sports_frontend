"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiTruck, FiPackage, FiDollarSign, FiAlertCircle } from "react-icons/fi";
import { useReturn, useApproveReturn, useRejectReturn, useSchedulePickup, useMarkInTransit, useMarkReceived, useProcessRefund, useCompleteReturn } from "@/hooks/useReturns";
import ReturnDetailsCard from "@/features/returns/components/ReturnDetailsCard";
import ReturnWorkflowTimeline from "@/features/returns/components/ReturnWorkflowTimeline";
import ApproveReturnModal from "@/features/returns/components/ApproveReturnModal";
import RejectReturnModal from "@/features/returns/components/RejectReturnModal";
import SchedulePickupModal from "@/features/returns/components/SchedulePickupModal";
import RefundModal from "@/features/returns/components/RefundModal";
import CompleteReturnModal from "@/features/returns/components/CompleteReturnModal";

export default function ReturnDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data, isLoading, error, refetch } = useReturn(id);
  const { mutateAsync: approveReturn, isPending: isApproving } = useApproveReturn();
  const { mutateAsync: rejectReturn, isPending: isRejecting } = useRejectReturn();
  const { mutateAsync: schedulePickup, isPending: isScheduling } = useSchedulePickup();
  const { mutateAsync: markInTransit, isPending: isMarkingInTransit } = useMarkInTransit();
  const { mutateAsync: markReceived, isPending: isMarking } = useMarkReceived();
  const { mutateAsync: processRefund, isPending: isRefunding } = useProcessRefund();
  const { mutateAsync: completeReturn, isPending: isCompleting } = useCompleteReturn();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showPickup, setShowPickup] = useState(false);
  const [showInTransit, setShowInTransit] = useState(false);
  const [showReceived, setShowReceived] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const re = data?.data;

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
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

      {/* Back + Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/returns"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FiArrowLeft className="size-4" />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {re ? re.returnNumber : "Return Details"}
            </h1>
            <p className="text-sm text-slate-500">
              {re ? `${re.customer?.firstName ?? ""} ${re.customer?.lastName ?? ""}` : "Loading..."}
            </p>
          </div>
        </div>

        {re && (
          <div className="flex items-center gap-2">
            {re.status === "REQUESTED" && (
              <>
                <button onClick={() => setShowApprove(true)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-all">
                  <FiCheckCircle className="size-4" /> Approve
                </button>
                <button onClick={() => setShowReject(true)} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-all">
                  <FiXCircle className="size-4" /> Reject
                </button>
              </>
            )}
            {re.status === "APPROVED" && (
              <button onClick={() => setShowPickup(true)} className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-100 transition-all">
                <FiTruck className="size-4" /> Schedule Pickup
              </button>
            )}
            {re.status === "PICKUP_SCHEDULED" && (
              <button onClick={() => setShowInTransit(true)} className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2.5 text-sm font-semibold text-cyan-700 hover:bg-cyan-100 transition-all">
                <FiTruck className="size-4" /> Mark In Transit
              </button>
            )}
            {re.status === "IN_TRANSIT" && (
              <button onClick={() => setShowReceived(true)} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all">
                <FiPackage className="size-4" /> Mark Received
              </button>
            )}
            {re.status === "RECEIVED" && (
              <button onClick={() => setShowRefund(true)} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-all">
                <FiDollarSign className="size-4" /> Process Refund
              </button>
            )}
            {re.status === "REFUNDED" && (
              <button onClick={() => setShowComplete(true)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-all">
                <FiCheckCircle className="size-4" /> Complete Return
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading return...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load return</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : !re ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Return not found</h3>
          <p className="mt-1.5 text-sm text-slate-500">The return you are looking for does not exist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ReturnDetailsCard data={re} />
          </div>
          <div className="space-y-6">
            <ReturnWorkflowTimeline status={re.status} timeline={re.timeline} />
          </div>
        </div>
      )}

      {/* Modals */}
      {showApprove && re && (
        <ApproveReturnModal
          returnNumber={re.returnNumber}
          onClose={() => setShowApprove(false)}
          onConfirm={async () => { try { await approveReturn(re.id); showToast("success", "Return approved."); setShowApprove(false); refetch(); } catch { showToast("error", "Failed."); } }}
          isPending={isApproving}
        />
      )}
      {showReject && re && (
        <RejectReturnModal
          returnNumber={re.returnNumber}
          onClose={() => setShowReject(false)}
          onConfirm={async (reason) => { try { await rejectReturn({ id: re.id, reason }); showToast("success", "Return rejected."); setShowReject(false); refetch(); } catch { showToast("error", "Failed."); } }}
          isPending={isRejecting}
        />
      )}
      {showPickup && re && (
        <SchedulePickupModal
          returnNumber={re.returnNumber}
          onClose={() => setShowPickup(false)}
          onConfirm={async (d: { pickupDate: string; courierName?: string; notes?: string }) => { try { await schedulePickup({ id: re.id, ...d }); showToast("success", "Pickup scheduled."); setShowPickup(false); refetch(); } catch { showToast("error", "Failed."); } }}
          isPending={isScheduling}
        />
      )}
      {showInTransit && re && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowInTransit(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-cyan-50">
                <span className="text-cyan-500 font-bold text-lg">🚚</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Mark In Transit</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">Confirm item is in transit?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowInTransit(false)} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={async () => { try { await markInTransit(re.id); showToast("success", "Marked in transit."); setShowInTransit(false); refetch(); } catch { showToast("error", "Failed."); } }} disabled={isMarkingInTransit} className="rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50">
                {isMarkingInTransit ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showReceived && re && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowReceived(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50">
                <span className="text-indigo-500 font-bold text-lg">📦</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800">Mark as Received</h2>
            </div>
            <p className="text-sm text-slate-600 mb-6">Confirm item received?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowReceived(false)} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={async () => { try { await markReceived(re.id); showToast("success", "Marked received."); setShowReceived(false); refetch(); } catch { showToast("error", "Failed."); } }} disabled={isMarking} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                {isMarking ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showRefund && re && (
        <RefundModal
          returnNumber={re.returnNumber}
          refundAmount={re.totalRefundAmount}
          onClose={() => setShowRefund(false)}
          onConfirm={async (d) => { try { await processRefund({ id: re.id, ...d }); showToast("success", "Refund processed."); setShowRefund(false); refetch(); } catch { showToast("error", "Failed."); } }}
          isPending={isRefunding}
        />
      )}
      {showComplete && re && (
        <CompleteReturnModal
          returnNumber={re.returnNumber}
          onClose={() => setShowComplete(false)}
          onConfirm={async () => { try { await completeReturn(re.id); showToast("success", "Return completed."); setShowComplete(false); refetch(); } catch { showToast("error", "Failed."); } }}
          isPending={isCompleting}
        />
      )}
    </div>
  );
}
