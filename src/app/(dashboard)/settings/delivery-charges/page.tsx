"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "@/components/ui/select/Select";
import * as z from "zod";
import {
  FiPlus,
  FiSearch,
  FiDollarSign,
  FiToggleLeft,
  FiToggleRight,
  FiClock,
  FiX,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiAlertTriangle,
  FiRefreshCw,
  FiAlertCircle,
  FiBarChart2,
  FiMoreVertical,
  FiPackage,
} from "react-icons/fi";
import {
  useDeliveryCharges,
  useCreateDeliveryCharge,
  useUpdateDeliveryCharge,
  useDeleteDeliveryCharge,
  useToggleDeliveryCharge,
  useDeliveryChargeHistory,
} from "@/hooks/useDeliveryCharges";
import type { DeliveryCharge } from "@/types/delivery-charge.types";
import { useDropdownDirection } from "@/hooks/useDropdownDirection";

// ── Form Schema ──────────────────────────────────────────────
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  chargeAmount: z.coerce.number().positive("Must be greater than 0"),
  chargeType: z.string().min(1, "Charge type is required"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;
type FormInput = z.input<typeof formSchema>;

const CHARGE_TYPES = ["FIXED_DELIVERY", "FREE_SHIPPING_THRESHOLD", "COD_CHARGE", "HANDLING_CHARGE"];
const CHARGE_TYPE_LABELS: Record<string, string> = {
  FIXED_DELIVERY: "Fixed Delivery",
  FREE_SHIPPING_THRESHOLD: "Free Shipping Threshold",
  COD_CHARGE: "COD Charge",
  HANDLING_CHARGE: "Handling Charge",
};

// ── Helpers ──────────────────────────────────────────────────
function fmtCurrency(val: number) {
  return val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ── Page ─────────────────────────────────────────────────────
export default function DeliveryChargesPage() {
  // ── Data ──
  const { data: listRes, isLoading, error, refetch } = useDeliveryCharges();
  const allCharges = listRes ?? [];

  const activeCount = allCharges.filter((c) => c.isActive).length;
  const inactiveCount = allCharges.filter((c) => !c.isActive).length;
  const avgCharge = allCharges.length > 0
    ? allCharges.reduce((s, c) => s + Number(c.chargeAmount), 0) / allCharges.length
    : 0;

  // ── Mutations ──
  const { mutateAsync: createCharge, isPending: isCreating } = useCreateDeliveryCharge();
  const { mutateAsync: updateCharge, isPending: isUpdating } = useUpdateDeliveryCharge();
  const { mutateAsync: deleteCharge, isPending: isDeleting } = useDeleteDeliveryCharge();
  const { mutateAsync: toggleCharge, isPending: isToggling } = useToggleDeliveryCharge();

  // ── UI State ──
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DeliveryCharge | null>(null);
  const [viewing, setViewing] = useState<DeliveryCharge | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeliveryCharge | null>(null);
  const [historyTarget, setHistoryTarget] = useState<DeliveryCharge | null>(null);

  const filtered = search
    ? allCharges.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : allCharges;

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (c: DeliveryCharge) => {
    setEditing(c);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: FormValues) => {
    if (editing) {
      await updateCharge({ id: editing.id, data });
    } else {
      await createCharge(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteCharge(deleteTarget.id);
    setDeleteTarget(null);
  };

  const handleToggle = async (id: string) => {
    await toggleCharge(id);
  };

  const isFormPending = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-1 rounded-full bg-indigo-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Charges</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all shipping and delivery fee configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
          >
            <FiRefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            style={{ background: "linear-gradient(135deg, #4338ca, #6d28d9)" }}
          >
            <FiPlus className="size-4" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3">
          <FiAlertCircle className="size-5 text-rose-500 shrink-0" />
          <p className="text-sm font-semibold text-rose-700">Failed to load delivery charges. Please try again.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 animate-pulse">
              <div className="size-10 bg-slate-200 rounded-xl mb-3" />
              <div className="h-7 w-20 bg-slate-200 rounded mb-1" />
              <div className="h-3 w-16 bg-slate-200 rounded" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Rules" value={allCharges.length.toString()} icon={<FiPackage className="size-5 text-white" />} bg="from-indigo-500 to-indigo-600" />
            <StatCard label="Active Rules" value={activeCount.toString()} icon={<FiToggleRight className="size-5 text-white" />} bg="from-emerald-500 to-emerald-600" />
            <StatCard label="Inactive Rules" value={inactiveCount.toString()} icon={<FiToggleLeft className="size-5 text-white" />} bg="from-slate-500 to-slate-600" />
            <StatCard label="Avg Charge" value={`$${avgCharge.toFixed(2)}`} icon={<FiDollarSign className="size-5 text-white" />} bg="from-blue-500 to-blue-600" />
          </>
        )}
      </div>

      {/* Search + Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <p className="text-xs text-slate-500 ml-auto">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {allCharges.length} rules
          </p>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FiBarChart2 className="size-7 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800">{search ? "No matching rules" : "No Delivery Charges Yet"}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {search ? "Try a different search term." : "Create your first delivery charge rule to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Charge Type</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((charge) => (
                  <tr key={charge.id} className="group hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">{charge.name}</td>
                    <td className="px-5 py-4 text-sm text-slate-500 max-w-[200px] truncate">{charge.description || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        {CHARGE_TYPE_LABELS[charge.chargeType] ?? charge.chargeType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-800">${fmtCurrency(Number(charge.chargeAmount))}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(charge.id)}
                        disabled={isToggling}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${charge.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                      >
                        {charge.isActive ? <FiToggleRight className="size-3.5" /> : <FiToggleLeft className="size-3.5" />}
                        {charge.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{fmtDate(charge.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <RowActions
                        charge={charge}
                        onView={() => setViewing(charge)}
                        onEdit={() => openEdit(charge)}
                        onDelete={() => setDeleteTarget(charge)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {showForm && (
        <FormModal
          editing={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSubmit={handleFormSubmit}
          isPending={isFormPending}
        />
      )}

      {/* ── View Modal ── */}
      {viewing && (
        <ViewModal charge={viewing} onClose={() => setViewing(null)} />
      )}

      {/* ── Delete Dialog ── */}
      {deleteTarget && (
        <DeleteDialog
          charge={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          isPending={isDeleting}
        />
      )}

      {/* ── History Drawer ── */}
      {historyTarget && (
        <HistoryDrawer charge={historyTarget} onClose={() => setHistoryTarget(null)} />
      )}
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, icon, bg }: { label: string; value: string; icon: React.ReactNode; bg: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm p-5">
      <div className={`absolute top-0 right-0 size-20 rounded-bl-full bg-gradient-to-br ${bg} opacity-5`} />
      <div className={`inline-flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${bg} shadow-sm mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

// ── Menu Button ──────────────────────────────────────────────
function MenuBtn({ icon: Icon, label, onClick, className }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; className?: string }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors ${className ?? ""}`}>
      <Icon className="size-4" />
      {label}
    </button>
  );
}

// ── Row Actions ──────────────────────────────────────────────
function RowActions({
  charge,
  onView,
  onEdit,
  onDelete,
}: {
  charge: DeliveryCharge;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { ref: dropdownRef, open, setOpen, direction } = useDropdownDirection();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
      >
        <FiMoreVertical className="size-4" />
      </button>
      {open && (
        <div
          className={`absolute right-0 z-50 w-48 rounded-xl border border-slate-200 bg-white shadow-xl py-1.5 focus:outline-none ${
            direction === "up"
              ? "bottom-full mb-1 origin-bottom-right"
              : "top-full mt-1 origin-top-right"
          }`}
        >
          <MenuBtn
            icon={FiEye}
            label="View"
            onClick={() => {
              onView();
              setOpen(false);
            }}
          />
          <MenuBtn
            icon={FiEdit2}
            label="Edit"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
          />
          {/* <MenuBtn icon={FiClock} label="History" onClick={() => { onHistory(); setOpen(false); }} /> */}
          <div className="border-t border-slate-100 my-1" />
          <MenuBtn
            icon={FiTrash2}
            label="Delete"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="text-red-600 hover:bg-red-50"
          />
        </div>
      )}
    </div>
  );
}

// ── Form Modal ───────────────────────────────────────────────
function FormModal({
  editing,
  onClose,
  onSubmit,
  isPending,
}: {
  editing: DeliveryCharge | null;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      name: editing?.name ?? "",
      description: editing?.description ?? "",
      chargeAmount: editing ? Number(editing.chargeAmount) : 0,
      chargeType: editing?.chargeType ?? "FIXED_DELIVERY",
      isActive: editing?.isActive ?? true,
    },
  });
  const isEdit = !!editing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">{isEdit ? "Edit Delivery Charge" : "Create Delivery Charge"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Name</label>
            <input {...register("name")} placeholder="e.g. Standard Delivery" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Description</label>
            <textarea
              {...register("description")}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9 @\n\r]/g, "");
                register("description").onChange(e);
              }}
              rows={2}
              placeholder="Optional description"
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Charge Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                <input {...register("chargeAmount")} type="number" step="0.01" min="0" placeholder="0.00" className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100" />
              </div>
              {errors.chargeAmount && <p className="text-xs text-red-500 mt-1">{errors.chargeAmount.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Charge Type</label>
              <Select
                value={watch("chargeType") ?? "FIXED_DELIVERY"}
                onChange={(val) => setValue("chargeType", val, { shouldValidate: true })}
                options={CHARGE_TYPES.map((t) => ({ value: t, label: t.replace(/_/g, " ") }))}
                placeholder="Select Charge Type"
                size="md"
              />
              <input type="hidden" {...register("chargeType")} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Active</label>
            <button
              type="button"
              onClick={() => setValue("isActive", !getValues("isActive"))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${getValues("isActive") ? "bg-emerald-500" : "bg-slate-300"}`}
            >
              <span className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${getValues("isActive") ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
              {isPending ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── View Modal ───────────────────────────────────────────────
function ViewModal({ charge, onClose }: { charge: DeliveryCharge; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">{charge.name}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Description" value={charge.description || "—"} />
          <Field label="Charge Type" value={CHARGE_TYPE_LABELS[charge.chargeType] ?? charge.chargeType.replace(/_/g, " ")} />
          <Field label="Charge Amount" value={`$${fmtCurrency(Number(charge.chargeAmount))}`} />
          <Field label="Status" value={charge.isActive ? "Active" : "Inactive"} />
          <Field label="Created" value={fmtDateTime(charge.createdAt)} />
          <Field label="Updated" value={fmtDateTime(charge.updatedAt)} />
        </div>
        <div className="flex justify-end pt-4">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

// ── Delete Dialog ────────────────────────────────────────────
function DeleteDialog({ charge, onClose, onConfirm, isPending }: { charge: DeliveryCharge; onClose: () => void; onConfirm: () => void; isPending: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-50">
              <FiAlertTriangle className="size-5 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Delete Charge</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to delete <span className="font-semibold text-slate-800">{charge.name}</span>? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isPending} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── History Drawer ───────────────────────────────────────────
function HistoryDrawer({ charge, onClose }: { charge: DeliveryCharge; onClose: () => void }) {
  const { data: historyRes, isLoading } = useDeliveryChargeHistory(charge.id);
  const entries = historyRes ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto" style={{ animation: "slideIn 0.2s ease-out" }}>
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Audit History</h2>
            <p className="text-xs text-slate-500 mt-0.5">{charge.name}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="size-5" />
          </button>
        </div>

        <div className="p-5">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border-l-2 border-slate-200 pl-4 py-2 space-y-1">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-3 w-32 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <FiClock className="size-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-500">No history entries found</p>
            </div>
          ) : (
            <div className="space-y-5">
              {entries.map((entry, i) => (
                <div key={i} className="relative pl-5 pb-5 border-l-2 border-slate-200 last:border-transparent last:pb-0">
                  <div className="absolute left-[-5px] top-1 size-2.5 rounded-full bg-indigo-500 ring-2 ring-white" />
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{entry.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{entry.changedBy} &middot; {fmtDateTime(entry.createdAt)}</p>
                  {(entry.oldValue || entry.newValue) && (
                    <div className="mt-2 bg-slate-50 rounded-lg p-3 space-y-1">
                      {entry.oldValue !== null && entry.oldValue !== undefined && (
                        <p className="text-xs text-slate-500"><span className="font-semibold">Old:</span> {entry.oldValue}</p>
                      )}
                      {entry.newValue !== null && entry.newValue !== undefined && (
                        <p className="text-xs text-slate-700"><span className="font-semibold">New:</span> {entry.newValue}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
