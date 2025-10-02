import { Request, Response, NextFunction } from 'express';
import { B2BClient, B2BIntrospectTokenClaims, MemberSession } from 'stytch';
import { TicketService } from './TicketService';

// Extend Express Request interface for B2B auth
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      memberSession?: MemberSession;
      client?: B2BIntrospectTokenClaims;
    }
  }
}

let b2bClient: B2BClient | null = null;

function getB2BClient(): B2BClient {
  if (!b2bClient) {
    b2bClient = new B2BClient({
      project_id: process.env.STYTCH_PROJECT_ID!,
      secret: process.env.STYTCH_PROJECT_SECRET!,
      custom_base_url: process.env.STYTCH_DOMAIN!,
    });
  }
  return b2bClient;
}

export function authorizeSessionMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionJwt = req.cookies.stytch_session_jwt;
      if (!sessionJwt) {
        res.status(401).json({ error: 'Missing session cookie' });
        return;
      }

      const { member_session } = await getB2BClient().sessions.authenticateJwt({
        session_jwt: sessionJwt,
      });

      if (!member_session || !member_session.organization_id) {
        res.status(401).json({ error: 'Invalid or expired session' });
        return;
      }

      req.memberSession = member_session;
      next();
    } catch (err) {
      console.error('Error in session auth middleware:', err);
      res.status(401).json({ error: 'Invalid or expired session' });
    }
  };
}

export function authorizeTokenMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        console.error('Authorization header is missing');
        const wwwAuthValue = `Bearer error="Unauthorized", error_description="Unauthorized", resource_metadata="${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource"`;
        res.set('WWW-Authenticate', wwwAuthValue);
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const tokenClaims = await getB2BClient().idp.introspectTokenLocal(token);

      // Check if token is valid and has organization context
      if (!tokenClaims.organization?.organization_id) {
        res.status(401).json({ error: 'Missing organization context in token' });
        return;
      }

      req.client = tokenClaims;

      next();
    } catch (error) {
      console.error('Error in token auth middleware:', error);
      const wwwAuthValue = `Bearer error="Unauthorized", error_description="Unauthorized", resource_metadata="${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource"`;
      res.set('WWW-Authenticate', wwwAuthValue);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
}

export function getTicketServiceForRequest(req: Request): TicketService {
  if (req.memberSession) {
    const { organization_id, organization_slug } = req.memberSession;
    return new TicketService(organization_id, organization_slug);
  }

  if (req.client) {
    const { organization_id, slug } = req.client.organization;
    return new TicketService(organization_id, slug);
  }

  throw new Error('No organization ID found in request context');
}
