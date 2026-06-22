"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useSubCategory, useUpdateSubCategory } from "@/hooks/useSubCategories";
import SubCategoryForm from "@/features/sub-categories/components/SubCategoryForm";

interface EditSubCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSubCategoryPage({ params }: EditSubCategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useSubCategory(id);
  const { mutateAsync: updateSubCategory, isPending } = useUpdateSubCategory(id);

  const handleSubmit = async (formData: { categoryId: string; name: string; slug?: string; image?: string; description?: string; sortOrder: number; isActive: boolean }) => {
    await updateSubCategory({ ...formData, sortOrder: Number(formData.sortOrder) });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading sub category...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Sub Category Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The sub category you are trying to edit does not exist.</p>
        <button onClick={() => router.push("/sub-categories")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to Sub Categories</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/sub-categories"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Sub Category</h1>
          <p className="text-sm text-slate-500">Update sub category details and settings.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <SubCategoryForm
          initialData={data.data}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/sub-categories")}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
