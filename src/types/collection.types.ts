export interface Collection {
  id: string;
  name: string;
  slug: string;
  bannerImage?: string;
  image?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Collection[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CollectionSingleResponse {
  statusCode: number;
  message: string;
  data: Collection;
}

export interface CollectionDeleteResponse {
  statusCode: number;
  message: string;
}

export interface CreateCollectionRequest {
  name: string;
  slug?: string;
  bannerImage?: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateCollectionRequest = Partial<CreateCollectionRequest>;

export interface CollectionListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
