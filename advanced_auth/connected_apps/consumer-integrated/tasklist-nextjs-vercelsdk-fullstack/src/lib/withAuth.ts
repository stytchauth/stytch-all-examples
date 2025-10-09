import { NextRequest, NextResponse } from 'next/server';
import { authenticateSession } from '@/lib/auth';
import { Session } from 'stytch';

type AuthenticatedHandler<TParams> = (req: NextRequest, session: Session, params: TParams) => Promise<NextResponse>;

type AuthenticatedHandlerWithoutParams = (req: NextRequest, session: Session) => Promise<NextResponse>;

// Overloads for different use cases
export function withAuth(
  handler: AuthenticatedHandlerWithoutParams,
  errorMessage?: string,
): (req: NextRequest) => Promise<NextResponse>;

export function withAuth<TParams>(
  handler: AuthenticatedHandler<TParams>,
  errorMessage?: string,
): (req: NextRequest, context: { params: Promise<TParams> }) => Promise<NextResponse>;

export function withAuth<TParams>(
  handler: AuthenticatedHandler<TParams> | AuthenticatedHandlerWithoutParams,
  errorMessage: string = 'Operation failed',
) {
  return async (req: NextRequest, context?: { params: Promise<TParams> }): Promise<NextResponse> => {
    try {
      const session = await authenticateSession();
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      if (context?.params) {
        return await (handler as AuthenticatedHandler<TParams>)(req, session, await context.params);
      } else {
        return await (handler as AuthenticatedHandlerWithoutParams)(req, session);
      }
    } catch (error) {
      console.error(`Error in ${handler.name}:`, error);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
  };
}
