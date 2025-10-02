import { writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { StytchSetupResult } from '@/scripts/stytch';
import { FirebaseSetupResult } from '@/scripts/firebase';

async function promptForFirebaseVariables(): Promise<FirebaseSetupResult> {
  let firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
  if (!firebaseProjectId) {
    firebaseProjectId = await inquirer
      .prompt<{ projectId: string }>([
        {
          type: 'input',
          name: 'projectId',
          message: 'Enter your Firebase project ID (FIREBASE_PROJECT_ID)',
          validate: (projectId) =>
            projectId.match(/^[a-z0-9-]+$/) ? true : 'Invalid project ID. Must be in the format <random-string>',
        },
      ])
      .then((answer) => answer.projectId);
  }

  let firebaseApiKey = process.env.FIREBASE_API_KEY;
  if (!firebaseApiKey) {
    firebaseApiKey = await inquirer
      .prompt<{ apiKey: string }>([
        {
          type: 'input',
          name: 'apiKey',
          message: 'Enter your Firebase API key (FIREBASE_API_KEY)',
          validate: (apiKey) =>
            apiKey.match(/^[a-z0-9-]+$/) ? true : 'Invalid API key. Must be in the format <random-string>',
        },
      ])
      .then((answer) => answer.apiKey);
  }

  let firebasePrivateKeyId = process.env.FIREBASE_PRIVATE_KEY_ID;
  if (!firebasePrivateKeyId) {
    firebasePrivateKeyId = await inquirer
      .prompt<{ privateKeyId: string }>([
        {
          type: 'input',
          name: 'privateKeyId',
          message: 'Enter your Firebase private key ID (FIREBASE_PRIVATE_KEY_ID)',
          validate: (privateKeyId) =>
            privateKeyId.match(/^[a-z0-9-]+$/) ? true : 'Invalid private key ID. Must be in the format <random-string>',
        },
      ])
      .then((answer) => answer.privateKeyId);
  }

  let firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!firebasePrivateKey) {
    firebasePrivateKey = await inquirer
      .prompt<{ privateKey: string }>([
        {
          type: 'input',
          name: 'privateKey',
          message: 'Enter your Firebase private key (FIREBASE_PRIVATE_KEY)',
          validate: (privateKey) =>
            privateKey.match(/^-----BEGIN PRIVATE KEY-----\n[a-z0-9+/]+={0,2}\n-----END PRIVATE KEY-----\n$/)
              ? true
              : 'Invalid private key. Must be in PEM format',
        },
      ])
      .then((answer) => answer.privateKey);
  }

  let firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (!firebaseClientEmail) {
    firebaseClientEmail = await inquirer
      .prompt<{ clientEmail: string }>([
        {
          type: 'input',
          name: 'clientEmail',
          message: 'Enter your Firebase client email (FIREBASE_CLIENT_EMAIL)',
          validate: (clientEmail) =>
            clientEmail.match(/^[a-z0-9-]+$/) ? true : 'Invalid client email. Must be in the format <random-string>',
        },
      ])
      .then((answer) => answer.clientEmail);
  }

  let firebaseClientId = process.env.FIREBASE_CLIENT_ID;
  if (!firebaseClientId) {
    firebaseClientId = await inquirer
      .prompt<{ clientId: string }>([
        {
          type: 'input',
          name: 'clientId',
          message: 'Enter your Firebase client ID (FIREBASE_CLIENT_ID)',
          validate: (clientId) =>
            clientId.match(/^[a-z0-9-]+$/) ? true : 'Invalid client ID. Must be in the format <random-string>',
        },
      ])
      .then((answer) => answer.clientId);
  }

  return {
    projectId: firebaseProjectId!,
    apiKey: firebaseApiKey!,
    privateKeyId: firebasePrivateKeyId!,
    privateKey: firebasePrivateKey!,
    clientEmail: firebaseClientEmail!,
    clientId: firebaseClientId!,
  };
}

