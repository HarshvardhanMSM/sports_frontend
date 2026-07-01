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

export interface SmtpSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  emailProvider: string;
  fromName: string;
  fromEmail: string;
}

export interface UpdateSmtpSettingsDto {
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
  emailProvider?: string;
  fromName?: string;
  fromEmail?: string;
}

export interface SmtpTestPayload {
  to: string;
}

export interface SmtpTestResponse {
  statusCode: number;
  message: string;
}
