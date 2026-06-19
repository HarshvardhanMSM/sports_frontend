"use client";

import React from "react";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import type { ReturnListItem, ReturnStatus } from "@/types/return.types";

interface Props {
  returns: ReturnListItem[];
  onApprove: (ret: ReturnListItem) => void;
  onReject: (ret: ReturnListItem) => void;
  onSchedulePickup: (ret: ReturnListItem) => void;
  onMarkInTransit: (ret: ReturnListItem) => void;
  onMarkReceived: (ret: ReturnListItem) => void;
  onProcessRefund: (ret: ReturnListItem) => void;
  onComplete: (ret: ReturnListItem) => void;
}

const STATUS_BADGE: Record<ReturnStatus, { bg: string; dot: string }> = {
  REQUESTED:        { bg: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", dot: "bg-amber-500" },
  APPROVED:         { bg: "bg-blue-50 text-blue-700 ring-1 ring-blue-200", dot: "bg-blue-500" },
  PICKUP_SCHEDULED: { bg: "bg-violet-50 text-violet-700 ring-1 ring-violet-200", dot: "bg-violet-500" },
  IN_TRANSIT:       { bg: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200", dot: "bg-cyan-500" },
  RECEIVED:         { bg: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", dot: "bg-indigo-500" },
  REFUNDED:         { bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  COMPLETED:        { bg: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  REJECTED:         { bg: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
};

function Badge({ status }: { status: ReturnStatus }) {
  const s = STATUS_BADGE[status] ?? { bg: "bg-slate-100 text-slate-600 ring-1 ring-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function ReturnsTable({
  returns, onApprove, onReject, onSchedulePickup, onMarkInTransit, onMarkReceived, onProcessRefund, onComplete,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Return</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {returns.map((ret) => {
              const customerName = `${ret.customer?.firstName ?? ""} ${ret.customer?.lastName ?? ""}`.trim() || "Unknown";
              const productName = ret.items?.[0]?.product?.productName ?? "Unknown Product";
              const productImage = ret.items?.[0]?.product?.productImage;
              return (
                <tr key={ret.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <Link href={`/returns/${ret.id}`} className="text-sm font-mono font-semibold text-indigo-600 hover:text-indigo-800">
                      {ret.returnNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm font-mono text-slate-600">{ret.order.orderNumber}</td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">{customerName}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      {productImage ? (
                        <img src={productImage} alt="" className="size-8 rounded-lg object-cover border border-slate-200" />
                      ) : (
                        <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                          {productName.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-slate-700 max-w-[160px] truncate">{productName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 max-w-[140px] truncate">
                    {ret.reason.replace(/_/g, " ")}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(ret.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4"><Badge status={ret.status} /></td>
                  <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">
                    ${Number(ret.totalRefundAmount).toFixed(2)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1 justify-end">
                      <Link
                        href={`/returns/${ret.id}`}
                        className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        title="View Details"
                      >
                        <FiEye className="size-4" />
                      </Link>
                      {ret.status === "REQUESTED" && (
                        <>
                          <button onClick={() => onApprove(ret)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-xs font-bold" title="Approve">✓</button>
                          <button onClick={() => onReject(ret)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs font-bold" title="Reject">✗</button>
                        </>
                      )}
                      {ret.status === "APPROVED" && (
                        <button onClick={() => onSchedulePickup(ret)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all text-xs font-bold" title="Schedule Pickup">📦</button>
                      )}
                      {ret.status === "PICKUP_SCHEDULED" && (
                        <button onClick={() => onMarkInTransit(ret)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all text-xs font-bold" title="Mark In Transit">🚚</button>
                      )}
                      {ret.status === "IN_TRANSIT" && (
                        <button onClick={() => onMarkReceived(ret)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-bold" title="Mark Received">⬇</button>
                      )}
                      {ret.status === "RECEIVED" && (
                        <button onClick={() => onProcessRefund(ret)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-bold" title="Process Refund">💳</button>
                      )}
                      {ret.status === "REFUNDED" && (
                        <button onClick={() => onComplete(ret)} className="size-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-xs font-bold" title="Complete">✓</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {returns.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                      <span className="text-2xl text-slate-400">0</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">No returns found</p>
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
