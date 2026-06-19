import { api } from "./api";
import type {
  BrandListResponse,
  BrandSingleResponse,
  BrandDeleteResponse,
  BrandListParams,
  BrandCategoriesResponse,
} from "@/types/brand.types";

export const brandKeys = {
  all:         ()                         => ["brands"]                     as const,
  lists:       ()                         => ["brands", "list"]             as const,
  list:        (p: BrandListParams)       => ["brands", "list", p]          as const,
  details:     ()                         => ["brands", "detail"]           as const,
  detail:      (id: string)               => ["brands", "detail", id]       as const,
  categories:  (id: string)               => ["brands", "categories", id]   as const,
};

export const BrandService = {
  getBrands(params?: BrandListParams) {
    return api.get<BrandListResponse>("/admin/brands", params);
  },

  getBrand(id: string) {
    return api.get<BrandSingleResponse>(`/admin/brands/${id}`);
  },

  createBrand(formData: FormData) {
    return api.post<BrandSingleResponse>("/admin/brands", formData);
  },

  updateBrand(id: string, formData: FormData) {
    return api.patch<BrandSingleResponse>(`/admin/brands/${id}`, formData);
  },

  updateBrandJson(id: string, body: Record<string, unknown>) {
    return api.patch<BrandSingleResponse>(`/admin/brands/${id}`, body, {
      headers: { "Content-Type": "application/json" },
    });
  },

  deleteBrand(id: string) {
    return api.delete<BrandDeleteResponse>(`/admin/brands/${id}`);
  },

  /** GET /admin/brands/:id/categories */
  getBrandCategories(id: string) {
    return api.get<BrandCategoriesResponse>(`/admin/brands/${id}/categories`);
  },
};
