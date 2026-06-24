"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateProduct } from "@/hooks/useProducts";
import ProductForm from "@/features/products/components/ProductForm";
import type { CreateProductRequest } from "@/types/product.types";
import { ProductService } from "@/services/product.service";

export default function CreateProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct();
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (
    data: Record<string, unknown>,
    newImages: File[],
    deletedImageIds: string[],
    primaryImageIndex: number,
    primaryImageId: string | null
  ) => {
    setIsSaving(true);
    const fd = new FormData();
    fd.append("brandId", data.brandId as string);
    fd.append("categoryId", data.categoryId as string);
    if (data.subCategoryId) fd.append("subCategoryId", data.subCategoryId as string);
    fd.append("name", data.name as string);
    fd.append("slug", data.slug as string);
    if (data.skuPrefix) fd.append("skuPrefix", data.skuPrefix as string);
    if (data.shortDescription) fd.append("shortDescription", data.shortDescription as string);
    if (data.description) fd.append("description", data.description as string);
    fd.append("status", data.status as string);
    if (data.metaTitle) fd.append("metaTitle", data.metaTitle as string);
    if (data.metaDescription) fd.append("metaDescription", data.metaDescription as string);
    if (data.metaKeywords) fd.append("metaKeywords", data.metaKeywords as string);

    // Append multiple files under the key "images"
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        fd.append("images", file);
      });
      fd.append("primaryImageIndex", String(primaryImageIndex));
    }

    if (Array.isArray(data.collectionIds) && data.collectionIds.length > 0) {
      fd.append("collectionIds", JSON.stringify(data.collectionIds));
    }
    if (Array.isArray(data.tagIds) && data.tagIds.length > 0) {
      fd.append("tagIds", JSON.stringify(data.tagIds));
    }
    if (Array.isArray(data.variants) && data.variants.length > 0) {
      fd.append("variants", JSON.stringify(data.variants));
    }

    try {
      const response = await createMutation.mutateAsync(fd as unknown as CreateProductRequest);
      const createdProductId = response.data.id;

      // Update boolean fields via JSON patch request to ensure synchronization
      await ProductService.updateProduct(createdProductId, {
        isFeatured: data.isFeatured as boolean,
        isActive: data.isActive as boolean,
      });

      router.push("/products");
    } catch (err) {
      console.error("Failed to create product", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => router.push("/products");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <FiArrowLeft className="size-4" />
          Back
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create New Product</h1>
          <p className="text-sm text-slate-550">Add a new product to the catalog.</p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} isPending={isSaving} />
    </div>
  );
}
