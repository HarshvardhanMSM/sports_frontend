"use client";

import React, { useState, useMemo } from "react";
import { FiAlertCircle, FiStar } from "react-icons/fi";
import { useReviews, useDeleteReview, useApproveReview, useRejectReview, useHideReview, useReviewAnalytics } from "@/hooks/useReviews";
import type { ReviewListParams } from "@/types/review.types";
import ReviewTable from "@/features/reviews/components/ReviewTable";
import ReviewFilters from "@/features/reviews/components/ReviewFilters";
import ReviewAnalyticsCards from "@/features/reviews/components/ReviewAnalyticsCards";
import DeleteReviewModal from "@/features/reviews/components/DeleteReviewModal";
import Pagination from "@/components/ui/pagination/Pagination";
import type { Review } from "@/types/review.types";

const PAGE_SIZE = 10;

export default function ProductReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const params: ReviewListParams = {
    search: searchTerm || undefined,
    ...(statusFilter !== "All" ? { status: statusFilter as ReviewListParams["status"] } : {}),
    ...(ratingFilter !== undefined ? { rating: ratingFilter } : {}),
  };

  const { data, isLoading, error, isRefetching, refetch } = useReviews(params);
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useReviewAnalytics();
  const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteReview();
  const { mutateAsync: approveReview } = useApproveReview();
  const { mutateAsync: rejectReview } = useRejectReview();
  const { mutateAsync: hideReview } = useHideReview();

  const allReviews = useMemo(() => data?.data ?? [], [data]);

  const filtered = useMemo(() => {
    let result = allReviews;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.userName.toLowerCase().includes(q) ||
          r.productName.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (ratingFilter !== undefined) {
      result = result.filter((r) => r.rating === ratingFilter);
    }
    return result;
  }, [allReviews, searchTerm, statusFilter, ratingFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Review Management</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Product Reviews</h1>
          <p className="text-sm text-slate-500 mt-0.5">Moderate and manage customer reviews across your product catalog.</p>
        </div>
      </div>

      <ReviewAnalyticsCards analytics={analyticsData?.data} isLoading={isAnalyticsLoading} />

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
      ) : items.length > 0 ? (
        <div className="space-y-4">
          <ReviewTable
            reviews={items}
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            {searchTerm || statusFilter !== "All" || ratingFilter !== undefined ? (
              <FiAlertCircle className="size-6 text-slate-400" />
            ) : (
              <FiStar className="size-6 text-slate-400" />
            )}
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || statusFilter !== "All" || ratingFilter !== undefined
              ? "No matching reviews"
              : "No reviews found"}
          </h3>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">
            {searchTerm || statusFilter !== "All" || ratingFilter !== undefined
              ? "No reviews match your current filters. Try refining your search query."
              : "Customer reviews will appear here once they start submitting feedback on your products."}
          </p>
        </div>
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
