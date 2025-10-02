import express, { Request, Response } from 'express';
import { auth, db, FieldValue } from '../config/firebase.js';
import { validate, schemas } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { SignUpRequest, SignInRequest } from '../types/index.js';
import { extractDomainFromEmail } from '../utils/domain.js';

const router = express.Router();

// Sign up endpoint
router.post('/signup', validate(schemas.signUp), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body as SignUpRequest;
    const domain = extractDomainFromEmail(email);

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Check if domain organization exists
    const existingOrgs = await db.collection('organizations').where('domain', '==', domain).get();

    let organizationId;

    if (!existingOrgs.empty) {
      // Organization exists, add user to it
      const orgDoc = existingOrgs.docs[0]!;
      organizationId = orgDoc.id;

      await db
        .collection('organizations')
        .doc(organizationId)
        .update({
          members: FieldValue.arrayUnion(userRecord.uid),
          updatedAt: new Date(),
        });
    } else {
      // Create new domain organization with user as admin
      const orgRef = await db.collection('organizations').add({
        domain,
        name: domain,
        description: `Organization for ${domain}`,
        adminId: userRecord.uid,
        adminEmail: email,
        adminName: name,
        members: [userRecord.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      organizationId = orgRef.id;
    }

    auth.setCustomUserClaims(userRecord.uid, {
      org_id: organizationId,
    });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      organizationId,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        organizationId,
      },
    });
  } catch (error: any) {
    console.error('Sign up error:', error);

    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Sign in endpoint
router.post('/signin', validate(schemas.signIn), async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as SignInRequest;

    // Use Firebase Client SDK for password verification (server-side)
    const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
    const { initializeApp } = await import('firebase/app');

    // Initialize Firebase app using the same project ID from our existing config
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: process.env.FIREBASE_PROJECT_ID,
    };

    const app = initializeApp(firebaseConfig);
    const authClient = getAuth(app);

    // Sign in with email and password to verify credentials
    const userCredential = await signInWithEmailAndPassword(authClient, email, password);
    const user = userCredential.user;

    // Get the ID token
    const idToken = await user.getIdToken();

    // Get user data from Firestore using our existing db instance
    const userDoc = await db.collection('users').doc(user.uid).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: 'User profile not found' });
      return;
    }

    const userData = userDoc.data();

    res.json({
      message: 'Sign in successful',
      token: idToken,
      user: {
        uid: user.uid,
        email: user.email,
        name: userData?.name,
        organizationId: userData?.organizationId,
      },
    });
  } catch (error: any) {
    console.error('Sign in error:', error);

    // Handle specific Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      res.status(401).json({ error: 'No user found with this email address' });
      return;
    }

    if (error.code === 'auth/wrong-password') {
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    if (error.code === 'auth/invalid-email') {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }

    if (error.code === 'auth/user-disabled') {
      res.status(401).json({ error: 'User account has been disabled' });
      return;
    }

    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req: any, res: Response): Promise<void> => {
  try {
    const { uid } = req.user;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userData = userDoc.data();

    res.json({
      uid,
      email: userData?.email,
      name: userData?.name,
      organizations: userData?.organizations || [],
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Generate custom token for testing (admin only)
router.post('/custom-token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.body as { uid: string };

    if (!uid) {
      res.status(400).json({ error: 'UID is required' });
      return;
    }

    const customToken = await auth.createCustomToken(uid);

    res.json({
      customToken,
    });
  } catch (error: any) {
    console.error('Custom token error:', error);
    res.status(500).json({ error: 'Failed to create custom token' });
  }
});

export default router;
