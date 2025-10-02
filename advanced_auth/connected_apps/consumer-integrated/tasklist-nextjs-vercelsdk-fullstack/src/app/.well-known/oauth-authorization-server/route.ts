import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = new URL(req.url).origin;
  const authDomain = process.env.STYTCH_DOMAIN;

  const response = NextResponse.json({
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

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
