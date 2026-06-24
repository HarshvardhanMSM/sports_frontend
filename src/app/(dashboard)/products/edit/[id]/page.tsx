"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import ProductForm from "@/features/products/components/ProductForm";
import type { UpdateProductRequest, CreateProductVariantRequest } from "@/types/product.types";
import { ProductService } from "@/services/product.service";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useProduct(id);
  const updateMutation = useUpdateProduct(id);
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
    fd.append("subCategoryId", (data.subCategoryId as string) || "");
    fd.append("name", data.name as string);
    fd.append("slug", data.slug as string);
    fd.append("skuPrefix", (data.skuPrefix as string) || "");
    fd.append("shortDescription", (data.shortDescription as string) || "");
    fd.append("description", (data.description as string) || "");
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



    // Append primary image ID if an existing one was set as primary
    if (primaryImageId) {
      fd.append("primaryImageId", primaryImageId);
    }

    if (Array.isArray(data.collectionIds)) {
      fd.append("collectionIds", JSON.stringify(data.collectionIds));
    }
    if (Array.isArray(data.tagIds)) {
      fd.append("tagIds", JSON.stringify(data.tagIds));
    }
    if (Array.isArray(data.variants)) {
      fd.append("variants", JSON.stringify(data.variants));
    }

    try {
      if (deletedImageIds.length > 0) {
        const uniqueIds = Array.from(new Set(deletedImageIds));
        await Promise.all(
          uniqueIds.map((imageId) => ProductService.deleteProductImage(imageId))
        );
      }

      await updateMutation.mutateAsync(fd as unknown as UpdateProductRequest);

      // Update boolean and variants fields via JSON patch request
      await ProductService.updateProduct(id, {
        isFeatured: data.isFeatured as boolean,
        isActive: data.isActive as boolean,
        variants: data.variants as CreateProductVariantRequest[],
      });

      router.push("/products");
    } catch (err) {
      console.error("Failed to update product", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => router.push("/products");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading product...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The product you are trying to edit does not exist.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Edit Product</h1>
          <p className="text-sm text-slate-500">Update product details and settings.</p>
        </div>
      </div>

      <ProductForm
        initialData={data.data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isPending={isSaving}
      />
    </div>
  );
}
