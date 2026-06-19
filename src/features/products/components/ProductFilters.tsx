"use client";

import React, { useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";

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
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Brand
          </label>
          <select
            value={brandId}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
          >
            <option value="All">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
          >
            <option value="All">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            {/* <option value="ARCHIVED">Archived</option> */}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Featured
          </label>
          <select
            value={isFeatured}
            onChange={(e) => onFeaturedChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
          >
            <option value="All">All</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured</option>
          </select>
        </div>

        <div>
          <button
            type="button"
            onClick={onReset}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
