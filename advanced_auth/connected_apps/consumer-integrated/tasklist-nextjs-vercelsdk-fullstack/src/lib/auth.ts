import { Client, IntrospectTokenClaims, Session } from 'stytch';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = new Client({
      project_id: process.env.STYTCH_PROJECT_ID!,
      secret: process.env.STYTCH_PROJECT_SECRET!,
      custom_base_url: process.env.STYTCH_DOMAIN!,
    });
  }
  return client;
}

export async function authenticateSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionJwt = cookieStore.get('stytch_session_jwt');

    if (!sessionJwt?.value) {
      return null;
    }

    const { session } = await getClient().sessions.authenticateJwt({
      session_jwt: sessionJwt.value,
    });

    return session;
  } catch (err) {
    console.error('Error authenticating session:', err);
    return null;
  }
}

export async function authenticateToken(req: NextRequest): Promise<IntrospectTokenClaims | null> {
  try {
    const authorization = req.headers.get('authorization');
    const token = authorization?.split(' ')[1];

    if (!token) {
      return null;
    }

    const claims = await getClient().idp.introspectTokenLocal(token);
    return claims;
  } catch (error) {
    console.error('Error authenticating token:', error);
    return null;
  }
}

export function createUnauthorizedResponse(req: NextRequest): NextResponse {
  const host = req.headers.get('host');
  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const wwwAuthValue = `Bearer error="Unauthorized", error_description="Unauthorized", resource_metadata="${protocol}://${host}/.well-known/oauth-protected-resource"`;

  return NextResponse.json(
    { error: 'Unauthorized' },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': wwwAuthValue,
      },
    },
  );
}
