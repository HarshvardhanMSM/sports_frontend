"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiX } from "react-icons/fi";
import type { PermissionSlug } from "@/types/role.types";

const schema = z.object({
  name: z.string().min(1, "Permission name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z]+\.[a-z]+$/, "Slug must be in format 'module.action' (e.g. product.create)"),
  module: z.string().min(1, "Module is required"),
});

type FormValues = z.infer<typeof schema>;

interface PermissionFormModalProps {
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  isPending: boolean;
}

export default function PermissionFormModal({ onClose, onSubmit, isPending }: PermissionFormModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", module: "" },
  });

  const nameVal = watch("name");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Create Permission</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Permission Name</label>
            <input
              {...register("name")}
              placeholder="e.g. Create Product"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Module</label>
            <input
              {...register("module")}
              placeholder="e.g. product"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
            {errors.module && <p className="text-xs text-red-500 mt-1">{errors.module.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Slug</label>
            <div className="relative">
              <input
                {...register("slug")}
                placeholder="e.g. product.create"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
              {isPending ? "Creating..." : "Create Permission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
