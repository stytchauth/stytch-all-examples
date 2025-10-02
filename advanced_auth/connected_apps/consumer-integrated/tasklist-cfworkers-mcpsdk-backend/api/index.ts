import { createMcpServer } from './TaskMCP';
import { TaskAPI } from './TaskAPI';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import { Consumer } from '@hono/stytch-auth';
import { StreamableHTTPTransport } from '@hono/mcp';
import { HTTPException } from 'hono/http-exception';

const authenticateTokenAuthMiddleware = Consumer.authenticateOAuthToken({
  onError: (c, err) => {
    console.error(err);
    // Construct the proper WWW-Authenticate header for protected resource discovery
    const url = new URL(c.req.url);
    const wwwAuthValue = `Bearer error="Unauthorized", error_description="Unauthorized", resource_metadata="${url.origin}/.well-known/oauth-protected-resource"`;

    const errorResponse = new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': wwwAuthValue },
    });
    throw new HTTPException(401, { res: errorResponse });
  },
});

export default new Hono<{ Bindings: Env }>()
  .use(cors())

  // Mount the Task API underneath us
  .route('/api', TaskAPI)

  // Serve the OAuth Protected Resource metadata per the 6-18 Auth specification
  // Note: Certain clients will infer the OPR metadata endpoint instead of taking it from the WWW-Auth header
  // So we should support .well-known/OPR as well as .well-known/OPR/sse and .well-known/OPR/mcp
  .get('/.well-known/oauth-protected-resource/:transport?', async (c) => {
    const url = new URL(c.req.url);
    return c.json({
      resource: url.origin,
      authorization_servers: [c.env.STYTCH_DOMAIN],
      scopes_supported: ['openid', 'email', 'profile'],
    });
  })

  // Backwards compatibility for the 3-26 Auth Specification, which is still supported by some clients as a fallback
  // Serve the OAuth Authorization Server response for Dynamic Client Registration
  .get('/.well-known/oauth-authorization-server', async (c) => {
    const url = new URL(c.req.url);
    const metadata = {
      issuer: c.env.STYTCH_DOMAIN,
      // Link to the OAuth Authorization screen implemented within the React UI
      authorization_endpoint: `${url.origin}/oauth/authorize`,
      token_endpoint: `${c.env.STYTCH_DOMAIN}/v1/oauth2/token`,
      registration_endpoint: `${c.env.STYTCH_DOMAIN}/v1/oauth2/register`,
      scopes_supported: ['openid', 'email', 'profile'],
      response_types_supported: ['code'],
      response_modes_supported: ['query'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['none'],
      code_challenge_methods_supported: ['S256'],
    };
    return c.json(metadata);
  })

  // Let the MCP Server have a go at handling the request
  // This adds SSE Transport support, for backwards compatibility
  .use('/sse/*', authenticateTokenAuthMiddleware)
  .use('/sse', async (c) => {
    const { claims } = Consumer.getOAuthData(c);
    const mcpServer = createMcpServer(c.env, claims.subject);
    const transport = new StreamableHTTPTransport();
    await mcpServer.connect(transport);
    return transport.handleRequest(c);
  })

  // This adds HTTP Streaming support (the new preferred transport)
  .use('/mcp', authenticateTokenAuthMiddleware)
  .use('/mcp', async (c) => {
    const { claims } = Consumer.getOAuthData(c);
    const mcpServer = createMcpServer(c.env, claims.subject);
    const transport = new StreamableHTTPTransport();
    await mcpServer.connect(transport);
    return transport.handleRequest(c);
  });
