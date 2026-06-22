"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateSubCategory } from "@/hooks/useSubCategories";
import SubCategoryForm from "@/features/sub-categories/components/SubCategoryForm";

export default function CreateSubCategoryPage() {
  const router = useRouter();
  const { mutateAsync: createSubCategory, isPending } = useCreateSubCategory();

  const handleSubmit = async (data: { categoryId: string; name: string; slug?: string; image?: string; description?: string; sortOrder: number; isActive: boolean }) => {
    await createSubCategory({ ...data, sortOrder: Number(data.sortOrder) });
  };

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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Sub Category</h1>
          <p className="text-sm text-slate-500">Create a new sub category for product classification.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <SubCategoryForm onSubmit={handleSubmit} onCancel={() => router.push("/sub-categories")} isPending={isPending} />
      </div>
    </div>
  );
}
