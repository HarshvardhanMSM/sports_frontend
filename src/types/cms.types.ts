export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  pageType: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPageListResponse {
  statusCode: number;
  message: string;
  data: {
    items: CmsPage[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  timestamp?: string;
}

export interface CmsPageSingleResponse {
  statusCode: number;
  message: string;
  data: CmsPage;
}

export interface CmsPageDeleteResponse {
  statusCode: number;
  message: string;
}

export interface CreateCmsPageRequest {
  title: string;
  slug: string;
  content: string;
  pageType: string;
  status: "DRAFT" | "PUBLISHED";
}

export type UpdateCmsPageRequest = Partial<CreateCmsPageRequest>;

export interface CmsPageListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}
