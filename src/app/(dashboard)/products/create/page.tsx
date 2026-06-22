"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { useCreateProduct } from "@/hooks/useProducts";
import ProductForm from "@/features/products/components/ProductForm";
import type { CreateProductRequest } from "@/types/product.types";

export default function CreateProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct(() => router.push("/products"));

  const handleSubmit = (data: Record<string, unknown>) => {
    createMutation.mutate(data as unknown as CreateProductRequest);
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
          <p className="text-sm text-slate-500">Add a new product to the catalog.</p>
        </div>
      </div>

      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
