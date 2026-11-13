import http from 'node:http';
import { handleInquiryApiRequest } from './apiHandler.ts';

const PORT = Number(process.env.PORT) || 3001;

const server = http.createServer((req, res) => {
  const url = req.url ? req.url.split('?')[0] : '';
  if (url === '/api/inquiries' || url === '/api/inquiry') {
    handleInquiryApiRequest(req, res).catch((err) => {
      console.error('[Standalone API Error]:', err);
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
  } else if (url === '/health' || url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        status: 'online',
        service: 'HASH.DEVS Inquiries API',
        endpoints: ['POST /api/inquiries', 'POST /api/inquiry'],
      })
    );
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`[HASH.DEVS] Inquiries API Server listening on http://localhost:${PORT}`);
});

