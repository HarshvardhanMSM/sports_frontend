"use client";

import React, { useState } from "react";
import { FiAlertCircle, FiStar } from "react-icons/fi";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useReviews, useDeleteReview, useApproveReview, useRejectReview, useHideReview } from "@/hooks/useReviews";
import type { ReviewListParams } from "@/types/review.types";
import ReviewTable from "@/features/reviews/components/ReviewTable";
import ReviewFilters from "@/features/reviews/components/ReviewFilters";
import ReviewAnalyticsCards from "@/features/reviews/components/ReviewAnalyticsCards";
import DeleteReviewModal from "@/features/reviews/components/DeleteReviewModal";
import Pagination from "@/components/ui/pagination/Pagination";
import type { Review } from "@/types/review.types";

const PAGE_SIZE = 10;

export default function ProductReviewsPage() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const params: ReviewListParams = {
    page,
    limit: PAGE_SIZE,
    search: searchTerm || undefined,
    ...(statusFilter !== "All" ? { status: statusFilter as ReviewListParams["status"] } : {}),
    ...(ratingFilter !== undefined ? { rating: ratingFilter } : {}),
  };

  const { data, isLoading, error, isRefetching, refetch } = useReviews(params);
  const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { mutateAsync: approveReview } = useApproveReview();
  const { mutateAsync: rejectReview } = useRejectReview();
  const { mutateAsync: hideReview } = useHideReview();

  const d = data?.data;
  const allReviews = d?.reviews ?? [];
  const total = d?.total ?? d?.totalReviews ?? 0;
  const totalPages = d?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = d?.page ?? page;

  const reviewMeta = d ? {
    totalReviews: d.totalReviews,
    averageRating: d.averageRating,
    pendingReviews: 0,
    approvedReviews: 0,
    rejectedReviews: 0,
    hiddenReviews: 0,
    ratingDistribution: [],
  } : undefined;

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: string) => {
    const review = allReviews.find((r) => r.id === id);
    if (review) setDeleteTarget(review);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteReview(deleteTarget.id);
      showToast("success", "Review deleted successfully");
      setDeleteTarget(null);
    } catch {
      showToast("error", "Failed to delete review");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      showToast("success", "Review approved successfully");
    } catch {
      showToast("error", "Failed to approve review");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id);
      showToast("success", "Review rejected successfully");
    } catch {
      showToast("error", "Failed to reject review");
    }
  };

  const handleHide = async (id: string) => {
    try {
      await hideReview(id);
      showToast("success", "Review hidden successfully");
    } catch {
      showToast("error", "Failed to hide review");
    }
  };

  const isFiltered = searchTerm !== "" || statusFilter !== "All" || ratingFilter !== undefined;

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <PageHeader
        badge="Review Management"
        title="Product Reviews"
        description="Moderate and manage customer reviews across your product catalog."
      />

      <ReviewAnalyticsCards analytics={reviewMeta} isLoading={isLoading} />

      <ReviewFilters
        search={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1); }}
        statusFilter={statusFilter}
        onStatusFilterChange={(v) => { setStatusFilter(v); setPage(1); }}
        ratingFilter={ratingFilter}
        onRatingFilterChange={(v) => { setRatingFilter(v); setPage(1); }}
        onRefresh={() => refetch()}
        isRefetching={isRefetching}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading reviews...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load reviews</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : allReviews.length > 0 ? (
        <div className="space-y-4">
          <ReviewTable
            reviews={allReviews}
            onApprove={handleApprove}
            onReject={handleReject}
            onHide={handleHide}
            onDelete={handleDelete}
            isPending={isDeleting}
          />
          <Pagination
            page={safePage}
            totalPages={totalPages}
            total={total}
            limit={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <EmptyState
          icon={
            isFiltered ? (
              <FiAlertCircle className="size-6 text-slate-400" />
            ) : (
              <FiStar className="size-6 text-slate-400" />
            )
          }
          title={isFiltered ? "No matching reviews" : "No reviews found"}
          description={
            isFiltered
              ? "No reviews match your current filters. Try refining your search query."
              : "Customer reviews will appear here once they start submitting feedback on your products."
          }
        />
      )}

      {deleteTarget && (
        <DeleteReviewModal
          reviewTitle={deleteTarget.title}
          customerName={deleteTarget.userName}
          rating={deleteTarget.rating}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
