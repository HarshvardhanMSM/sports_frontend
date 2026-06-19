// ─────────────────────────────────────────────────────────────────
// CATEGORY TYPES
// ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  isActive: boolean;
  productsCount: number;
  brands?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

// ── API Response Wrappers ───────────────────────────────────────

export interface CategoryListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Category[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategorySingleResponse {
  statusCode: number;
  message: string;
  data: Category;
}

export interface CategoryDeleteResponse {
  statusCode: number;
  message: string;
}

// ── Request types ───────────────────────────────────────────────

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  image?: File;
  description?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  image?: File;
  description?: string;
  isActive?: boolean;
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  status?: string;
  brandIds?: string[];
}
