import { NextFunction, Request, Response } from 'express';
import * as stytch from 'stytch';
import { B2BIntrospectTokenClaims } from 'stytch/types/lib/b2b/idp';

// Extend Express Request interface to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      client?: B2BIntrospectTokenClaims;
    }
  }
}

// middleware to validate an oauth token using the stytch client
const client = new stytch.B2BClient({
  project_id: process.env.STYTCH_PROJECT_ID as string,
  secret: process.env.STYTCH_SECRET as string,
  custom_base_url: process.env.STYTCH_IDP_DOMAIN,
});

// middleware to validate an oauth token using the stytch client
export const validateMcpToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.error('Authorization header is missing');
      const wwwAuthValue = `Bearer error="Unauthorized", error_description="Unauthorized", resource_metadata="${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource"`;
      res.set('WWW-Authenticate', wwwAuthValue);
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    req.client = await client.idp.introspectTokenLocal(token);
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    const wwwAuthValue = `Bearer error="Unauthorized", error_description="Unauthorized", resource_metadata="${req.protocol}://${req.get('host')}/.well-known/oauth-protected-resource"`;
    res.set('WWW-Authenticate', wwwAuthValue);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
