export type ProductStatus = "Draft" | "Active" | "Inactive";

export interface ProductVariant {
  id?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  isDefault: boolean;
  attributeValues?: {
    id?: string;
    attributeValueId?: string;
    attributeId?: string;
    value?: string;
    attribute?: { id: string; name: string };
  }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  skuPrefix?: string;
  brandId: string;
  brandName?: string;
  categoryId: string;
  categoryName?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  shortDescription?: string;
  description?: string;
  status: ProductStatus;
  isFeatured: boolean;
  isActive: boolean;
  image?: string;
  images?: ProductImage[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  collectionIds?: string[];
  tagIds?: string[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Product[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ProductSingleResponse {
  statusCode: number;
  message: string;
  data: Product;
}


export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  brandId?: string;
  categoryId?: string;
  subCategoryId?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductImageRequest {
  imageUrl: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface UpdateProductImageRequest {
  imageUrl?: string;
  altText?: string;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ProductAttributeMapping {
  attributeId: string;
  attributeValueId: string;
}

export interface CreateProductVariantRequest {
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  isDefault: boolean;
  attributes: ProductAttributeMapping[];
}

export interface CreateProductRequest {
  brandId: string;
  categoryId: string;
  subCategoryId?: string | null;
  name: string;
  slug: string;
  skuPrefix?: string;
  shortDescription?: string;
  description?: string;
  status: ProductStatus;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  collectionIds?: string[];
  tagIds?: string[];
  variants?: CreateProductVariantRequest[] | string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;
