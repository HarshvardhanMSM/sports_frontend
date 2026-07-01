"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FiX, FiCopy } from "react-icons/fi";
import Select from "@/components/ui/select/Select";
import type { ModuleGroup, Role, PermissionSlug } from "@/types/role.types";
import { groupPermissionsByModule, permissionsToSlugs } from "@/types/role.types";
import PermissionModuleCard from "./PermissionModuleCard";

// ─── Schema ───────────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

// ─── Props ────────────────────────────────────────────────────────────

interface RoleFormModalProps {
  /** If provided, the modal is in "edit" mode. */
  role?: Role | null;
  /** All available permission slugs (from the API). */
  permissionSlugs: PermissionSlug[];
  /** All roles for "clone from" dropdown. */
  allRoles: Role[];
  /** Called with the final name, slug, description, and selected permission slugs. */
  onSubmit: (name: string, slug: string, description: string, permissionSlugs: string[]) => void;
  onClose: () => void;
  isPending: boolean;
}

// ─── Component ────────────────────────────────────────────────────────

export default function RoleFormModal({
  role,
  permissionSlugs,
  allRoles,
  onSubmit,
  onClose,
  isPending,
}: RoleFormModalProps) {
  const isEdit = !!role;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: role?.name ?? "", description: role?.description ?? "" },
  });

  // Permission slugs that are selected
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(() => {
    if (role) return new Set(permissionsToSlugs(role.permissions));
    return new Set<string>();
  });

  // Clone from dropdown
  const [cloneFromId, setCloneFromId] = useState<string>("");

  useEffect(() => {
    reset({
      name: role?.name ?? "",
      description: role?.description ?? "",
    });
    const timer = setTimeout(() => {
      setSelectedSlugs(new Set(role ? permissionsToSlugs(role.permissions) : []));
      setCloneFromId("");
    }, 0);
    return () => clearTimeout(timer);
  }, [role, reset]);

  // Group permissions once
  const groupedModules = groupPermissionsByModule(permissionSlugs);

  const handleToggleSlug = useCallback((slug: string) => {
    setSelectedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  // Clone permissions from another role
  const handleClone = useCallback(
    (targetRoleId: string) => {
      const target = allRoles.find((r) => r.id === targetRoleId);
      if (!target) return;
      setSelectedSlugs(new Set(permissionsToSlugs(target.permissions)));
    },
    [allRoles],
  );

  // Re-fetch permissions when clone selection changes
  const [prevCloneFromId, setPrevCloneFromId] = useState("");
  if (cloneFromId && cloneFromId !== prevCloneFromId) {
    setPrevCloneFromId(cloneFromId);
    const target = allRoles.find((r) => r.id === cloneFromId);
    if (target) {
      setSelectedSlugs(new Set(permissionsToSlugs(target.permissions)));
    }
  }

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFormSubmit = (data: FormValues) => {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 100);
    onSubmit(data.name, slug, data.description, Array.from(selectedSlugs));
  };

  const totalSelected = selectedSlugs.size;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 mx-4 flex w-full max-w-3xl max-h-[85vh] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header — fixed top */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEdit ? "Edit Role" : "Create Role"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit
                ? "Update role details and permissions"
                : "Define a new role and assign permissions"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="role-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* Name & Description */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Role Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Product Manager"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Clone Permissions From
              </label>
              <Select
                value={cloneFromId}
                onChange={(val) => {
                  setCloneFromId(val);
                  if (val) handleClone(val);
                }}
                options={[
                  { value: "", label: "Start from scratch" },
                  ...allRoles
                    .filter((r) => r.id !== role?.id)
                    .map((r) => ({
                      value: r.id,
                      label: `${r.name} (${r.permissions.reduce((s, p) => s + p.actions.length, 0)} perms)`,
                    })),
                ]}
                placeholder="Start from scratch"
                size="md"
                Icon={FiCopy}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              {...register("description")}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9 @\n\r]/g, "");
                register("description").onChange(e);
              }}
              rows={2}
              placeholder="Describe what this role is allowed to do..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Permissions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700">
                Permissions
              </span>
              <span className="text-xs text-slate-400">
                {totalSelected} selected
              </span>
            </div>
            <div className="space-y-3 pb-2">
              {groupedModules.map((mod) => (
                <PermissionModuleCard
                  key={mod.module}
                  module={mod}
                  selectedSlugs={selectedSlugs}
                  onToggleSlug={handleToggleSlug}
                />
              ))}
            </div>
          </div>
        </form>

        {/* Footer — fixed bottom */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-100 px-6 py-4 bg-white rounded-b-2xl">
          <span className="text-sm text-slate-500">
            <strong className="text-slate-700">{totalSelected}</strong> permission
            {totalSelected !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="role-form"
              disabled={isPending || totalSelected === 0}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? "Saving..." : isEdit ? "Update Role" : "Create Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
