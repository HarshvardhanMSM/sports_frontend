"use client";

import React, { useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import Select from "@/components/ui/select/Select";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  brandId: string;
  onBrandChange: (val: string) => void;
  categoryId: string;
  onCategoryChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  isFeatured: string;
  onFeaturedChange: (val: string) => void;
  onReset: () => void;
}

export default function ProductFilters({
  search,
  onSearchChange,
  brandId,
  onBrandChange,
  categoryId,
  onCategoryChange,
  status,
  onStatusChange,
  isFeatured,
  onFeaturedChange,
  onReset,
}: ProductFiltersProps) {
  const { data: brandsData } = useBrands({ limit: 100 });
  const { data: categoriesData } = useCategories({ limit: 100 });

  const brands = useMemo(() => brandsData?.data?.items ?? [], [brandsData]);
  const categories = useMemo(() => categoriesData?.data?.items ?? [], [categoriesData]);

  // Memoize options for the custom Select components
  const categoryOptions = useMemo(() => {
    return [
      { value: "All", label: "All Categories" },
      ...categories.map((c) => ({ value: c.id, label: c.name })),
    ];
  }, [categories]);

  const brandOptions = useMemo(() => {
    return [
      { value: "All", label: "All Brands" },
      ...brands.map((b) => ({ value: b.id, label: b.name })),
    ];
  }, [brands]);

  const statusOptions = useMemo(() => [
    { value: "All", label: "All Statuses" },
    { value: "DRAFT", label: "Draft" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ], []);

  const featuredOptions = useMemo(() => [
    { value: "All", label: "All" },
    { value: "true", label: "Featured Only" },
    { value: "false", label: "Non-Featured" },
  ], []);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 items-end">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <Select
            value={categoryId}
            onChange={onCategoryChange}
            options={categoryOptions}
            placeholder="All Categories"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Brand
          </label>
          <Select
            value={brandId}
            onChange={onBrandChange}
            options={brandOptions}
            placeholder="All Brands"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <Select
            value={status}
            onChange={onStatusChange}
            options={statusOptions}
            placeholder="All Statuses"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Featured
          </label>
          <Select
            value={isFeatured}
            onChange={onFeaturedChange}
            options={featuredOptions}
            placeholder="All"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer h-[34px]"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

