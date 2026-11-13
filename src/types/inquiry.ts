export interface InquiryFormData {
  // Step 1: Project Type
  services: string[];

  // Step 2: Project Details
  projectName: string;
  projectDescription: string;
  projectGoal: string;

  // Step 3: Scope & Timeline (Optional)
  budgetRange: string;
  timeline: string;

  // Step 4: Your Details
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

export interface InquiryFormErrors {
  services?: string;
  projectName?: string;
  projectDescription?: string;
  projectGoal?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export interface InquirySubmissionResult {
  readonly success: boolean;
  readonly inquiryId?: string;
  readonly error?: string;
  readonly message?: string;
}

