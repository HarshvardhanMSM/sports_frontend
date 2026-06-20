"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useInventoryVariants } from "@/hooks/useInventory";
import type { VariantSearchResult } from "@/types/inventory.types";

const inventorySchema = z.object({
  variantSku: z.string().min(1, "SKU is required"),
  quantity: z.number().int().min(0, "Quantity must be 0 or more"),
  reservedQuantity: z.number().int().min(0).optional(),
  reorderPoint: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(1, "Threshold must be at least 1").optional(),
  reorderQuantity: z.number().int().min(0).optional(),
});

export type InventoryFormValues = z.infer<typeof inventorySchema>;

interface InventoryFormProps {
  defaultValues?: Partial<InventoryFormValues>;
  initialVariant?: { variantId: string; variantSku: string };
  onSubmit: (data: InventoryFormValues & { variantId?: string; variantSku?: string }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function InventoryForm({
  defaultValues: externalDefaults,
  initialVariant,
  onSubmit,
  onCancel,
  isPending,
}: InventoryFormProps) {
  const [searchTerm, setSearchTerm] = useState(externalDefaults?.variantSku ?? "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantSearchResult | null>(
    initialVariant ? { productId: initialVariant.variantId, sku: initialVariant.variantSku } : null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: variantsRes } = useInventoryVariants(searchTerm);
  const variants = variantsRes?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      variantSku: "",
      quantity: 0,
      reservedQuantity: 0,
      reorderPoint: 10,
      lowStockThreshold: 5,
      reorderQuantity: 50,
      ...externalDefaults,
    },
  });

  const skuValue = watch("variantSku");

  useEffect(() => {
    if (selectedVariant && skuValue !== selectedVariant.sku) {
      setSelectedVariant(null);
    }
  }, [skuValue, selectedVariant]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("variantSku", val);
    setSearchTerm(val);
    setShowDropdown(val.length >= 2);
  }, [setValue]);

  const handleSelectVariant = useCallback((v: VariantSearchResult) => {
    setSelectedVariant(v);
    setValue("variantSku", v.sku);
    setSearchTerm(v.sku);
    setShowDropdown(false);
  }, [setValue]);

  const handleFormSubmit = useCallback((data: InventoryFormValues) => {
    onSubmit({
      ...data,
      variantId: selectedVariant?.productId ?? initialVariant?.variantId,
      variantSku: selectedVariant?.sku ?? initialVariant?.variantSku ?? data.variantSku,
    });
  }, [onSubmit, selectedVariant, initialVariant]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm font-sans">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">Create Inventory Item</h2>
        <p className="text-xs text-slate-500 mt-1">Search for a variant by SKU and set stock levels.</p>
      </div>

      <div className="grid gap-5">
        <div ref={dropdownRef} className="relative">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Variant SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Search by SKU (e.g. PEGASUS)"
            {...register("variantSku")}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.variantSku && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.variantSku.message}</p>
          )}

          {showDropdown && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-60 overflow-y-auto">
              {variants.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400">Type at least 2 characters to search...</p>
              ) : (
                variants.map((v) => (
                  <button
                    key={v.productId}
                    type="button"
                    onClick={() => handleSelectVariant(v)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <span className="font-semibold text-slate-800">{v.sku}</span>
                    {v.productName && (
                      <span className="block text-xs text-slate-500 mt-0.5">{v.productName}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}

          {selectedVariant && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <span className="font-semibold">Selected:</span> {selectedVariant.sku}
              {selectedVariant.productName && <span>({selectedVariant.productName})</span>}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Quantity <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 100"
            {...register("quantity", { valueAsNumber: true })}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.quantity && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Reserved Quantity
          </label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 10"
            {...register("reservedQuantity", { valueAsNumber: true })}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.reservedQuantity && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.reservedQuantity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Low Stock Threshold
          </label>
          <input
            type="number"
            min={1}
            placeholder="e.g. 5"
            {...register("lowStockThreshold", { valueAsNumber: true })}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.lowStockThreshold && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.lowStockThreshold.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Reorder Point
          </label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 10"
            {...register("reorderPoint", { valueAsNumber: true })}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.reorderPoint && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.reorderPoint.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Reorder Quantity
          </label>
          <input
            type="number"
            min={0}
            placeholder="e.g. 50"
            {...register("reorderQuantity", { valueAsNumber: true })}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.reorderQuantity && (
            <p className="text-xs font-semibold text-rose-600 mt-1">{errors.reorderQuantity.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Create Inventory"}
        </button>
      </div>
    </form>
  );
}
