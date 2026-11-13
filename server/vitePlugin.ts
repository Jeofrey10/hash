import type { Plugin } from 'vite';
import { handleInquiryApiRequest } from './apiHandler.ts';

/**
 * Vite plugin that attaches the Project Inquiry API endpoint to the dev and preview servers.
 * Intercepts POST requests to `/api/inquiries` and `/api/inquiry`.
 */
export function inquiryApiPlugin(): Plugin {
  return {
    name: 'hashdevs-inquiry-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/inquiries' || url === '/api/inquiry') {
          handleInquiryApiRequest(req, res).catch((err) => {
            console.error('[API Middleware Error]:', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Internal Server Error',
                  message: 'An unexpected server error occurred.',
                })
              );
            }
          });
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/inquiries' || url === '/api/inquiry') {
          handleInquiryApiRequest(req, res).catch((err) => {
            console.error('[API Middleware Error]:', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Internal Server Error',
                  message: 'An unexpected server error occurred.',
                })
              );
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

