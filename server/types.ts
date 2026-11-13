/**
 * Server-Side Inquiries Domain Types
 */

export interface InquiryIncomingPayload {
  services: string[];
  projectName: string;
  projectDescription: string;
  projectGoal: string;
  budgetRange?: string;
  timeline?: string;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  submittedAt?: string;
}

export interface StoredInquiryRow {
  inquiryId: string;
  submittedAt: string;
  services: string;
  projectName: string;
  projectDescription: string;
  projectGoal: string;
  budgetRange: string;
  timeline: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: string;
}

export interface InquiryValidationResult {
  valid: boolean;
  errors?: Record<string, string>;
  sanitized?: InquiryIncomingPayload;
}

export interface InquiryApiResponse {
  success: boolean;
  inquiryId?: string;
  message: string;
  error?: string;
  errors?: Record<string, string>;
  timestamp?: string;
}

