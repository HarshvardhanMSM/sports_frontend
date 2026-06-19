"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import { useReview, useApproveReview, useRejectReview, useHideReview, useDeleteReview } from "@/hooks/useReviews";
import ReviewDetailsCard from "@/features/reviews/components/ReviewDetailsCard";
import ReviewModerationActions from "@/features/reviews/components/ReviewModerationActions";
import DeleteReviewModal from "@/features/reviews/components/DeleteReviewModal";

export default function ReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;

  const { data, isLoading, error, refetch } = useReview(id);
  const { mutateAsync: approveReview, isPending: isApproving } = useApproveReview();
  const { mutateAsync: rejectReview, isPending: isRejecting } = useRejectReview();
  const { mutateAsync: hideReview, isPending: isHiding } = useHideReview();
  const { mutateAsync: deleteReview, isPending: isDeleting } = useDeleteReview();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const review = data?.data;

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = async () => {
    try {
      await approveReview(id!);
      showToast("success", "Review approved successfully");
    } catch {
      showToast("error", "Failed to approve review");
    }
  };

  const handleReject = async () => {
    try {
      await rejectReview(id!);
      showToast("success", "Review rejected successfully");
    } catch {
      showToast("error", "Failed to reject review");
    }
  };

  const handleHide = async () => {
    try {
      await hideReview(id!);
      showToast("success", "Review hidden successfully");
    } catch {
      showToast("error", "Failed to hide review");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview(id!);
      showToast("success", "Review deleted successfully");
      setShowDeleteModal(false);
      setTimeout(() => router.push("/product-reviews"), 300);
    } catch {
      showToast("error", "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all ${
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/product-reviews"
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <FiArrowLeft className="size-3.5" />
              Back to Reviews
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Review Details</h1>
          <p className="text-sm text-slate-500 mt-0.5">View and moderate customer review.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-9 animate-spin rounded-full border-[3px] border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading review...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-rose-500" />
          </div>
          <p className="text-sm font-semibold text-slate-800">Failed to load review</p>
          <p className="text-xs text-slate-500 mt-1">Please try again later.</p>
          <button
            onClick={() => refetch()}
            className="mt-5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            Retry
          </button>
        </div>
      ) : !review ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <FiAlertCircle className="size-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Review not found</h3>
          <p className="mt-1.5 text-sm text-slate-500">The review you are looking for does not exist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReviewDetailsCard review={review} />
          </div>
          <div>
            <ReviewModerationActions
              status={review.status}
              onApprove={handleApprove}
              onReject={handleReject}
              onHide={handleHide}
              onDelete={() => setShowDeleteModal(true)}
              isApproving={isApproving}
              isRejecting={isRejecting}
              isHiding={isHiding}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      )}

      {showDeleteModal && review && (
        <DeleteReviewModal
          reviewTitle={review.title}
          customerName={review.userName}
          rating={review.rating}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