async function promptForStytchVariables(): Promise<StytchSetupResult> {
  let stytchProjectId = process.env.STYTCH_PROJECT_ID;
  if (!stytchProjectId) {
    stytchProjectId = await inquirer
      .prompt<{ id: string }>([
        {
          type: 'input',
          name: 'id',
          message: 'Enter your Stytch project ID (STYTCH_PROJECT_ID)',
          validate: (id) => (id.match(/^project-/) ? true : 'Invalid ID. Must start with project-'),
        },
      ])
      .then((answer) => answer.id);
  }

  let stytchIdpDomain = process.env.STYTCH_IDP_DOMAIN;
  if (!stytchIdpDomain) {
    stytchIdpDomain = await inquirer
      .prompt<{ domain: string }>([
        {
          type: 'input',
          name: 'domain',
          message: 'Enter your Stytch IDP domain (STYTCH_IDP_DOMAIN)',
          validate: (domain) => (domain.match(/^https:\/\//) ? true : 'Invalid domain. Must start with https://'),
        },
      ])
      .then((answer) => answer.domain);
  }

  let stytchSecret = process.env.STYTCH_SECRET;
  if (!stytchSecret) {
    stytchSecret = await inquirer
      .prompt<{ secret: string }>([
        {
          type: 'password',
          name: 'secret',
          mask: '*',
          message: 'Enter your Stytch secret (STYTCH_SECRET)',
          validate: (secret) => (secret.match(/^secret-/) ? true : 'Invalid secret. Must start with secret-'),
        },
      ])
      .then((answer) => answer.secret);
  }

  let stytchPublicToken = process.env.VITE_STYTCH_PUBLIC_TOKEN;
  if (!stytchPublicToken) {
    stytchPublicToken = await inquirer
      .prompt<{ token: string }>([
        {
          type: 'input',
          name: 'token',
          message: 'Enter your Stytch public token (VITE_STYTCH_PUBLIC_TOKEN)',
          validate: (token) => (token.match(/^public-token-/) ? true : 'Invalid token. Must start with public-token-'),
        },
      ])
      .then((answer) => answer.token);
  }

  let stytchTokenProfile = process.env.VITE_STYTCH_TOKEN_PROFILE;
  if (!stytchTokenProfile) {
    stytchTokenProfile = await inquirer
      .prompt<{ profile: string }>([
        {
          type: 'input',
          name: 'profile',
          message: 'Enter your Stytch trusted token profile ID (VITE_STYTCH_TOKEN_PROFILE)',
          validate: (profile) =>
            profile.match(/^trusted-token-profile-/) ? true : 'Invalid profile. Must start with trusted-token-profile-',
        },
      ])
      .then((answer) => answer.profile);
  }

  return {
    projectId: stytchProjectId!,
    projectSecretKey: stytchSecret!,
    projectDomain: stytchIdpDomain!,
    projectPublicToken: stytchPublicToken!,
    trustedTokenProfileId: stytchTokenProfile!,
  };
}

function writeEnvFile(
  firebaseResult: FirebaseSetupResult = {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    apiKey: process.env.FIREBASE_API_KEY ?? '',
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID ?? '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY ?? '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
    clientId: process.env.FIREBASE_CLIENT_ID ?? '',
  },
  stytchResult: StytchSetupResult = {
    projectId: process.env.STYTCH_PROJECT_ID ?? '',
    projectSecretKey: process.env.STYTCH_SECRET ?? '',
    projectDomain: process.env.STYTCH_IDP_DOMAIN ?? '',
    projectPublicToken: process.env.VITE_STYTCH_PUBLIC_TOKEN ?? '',
    trustedTokenProfileId: process.env.VITE_STYTCH_TOKEN_PROFILE ?? '',
  },
) {
  const envFile = `PORT=3000
NODE_ENV=development
SITE_URL=http://localhost:3000
CORS_URLS=http://localhost:3000,http://localhost:3001

FIREBASE_PROJECT_ID=${firebaseResult.projectId}
FIREBASE_PRIVATE_KEY_ID=${firebaseResult.privateKeyId}
FIREBASE_PRIVATE_KEY=${firebaseResult.privateKey}
FIREBASE_CLIENT_EMAIL=${firebaseResult.clientEmail}
FIREBASE_CLIENT_ID=${firebaseResult.clientId}
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_API_KEY=${firebaseResult.apiKey}

STYTCH_PROJECT_ID=${stytchResult.projectId}
STYTCH_SECRET=${stytchResult.projectSecretKey}
STYTCH_IDP_DOMAIN=${stytchResult.projectDomain}
VITE_STYTCH_PUBLIC_TOKEN=${stytchResult.projectPublicToken}
VITE_STYTCH_TOKEN_PROFILE=${stytchResult.trustedTokenProfileId}`;

  writeFileSync('.env.local', envFile);
  console.log(`Environment variables written to .env.local`);
}

export { promptForFirebaseVariables, promptForStytchVariables, writeEnvFile };
