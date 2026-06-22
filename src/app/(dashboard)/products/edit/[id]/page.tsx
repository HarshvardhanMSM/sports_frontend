"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
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
      />
    </div>
  );
}
