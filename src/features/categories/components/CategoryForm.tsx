"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Category } from "@/types/category.types";
import { useBrands } from "@/hooks/useBrands";
import CategoryImageUpload from "./CategoryImageUpload";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  description: z.string().min(1, "Description is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: { name: string; slug?: string; description: string; isActive?: boolean; imageFile?: File | null; brandIds: string[] }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: CategoryFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(
    initialData?.brands?.map((b) => b.id) ?? []
  );

  const { data: brandsRes } = useBrands({ limit: 100 });
  const brands = brandsRes?.data?.items ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
    },
  });

  const nameVal = watch("name");

  useEffect(() => {
    if (!initialData && nameVal) {
      const generated = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generated, { shouldValidate: true });
    }
  }, [nameVal, setValue, initialData]);

  const toggleBrand = (id: string) => {
    setSelectedBrandIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (data: CategoryFormValues) => {
    onSubmit({ ...data, isActive, imageFile, brandIds: selectedBrandIds });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm font-sans">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? "Edit Category" : "Create New Category"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {initialData ? "Modify your category details below." : "Add a new sportswear product category."}
        </p>
      </div>

      <div className="grid gap-5">
        <CategoryImageUpload
          currentImage={initialData?.image}
          onFileSelect={setImageFile}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Category Name
          </label>
          <input
            type="text"
            placeholder="e.g. Footwear, Outerwear"
            {...register("name")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.name && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Slug
          </label>
          <input
            type="text"
            placeholder="e.g. footwear"
            {...register("slug")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.slug && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Write a brief category description..."
            {...register("description")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.description && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Linked Brands */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Linked Brands
          </label>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100">
            {brands.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-400">No brands available.</p>
            )}
            {brands.map((brand) => (
              <label
                key={brand.id}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedBrandIds.includes(brand.id)}
                  onChange={() => toggleBrand(brand.id)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">{brand.name}</span>
              </label>
            ))}
          </div>
          {selectedBrandIds.length > 0 && (
            <p className="text-xs text-slate-400 mt-1">{selectedBrandIds.length} selected</p>
          )}
        </div>

        {initialData && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Status
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  isActive ? "bg-indigo-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow transform ring-0 transition-transform ${
                    isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Category"}
        </button>
      </div>
    </form>
  );
}