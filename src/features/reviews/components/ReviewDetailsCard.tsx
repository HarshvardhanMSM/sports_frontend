"use client";

import React from "react";
import { FiStar, FiCalendar, FiUser, FiThumbsUp, FiCheckCircle } from "react-icons/fi";
import type { Review } from "@/types/review.types";
import Badge from "@/components/ui/badge/Badge";
import { resolveImageUrl } from "@/lib/image";

interface ReviewDetailsCardProps {
  review: Review;
}

const statusBadgeColor: Record<string, "success" | "warning" | "error" | "info"> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "error",
  HIDDEN: "info",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          className={`size-5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewDetailsCard({ review }: ReviewDetailsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Review Details</h2>
          <Badge color={statusBadgeColor[review.status] ?? "info"} size="md">
            {review.status.charAt(0) + review.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer</h3>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-indigo-50">
                  <FiUser className="size-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{review.userName}</p>
                  <p className="text-xs text-slate-500">
                    {review.user.firstName} {review.user.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Product</h3>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              {review.images.length > 0 ? (
                <img
                  src={resolveImageUrl(review.images[0].imageUrl)}
                  alt={review.productName}
                  className="size-12 rounded-lg object-cover border border-slate-200"
                />
              ) : (
                <div className="size-12 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                  {review.productName.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-slate-800">{review.productName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Review</h3>
          <div className="bg-slate-50 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Rating</p>
                <StarRating rating={review.rating} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Date</p>
                <div className="flex items-center gap-1 text-sm text-slate-700">
                  <FiCalendar className="size-3.5 text-slate-400" />
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Helpful</p>
                <div className="flex items-center gap-1 text-sm text-slate-700">
                  <FiThumbsUp className="size-3.5 text-slate-400" />
                  <span>{review.helpfulCount} votes</span>
                </div>
              </div>
              {review.isVerifiedPurchase && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1">Verified</p>
                  <div className="flex items-center gap-1 text-sm text-emerald-600">
                    <FiCheckCircle className="size-3.5" />
                    <span>Verified Purchase</span>
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Title</p>
              <p className="text-sm font-semibold text-slate-800">{review.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">Comment</p>
              <p className="text-sm text-slate-700 leading-relaxed">{review.comment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
