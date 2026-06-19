"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Brand } from "@/types/brand.types";
import { useCategories } from "@/hooks/useCategories";
import BrandImageUpload from "./BrandImageUpload";

const brandSchema = z.object({
  name: z.string().min(2, "Brand Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isActive: z.boolean(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandFormProps {
  initialData?: Brand;
  onSubmit: (data: BrandFormValues, logoFile: File | null, categoryIds: string[]) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function BrandForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: BrandFormProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    initialData?.categories?.map((c) => c.id) ?? []
  );

  const { data: categoriesRes } = useCategories({ limit: 100 });
  const categories = categoriesRes?.data?.items ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const nameVal = watch("name");

  useEffect(() => {
    if (!initialData && nameVal) {
      const generatedSlug = nameVal
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameVal, setValue, initialData]);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data, logoFile, selectedCategoryIds))} className="space-y-6 max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm font-sans">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? "Edit Brand" : "Create New Brand"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {initialData ? "Modify your brand details below." : "Add a new sportswear brand partner."}
        </p>
      </div>

      <div className="grid gap-5">
        {/* Brand Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Brand Name
          </label>
          <input
            type="text"
            placeholder="e.g. Nike, Adidas, Puma"
            {...register("name")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.name && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Slug
          </label>
          <input
            type="text"
            placeholder="e.g. nike"
            {...register("slug")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none"
          />
          {errors.slug && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.slug.message}</p>
          )}
        </div>

        {/* Logo Upload */}
        <BrandImageUpload
          currentLogo={initialData?.logo}
          onFileChange={setLogoFile}
        />

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Description
          </label>
          <textarea
            rows={4}
            placeholder="Write a brief brand description, vision or motto..."
            {...register("description")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.description && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Linked Categories */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Linked Categories
          </label>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-100">
            {categories.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-400">No categories available.</p>
            )}
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryIds.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-700">{cat.name}</span>
              </label>
            ))}
          </div>
          {selectedCategoryIds.length > 0 && (
            <p className="text-xs text-slate-400 mt-1">{selectedCategoryIds.length} selected</p>
          )}
        </div>

        {/* Status Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Status
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="true"
                checked={watch("isActive") === true}
                onChange={() => setValue("isActive", true)}
                className="size-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="false"
                checked={watch("isActive") === false}
                onChange={() => setValue("isActive", false)}
                className="size-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-700">Inactive</span>
            </label>
          </div>
        </div>
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
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Brand"}
        </button>
      </div>
    </form>
  );
}