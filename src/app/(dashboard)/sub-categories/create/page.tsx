"use client";

import { useRouter } from "next/navigation";
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Sub Category</h1>
        <p className="text-sm text-slate-500">Create a new sub category for product classification.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl">
        <SubCategoryForm onSubmit={handleSubmit} onCancel={() => router.push("/sub-categories")} isPending={isPending} />
      </div>
    </div>
  );
}
