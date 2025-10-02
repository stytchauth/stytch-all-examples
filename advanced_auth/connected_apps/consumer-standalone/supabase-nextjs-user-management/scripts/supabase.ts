import axios from 'axios';
import { randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import inquirer from 'inquirer';
import { join } from 'path';

const supaman = axios.create({
  baseURL: 'https://api.supabase.com',
});

type SupabaseOrganization = {
  id: string;
  name: string;
};

type SupabaseProject = {
  id: string;
  organization_id: string;
  name: string;
  region: string;
};

type SupabaseApiKey = {
  id: string;
  name: string;
  type: string;
  api_key: string;
};

type SupabaseSetupResult = {
  supabaseUrl: string;
  supabasePublishableKey: string;
  supabaseSecretKey: string;
};

async function listSupabaseOrganizations(): Promise<SupabaseOrganization[]> {
  const organizations = await supaman.get('/v1/organizations');
  return organizations.data;
}

async function createSupabaseOrganization(name: string): Promise<SupabaseOrganization> {
  const organization = await supaman.post('/v1/organizations', {
    name: name,
  });

  if (!organization) {
    throw new Error('Failed to create organization');
  }

  return organization.data;
}

async function listSupabaseProjects(organizationId: string): Promise<SupabaseProject[]> {
  const projects = await supaman.get('/v1/projects');
  return projects.data.filter((project: SupabaseProject) => project.organization_id === organizationId);
}

async function createSupabaseProject(organizationId: string, name: string, region: string): Promise<SupabaseProject> {
  const project = await supaman.post('/v1/projects', {
    name: name,
    region: region,
    db_pass: randomBytes(16).toString('hex'),
    organization_id: organizationId,
  });

  if (!project) {
    throw new Error('Failed to create project');
  }

  return project.data;
}

async function getSupabaseSigningKey(projectId: string): Promise<string | null> {
  const signingKeys = await supaman.get(`/v1/projects/${projectId}/config/auth/signing-keys`);
  return signingKeys.data.keys.find((key: any) => key.status === 'in_use')?.id ?? null;
}

async function createSupabaseSigningKey(projectId: string) {
  const signingKey = await supaman.post(`/v1/projects/${projectId}/config/auth/signing-keys`, {
    algorithm: 'ES256',
  });

  if (!signingKey) {
    throw new Error('Failed to create signing key');
  }

  await supaman.patch(`/v1/projects/${projectId}/config/auth/signing-keys/${signingKey.data.id}`, {
    status: 'in_use',
  });

  return signingKey.data.id;
}

async function getSupabasePublishableKey(projectId: string): Promise<SupabaseApiKey | null> {
  const publishableKeys = await supaman.get(`/v1/projects/${projectId}/api-keys`);
  return publishableKeys.data.find((key: SupabaseApiKey) => key.type === 'publishable') ?? null;
}

async function createSupabasePublishableKey(projectId: string): Promise<SupabaseApiKey> {
  const publishableKey = await supaman.post(`/v1/projects/${projectId}/api-keys`, {
    name: 'default',
    type: 'publishable',
  });

  if (!publishableKey) {
    throw new Error('Failed to create publishable key');
  }

  return publishableKey.data;
}

async function listSupabaseSecretKeys(projectId: string): Promise<SupabaseApiKey[]> {
  const secretKeys = await supaman.get(`/v1/projects/${projectId}/api-keys`);
  return secretKeys.data.filter((key: SupabaseApiKey) => key.type === 'secret');
}

async function getRevealedSupabaseSecretKey(projectId: string, keyId: string): Promise<SupabaseApiKey> {
  const secretKey = await supaman.get(`/v1/projects/${projectId}/api-keys/${keyId}?reveal=true`);
  return secretKey.data;
}

async function createSupabaseSecretKey(projectId: string, name: string = 'default'): Promise<SupabaseApiKey> {
  const secretKey = await supaman.post(`/v1/projects/${projectId}/api-keys`, {
    name: name,
    type: 'secret',
    secret_jwt_template: {
      role: 'service_role',
    },
  });

  if (!secretKey) {
    throw new Error('Failed to create secret key');
  }

  return secretKey.data;
}

async function checkSupabaseLegacyKeysEnabled(projectId: string): Promise<boolean> {
  const legacyKeys = await supaman.get(`/v1/projects/${projectId}/api-keys/legacy`);
  return legacyKeys.data.enabled;
}

async function disableSupabaseLegacyKeys(projectId: string) {
  await supaman.put(`/v1/projects/${projectId}/api-keys/legacy?enabled=false`);
}

// run the migration in supabase-init.sql, but don't fail if it fails
async function runSupabaseMigration(projectId: string) {
  try {
    await supaman.post(`/v1/projects/${projectId}/database/migrations`, {
      query: readFileSync(join(__dirname, 'supabase-init.sql'), 'utf8'),
    });
  } catch (error) {
    console.log(
      `Migration failed, likely because the migration has already been run. Verify by checking the Supabase Table Editor.`,
    );
  }
}

async function disableSupabaseEmailVerification(projectId: string) {
  await supaman.patch(`/v1/projects/${projectId}/config/auth`, {
    mailer_autoconfirm: true,
  });
}

function getExistingConfig(): SupabaseSetupResult | null {
  const existingConfig: SupabaseSetupResult = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? '',
  };

  if (existingConfig.supabaseUrl && existingConfig.supabasePublishableKey && existingConfig.supabaseSecretKey) {
    return existingConfig;
  }

  return null;
}

