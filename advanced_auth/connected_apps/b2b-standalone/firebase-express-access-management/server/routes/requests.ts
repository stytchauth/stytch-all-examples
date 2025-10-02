import express, { Response } from 'express';
import { db } from '../config/firebase.js';
import { authenticateToken, requireOrgAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { CreateAccessRequestData, ApproveDenyRequest } from '../types/index.js';

const router = express.Router();

// Create an access request
router.post(
  '/requests/:orgId',
  authenticateToken,
  validate(schemas.createAccessRequest),
  async (req: any, res: Response): Promise<void> => {
    try {
      const { orgId } = req.params;
      const { resourceName, reason } = req.body as CreateAccessRequestData;
      const { uid, email, name: userName } = req.user;

      // Check if organization exists and user is a member
      const orgDoc = await db.collection('organizations').doc(orgId!).get();

      if (!orgDoc.exists) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }

      const orgData = orgDoc.data();

      if (!orgData?.members.includes(uid)) {
        res.status(403).json({
          error: 'Access denied. You are not a member of this organization.',
        });
        return;
      }

      // Create access request
      const requestRef = await db.collection('accessRequests').add({
        orgId,
        userId: uid,
        userEmail: email,
        userName: userName,
        resourceName,
        reason,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json({
        message: 'Access request created successfully',
        request: {
          id: requestRef.id,
          orgId,
          userId: uid,
          userEmail: email,
          userName: userName,
          resourceName,
          reason,
          status: 'pending',
          createdAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error('Create access request error:', error);
      res.status(500).json({ error: 'Failed to create access request' });
    }
  },
);

// Get all access requests for an organization (admin only)
router.get('/requests/:orgId', authenticateToken, requireOrgAdmin, async (req: any, res: Response): Promise<void> => {
  try {
    const { orgId } = req.params;
    const { status } = req.query;

    let query = db.collection('accessRequests').where('orgId', '==', orgId);

    // Filter by status if provided
    if (status && ['pending', 'approved', 'denied'].includes(status as string)) {
      query = query.where('status', '==', status);
    }

    const requestsSnapshot = await query.orderBy('createdAt', 'desc').get();

    const requests = requestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      requests,
    });
  } catch (error: any) {
    console.error('Get access requests error:', error);
    res.status(500).json({ error: 'Failed to get access requests' });
  }
});

// Get a specific access request
router.get('/requests/:orgId/:requestId', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { orgId, requestId } = req.params;
    const { uid } = req.user;

    const requestDoc = await db.collection('accessRequests').doc(requestId!).get();

    if (!requestDoc.exists) {
      res.status(404).json({ error: 'Access request not found' });
      return;
    }

    const requestData = requestDoc.data();

    // Check if user is the requester or an admin of the organization
    if (requestData?.userId !== uid && requestData?.orgId !== orgId) {
      // Check if user is admin of the organization
      const orgDoc = await db.collection('organizations').doc(orgId!).get();
      const orgData = orgDoc.data();

      if (orgData?.adminId !== uid) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }
    }

    res.json({
      id: requestId,
      ...requestData,
    });
  } catch (error: any) {
    console.error('Get access request error:', error);
    res.status(500).json({ error: 'Failed to get access request' });
  }
});

// Approve or deny an access request (admin only)
router.patch(
  '/requests/:orgId/:requestId',
  authenticateToken,
  requireOrgAdmin,
  validate(schemas.approveDenyRequest),
  async (req: any, res: Response): Promise<void> => {
    try {
      const { orgId, requestId } = req.params;
      const { action, reason } = req.body as ApproveDenyRequest;
      const { uid, name: adminName } = req.user;

      const requestRef = db.collection('accessRequests').doc(requestId!);
      const requestDoc = await requestRef.get();

      if (!requestDoc.exists) {
        res.status(404).json({ error: 'Access request not found' });
        return;
      }

      const requestData = requestDoc.data();

      // Check if request belongs to this organization
      if (requestData?.orgId !== orgId) {
        res.status(400).json({ error: 'Request does not belong to this organization' });
        return;
      }

      // Check if request is still pending
      if (requestData?.status !== 'pending') {
        res.status(400).json({ error: 'Request has already been processed' });
        return;
      }

      // Update request status
      const newStatus = action === 'approve' ? 'approved' : 'denied';

      await requestRef.update({
        status: newStatus,
        adminResponse: reason,
        adminId: uid,
        adminName: adminName,
        updatedAt: new Date(),
      });

      res.json({
        message: `Access request ${action === 'approve' ? 'approved' : 'denied'} successfully`,
        request: {
          id: requestId,
          status: newStatus,
          adminResponse: reason,
          adminId: uid,
          adminName: adminName,
          updatedAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error('Approve/deny request error:', error);
      res.status(500).json({ error: 'Failed to process access request' });
    }
  },
);

// Cancel a pending request (requester only)
router.delete('/requests/:orgId/:requestId', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { orgId, requestId } = req.params;
    const { uid } = req.user;

    const requestRef = db.collection('accessRequests').doc(requestId!);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      res.status(404).json({ error: 'Access request not found' });
      return;
    }

    const requestData = requestDoc.data();

    // Check if user is the requester
    if (requestData?.userId !== uid) {
      res.status(403).json({
        error: 'Access denied. You can only cancel your own requests.',
      });
      return;
    }

    // Check if request belongs to this organization
    if (requestData?.orgId !== orgId) {
      res.status(400).json({ error: 'Request does not belong to this organization' });
      return;
    }

    // Check if request is still pending
    if (requestData?.status !== 'pending') {
      res.status(400).json({
        error: 'Cannot cancel a request that has already been processed',
      });
      return;
    }

    // Delete the request
    await requestRef.delete();

    res.json({
      message: 'Access request cancelled successfully',
    });
  } catch (error: any) {
    console.error('Cancel request error:', error);
    res.status(500).json({ error: 'Failed to cancel access request' });
  }
});

// Get user's own access requests
router.get('/requests', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { uid } = req.user;
    const { status, orgId } = req.query;

    let query = db.collection('accessRequests').where('userId', '==', uid);

    // Filter by organization if provided
    if (orgId) {
      query = query.where('orgId', '==', orgId);
    }

    // Filter by status if provided
    if (status && ['pending', 'approved', 'denied'].includes(status as string)) {
      query = query.where('status', '==', status);
    }

    const requestsSnapshot = await query.orderBy('createdAt', 'desc').get();

    const requests = requestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      requests,
    });
  } catch (error: any) {
    console.error('Get user requests error:', error);
    res.status(500).json({ error: 'Failed to get user requests' });
  }
});

export default router;
