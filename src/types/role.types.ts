// ─────────────────────────────────────────────────────────────────
// ROLE & PERMISSION TYPES
// ─────────────────────────────────────────────────────────────────

import type { EntityStatus } from "./common.types";

// ── Permission Modules (legacy enum style) ───────────────────────

export type PermissionModule =
  | "Dashboard"
  | "Catalog"
  | "Inventory"
  | "Orders"
  | "Customers"
  | "Marketing"
  | "Content"
  | "Analytics"
  | "User Management"
  | "Settings";

export type PermissionAction = "view" | "create" | "edit" | "delete";

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

// ── Slug-based permissions (new backend format) ──────────────────

export interface PermissionSlug {
  id: string;             // numeric ID from API
  slug: string;           // e.g. "product.create"
  name: string;           // e.g. "Create Product"
  module: string;         // e.g. "product"
}

/** A group of permissions keyed by module. */
export interface ModuleGroup {
  module: string;
  displayName: string;
  permissions: PermissionSlug[];
}

// ── Role ─────────────────────────────────────────────────────────

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  adminCount: number;
  isSystemRole: boolean;
  createdDate: string;
}

export interface RolesListResponse {
  statusCode: number;
  message: string;
  data: {
    roles: Role[];
    activeRoles: number;
    customRoles: number;
    systemRoles: number;
    totalRoles: number;
  };
}

export interface CreateRoleRequest {
  name: string;
  slug: string;
  description: string;
  permissionSlugs?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  slug?: string;
  description?: string;
  permissionSlugs?: string[];
}

// ── Admin User ───────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  avatar?: string;
  status: EntityStatus;
  lastLogin: string;
  createdDate: string;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface UpdateAdminUserRequest {
  name?: string;
  email?: string;
  roleId?: string;
  status?: EntityStatus;
}

// ── Audit Log ────────────────────────────────────────────────────

export type AuditSeverity = "Info" | "Warning" | "Critical";

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: PermissionModule;
  ipAddress: string;
  severity: AuditSeverity;
  metadata?: Record<string, unknown>;
}

// ── Module display name mapping ──────────────────────────────────

export const MODULE_DISPLAY_NAMES: Record<string, string> = {
  product: "Product Management",
  variant: "Variant Management",
  inventory: "Inventory Management",
  order: "Order Management",
  finance: "Finance Management",
  settlement: "Settlement Management",
  user: "User Management",
  admin: "Admin Management",
  rbac: "Role-Based Access Control",
  support: "Customer Support",
  warehouse: "Warehouse Management",
  shipment: "Shipment Management",
  payment: "Payment Management",
  refund: "Refund Management",
  brand: "Brand Management",
  category: "Category Management",
  collection: "Collection Management",
  attribute: "Attribute Management",
  coupon: "Coupon Management",
  promotion: "Promotion Management",
  review: "Review Management",
  reports: "Reports & Analytics",
  settings: "Settings",
  cms: "Content Management",
  catalog: "Catalog Management",
  dashboard: "Dashboard",
  customers: "Customers",
  marketing: "Marketing",
  content: "Content",
  analytics: "Analytics",
};

// ── Slug → Permission conversion helpers ─────────────────────────

export function slugToPermissionModule(slug: string): string {
  return slug.split(".")[0] ?? slug;
}

export function slugToAction(slug: string): string {
  return slug.split(".")[1] ?? slug;
}

export function slugToDisplayName(slug: string): string {
  // "product.create" → "Create Product"
  const parts = slug.split(".");
  if (parts.length < 2) return slug;
  const action = parts[1];
  return action.charAt(0).toUpperCase() + action.slice(1) + " " + slugToModuleDisplayName(parts[0]);
}

export function slugToModuleDisplayName(slug: string): string {
  return MODULE_DISPLAY_NAMES[slug] ?? slug;
}

/** Group an array of PermissionSlug by module. */
export function groupPermissionsByModule(
  permissions: PermissionSlug[],
): ModuleGroup[] {
  const map = new Map<string, PermissionSlug[]>();
  for (const p of permissions) {
    const list = map.get(p.module);
    if (list) list.push(p);
    else map.set(p.module, [p]);
  }
  return Array.from(map.entries()).map(([module, perms]) => ({
    module,
    displayName: MODULE_DISPLAY_NAMES[module] ?? module,
    permissions: perms,
  }));
}

/** Convert permission slugs to the legacy Permission[] format. */
export function slugsToPermissions(slugs: string[]): Permission[] {
  const map = new Map<string, PermissionAction[]>();
  for (const slug of slugs) {
    const [mod, act] = slug.split(".");
    if (!mod || !act) continue;
    const actions = map.get(mod);
    if (actions) {
      if (!actions.includes(act as PermissionAction)) actions.push(act as PermissionAction);
    } else {
      map.set(mod, [act as PermissionAction]);
    }
  }
  return Array.from(map.entries()).map(([module, actions]) => ({
    module: module as PermissionModule,
    actions,
  }));
}

/** Convert Permission[] back to an array of slug strings. */
export function permissionsToSlugs(permissions: Permission[]): string[] {
  return permissions.flatMap((p) => p.actions.map((a) => `${p.module}.${a}`));
}

/** Name of the super-admin role that should be hidden from assign modals and protected from edit/delete. */
export const SUPER_ADMIN_ROLE = "Super Admin";