async function performSupabaseSetup(): Promise<SupabaseSetupResult> {
  const existingConfig = getExistingConfig();
  if (existingConfig) {
    console.log(
      `\nSupabase variables are already set in your .env.local file. To restart Supabase steps, remove them or set them to empty values. Skipping setup...`,
    );
    return existingConfig;
  }

  console.log(
    `This script will create a new organization, project, and API keys for you. It will also disable legacy keys and email verification for the project.`,
  );

  console.log(
    '\nFirst, create a Supabase account and generate a personal access token (https://supabase.com/dashboard/account/tokens).',
  );
  const personalAccessToken = await inquirer.prompt<{ token: string }>([
    {
      type: 'password',
      name: 'token',
      mask: '*',
      message: 'Enter your personal access token',
      validate: (token) => (token.match(/^sbp_/) ? true : 'Invalid token. Must start with sbp_'),
    },
  ]);

  supaman.defaults.headers.common['Authorization'] = `Bearer ${personalAccessToken.token}`;

  console.log(`\nNext, select or create an organization to contain your project.`);

  const organizations = await listSupabaseOrganizations();
  let selectedOrganizationName: string = 'Create new organization';
  if (organizations.length > 0) {
    selectedOrganizationName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'list',
          name: 'name',
          message: 'Select an organization',
          choices: [...organizations.map((organization) => organization.name), 'Create new organization'],
          default: organizations[0].name,
        },
      ])
      .then((response) => response.name);
  }

  let selectedOrganization: SupabaseOrganization | null = null;
  if (selectedOrganizationName === 'Create new organization') {
    const newOrganizationName = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the new organization',
      },
    ]);

    selectedOrganization = await createSupabaseOrganization(newOrganizationName.name);
  } else {
    selectedOrganization = organizations.find((organization) => organization.name === selectedOrganizationName)!;
  }

  console.log(`\nNext, select or create a project to contain your database.`);

  const projects = await listSupabaseProjects(selectedOrganization.id);
  let selectedProjectName: string = 'Create new project';
  if (projects.length > 0) {
    selectedProjectName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'list',
          name: 'name',
          message: 'Select a project',
          choices: [...projects.map((project) => project.name), 'Create new project'],
          default: projects[0].name,
        },
      ])
      .then((response) => response.name);
  }

  let selectedProject: SupabaseProject | null = null;
  if (selectedProjectName === 'Create new project') {
    const newProjectName = await inquirer.prompt<{ name: string }>([
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the new project',
        default: 'stytch-mcp-blog',
      },
    ]);

    const newProjectRegion = await inquirer
      .prompt<{ region: string }>([
        {
          type: 'list',
          name: 'region',
          message: 'Select a region for the new project',
          choices: [
            'us-east-1',
            'us-east-2',
            'us-west-1',
            'ca-central-1',
            'sa-east-1',
            'ap-south-1',
            'ap-northeast-1',
            'ap-northeast-2',
            'ap-southeast-1',
            'ap-southeast-2',
            'eu-west-1',
            'eu-west-2',
            'eu-west-3',
            'eu-north-1',
            'eu-central-1',
            'eu-central-2',
          ],
          default: 'us-east-1',
        },
      ])
      .then((response) => response.region);

    selectedProject = await createSupabaseProject(selectedOrganization.id, newProjectName.name, newProjectRegion);
  } else {
    selectedProject = projects.find((project) => project.name === selectedProjectName)!;
  }

  console.log(`\nNext, let's set up your project's JWT signing key and publishable API key.`);

  // a supabase project can only have one JWT signing key, so we don't need to prompt the user
  let signingKeyId = await getSupabaseSigningKey(selectedProject.id);
  if (!signingKeyId) {
    console.log(`Setting up a JWT signing key...`);
    signingKeyId = await createSupabaseSigningKey(selectedProject.id);
  }
  console.log(`Using JWT signing key with ID: ${signingKeyId}`);

  // a supabase project can only have one publishable key, so we don't need to prompt the user
  let publishableKey = await getSupabasePublishableKey(selectedProject.id);
  if (!publishableKey) {
    console.log(`Setting up a publishable key...`);
    publishableKey = await createSupabasePublishableKey(selectedProject.id);
  }
  console.log(`Using publishable key: ${publishableKey.api_key}`);

  console.log(`\nNext, select or create a secret key to use for this app.`);

  let secretKeys = await listSupabaseSecretKeys(selectedProject.id);
  let selectedSecretKeyName: string = 'Create new secret key';
  if (secretKeys.length > 0) {
    selectedSecretKeyName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'list',
          name: 'name',
          message: 'Select a secret key',
          choices: [...secretKeys.map((key) => key.name), 'Create new secret key'],
          default: secretKeys[0].name,
        },
      ])
      .then((response) => response.name);
  }

  let secretKey: SupabaseApiKey | null = null;
  if (selectedSecretKeyName === 'Create new secret key') {
    // for now, we're just going to use "stytchdemo" as the key name
    // const newSecretKeyName = await inquirer.prompt<{ name: string }>([
    //     {
    //         type: "input",
    //         name: "name",
    //         message: "Enter a name for the new secret key",
    //         default: "default",
    //     },
    // ])

    secretKey = await createSupabaseSecretKey(selectedProject.id, 'stytchdemo');
  } else {
    secretKey = secretKeys.find((key) => key.name === selectedSecretKeyName)!;
  }

  const revealedSecretKey = await getRevealedSupabaseSecretKey(selectedProject.id, secretKey.id);
  console.log(`Using secret key: ${secretKey.api_key}`);

  console.log(
    `\nNext, let's disable legacy API keys for the project. Supabase is deprecating these in the near future.`,
  );

  const legacyKeysEnabled = await checkSupabaseLegacyKeysEnabled(selectedProject.id);
  if (legacyKeysEnabled) {
    await disableSupabaseLegacyKeys(selectedProject.id);
    console.log(`Disabled legacy keys.`);
  } else {
    console.log(`Legacy keys are already disabled.`);
  }

  console.log(
    `\nNext, let's disable email verification for the project. This will simplify the demo, as you won't need to confirm your email in the app.`,
  );

  await disableSupabaseEmailVerification(selectedProject.id);
  console.log(`Disabled email verification.`);

  console.log(`\nFinally, let's run the migration to set up your database.`);

  await runSupabaseMigration(selectedProject.id);
  console.log(`Ran migration.`);

  const supabaseUrl = `https://${selectedProject.id}.supabase.co`;
  console.log(
    `\nSupabase setup complete! You'll need to set the following environment variables in your Vercel project:`,
  );
  console.log(`NEXT_PUBLIC_SUPABASE_URL=            ${supabaseUrl}`);
  console.log(`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishableKey.api_key}`);
  console.log(`SUPABASE_SECRET_KEY=                 ${revealedSecretKey.api_key}`);
  console.log(`\n`);

  return {
    supabaseUrl: supabaseUrl,
    supabasePublishableKey: publishableKey.api_key,
    supabaseSecretKey: revealedSecretKey.api_key,
  };
}

export default performSupabaseSetup;
export type { SupabaseSetupResult };
