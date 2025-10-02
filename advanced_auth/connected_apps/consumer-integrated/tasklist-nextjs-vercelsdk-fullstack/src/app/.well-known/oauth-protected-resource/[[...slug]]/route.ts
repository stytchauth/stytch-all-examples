import { NextRequest, NextResponse } from 'next/server';

// Some MCP Clients (mainly certain version of the MCP inspector) will ignore the WWW-Auth header and
// pick a default location for the protected resource metadata. For example, if
// your MCP URL is `https://example.com/mcp` they will look for the metadata at
// .well-known/oauth-protected-resource/mcp
// To handle this case, we host the route at .well-known/oauth-protected-resource/[[..slug]]/route.ts instead
// of the expected .well-known/oauth-protected-resource/route.ts
export async function GET(req: NextRequest) {
  const response = NextResponse.json({
    resource: new URL(req.url).origin,
    authorization_servers: [process.env.STYTCH_DOMAIN],
    scopes_supported: ['openid', 'email', 'profile'],
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
