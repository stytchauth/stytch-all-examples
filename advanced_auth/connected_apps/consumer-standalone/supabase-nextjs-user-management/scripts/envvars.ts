import { writeFileSync } from 'fs';
import inquirer from 'inquirer';
import { StytchSetupResult } from '@/scripts/stytch';
import { SupabaseSetupResult } from '@/scripts/supabase';

async function promptForSupabaseVariables(): Promise<SupabaseSetupResult> {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    supabaseUrl = await inquirer
      .prompt<{ url: string }>([
        {
          type: 'input',
          name: 'url',
          message: 'Enter your Supabase URL (NEXT_PUBLIC_SUPABASE_URL)',
          validate: (url) =>
            url.match(/^https:\/\/.*\.supabase\.co$/)
              ? true
              : 'Invalid URL. Must be in the format https://<random-string>.supabase.co',
        },
      ])
      .then((answer) => answer.url);
  }

  let supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabasePublishableKey) {
    supabasePublishableKey = await inquirer
      .prompt<{ key: string }>([
        {
          type: 'input',
          name: 'key',
          message: 'Enter your Supabase publishable key (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)',
          validate: (key) => (key.match(/^sb_publishable_/) ? true : 'Invalid key. Must start with sb_publishable_'),
        },
      ])
      .then((answer) => answer.key);
  }

  let supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseSecretKey) {
    supabaseSecretKey = await inquirer
      .prompt<{ key: string }>([
        {
          type: 'password',
          name: 'key',
          mask: '*',
          message: 'Enter your Supabase secret key (SUPABASE_SECRET_KEY)',
          validate: (key) => (key.match(/^sb_secret_/) ? true : 'Invalid key. Must start with sb_secret_'),
        },
      ])
      .then((answer) => answer.key);
  }

  return {
    supabaseUrl: supabaseUrl!,
    supabasePublishableKey: supabasePublishableKey!,
    supabaseSecretKey: supabaseSecretKey!,
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

  let stytchPublicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN;
  if (!stytchPublicToken) {
    stytchPublicToken = await inquirer
      .prompt<{ token: string }>([
        {
          type: 'input',
          name: 'token',
          message: 'Enter your Stytch public token (NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN)',
          validate: (token) => (token.match(/^public-token-/) ? true : 'Invalid token. Must start with public-token-'),
        },
      ])
      .then((answer) => answer.token);
  }

  let stytchTokenProfile = process.env.NEXT_PUBLIC_STYTCH_TOKEN_PROFILE;
  if (!stytchTokenProfile) {
    stytchTokenProfile = await inquirer
      .prompt<{ profile: string }>([
        {
          type: 'input',
          name: 'profile',
          message: 'Enter your Stytch trusted token profile ID (NEXT_PUBLIC_STYTCH_TOKEN_PROFILE)',
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
  supabaseResult: SupabaseSetupResult = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? '',
  },
  stytchResult: StytchSetupResult = {
    projectId: process.env.STYTCH_PROJECT_ID ?? '',
    projectSecretKey: process.env.STYTCH_SECRET ?? '',
    projectDomain: process.env.STYTCH_IDP_DOMAIN ?? '',
    projectPublicToken: process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN ?? '',
    trustedTokenProfileId: process.env.NEXT_PUBLIC_STYTCH_TOKEN_PROFILE ?? '',
  },
) {
  const envFile = `NEXT_PUBLIC_SUPABASE_URL=${supabaseResult.supabaseUrl}
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${supabaseResult.supabasePublishableKey}
SUPABASE_SECRET_KEY=${supabaseResult.supabaseSecretKey}

STYTCH_PROJECT_ID=${stytchResult.projectId}
STYTCH_SECRET=${stytchResult.projectSecretKey}
STYTCH_IDP_DOMAIN=${stytchResult.projectDomain}
NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN=${stytchResult.projectPublicToken}
NEXT_PUBLIC_STYTCH_TOKEN_PROFILE=${stytchResult.trustedTokenProfileId}`;

  writeFileSync('.env.local', envFile);
  console.log(`Environment variables written to .env.local`);
}

export { promptForSupabaseVariables, promptForStytchVariables, writeEnvFile };
