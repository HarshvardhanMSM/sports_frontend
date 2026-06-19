export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  productsCount: number;
  categories?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Brand[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  timestamp?: string;
}

export interface BrandSingleResponse {
  statusCode: number;
  message: string;
  data: Brand;
}

export interface BrandDeleteResponse {
  statusCode: number;
  message: string;
}

export interface BrandCategoriesResponse {
  statusCode: number;
  message: string;
  data: { id: string; name: string; slug: string }[];
}

export interface BrandListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  status?: string;
  code?: string;
  categoryIds?: string[];
}
