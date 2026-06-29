"use client";

import React from "react";
import type { Review } from "@/types/review.types";
import ReviewRowActions from "./ReviewRowActions";
import Badge from "@/components/ui/badge/Badge";
import { FiStar } from "react-icons/fi";

interface ReviewTableProps {
  reviews: Review[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onHide: (id: string) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

const statusBadgeColor: Record<string, "success" | "warning" | "error" | "info"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "error",
  HIDDEN: "info",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          className={`size-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

export default function ReviewTable({
  reviews,
  onApprove,
  onReject,
  onHide,
  onDelete,
}: ReviewTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm max-w-full overflow-x-auto min-h-[200px]">
      <table className="w-full border-collapse text-left text-sm text-slate-600">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Comment</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Created Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reviews.map((review) => (
            <tr key={review.id} className="group hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-slate-800">{review.userName}</span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-800 max-w-[160px] truncate overflow-hidden">
                <span className="block truncate" title={review.productName}>{review.productName}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap w-[110px] min-w-[110px]">
                <StarRating rating={review.rating} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 max-w-[160px]">
                {truncate(review.title, 40)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px]">
                {truncate(review.comment, 60)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge color={statusBadgeColor[review.status] ?? "info"} size="sm">
                  {review.status.charAt(0) + review.status.slice(1).toLowerCase()}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                <ReviewRowActions
                  id={review.id}
                  status={review.status}
                  onApprove={onApprove}
                  onReject={onReject}
                  onHide={onHide}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
