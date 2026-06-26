"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Collection } from "@/types/collection.types";
import CategoryImageUpload from "../../categories/components/CategoryImageUpload";
import { useProducts } from "@/hooks/useProducts";
import { getImageUrl } from "@/lib/utils";
import { FiSearch } from "react-icons/fi";

const collectionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  bannerImage: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CollectionFormValues = z.infer<typeof collectionSchema>;

interface CollectionFormProps {
  initialData?: Collection;
  onSubmit: (data: CollectionFormValues & { bannerImageFile: File | null; productIds: string[] }) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function CollectionForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: CollectionFormProps) {
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Fetch all products
  const { data: productsData, isLoading: isProductsLoading } = useProducts({ limit: 1000 });
  const allProducts = productsData?.data?.items ?? [];

  // Populate selected product IDs when editing or when products are loaded
  useEffect(() => {
    if (initialData) {
      const collectionProductIds = initialData.productIds || 
                                   (initialData as any).products?.map((p: any) => p.id) || 
                                   [];
      if (collectionProductIds.length > 0) {
        setSelectedProductIds(collectionProductIds);
        return;
      }
      
      // Fallback: check products' collectionIds list
      if (allProducts.length > 0) {
        const initialIds = allProducts
          .filter((p) => p.collectionIds?.includes(initialData.id))
          .map((p) => p.id);
        setSelectedProductIds(initialIds);
      }
    }
  }, [initialData, allProducts]);

  const filteredProducts = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAllProducts = () => {
    const filteredIds = filteredProducts.map((p) => p.id);
    setSelectedProductIds((prev) => {
      const newIds = [...prev];
      filteredIds.forEach((id) => {
        if (!newIds.includes(id)) newIds.push(id);
      });
      return newIds;
    });
  };

  const handleClearAllProducts = () => {
    const filteredIds = filteredProducts.map((p) => p.id);
    setSelectedProductIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof collectionSchema>, unknown, CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      bannerImage: (initialData?.image || initialData?.bannerImage) ?? "",
      description: initialData?.description ?? "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const nameVal = watch("name");

  useEffect(() => {
    if (!initialData && nameVal) {
      const generated = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setValue("slug", generated, { shouldValidate: true });
    }
  }, [nameVal, setValue, initialData]);

  const handleFormSubmit = (data: CollectionFormValues) => {
    onSubmit({ ...data, bannerImageFile, productIds: selectedProductIds });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 font-sans text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">{initialData ? "Edit Collection" : "Create New Collection"}</h2>
        <p className="text-xs text-slate-500 mt-1">{initialData ? "Modify your collection details below." : "Add a new product collection."}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Collection Name *</label>
          <input type="text" placeholder="e.g. Summer Collection" {...register("name")} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
          {errors.name && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Slug (Auto-generated)</label>
          <input type="text" placeholder="e.g. summer-collection" {...register("slug")} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
          {errors.slug && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.slug.message}</p>}
        </div>

        <div className="md:col-span-2">
          <CategoryImageUpload
            currentImage={initialData?.image || initialData?.bannerImage}
            onFileSelect={setBannerImageFile}
            label="Banner Image"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Description</label>
          <textarea rows={3} placeholder="Hot styles for the summer season..." {...register("description")} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Status</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={watch("isActive") === true} onChange={() => setValue("isActive", true)} className="size-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={watch("isActive") === false} onChange={() => setValue("isActive", false)} className="size-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
              <span className="text-sm font-medium text-slate-700">Inactive</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Products to Add to Collection
          </label>
          {isProductsLoading ? (
            <div className="h-40 flex items-center justify-center border border-slate-200 rounded-lg bg-slate-50">
              <div className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllProducts}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleClearAllProducts}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-rose-600 transition-all"
                >
                  Clear All
                </button>
              </div>
              
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-2">
                {filteredProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    No products found
                  </p>
                ) : (
                  filteredProducts.map((p) => {
                    const isChecked = selectedProductIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-slate-50/80 ${
                          isChecked ? "bg-indigo-50/30" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleProduct(p.id)}
                          className="size-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        {p.image && (
                          <img
                            src={getImageUrl(p.image)}
                            alt={p.name}
                            className="size-8 rounded-lg object-cover border border-slate-100 bg-slate-50"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.slug}</p>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
              <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/30 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-medium">
                  {selectedProductIds.length} of {allProducts.length} products selected
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{isPending ? "Saving..." : initialData ? "Save Changes" : "Create Collection"}</button>
      </div>
    </form>
  );
}
