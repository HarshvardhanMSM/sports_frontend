"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiEdit2, FiPackage, FiStar } from "react-icons/fi";
import { useCollection } from "@/hooks/useCollections";
import Badge from "@/components/ui/badge/Badge";
import { getImageUrl } from "@/lib/utils";
import type { CollectionProduct } from "@/types/collection.types";

function ProductCard({ product }: { product: CollectionProduct }) {
  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden flex"
    >
      <div className="w-24 h-24 shrink-0 bg-slate-50 flex items-center justify-center overflow-hidden">
        {primaryImage ? (
          <img src={getImageUrl(primaryImage.imageUrl)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <FiPackage className="size-6 text-slate-300" />
        )}
      </div>
      <div className="flex-1 p-3 flex flex-col justify-center min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
        {product.shortDescription && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{product.shortDescription}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <Badge color={product.isActive ? "success" : "error"}>{product.isActive ? "Active" : "Inactive"}</Badge>
          <span className="text-xs text-slate-400">{product.status}</span>
          {Number(product.averageRating) > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-500">
              <FiStar className="size-3 fill-current" />
              {Number(product.averageRating).toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface ViewCollectionPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewCollectionPage({ params }: ViewCollectionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isPending, isError, error } = useCollection(id);

  if (isPending) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-48 bg-slate-100 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4"><div className="h-20 bg-slate-100 rounded-xl" /><div className="h-20 bg-slate-100 rounded-xl" /></div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
        <h2 className="text-lg font-bold text-slate-800">Collection Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">{(error as Error)?.message ?? "The collection you are looking for does not exist."}</p>
        <button onClick={() => router.push("/collections")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to Collections</button>
      </div>
    );
  }

  const collection = data.data;
  const products = collection.products ?? [];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push("/collections")} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"><FiArrowLeft className="size-4" /> Back to Collections</button>
        <button onClick={() => router.push(`/collections/${id}/edit`)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"><FiEdit2 className="size-4" /> Edit Collection</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {(collection.image || collection.bannerImage) && (
          <div className="w-full h-48 bg-slate-100">
            <img src={getImageUrl(collection.image || collection.bannerImage)} alt={collection.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{collection.name}</h1>
              <p className="text-sm text-slate-500 font-mono mt-1">{collection.slug}</p>
            </div>
            <Badge color={collection.isActive ? "success" : "error"}>{collection.isActive ? "Active" : "Inactive"}</Badge>
          </div>

          {collection.description && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</h3>
              <p className="text-sm text-slate-700">{collection.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Created</h3>
              <p className="text-sm text-slate-800">{new Date(collection.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Last Updated</h3>
              <p className="text-sm text-slate-800">{new Date(collection.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 pb-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Products</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Collection Products</h2>
          <p className="text-xs text-slate-500 mt-0.5">{collection.productCount ?? products.length} product{(collection.productCount ?? products.length) !== 1 ? "s" : ""} in this collection.</p>
        </div>
        <div className="p-6 pt-4">
          {products.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <FiPackage className="size-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No products in this collection</p>
              <p className="text-xs text-slate-500 mt-1">Assign products from the edit page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
