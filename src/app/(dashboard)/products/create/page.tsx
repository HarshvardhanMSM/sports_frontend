"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Create New Product
        </h1>
        <p className="text-sm text-slate-500">
          Add a new product to the catalog.
        </p>
      </div>

      <ProductForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
