import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest) {
  const response = NextResponse.json({
    issuer: process.env.STYTCH_PROJECT_ID,
    // link to the OAuth Authorization screen implemented within the React UI
    authorization_endpoint: `${process.env.NEXT_SITE_URL}/oauth/authorize`,
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

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
