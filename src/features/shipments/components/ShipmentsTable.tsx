"use client";

import React from "react";
import Link from "next/link";
import { FiEye, FiEdit2, FiPackage } from "react-icons/fi";
import type { ShipmentListItem, ShipmentStatus } from "@/types/shipment.types";

interface Props {
  shipments: ShipmentListItem[];
  onUpdateStatus: (shipment: ShipmentListItem) => void;
}

const STATUS_BADGE: Record<ShipmentStatus, { bg: string; dot: string }> = {
  PENDING:            { bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500" },
  PACKED:             { bg: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", dot: "bg-blue-500" },
  READY_FOR_DISPATCH: { bg: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500" },
  OUT_FOR_DELIVERY:   { bg: "bg-orange-50 text-orange-700 ring-1 ring-orange-200", dot: "bg-orange-500" },
  DELIVERED:          { bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  FAILED_DELIVERY:    { bg: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
};

function Badge({ status }: { status: ShipmentStatus }) {
  const s = STATUS_BADGE[status] ?? { bg: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function ShipmentsTable({ shipments, onUpdateStatus }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking #</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order #</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Carrier</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Delivery</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shipments.map((sh) => (
              <tr key={sh.shipmentId} className="group hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <Link href={`/shipments/${sh.shipmentId}`} className="text-sm font-mono font-semibold text-indigo-600 hover:text-indigo-800">
                    {sh.trackingId}
                  </Link>
                </td>
                <td className="px-5 py-4 text-sm font-mono text-slate-600">{sh.orderId}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{sh.customer}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{sh.carrier}</td>
                <td className="px-5 py-4"><Badge status={sh.status} /></td>
                <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{new Date(sh.estDelivery).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1 justify-end">
                    <Link
                      href={`/shipments/${sh.shipmentId}`}
                      className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      title="View Details"
                    >
                      <FiEye className="size-4" />
                    </Link>
                    <button
                      onClick={() => onUpdateStatus(sh)}
                      className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                      title="Update Status"
                    >
                      <FiEdit2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {shipments.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <FiPackage className="size-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">No shipments found</p>
                      <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search or filter criteria.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
