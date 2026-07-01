export interface SubCategory {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategoryListResponse {
  statusCode: number;
  message: string;
  data: {
    items: SubCategory[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    totalSubCategories: number;
    activeSubCategories: number;
    inactiveSubCategories: number;
  };
}

export interface SubCategorySingleResponse {
  statusCode: number;
  message: string;
  data: SubCategory;
}

export interface CreateSubCategoryRequest {
  categoryId: string;
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export type UpdateSubCategoryRequest = Partial<CreateSubCategoryRequest>;

export interface SubCategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}
