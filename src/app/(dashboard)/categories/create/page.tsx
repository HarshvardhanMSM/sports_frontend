"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateCategory } from "@/hooks/useCategories";
import CategoryForm from "@/features/categories/components/CategoryForm";

export default function CreateCategoryPage() {
  const router = useRouter();
  const { mutateAsync: createCategory, isPending } = useCreateCategory();

  const handleSubmit = async ({ name, slug, description, imageFile, brandIds }: { name: string; slug?: string; description: string; imageFile?: File | null; brandIds: string[] }) => {
    const fd = new FormData();
    fd.append("name", name);
    if (slug) fd.append("slug", slug);
    fd.append("description", description);
    if (imageFile) fd.append("image", imageFile);
    if (brandIds.length > 0) fd.append("brandIds", JSON.stringify(brandIds));
    await createCategory(fd);
  };

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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Category</h1>
          <p className="text-sm text-slate-500">Create a new category for sportswear products.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm max-w-full">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/categories")}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
