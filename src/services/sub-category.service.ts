import { api } from "./api";
import type {
  SubCategoryListResponse,
  SubCategorySingleResponse,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest,
  SubCategoryListParams,
} from "@/types/sub-category.types";

export const subCategoryKeys = {
  all:     ()                       => ["sub-categories"]            as const,
  lists:   ()                       => ["sub-categories", "list"]    as const,
  list:    (p: SubCategoryListParams) => ["sub-categories", "list", p] as const,
  details: ()                       => ["sub-categories", "detail"]  as const,
  detail:  (id: string)             => ["sub-categories", "detail", id] as const,
};

export const SubCategoryService = {
  getSubCategories(params?: SubCategoryListParams) {
    return api.get<SubCategoryListResponse>("/admin/sub-categories", params);
  },

  getSubCategory(id: string) {
    return api.get<SubCategorySingleResponse>(`/admin/sub-categories/${id}`);
  },

  createSubCategory(data: CreateSubCategoryRequest | FormData) {
    return api.post<SubCategorySingleResponse>("/admin/sub-categories", data);
  },

  updateSubCategory(id: string, data: UpdateSubCategoryRequest | FormData) {
    return api.patch<SubCategorySingleResponse>(`/admin/sub-categories/${id}`, data);
  },

  deleteSubCategory(id: string) {
    return api.delete<void>(`/admin/sub-categories/${id}`);
  },
};
