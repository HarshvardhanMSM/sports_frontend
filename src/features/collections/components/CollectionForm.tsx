"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Collection } from "@/types/collection.types";
import CategoryImageUpload from "../../categories/components/CategoryImageUpload";

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
  onSubmit: (data: CollectionFormValues & { bannerImageFile: File | null }) => void;
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
    onSubmit({ ...data, bannerImageFile });
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
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
        <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">{isPending ? "Saving..." : initialData ? "Save Changes" : "Create Collection"}</button>
      </div>
    </form>
  );
}
