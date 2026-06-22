import { api } from "./api";
import type {
  ProductListResponse,
  ProductSingleResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListParams,
  ProductImage,
  CreateProductImageRequest,
  UpdateProductImageRequest,
} from "@/types/product.types";

export const productKeys = {
  all:        ()                               => ["products"]                       as const,
  lists:      ()                               => ["products", "list"]               as const,
  list:       (params?: ProductListParams)     => ["products", "list", params]       as const,
  details:    ()                               => ["products", "detail"]             as const,
  detail:     (id: string)                     => ["products", "detail", id]         as const,
  images:     (id: string)                     => ["products", "images", id]         as const,
};

export const ProductService = {
  /** GET /admin/products */
  getProducts(params?: ProductListParams) {
    return api.get<ProductListResponse>("/admin/products", params);
  },

  /** GET /admin/products/:id */
  getProduct(id: string) {
    return api.get<ProductSingleResponse>(`/admin/products/${id}`);
  },

  /** POST /admin/products */
  createProduct(data: CreateProductRequest) {
    return api.post<ProductSingleResponse>("/admin/products", data);
  },

  /** PATCH /admin/products/:id */
  updateProduct(id: string, data: UpdateProductRequest) {
    return api.patch<ProductSingleResponse>(`/admin/products/${id}`, data);
  },

  /** DELETE /admin/products/:id */
  deleteProduct(id: string) {
    return api.delete<void>(`/admin/products/${id}`);
  },

  /** DELETE /admin/products/bulk */
  bulkDeleteProducts(ids: string[]) {
    return api.delete<void>("/admin/products/bulk", { data: { ids } });
  },

  /** PATCH /admin/products/:id/publish */
  publishProduct(id: string) {
    return api.patch<ProductSingleResponse>(`/admin/products/${id}/publish`);
  },

  /** PATCH /admin/products/:id/archive */
  archiveProduct(id: string) {
    return api.patch<ProductSingleResponse>(`/admin/products/${id}/archive`);
  },

  // ── Images ───────────────────────────────────────────────────────

  /** GET /admin/products/:id/images */
  getProductImages(productId: string) {
    return api.get<ProductImage[]>(`/admin/products/${productId}/images`);
  },

  /** POST /admin/products/:id/images */
  createProductImage(productId: string, data: CreateProductImageRequest | FormData) {
    const isFormData = data instanceof FormData;
    return api.post<ProductImage>(`/admin/products/${productId}/images`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
  },

  /** PATCH /admin/products/images/:imageId */
  updateProductImage(imageId: string, data: UpdateProductImageRequest) {
    return api.patch<ProductImage>(`/admin/products/images/${imageId}`, data);
  },

  /** DELETE /admin/products/images/:imageId */
  deleteProductImage(imageId: string) {
    return api.delete<void>(`/admin/products/images/${imageId}`);
  },

  /** PATCH /admin/products/images/:imageId/primary */
  setPrimaryImage(imageId: string) {
    return api.patch<ProductImage>(`/admin/products/images/${imageId}/primary`);
  },

  // ── Collections & Tags ──────────────────────────────────────────

  /** POST /admin/products/:id/collections */
  addCollections(productId: string, collectionIds: string[]) {
    return api.post<ProductSingleResponse>(`/admin/products/${productId}/collections`, { collectionIds });
  },

  /** DELETE /admin/products/:id/collections/:collectionId */
  removeCollection(productId: string, collectionId: string) {
    return api.delete<void>(`/admin/products/${productId}/collections/${collectionId}`);
  },

  /** POST /admin/products/:id/tags */
  addTags(productId: string, tagIds: string[]) {
    return api.post<ProductSingleResponse>(`/admin/products/${productId}/tags`, { tagIds });
  },

  /** DELETE /admin/products/:id/tags/:tagId */
  removeTag(productId: string, tagId: string) {
    return api.delete<void>(`/admin/products/${productId}/tags/${tagId}`);
  },
};
