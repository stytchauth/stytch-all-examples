import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { authorizeTokenMiddleware, getTicketServiceForRequest } from './auth.js';
import { createMcpServer } from './mcpServer.js';
import { initializeDatabase, closeDatabase } from './database.js';
import healthRoutes from './healthRoutes.js';
import ticketRoutes from './ticketRoutes.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize database
initializeDatabase();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  }),
);

// Mount route modules
app.use('/api', healthRoutes);
app.use('/api', ticketRoutes);

// Serve the OAuth Protected Resource metadata per the 6-18 Auth specification
app.get('/.well-known/oauth-protected-resource{/:transport}', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return res.json({
    resource: baseUrl,
    authorization_servers: [process.env.STYTCH_DOMAIN],
    scopes_supported: ['openid', 'email', 'profile'],
  });
});

// Backwards compatibility for the 3-26 Auth Specification
app.get('/.well-known/oauth-authorization-server', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const authDomain = process.env.STYTCH_DOMAIN;

  return res.json({
    issuer: authDomain,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    token_endpoint: `${authDomain}/v1/oauth2/token`,
    registration_endpoint: `${authDomain}/v1/oauth2/register`,
    scopes_supported: ['openid', 'email', 'profile'],
    response_types_supported: ['code'],
    response_modes_supported: ['query'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    token_endpoint_auth_methods_supported: ['none'],
    code_challenge_methods_supported: ['S256'],
  });
});

// MCP endpoint with HTTP Streaming support
app.post('/mcp', authorizeTokenMiddleware(), async (req, res) => {
  try {
    // Extract organization ID from the authenticated request
    const ticketService = getTicketServiceForRequest(req);

    const server = createMcpServer(ticketService);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on('close', () => {
      console.log('MCP request closed');
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);

  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  }
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Sprint Planner Express MCP Server listening on port ${PORT}`);
  console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`API endpoint: http://localhost:${PORT}/api`);
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    closeDatabase();
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    closeDatabase();
    console.log('✅ Process terminated');
    process.exit(0);
  });
});
