// ─────────────────────────────────────────────────────────────────
// CATEGORY SERVICE + QUERY KEYS
// ─────────────────────────────────────────────────────────────────

import { api } from "./api";
import type {
  CategoryListResponse,
  CategorySingleResponse,
  CategoryDeleteResponse,
  CategoryListParams,
} from "@/types/category.types";

export const categoryKeys = {
  all:    ()                     => ["categories"]                 as const,
  lists:  ()                     => ["categories", "list"]         as const,
  list:   (p: CategoryListParams) => ["categories", "list", p]     as const,
  details: ()                    => ["categories", "detail"]       as const,
  detail: (id: string)           => ["categories", "detail", id]   as const,
};

export const CategoryService = {
  getCategories(params?: CategoryListParams) {
    return api.get<CategoryListResponse>("/admin/categories", params);
  },

  getCategory(id: string) {
    return api.get<CategorySingleResponse>(`/admin/categories/${id}`);
  },

  createCategory(formData: FormData) {
    return api.post<CategorySingleResponse>("/admin/categories", formData);
  },

  updateCategory(id: string, formData: FormData) {
    return api.patch<CategorySingleResponse>(`/admin/categories/${id}`, formData);
  },

  updateCategoryJson(id: string, body: Record<string, unknown>) {
    return api.patch<CategorySingleResponse>(`/admin/categories/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  deleteCategory(id: string) {
    return api.delete<CategoryDeleteResponse>(`/admin/categories/${id}`);
  },
};
