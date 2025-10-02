import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { validateMcpToken } from '../middleware/mcpToken.js';
import { initializeMCPServer } from '../utils/mcp.js';

const router = express.Router();

router.get('/.well-known/oauth-authorization-server', (req, res) => {
  res.json({
    issuer: process.env.STYTCH_PROJECT_ID,
    // link to the OAuth Authorization screen implemented within the React UI
    authorization_endpoint: `${process.env.SITE_URL}/oauth/authorize`,
    // backend OAuth Authorization Server endpoints
    token_endpoint: `${process.env.STYTCH_IDP_DOMAIN}/v1/oauth2/token`,
    registration_endpoint: `${process.env.STYTCH_IDP_DOMAIN}/v1/oauth2/register`,
    scopes_supported: ['openid', 'email', 'profile'],
    response_types_supported: ['code'],
    response_modes_supported: ['query'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    token_endpoint_auth_methods_supported: ['none'],
    code_challenge_methods_supported: ['S256'],
  });
});

router.get('/.well-known/oauth-protected-resource', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol || 'http';
  const resource = `${protocol}://${host}`;

  res.json({
    resource: resource,
    authorization_servers: [process.env.STYTCH_IDP_DOMAIN],
    scopes_supported: ['openid', 'email', 'profile'],
  });
});

router.post('/mcp', validateMcpToken, async (req, res) => {
  try {
    const server = initializeMCPServer(req.client!.custom_claims.fb_user_id);
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

export default router;
