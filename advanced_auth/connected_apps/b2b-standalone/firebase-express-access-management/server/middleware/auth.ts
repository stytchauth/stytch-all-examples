import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase.js';

// Middleware to verify Firebase ID token
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Access denied. No token provided or invalid format.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: 'Access denied. No token provided.',
      });
      return;
    }

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(token);
    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name || null,
      organizationId: decodedToken.org_id || null,
    };

    // Add db reference to request for convenience
    (req as any).db = db;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      error: 'Invalid token or token expired.',
    });
  }
};

// Middleware to check if user is admin of an organization
export const requireOrgAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orgId } = req.params;
    const { uid } = (req as any).user;

    const orgDoc = await db.collection('organizations').doc(orgId!).get();

    if (!orgDoc.exists) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const orgData = orgDoc.data();

    if (orgData?.adminId !== uid) {
      res.status(403).json({
        error: 'Access denied. Admin privileges required.',
      });
      return;
    }

    (req as any).organization = orgData;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
