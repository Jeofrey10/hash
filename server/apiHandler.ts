import type { IncomingMessage, ServerResponse } from 'node:http';
import { processInquirySubmission } from './inquiryService.ts';

const MAX_PAYLOAD_BYTES = 100 * 1024; // 100KB

/**
 * Handles incoming HTTP requests for `/api/inquiries` and `/api/inquiry`.
 */
export async function handleInquiryApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  customFilePath?: string
): Promise<void> {
  const method = req.method?.toUpperCase();

  // CORS Preflight handling
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.end();
    return;
  }

  // Only POST is permitted
  if (method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Allow', 'POST, OPTIONS');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Method Not Allowed',
        message: 'Only POST requests are accepted for project inquiries.',
      })
    );
    return;
  }

  // Stream and buffer the request body with size guard
  let bodyBuffer = '';
  let receivedBytes = 0;
  let isOversized = false;

  try {
    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk: Buffer | string) => {
        receivedBytes += chunk.length;
        if (receivedBytes > MAX_PAYLOAD_BYTES) {
          isOversized = true;
        } else {
          bodyBuffer += chunk.toString();
        }
      });

      req.on('end', () => resolve());
      req.on('error', (err) => reject(err));
    });
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Bad Request',
        message: 'Failed to read inquiry request stream.',
      })
    );
    return;
  }

  if (isOversized) {
    res.statusCode = 413;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Payload Too Large',
        message: 'The submitted inquiry payload exceeds the 100KB limit.',
      })
    );
    return;
  }

  // Parse JSON
  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(bodyBuffer);
  } catch {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Invalid JSON',
        message: 'The request body must be valid JSON.',
      })
    );
    return;
  }

  // Process inquiry with validation and Excel persistence
  const result = await processInquirySubmission(parsedPayload, customFilePath);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (result.success) {
    res.statusCode = 201;
    res.end(JSON.stringify(result));
  } else if (result.error === 'Validation failed') {
    res.statusCode = 400;
    res.end(JSON.stringify(result));
  } else {
    res.statusCode = 500;
    res.end(JSON.stringify(result));
  }
}

