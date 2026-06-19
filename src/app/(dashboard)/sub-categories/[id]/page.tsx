"use client";

import { use, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit, FiGrid, FiLayers, FiCalendar } from "react-icons/fi";
import { useSubCategory } from "@/hooks/useSubCategories";
import { useCategories } from "@/hooks/useCategories";
import Badge from "@/components/ui/badge/Badge";
import { getImageUrl } from "@/lib/utils";

interface ViewSubCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewSubCategoryPage({ params }: ViewSubCategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading, isError } = useSubCategory(id);
  const { data: catsData } = useCategories({ limit: 100 });
  const categories = useMemo(() => catsData?.data?.items ?? [], [catsData]);

  const sc = data?.data;
  const categoryName = categories.find((c) => c.id === sc?.categoryId)?.name ?? sc?.categoryName ?? "—";

  if (!id || id === "undefined") {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Invalid ID</h2>
        <p className="text-sm text-slate-500 mt-2">The sub category ID provided is invalid.</p>
        <button onClick={() => router.push("/sub-categories")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading sub category...</p>
      </div>
    );
  }

  if (isError || !sc) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Sub Category Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The sub category does not exist or has been deleted.</p>
        <button onClick={() => router.push("/sub-categories")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to Sub Categories</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/sub-categories")} className="flex items-center justify-center size-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-colors">
            <FiArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">{sc.name}</h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Slug: {sc.slug}</p>
          </div>
        </div>
        <Link href={`/sub-categories/${sc.id}/edit`} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
          <FiEdit className="size-4" />
          Edit Sub Category
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {sc.image && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image</h3>
              <div className="relative aspect-video w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                <img src={getImageUrl(sc.image)} alt={sc.name} className="max-h-full max-w-full object-contain" />
              </div>
            </div>
          )}

          {sc.description && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{sc.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
              <Badge color={sc.isActive ? "success" : "error"}>{sc.isActive ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Sort Order</span>
              <span className="text-slate-800 font-bold">{sc.sortOrder}</span>
            </div>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-800">{new Date(sc.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-800">{new Date(sc.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Category</h3>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FiLayers className="size-4.5" />
              </div>
              <span className="text-sm font-bold text-slate-800">{categoryName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
