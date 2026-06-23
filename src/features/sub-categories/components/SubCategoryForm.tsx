"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { SubCategory } from "@/types/sub-category.types";
import { useCategories } from "@/hooks/useCategories";
import { useSubCategories } from "@/hooks/useSubCategories";
import CategoryImageUpload from "../../categories/components/CategoryImageUpload";

const subCategorySchema = z.object({
  categoryId: z.string().min(1, "Please select a parent category"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.coerce.number().min(0, "Sort order must be 0 or greater").default(0),
  isActive: z.boolean().default(true),
});

type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

interface SubCategoryFormProps {
  initialData?: SubCategory;
  onSubmit: (data: SubCategoryFormValues & { imageFile: File | null }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function SubCategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: SubCategoryFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: catsData } = useCategories({ limit: 100 });
  const categories = useMemo(() => catsData?.data?.items ?? [], [catsData]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof subCategorySchema>, unknown, SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      categoryId: initialData?.categoryId ?? "",
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      image: initialData?.image ?? "",
      description: initialData?.description ?? "",
      sortOrder: initialData?.sortOrder ?? 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const selectedCategoryId = watch("categoryId");

  const { data: existingSubCatsData, isLoading: existingLoading } = useSubCategories(
    { limit: 100, categoryId: selectedCategoryId || undefined },
    { enabled: !!selectedCategoryId },
  );
  const existingSubCategories = useMemo(
    () => existingSubCatsData?.data?.items ?? [],
    [existingSubCatsData],
  );

  const nameVal = watch("name");

  useEffect(() => {
    if (!initialData && nameVal) {
      const slug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameVal, setValue, initialData]);

  const handleFormSubmit = (data: SubCategoryFormValues) => {
    onSubmit({ ...data, imageFile });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 font-sans text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? "Edit Sub Category" : "Create New Sub Category"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {initialData ? "Modify your sub category details below." : "Add a new sub category for product classification."}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Parent Category *</label>
          <select
            {...register("categoryId")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Sub Category Name *</label>
          <input
            type="text"
            placeholder="e.g. Running Shoes"
            {...register("name")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.name && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Slug (Auto-generated)</label>
          <input
            type="text"
            placeholder="e.g. running-shoes"
            {...register("slug")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.slug && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.slug.message}</p>}
        </div>

        <div className="md:col-span-2">
          <CategoryImageUpload
            currentImage={initialData?.image}
            onFileSelect={setImageFile}
            label="Sub Category Image"
          />
        </div>

        {initialData && (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Sort Order</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                {...register("sortOrder")}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              {errors.sortOrder && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.sortOrder.message}</p>}
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
                />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Active</span>
              </label>
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Description</label>
          <textarea
            rows={3}
            placeholder="High-performance running footwear"
            {...register("description")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Existing Sub Categories under selected category */}
      {selectedCategoryId && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
            Existing Sub Categories in this Category
          </h4>
          {existingLoading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : existingSubCategories.length === 0 ? (
            <p className="text-sm text-slate-400">No sub categories yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {existingSubCategories.map((sc) => (
                <span
                  key={sc.id}
                  className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                >
                  {sc.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Sub Category"}
        </button>
      </div>
    </form>
  );
}