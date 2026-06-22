"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Attribute } from "@/types/attribute.types";

const attributeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  isFilterable: z.boolean().default(true),
  isRequired: z.boolean().default(false),
  sortOrder: z.coerce.number().min(0, "Sort order must be 0 or greater").default(0),
});

type AttributeFormValues = z.infer<typeof attributeSchema>;

interface AttributeFormProps {
  initialData?: Attribute;
  onSubmit: (data: AttributeFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function AttributeForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
}: AttributeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof attributeSchema>, unknown, AttributeFormValues>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      isFilterable: initialData?.isFilterable ?? true,
      isRequired: initialData?.isRequired ?? false,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const nameVal = watch("name");

  useEffect(() => {
    if (!initialData && nameVal) {
      const slug = nameVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameVal, setValue, initialData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-sans text-slate-800">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? "Edit Attribute" : "Create New Attribute"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {initialData ? "Modify your attribute details below." : "Add a new product attribute."}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Attribute Name *</label>
          <input
            type="text"
            placeholder="e.g. Color"
            {...register("name")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.name && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Slug (Auto-generated)</label>
          <input
            type="text"
            placeholder="e.g. color"
            {...register("slug")}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.slug && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.slug.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Sort Order</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            {...register("sortOrder")}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
          {errors.sortOrder && <p className="text-xs font-semibold text-rose-600 mt-1">{errors.sortOrder.message}</p>}
        </div>

        <div className="flex items-center gap-6 pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isFilterable")}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
            />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Filterable</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isRequired")}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 size-4"
            />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Required</span>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Attribute"}
        </button>
      </div>
    </form>
  );
}
