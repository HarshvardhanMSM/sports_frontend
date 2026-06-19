"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Collection } from "@/types/collection.types";

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
  onSubmit: (data: CollectionFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function CollectionForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: CollectionFormProps) {
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
      bannerImage: initialData?.bannerImage ?? "",
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm font-sans">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">{initialData ? "Edit Collection" : "Create New Collection"}</h2>
        <p className="text-xs text-slate-500 mt-1">{initialData ? "Modify your collection details below." : "Add a new product collection."}</p>
      </div>

      <div className="grid gap-5">
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Banner Image URL</label>
          <input type="url" placeholder="https://cdn.sport.com/collections/summer-banner.jpg" {...register("bannerImage")} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
          {watch("bannerImage") && (
            <div className="mt-2 rounded-lg border border-slate-200 overflow-hidden max-w-xs">
              <img src={watch("bannerImage")} alt="Banner preview" className="w-full h-24 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Description</label>
          <textarea rows={3} placeholder="Hot styles for the summer season..." {...register("description")} className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
        </div>

        <div>
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
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{isPending ? "Saving..." : initialData ? "Save Changes" : "Create Collection"}</button>
      </div>
    </form>
  );
}
