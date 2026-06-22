"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { FiUpload, FiX, FiImage, FiPlus, FiStar } from "react-icons/fi";
import { resolveImageUrl } from "@/lib/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBrands, useBrandCategories } from "@/hooks/useBrands";
import { useSubCategories } from "@/hooks/useSubCategories";
import type { Product } from "@/types/product.types";

const productSchema = z.object({
  brandId: z.string().min(1, "Please select a brand"),
  categoryId: z.string().min(1, "Please select a category"),
  subCategoryId: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  skuPrefix: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  collectionIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (
    data: ProductFormValues,
    newImages: File[],
    deletedImageIds: string[],
    primaryImageIndex: number,
    primaryImageId: string | null
  ) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: ProductFormProps) {
  const [imagesList, setImagesList] = useState<{
    id: string;
    file: File | null;
    preview: string;
    isPrimary: boolean;
  }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData?.images && initialData.images.length > 0) {
      setImagesList(
        initialData.images.map((img) => ({
          id: img.id,
          file: null,
          preview: resolveImageUrl(img.imageUrl) ?? "",
          isPrimary: img.isPrimary,
        }))
      );
    } else if (initialData?.image) {
      setImagesList([
        {
          id: "fallback-primary",
          file: null,
          preview: resolveImageUrl(initialData.image) ?? "",
          isPrimary: true,
        },
      ]);
    } else {
      setImagesList([]);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newItems = files.map((file) => {
      const id = Math.random().toString(36).substring(2, 9);
      return {
        id,
        file,
        preview: URL.createObjectURL(file),
        isPrimary: false,
      };
    });

    setImagesList((prev) => {
      const hasPrimary = prev.some((item) => item.isPrimary);
      const updated = [...prev, ...newItems];
      if (!hasPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  const handleRemoveImage = (id: string) => {
    setImagesList((prev) => {
      const target = prev.find((item) => item.id === id);
      const updated = prev.filter((item) => item.id !== id);

      if (target?.isPrimary && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      if (target && !target.file) {
        setDeletedImageIds((prevDeleted) => [...prevDeleted, target.id]);
      }

      return updated;
    });
  };

  const handleSetPrimary = (id: string) => {
    setImagesList((prev) =>
      prev.map((item) => ({
        ...item,
        isPrimary: item.id === id,
      }))
    );
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    const newImageFiles = imagesList.filter((item) => item.file !== null).map((item) => item.file!);
    const primaryItem = imagesList.find((item) => item.isPrimary);

    let primaryImageIndex = -1;
    let primaryImageId: string | null = null;

    if (primaryItem) {
      if (primaryItem.file) {
        const newItemsOnly = imagesList.filter((item) => item.file !== null);
        primaryImageIndex = newItemsOnly.findIndex((item) => item.id === primaryItem.id);
      } else {
        primaryImageId = primaryItem.id;
      }
    }

    onSubmit(data, newImageFiles, deletedImageIds, primaryImageIndex, primaryImageId);
  };
  const { data: brandsData, isLoading: brandsLoading } = useBrands({ limit: 100 });
  const brands = useMemo(() => brandsData?.data?.items ?? [], [brandsData]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof productSchema>, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      brandId: initialData?.brandId ?? "",
      categoryId: initialData?.categoryId ?? "",
      subCategoryId: initialData?.subCategoryId ?? "",
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      skuPrefix: initialData?.skuPrefix ?? "",
      shortDescription: initialData?.shortDescription ?? "",
      description: initialData?.description ?? "",
      status: ((initialData?.status?.toUpperCase() ?? "DRAFT") as ProductFormValues["status"]),
      metaTitle: initialData?.metaTitle ?? "",
      metaDescription: initialData?.metaDescription ?? "",
      metaKeywords: initialData?.metaKeywords ?? "",
      isFeatured: initialData?.isFeatured ?? false,
      isActive: initialData?.isActive ?? true,
      collectionIds: initialData?.collectionIds ?? [],
      tagIds: initialData?.tagIds ?? [],
    },
  });

  const selectedBrandId = watch("brandId");
  const selectedCategoryId = watch("categoryId");

  const { data: brandCatsData, isLoading: catsLoading } = useBrandCategories(selectedBrandId || undefined);
  const brandCategories = useMemo(() => brandCatsData?.data ?? [], [brandCatsData]);

  const { data: subCatsData } = useSubCategories(
    { limit: 100, categoryId: selectedCategoryId || undefined },
    { enabled: !!selectedCategoryId },
  );
  const subCategories = useMemo(() => subCatsData?.data?.items ?? [], [subCatsData]);

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

  useEffect(() => {
    if (!initialData && selectedBrandId && selectedCategoryId) {
      const categoryStillLinked = brandCategories.some((c) => c.id === selectedCategoryId);
      if (!categoryStillLinked) {
        setValue("categoryId", "", { shouldValidate: true });
        setValue("subCategoryId", "");
      }
    }
  }, [selectedBrandId, brandCategories, selectedCategoryId, setValue, initialData]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-8 max-w-6xl font-sans text-slate-800"
    >
      {/* 1. General Information */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            1. General Information
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Define basic product settings.
          </p>
        </div>

        {/* Product Image Gallery Section */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Product Media
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imagesList.map((item) => (
              <div
                key={item.id}
                className={`group relative aspect-square rounded-xl overflow-hidden border bg-white flex items-center justify-center shadow-sm transition-all duration-200 ${
                  item.isPrimary ? "border-indigo-500 ring-2 ring-indigo-50" : "border-slate-200 hover:border-slate-350"
                }`}
              >
                <img
                  src={item.preview}
                  alt="Product"
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge or Set Primary Trigger */}
                <div className="absolute top-2 left-2">
                  {item.isPrimary ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                      <FiStar className="size-3 fill-white" />
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 px-2 py-1 text-[10px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-slate-200"
                    >
                      <FiStar className="size-3" />
                      Set Primary
                    </button>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(item.id)}
                  className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-white/90 hover:bg-rose-600 text-slate-500 hover:text-white border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                  <FiX className="size-3.5" />
                </button>
              </div>
            ))}

            {/* Add Image Card (Dashed Dropzone) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 bg-slate-50/50 hover:bg-indigo-50/10 transition-all cursor-pointer aspect-square text-center group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="size-10 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-all shadow-inner border border-slate-200/50">
                <FiPlus className="size-5" />
              </div>
              <p className="text-xs font-bold text-slate-700 mt-3">Add Images</p>
              <p className="text-[9px] font-medium text-slate-400 mt-1">Upload multiple files</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Nike Air Max Plus"
              {...register("name")}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.name && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Slug (Auto-generated) *
            </label>
            <input
              type="text"
              placeholder="e.g. nike-air-max-plus"
              {...register("slug")}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.slug && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              SKU Prefix (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. NK-AMP"
              {...register("skuPrefix")}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Brand *
            </label>
            <select
              {...register("brandId")}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">{brandsLoading ? "Loading..." : "Select Brand"}</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            {errors.brandId && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.brandId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              {...register("categoryId")}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                {!selectedBrandId
                  ? "Select Brand first"
                  : catsLoading
                    ? "Loading..."
                    : brandCategories.length === 0
                      ? "No categories linked"
                      : "Select Category"}
              </option>
              {brandCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Sub Category (Optional)
            </label>
            <select
              {...register("subCategoryId")}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">No Sub Category</option>
              {subCategories.map((sc) => (
                <option key={sc.id} value={sc.id}>{sc.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 2. Descriptions */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            2. Descriptions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add product descriptions for customers and search engines.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Short Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief product summary..."
              {...register("shortDescription")}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Long Description
            </label>
            <textarea
              rows={4}
              placeholder="Detailed product description..."
              {...register("description")}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>
      </section>

      {/* 3. Status */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider">
            3. Status & Visibility
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Control product visibility and featured status.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Product Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["DRAFT", "ACTIVE", "INACTIVE"].map((st) => (
                <label
                  key={st}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3.5 cursor-pointer text-xs font-bold transition-all ${
                    watch("status") === st
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    value={st}
                    {...register("status")}
                    className="sr-only"
                  />
                  {st}
                </label>
              ))}
            </div>
            {errors.status && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.status.message}</p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isFeatured")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
              />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Featured Product
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isActive")}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
              />
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Active
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}