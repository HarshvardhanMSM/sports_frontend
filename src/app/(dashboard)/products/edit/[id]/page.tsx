"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useProduct, useUpdateProduct } from "@/hooks/useProducts";
import ProductForm from "@/features/products/components/ProductForm";
import type { UpdateProductRequest } from "@/types/product.types";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useProduct(id);
  const updateMutation = useUpdateProduct(id, () => router.push("/products"));

  const handleSubmit = (data: Record<string, unknown>) => {
    updateMutation.mutate(data as unknown as UpdateProductRequest);
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Edit Product
        </h1>
        <p className="text-sm text-slate-500">
          Update product details and settings.
        </p>
      </div>

      <ProductForm
        initialData={data.data}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
