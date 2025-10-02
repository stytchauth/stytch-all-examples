import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import organizationRoutes from './routes/organization.js';
import requestRoutes from './routes/requests.js';
import mcpRoutes from './routes/mcp.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: ['.env', '.env.production.local', '.env.local'] });

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [process.env.SITE_URL!, ...(process.env.CORS_URLS?.split(',') || [])],
    credentials: true,
  }),
);

// Content Security Policy for Stytch
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.stytch.com https://test.stytch.com; " +
      "connect-src 'self' https://api.stytch.com https://test.stytch.com https://*.stytch.com; " +
      "style-src 'self' 'unsafe-inline' https://api.stytch.com https://test.stytch.com; " +
      "img-src 'self' data: https://api.stytch.com https://test.stytch.com; " +
      "font-src 'self' https://api.stytch.com https://test.stytch.com; " +
      "frame-src 'self' https://api.stytch.com https://test.stytch.com;",
  );
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Frontend config endpoint
app.get('/config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
    window.APP_CONFIG = {
      VITE_STYTCH_PUBLIC_TOKEN: '${process.env.VITE_STYTCH_PUBLIC_TOKEN || ''}',
      VITE_STYTCH_TOKEN_PROFILE: '${process.env.VITE_STYTCH_TOKEN_PROFILE || ''}'
    };
  `);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api', requestRoutes);

// MCP routes (must be before frontend catch-all)
app.use('/', mcpRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Access Request Manager API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/signup': 'Create a new user account',
        'POST /api/auth/signin': 'Sign in with email/password (returns ID token)',
        'GET /api/auth/profile': 'Get current user profile',
        'POST /api/auth/custom-token': 'Generate custom token for testing',
      },
      organizations: {
        'GET /api/organization': "Get user's organization details",
        'GET /api/organization/members': 'Get organization members',
      },
      requests: {
        'POST /api/requests/:orgId': 'Create an access request',
        'GET /api/requests/:orgId': 'Get organization requests (admin only)',
        'GET /api/requests/:orgId/:requestId': 'Get specific request',
        'PATCH /api/requests/:orgId/:requestId': 'Approve/deny request (admin only)',
        'DELETE /api/requests/:orgId/:requestId': 'Cancel a pending request',
        'GET /api/requests': "Get user's own requests",
      },
    },
    authentication: 'All protected routes require Bearer token in Authorization header',
  });
});

// If this is running from a built version, serve the frontend
if (process.env.NODE_ENV !== 'tsxwatch') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API documentation available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  if (process.env.NODE_ENV !== 'tsxwatch') {
    console.log(`🌐 Frontend available at http://localhost:${PORT}/`);
  }
});

export default app;
