export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  whatsapp: string;
  youtube: string;
  telegram: string;
}

export interface UpdateSocialLinksDto {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  whatsapp?: string;
  youtube?: string;
  telegram?: string;
}

export interface SocialLinksResponse {
  statusCode: number;
  message: string;
  data: SocialLinks;
}
