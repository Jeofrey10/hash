import type {
  InquiryValidationResult,
  StoredInquiryRow,
  InquiryApiResponse,
} from './types.ts';
import { appendInquiryRecord } from './excelStorage.ts';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates incoming inquiry payload.
 */
export function validateInquiryPayload(payload: unknown): InquiryValidationResult {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: { payload: 'Payload must be a valid JSON object' } };
  }

  const data = payload as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // 1. Services selection
  if (!Array.isArray(data.services) || data.services.length === 0) {
    errors.services = 'At least one service or objective must be selected.';
  } else if (!data.services.every((s) => typeof s === 'string' && s.trim().length > 0)) {
    errors.services = 'All selected services must be non-empty strings.';
  }

  // 2. Project Name
  if (typeof data.projectName !== 'string' || data.projectName.trim().length === 0) {
    errors.projectName = 'Project or business name is required.';
  } else if (data.projectName.trim().length > 120) {
    errors.projectName = 'Project name cannot exceed 120 characters.';
  }

  // 3. Project Description
  if (typeof data.projectDescription !== 'string' || data.projectDescription.trim().length === 0) {
    errors.projectDescription = 'Project description is required.';
  } else if (data.projectDescription.trim().length < 10) {
    errors.projectDescription = 'Please provide at least 10 characters describing your project.';
  } else if (data.projectDescription.trim().length > 2000) {
    errors.projectDescription = 'Project description cannot exceed 2000 characters.';
  }

  // 4. Project Goal
  if (typeof data.projectGoal !== 'string' || data.projectGoal.trim().length === 0) {
    errors.projectGoal = 'Primary project goal is required.';
  } else if (data.projectGoal.trim().length > 120) {
    errors.projectGoal = 'Project goal cannot exceed 120 characters.';
  }

  // 5. Full Name
  if (typeof data.fullName !== 'string' || data.fullName.trim().length === 0) {
    errors.fullName = 'Full name is required.';
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = 'Full name cannot exceed 100 characters.';
  }

  // 6. Email
  if (typeof data.email !== 'string' || data.email.trim().length === 0) {
    errors.email = 'Work email address is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  } else if (data.email.trim().length > 160) {
    errors.email = 'Email address cannot exceed 160 characters.';
  }

  // 7. Optional fields length limits
  if (data.budgetRange && typeof data.budgetRange === 'string' && data.budgetRange.trim().length > 100) {
    errors.budgetRange = 'Budget range cannot exceed 100 characters.';
  }
  if (data.timeline && typeof data.timeline === 'string' && data.timeline.trim().length > 100) {
    errors.timeline = 'Timeline cannot exceed 100 characters.';
  }
  if (data.phone && typeof data.phone === 'string' && data.phone.trim().length > 50) {
    errors.phone = 'Phone number cannot exceed 50 characters.';
  }
  if (data.message && typeof data.message === 'string' && data.message.trim().length > 2000) {
    errors.message = 'Additional notes cannot exceed 2000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    sanitized: {
      services: (data.services as string[]).map((s) => s.trim()),
      projectName: (data.projectName as string).trim(),
      projectDescription: (data.projectDescription as string).trim(),
      projectGoal: (data.projectGoal as string).trim(),
      budgetRange: data.budgetRange && typeof data.budgetRange === 'string' ? data.budgetRange.trim() : '',
      timeline: data.timeline && typeof data.timeline === 'string' ? data.timeline.trim() : '',
      fullName: (data.fullName as string).trim(),
      email: (data.email as string).trim(),
      phone: data.phone && typeof data.phone === 'string' ? data.phone.trim() : '',
      message: data.message && typeof data.message === 'string' ? data.message.trim() : '',
      submittedAt:
        data.submittedAt && typeof data.submittedAt === 'string' && data.submittedAt.trim()
          ? data.submittedAt.trim()
          : new Date().toISOString(),
    },
  };
}

/**
 * Generates an alphanumeric, human-readable unique inquiry ID.
 * Format: INQ-HD-YYYYMMDD-XXXX (e.g. INQ-HD-20261113-9A4B)
 */
export function generateInquiryId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INQ-HD-${dateStr}-${randomSuffix}`;
}

/**
 * Orchestrates full server validation and Excel persistence for an incoming inquiry.
 */
export async function processInquirySubmission(
  rawPayload: unknown,
  customFilePath?: string
): Promise<InquiryApiResponse> {
  // 1. Schema & format validation
  const validation = validateInquiryPayload(rawPayload);
  if (!validation.valid || !validation.sanitized) {
    return {
      success: false,
      error: 'Validation failed',
      message: 'The submitted inquiry parameters failed server-side validation.',
      errors: validation.errors,
    };
  }

  const data = validation.sanitized;
  const inquiryId = generateInquiryId();
  const timestamp = data.submittedAt || new Date().toISOString();

  // 2. Prepare structured record
  const record: StoredInquiryRow = {
    inquiryId,
    submittedAt: timestamp,
    services: data.services.join(', '),
    projectName: data.projectName,
    projectDescription: data.projectDescription,
    projectGoal: data.projectGoal,
    budgetRange: data.budgetRange || '',
    timeline: data.timeline || '',
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    message: data.message || '',
    status: 'CONFIRMED',
  };

  // 3. Append to Excel workbook with concurrency lock
  try {
    await appendInquiryRecord(record, customFilePath);

    return {
      success: true,
      inquiryId,
      timestamp,
      message:
        'Project inquiry successfully recorded. Our team will review your parameters and follow up shortly.',
    };
  } catch (storageError) {
    // Log safe server error internally without exposing filesystem paths to client
    const internalDetail =
      storageError instanceof Error ? storageError.message : 'Unknown storage error';
    console.error('[InquiryStorage Error]:', internalDetail);

    return {
      success: false,
      error: 'Storage failure',
      message:
        'We were unable to record your inquiry due to a temporary storage issue. Please retry your submission.',
    };
  }
}
