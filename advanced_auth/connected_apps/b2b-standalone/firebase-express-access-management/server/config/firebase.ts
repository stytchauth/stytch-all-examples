import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env', '.env.production.local', '.env.local'] });

// Initialize Firebase Admin SDK
const initializeFirebase = (): admin.app.App => {
  if (!admin.apps.length) {
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  return admin.app();
};

const app = initializeFirebase();
const db = admin.firestore();
const auth = admin.auth();
const FieldValue = admin.firestore.FieldValue;

export { admin, db, auth, FieldValue };
export default app;
