import { Request, Response, NextFunction } from 'express';
import { Client, IntrospectTokenClaims, Session } from 'stytch';

// Extend Express Request interface to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: Session;
      client?: IntrospectTokenClaims;
    }
  }
}

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

export function authorizeSessionMiddleware() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { session } = await getClient().sessions.authenticateJwt({
        session_jwt: req.cookies.stytch_session_jwt,
      });
      req.user = session;
      next();
    } catch (err) {
      console.error('Error in auth middleware:', err);
      res.status(401).json({ error: 'Unauthorized' });
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

      req.client = await getClient().idp.introspectTokenLocal(token);
      next();
    } catch (error) {
      console.error('Error in auth middleware:', error);
      const wwwAuthValue = `Bearer error="Unauthorized", error_description="Unauthorized", resource_metadata="${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource"`;
      res.set('WWW-Authenticate', wwwAuthValue);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
