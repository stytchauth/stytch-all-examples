import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({
    resource: new URL(request.url).origin,
    authorization_servers: [process.env.STYTCH_IDP_DOMAIN],
    scopes_supported: ['openid', 'email', 'profile'],
  });

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
