export interface EmailTemplate {
  id: string;
  name: string;
  code: string;
  subject: string;
  description: string;
  body: string;
  isActive: boolean;
  isSystem?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplateListResponse {
  statusCode: number;
  message: string;
  data: {
    templates: EmailTemplate[];
    totalTemplates: number;
    activeTemplates: number;
    inactiveTemplates: number;
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  timestamp?: string;
}

export interface EmailTemplateSingleResponse {
  statusCode: number;
  message: string;
  data: EmailTemplate;
}

export interface EmailTemplateDeleteResponse {
  statusCode: number;
  message: string;
}

export interface EmailTemplateListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isSystem?: boolean;
  status?: string;
}
