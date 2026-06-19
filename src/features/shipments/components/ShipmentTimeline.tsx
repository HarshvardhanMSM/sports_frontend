"use client";

import React from "react";
import { FiClock, FiUser } from "react-icons/fi";
import type { TrackingLog, ShipmentStatus } from "@/types/shipment.types";

interface Props {
  logs: TrackingLog[];
  status: ShipmentStatus;
}

const WORKFLOW: { status: ShipmentStatus; label: string }[] = [
  { status: "PENDING",            label: "Pending" },
  { status: "PACKED",             label: "Packed" },
  { status: "READY_FOR_DISPATCH", label: "Ready For Dispatch" },
  { status: "OUT_FOR_DELIVERY",   label: "Out For Delivery" },
  { status: "DELIVERED",          label: "Delivered" },
];

const STATUS_ORDER: Record<string, number> = {
  PENDING: 0, PACKED: 1, READY_FOR_DISPATCH: 2, OUT_FOR_DELIVERY: 3, DELIVERED: 4, FAILED_DELIVERY: -1,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function ShipmentTimeline({ logs, status }: Props) {
  if (status === "FAILED_DELIVERY") {
    const failedLog = logs.find((l) => l.status === "FAILED_DELIVERY");
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Tracking Timeline</h2>
        </div>
        <div className="p-6 flex flex-col items-center py-10">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-3">
            <span className="text-rose-500 text-xl">✗</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Delivery Failed</p>
          <p className="text-xs text-slate-500 mt-1">{failedLog?.notes ?? "Delivery was unsuccessful."}</p>
          {failedLog && (
            <p className="text-xs text-slate-400 mt-2">{formatDate(failedLog.createdAt)}</p>
          )}
        </div>
      </div>
    );
  }

  const logMap = new Map(logs.map((l) => [l.status, l]));
  const lastIdx = logs.length > 0 ? (STATUS_ORDER[logs[logs.length - 1].status] ?? -1) : -1;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Tracking Timeline</h2>
      </div>
      <div className="p-6">
        <div className="relative">
          {WORKFLOW.map((step, i) => {
            const log = logMap.get(step.status);
            const isCompleted = !!log;
            const isNext = !isCompleted && i === lastIdx + 1;

            return (
              <div key={step.status} className="flex items-start gap-4 pb-6 last:pb-0 relative">
                {i < WORKFLOW.length - 1 && (
                  <div className={`absolute left-[15px] top-7 w-0.5 h-full -z-10 ${isCompleted ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isCompleted
                      ? "bg-emerald-100 text-emerald-600"
                      : isNext
                      ? "bg-indigo-100 text-indigo-600 ring-2 ring-indigo-200"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? "✓" : i + 1}
                </div>
                <div className="pt-0.5 min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${isNext ? "text-indigo-700" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                    {step.label}
                  </p>
                  {log && (
                    <div className="mt-1 space-y-0.5">
                      {log.notes && <p className="text-xs text-slate-500">{log.notes}</p>}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <FiClock className="size-3" /> {formatDate(log.createdAt)}
                        </span>
                        {log.changedBy && (
                          <span className="inline-flex items-center gap-1">
                            <FiUser className="size-3" /> {log.changedBy}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {isNext && (
                    <span className="text-xs text-indigo-500 font-medium mt-0.5 block">Next step</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
