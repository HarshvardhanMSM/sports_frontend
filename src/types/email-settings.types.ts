export interface EmailSettings {
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
}

export interface UpdateEmailSettingsDto {
  fromName?: string;
  fromEmail?: string;
  replyToEmail?: string;
}

export interface EmailSettingsResponse {
  statusCode: number;
  message: string;
  data: EmailSettings;
}
