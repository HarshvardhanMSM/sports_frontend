"use client";

import React from "react";
import { FiZap, FiTrendingUp, FiAlertTriangle, FiBarChart2 } from "react-icons/fi";
import type { ReturnSummary, ReturnReason, ReturnProduct } from "@/types/return-analytics.types";

interface Props {
  summary: ReturnSummary | undefined;
  reasons: ReturnReason[] | undefined;
  products: ReturnProduct[] | undefined;
  isLoading: boolean;
}

export default function ReturnInsights({ summary, reasons, products, isLoading }: Props) {
  const insights: { icon: React.ElementType; bg: string; title: string; description: string }[] = [];

  if (summary) {
    if (Number(summary.returnRate ?? 0) > 5) {
      insights.push({
        icon: FiAlertTriangle,
        bg: "from-amber-500 to-amber-600",
        title: "High Return Rate",
        description: `Current return rate is ${Number(summary.returnRate).toFixed(1)}%. Industry benchmark is ~3-5%. Investigate top return reasons.`,
      });
    }

    if (Number(summary.averageProcessingTimeHours ?? 0) > 24) {
      insights.push({
        icon: FiZap,
        bg: "from-indigo-500 to-indigo-600",
        title: "Slow Return Processing",
        description: `Average processing time is ${Number(summary.averageProcessingTimeHours).toFixed(1)} hours. Streamlining your return workflow could improve customer satisfaction.`,
      });
    }
  }

  if (reasons && reasons.length > 0) {
    const total = reasons.reduce((s, r) => s + Number(r.count ?? 0), 0);
    const topReason = reasons.reduce((max, r) => (Number(r.count ?? 0) > Number(max.count ?? 0) ? r : max), reasons[0]);
    const topPct = total > 0 ? (Number(topReason.count ?? 0) / total) * 100 : 0;
    if (topPct > 20) {
      insights.push({
        icon: FiZap,
        bg: "from-blue-500 to-blue-600",
        title: `Top Issue: "${(topReason.reason ?? "Unknown").replace(/_/g, " ")}"`,
        description: `${(topReason.reason ?? "Unknown").replace(/_/g, " ")} accounts for ${topPct.toFixed(1)}% of all returns (${Number(topReason.count).toLocaleString()} returns). Consider updating product descriptions or quality checks.`,
      });
    }
  }

  if (products && products.length > 0) {
    const worst = products.reduce((max, p) => (Number(p.revenueLoss ?? 0) > Number(max.revenueLoss ?? 0) ? p : max), products[0]);
    if (Number(worst.revenueLoss ?? 0) > 1000) {
      insights.push({
        icon: FiTrendingUp,
        bg: "from-red-500 to-red-600",
        title: `High Return Product: ${worst.productName ?? "Unknown"}`,
        description: `${worst.productName ?? "Unknown"} has ${worst.returnCount ?? 0} returns with a ${Number(worst.returnRate ?? 0).toFixed(1)}% return rate, costing $${Number(worst.revenueLoss).toFixed(2)} in lost revenue.`,
      });
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-pulse space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FiZap className="size-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-800">Insights</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">Actionable intelligence from your return analytics</p>
      </div>
      <div className="p-6 space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${insight.bg}`}>
              <insight.icon className="size-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{insight.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
