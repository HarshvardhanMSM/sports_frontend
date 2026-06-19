"use client";

import { useRouter } from "next/navigation";
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Add New Category</h1>
        <p className="text-sm text-slate-500">Create a new category for sportswear products.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl">
        <CategoryForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/categories")}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
