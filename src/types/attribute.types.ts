export interface AttributeValue {
  id: string;
  value: string;
  slug: string;
  sortOrder: number;
}

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  isFilterable: boolean;
  isRequired: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  values?: AttributeValue[];
}

export interface AttributeListResponse {
  statusCode: number;
  message: string;
  data: {
    items: Attribute[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AttributeSingleResponse {
  statusCode: number;
  message: string;
  data: Attribute;
}

export interface CreateAttributeRequest {
  name: string;
  slug?: string;
  isFilterable?: boolean;
  isRequired?: boolean;
  sortOrder?: number;
  values?: string[];
}

export type UpdateAttributeRequest = Partial<CreateAttributeRequest>;

export interface AttributeListParams {
  page?: number;
  limit?: number;
  search?: string;
  isFilterable?: boolean;
}
