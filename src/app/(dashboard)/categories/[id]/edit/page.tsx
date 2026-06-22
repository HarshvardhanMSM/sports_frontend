"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCategory, useUpdateCategory, useUpdateCategoryJson } from "@/hooks/useCategories";
import CategoryForm from "@/features/categories/components/CategoryForm";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isPending: isLoading, isError } = useCategory(id);
  const { mutateAsync: updateCategory, isPending: isSavingFile } = useUpdateCategory(id);
  const { mutateAsync: updateCategoryJson, isPending: isSavingJson } = useUpdateCategoryJson(id);
  const isPending = isSavingFile || isSavingJson;

  const handleSubmit = async ({ name, slug, description, isActive, imageFile, brandIds }: { name: string; slug?: string; description: string; isActive?: boolean; imageFile?: File | null; brandIds: string[] }) => {
    const payload: Record<string, unknown> = { name, description };
    if (slug) payload.slug = slug;
    if (isActive !== undefined) payload.isActive = isActive;

    if (imageFile) {
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (k !== "isActive") fd.append(k, v as string);
      });
      fd.append("image", imageFile);
      if (brandIds.length > 0) fd.append("brandIds", JSON.stringify(brandIds));
      await updateCategory(fd);
    }
    const jsonPayload: Record<string, unknown> = { ...payload };
    if (brandIds.length > 0) jsonPayload.brandIds = brandIds;
    if (Object.keys(jsonPayload).length > 0) {
      await updateCategoryJson(jsonPayload);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading category details...</p>
      </div>
    );
  }

  const category = data?.data;

  if (isError || !category) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <h2 className="text-lg font-bold text-slate-800">Category Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The category you are trying to edit does not exist or has been deleted.</p>
        <button
          onClick={() => router.push("/categories")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/categories"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Category</h1>
          <p className="text-sm text-slate-500">Modify details for {category.name} category.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <CategoryForm
          initialData={category}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/categories")}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
