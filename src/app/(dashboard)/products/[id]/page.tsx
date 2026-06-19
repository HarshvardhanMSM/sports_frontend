"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit, FiBriefcase, FiLayers, FiTag } from "react-icons/fi";
import { useProduct } from "@/hooks/useProducts";
import Badge from "@/components/ui/badge/Badge";

interface ViewProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewProductPage({ params }: ViewProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useProduct(id);

  const product = data?.data;

  if (!id || id === "undefined") {
    return <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
      <h2 className="text-lg font-bold text-slate-800">Invalid Product ID</h2>
      <p className="text-sm text-slate-500 mt-2">The product ID provided is invalid.</p>
      <button onClick={() => router.push("/products")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to Products</button>
    </div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm font-sans">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center font-sans">
        <h2 className="text-lg font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          The product you are trying to view does not exist or has been deleted.
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "success";
      case "Draft": return "warning";
      case "Inactive": return "dark";
      // case "Archived": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/products")}
            className="flex items-center justify-center size-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-colors"
          >
            <FiArrowLeft className="size-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Slug: {product.slug}</p>
          </div>
        </div>

        <Link
          href={`/products/edit/${product.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <FiEdit className="size-4" />
          Edit Product
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {product.image && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Product Image
              </h3>
              <div className="relative aspect-video w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}

          {(product.shortDescription || product.description) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              {product.shortDescription && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Short Description
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              )}
              {product.description && (
                <div className={product.shortDescription ? "border-t border-slate-100 pt-4" : ""}>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Full Description
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status
              </span>
              <Badge color={getStatusColor(product.status)}>{product.status}</Badge>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Featured</span>
              <Badge color={product.isFeatured ? "success" : "dark"}>
                {product.isFeatured ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-500">Active</span>
              <Badge color={product.isActive ? "success" : "dark"}>
                {product.isActive ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Created</span>
                <span className="text-slate-800">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Updated</span>
                <span className="text-slate-800">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Catalog Associations
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <FiBriefcase className="size-4.5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Brand
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {product.brandName || "—"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <FiLayers className="size-4.5" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Category
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    {product.categoryName || "—"}
                  </span>
                </div>
              </div>

              {product.subCategoryName && (
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <FiTag className="size-4.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Sub Category
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {product.subCategoryName}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
