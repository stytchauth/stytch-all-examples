import express, { Response } from 'express';
import { db, FieldValue } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';
import { extractDomainFromEmail } from '../utils/domain.js';

const router = express.Router();

// Get or create organization for user's domain
router.get('/', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { uid, email, name: userName } = req.user;
    const domain = extractDomainFromEmail(email);

    // Check if domain organization already exists
    const existingOrgs = await db.collection('organizations').where('domain', '==', domain).get();

    let orgData;
    let orgId;

    if (!existingOrgs.empty) {
      // Organization exists, get it
      const orgDoc = existingOrgs.docs[0]!;
      orgId = orgDoc.id;
      orgData = orgDoc.data();

      // Check if user is already a member
      if (!orgData.members.includes(uid)) {
        // Add user to organization
        await db
          .collection('organizations')
          .doc(orgId)
          .update({
            members: FieldValue.arrayUnion(uid),
            updatedAt: new Date(),
          });

        // Add organization to user's organizations list
        await db.collection('users').doc(uid).update({
          organizationId: orgId,
        });

        // Update orgData to include the new member
        orgData.members.push(uid);
      }
    } else {
      // Create new domain organization with user as admin
      const orgRef = await db.collection('organizations').add({
        domain,
        name: domain, // Use domain as organization name
        description: `Organization for ${domain}`,
        adminId: uid,
        adminEmail: email,
        adminName: userName,
        members: [uid],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      orgId = orgRef.id;

      // Add organization to user's organizations list
      await db.collection('users').doc(uid).update({
        organizationId: orgId,
      });

      orgData = {
        domain,
        name: domain,
        description: `Organization for ${domain}`,
        adminId: uid,
        adminEmail: email,
        adminName: userName,
        members: [uid],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const role = orgData.adminId === uid ? 'admin' : 'member';

    res.json({
      id: orgId,
      ...orgData,
      role,
      memberCount: orgData.members.length,
    });
  } catch (error: any) {
    console.error('Get organization error:', error);
    res.status(500).json({ error: 'Failed to get organization' });
  }
});

// Get organization members
router.get('/members', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { uid, organizationId } = req.user;

    const orgDoc = await db.collection('organizations').doc(organizationId!).get();

    if (!orgDoc.exists) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    const orgData = orgDoc.data();

    // Check if user is a member of this organization
    if (!orgData?.members.includes(uid)) {
      res.status(403).json({
        error: 'Access denied. You are not a member of this organization.',
      });
      return;
    }

    // Get member details
    const memberPromises = orgData.members.map(async (memberId: string) => {
      const userDoc = await db.collection('users').doc(memberId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return {
          uid: memberId,
          email: userData?.email,
          name: userData?.name,
          role: memberId === orgData.adminId ? 'admin' : 'member',
        };
      }
      return null;
    });

    const members = (await Promise.all(memberPromises)).filter((member) => member !== null);

    res.json({
      members,
    });
  } catch (error: any) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to get organization members' });
  }
});

export default router;
