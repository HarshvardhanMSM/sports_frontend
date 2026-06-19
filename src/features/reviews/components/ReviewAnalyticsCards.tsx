"use client";

import React from "react";
import { FiStar, FiThumbsUp, FiClock, FiCheckCircle, FiXCircle, FiEyeOff } from "react-icons/fi";
import type { ReviewAnalytics } from "@/types/review.types";

interface ReviewAnalyticsCardsProps {
  analytics: ReviewAnalytics | undefined;
  isLoading: boolean;
}

const cards = [
  {
    key: "totalReviews",
    label: "Total Reviews",
    icon: FiStar,
    gradient: "from-indigo-500 to-indigo-600",
    sub: "all time",
    getValue: (a: ReviewAnalytics) => a.totalReviews,
  },
  // {
  //   key: "pendingReviews",
  //   label: "Pending Reviews",
  //   icon: FiClock,
  //   gradient: "from-amber-500 to-amber-600",
  //   sub: "awaiting review",
  //   getValue: (a: ReviewAnalytics) => a.pendingReviews,
  // },
  // {
  //   key: "approvedReviews",
  //   label: "Approved",
  //   icon: FiCheckCircle,
  //   gradient: "from-emerald-500 to-emerald-600",
  //   sub: "publicly visible",
  //   getValue: (a: ReviewAnalytics) => a.approvedReviews,
  // },
  // {
  //   key: "rejectedReviews",
  //   label: "Rejected",
  //   icon: FiXCircle,
  //   gradient: "from-rose-500 to-rose-600",
  //   sub: "not approved",
  //   getValue: (a: ReviewAnalytics) => a.rejectedReviews,
  // },
  // {
  //   key: "hiddenReviews",
  //   label: "Hidden",
  //   icon: FiEyeOff,
  //   gradient: "from-slate-500 to-slate-600",
  //   sub: "not publicly visible",
  //   getValue: (a: ReviewAnalytics) => a.hiddenReviews,
  // },
  {
    key: "averageRating",
    label: "Average Rating",
    icon: FiThumbsUp,
    gradient: "from-violet-500 to-violet-600",
    sub: "across all products",
    getValue: (a: ReviewAnalytics) => `${a.averageRating.toFixed(1)}★`,
  },
];

export default function ReviewAnalyticsCards({ analytics, isLoading }: ReviewAnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
      {cards.map(({ key, label, sub, icon: Icon, gradient, getValue }) => (
        <div
          key={key}
          className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5"
        >
          <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${gradient} opacity-5`} />
          <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm mb-3`}>
            <Icon className="size-5 text-white" />
          </div>
          <p className="text-2xl font-bold text-slate-900 leading-none">
            {isLoading ? "-" : analytics ? getValue(analytics) : "-"}
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
        </div>
      ))}
    </div>
  );
}
