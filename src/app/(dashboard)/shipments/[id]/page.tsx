"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit2, FiAlertCircle, FiTruck } from "react-icons/fi";
import { useShipment, useUpdateShipmentStatus } from "@/hooks/useShipments";
import ShipmentDetailsCard from "@/features/shipments/components/ShipmentDetailsCard";
import ShipmentTimeline from "@/features/shipments/components/ShipmentTimeline";
import UpdateShipmentStatusModal from "@/features/shipments/components/UpdateShipmentStatusModal";

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data, isLoading, error, refetch } = useShipment(id);
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateShipmentStatus();
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  const shipment = data?.data;

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
            href="/shipments"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <FiArrowLeft className="size-4" />
            Back
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {shipment ? shipment.trackingNumber : "Shipment Details"}
            </h1>
            <p className="text-sm text-slate-500">
              {shipment ? `Status: ${shipment.status.replace(/_/g, " ")}` : "Loading..."}
            </p>
          </div>
        </div>
        {shipment && shipment.status !== "DELIVERED" && shipment.status !== "FAILED_DELIVERY" && (
          <button
            onClick={() => setShowUpdate(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-all"
          >
            <FiEdit2 className="size-4" /> Update Status
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading shipment...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load shipment</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : !shipment ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiTruck className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Shipment not found</h3>
          <p className="mt-1.5 text-sm text-slate-500">The shipment you are looking for does not exist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ShipmentDetailsCard data={shipment} />
          </div>
          <div className="space-y-6">
            <ShipmentTimeline logs={shipment.trackingLogs} status={shipment.status} />
          </div>
        </div>
      )}

      {showUpdate && shipment && (
        <UpdateShipmentStatusModal
          trackingNumber={shipment.trackingNumber}
          currentStatus={shipment.status}
          onClose={() => setShowUpdate(false)}
          onConfirm={async (d) => {
            try {
              await updateStatus({ id: shipment.id, ...d });
              showToast("success", `Status updated to ${d.status.replace(/_/g, " ")}.`);
              setShowUpdate(false);
              refetch();
            } catch { showToast("error", "Failed to update status."); }
          }}
          isPending={isUpdating}
        />
      )}
    </div>
  );
}
