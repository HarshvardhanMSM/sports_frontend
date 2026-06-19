"use client";

import React from "react";
import type { ReturnStatus, ReturnTimelineEntry } from "@/types/return.types";

interface Props {
  status: ReturnStatus;
  timeline?: ReturnTimelineEntry[];
}

interface WorkflowStep {
  action: string;
  label: string;
}

const WORKFLOW: WorkflowStep[] = [
  { action: "CREATED",          label: "Requested" },
  { action: "APPROVED",         label: "Approved" },
  { action: "PICKUP_SCHEDULED", label: "Pickup Scheduled" },
  { action: "IN_TRANSIT",       label: "In Transit" },
  { action: "RETURN_RECEIVED",  label: "Received" },
  { action: "REFUND_PROCESSED", label: "Refunded" },
  { action: "RETURN_COMPLETED", label: "Completed" },
];

const ACTION_ORDER: Record<string, number> = {
  CREATED: 0, APPROVED: 1, PICKUP_SCHEDULED: 2, IN_TRANSIT: 3,
  RETURN_RECEIVED: 4, REFUND_PROCESSED: 5, RETURN_COMPLETED: 6,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function ReturnWorkflowTimeline({ status, timeline }: Props) {
  if (status === "REJECTED") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Return Workflow</h2>
        </div>
        <div className="p-6 flex flex-col items-center py-10">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-3">
            <span className="text-rose-500 text-xl">✗</span>
          </div>
          <p className="text-sm font-bold text-slate-800">Return Rejected</p>
          <p className="text-xs text-slate-500 mt-1">This return request was rejected.</p>
        </div>
      </div>
    );
  }

  const completedActions = new Set(timeline?.map((t) => t.action) ?? []);
  const lastAction = timeline?.[timeline.length - 1]?.action;
  const lastIdx = lastAction ? (ACTION_ORDER[lastAction] ?? -1) : -1;
  const timelineMap = new Map(timeline?.map((t) => [t.action, t]) ?? []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Return Workflow</h2>
      </div>
      <div className="p-6">
        <div className="relative">
          {WORKFLOW.map((step, i) => {
            const entry = timelineMap.get(step.action);
            const isCompleted = completedActions.has(step.action);
            const isNext = !isCompleted && i === lastIdx + 1;

            return (
              <div key={step.action} className="flex items-start gap-4 pb-6 last:pb-0 relative">
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
                  {entry && (
                    <>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{entry.notes}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(entry.createdAt)}</p>
                    </>
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
