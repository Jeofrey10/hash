import type { InquiryFormData, InquirySubmissionResult } from '@/types';

/**
 * Project Inquiry Submission Adapter
 *
 * Dispatches validated project inquiry payload to the configured API endpoint.
 * Validates endpoint connectivity and strictly never generates simulated success
 * states when an endpoint is absent or unreachable.
 */
export async function submitProjectInquiry(
  data: InquiryFormData
): Promise<InquirySubmissionResult> {
  // Configured submission endpoint from Vite environment or standard local API route
  const endpoint = import.meta.env.VITE_INQUIRY_API_ENDPOINT || '/api/inquiry';

  // Sanitize payload: trim inputs and filter empty optional fields
  const payload = {
    services: data.services,
    projectName: data.projectName.trim(),
    projectDescription: data.projectDescription.trim(),
    projectGoal: data.projectGoal.trim(),
    budgetRange: data.budgetRange.trim() || undefined,
    timeline: data.timeline.trim() || undefined,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim() || undefined,
    message: data.message.trim() || undefined,
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const responseData = await response.json().catch(() => ({}));
      return {
        success: true,
        inquiryId:
          responseData.inquiryId ||
          responseData.id ||
          `INQ-${Date.now().toString(36).toUpperCase()}`,
        message:
          responseData.message ||
          'Your project parameters have been received. We will review your requirements and follow up via email.',
      };
    }

    // Server returned an error HTTP status
    let errorMessage = `Submission endpoint responded with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.message) errorMessage = errorJson.message;
      else if (errorJson.error) errorMessage = errorJson.error;
    } catch {
      // Body not JSON
    }

    return {
      success: false,
      error: errorMessage,
      message:
        'We were unable to complete your inquiry transmission. Please verify your details or retry.',
    };
  } catch (networkError) {
    // Network failure, connection refused, or endpoint not running
    const detail =
      networkError instanceof Error ? networkError.message : 'Network connection failure';
    return {
      success: false,
      error: detail,
      message:
        'Unable to reach the inquiry submission service. Please check your network connection and retry.',
    };
  }
}

