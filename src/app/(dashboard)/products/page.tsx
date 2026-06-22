"use client";

import React, { useState, Suspense, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiPlus, FiAlertCircle } from "react-icons/fi";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import ProductFilters from "@/features/products/components/ProductFilters";
import ProductTable from "@/features/products/components/ProductTable";
import Pagination from "@/components/ui/pagination/Pagination";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromUrl = parseInt(searchParams.get("page") ?? "1", 10);
  const limitFromUrl = parseInt(searchParams.get("limit") ?? "10", 10);
  const searchFromUrl = searchParams.get("search") ?? "";

  const brandId = searchParams.get("brandId") ?? "All";
  const categoryId = searchParams.get("categoryId") ?? "All";
  const status = searchParams.get("status") ?? "All";
  const isFeatured = searchParams.get("isFeatured") ?? "All";

  const { query, setQuery, debouncedQuery } = useFuzzySearch(null, {
    keys: [],
    isServerSide: true,
    initialQuery: searchFromUrl,
  });

  const params = {
    page: pageFromUrl,
    limit: limitFromUrl,
    ...(debouncedQuery ? { search: debouncedQuery } : {}),
    ...(brandId !== "All" ? { brandId } : {}),
    ...(categoryId !== "All" ? { categoryId } : {}),
    ...(status !== "All" ? { status: status.toUpperCase() } : {}),
    ...(isFeatured !== "All" ? { isFeatured: isFeatured === "true" } : {}),
  };
  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([k, v]) => {
        if (v && v !== "All" && v !== "1" && v !== "10") next.set(k, v);
        else next.delete(k);
      });
      router.push(`?${next.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (debouncedQuery !== searchFromUrl) {
      updateUrl({ search: debouncedQuery, page: "1" });
    }
  }, [debouncedQuery, searchFromUrl, updateUrl]);

  const { data, isLoading, isError } = useProducts(params);
  const deleteMutation = useDeleteProduct();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleReset = () => {
    setQuery("");
    router.push("/products");
  };

  const products = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-sm text-slate-500">
            View, search, filter, and manage products.
          </p>
        </div>
        <Link
          href="/products/create"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="size-4" />
          Add Product
        </Link>
      </div>

      <ProductFilters
        search={query}
        onSearchChange={(v) => { setQuery(v); }}
        brandId={brandId}
        onBrandChange={(v) => updateUrl({ brandId: v, page: "1" })}
        categoryId={categoryId}
        onCategoryChange={(v) => updateUrl({ categoryId: v, page: "1" })}
        status={status}
        onStatusChange={(v) => updateUrl({ status: v, page: "1" })}
        isFeatured={isFeatured}
        onFeaturedChange={(v) => updateUrl({ isFeatured: v, page: "1" })}
        onReset={handleReset}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">Loading products...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <FiAlertCircle className="size-8 text-rose-500 mb-3" />
          <h3 className="text-base font-bold text-slate-800">Failed to load products</h3>
          <p className="text-sm text-slate-500 mt-1">Please try again later.</p>
        </div>
      ) : products.length > 0 ? (
        <div className="space-y-4">
          <ProductTable products={products} onDelete={handleDelete} />
          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              showLimitSelector
              onPageChange={(p) => updateUrl({ page: String(p) })}
              onLimitChange={(l) => updateUrl({ limit: String(l), page: "1" })}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
          <FiAlertCircle className="size-6 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No products found
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Try adjusting your filters or create a new product.
          </p>
          <button
            onClick={handleReset}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
