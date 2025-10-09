import axios from 'axios';
import inquirer from 'inquirer';
import { FirebaseSetupResult } from '@/scripts/firebase';

const stytchman = axios.create({
  baseURL: 'https://management.stytch.com/v1',
});

type StytchSetupResult = {
  trustedTokenProfileId: string;
  projectId: string;
  projectDomain: string;
  projectSecretKey: string;
  projectPublicToken: string;
};

type StytchProject = {
  live_project_id: string;
  test_project_id: string;
  name: string;
  vertical: 'CONSUMER' | 'B2B';
  test_unique_project_name: string;
};

async function listStytchProjects(): Promise<StytchProject[]> {
  const response = await stytchman.get('/projects');
  return response.data.projects;
}

async function createStytchProject(name: string): Promise<StytchProject> {
  const response = await stytchman.post('/projects', {
    project_name: name,
    vertical: 'B2B',
  });
  return response.data.project;
}

async function updateStytchProject(project: StytchProject, idpAuthorizationUrl: string) {
  await stytchman.put(`/projects/${project.live_project_id}`, {
    name: project.name,
    test_idp_authorization_url: idpAuthorizationUrl,
    test_idp_dynamic_client_registration_enabled: true,
    test_idp_dynamic_client_registration_default_access_token_template_content: `{ "fb_user_id": {{member.external_id}} }`,
  });
}

async function createStytchTrustedTokenProfile(projectId: string, firebaseProjectId: string): Promise<string> {
  const response = await stytchman.post(`/projects/${projectId}/trusted-token-profiles`, {
    name: 'Firebase',
    audience: firebaseProjectId,
    issuer: `https://securetoken.google.com/${firebaseProjectId}`,
    can_jit_provision: true,
    public_key_type: 'jwk',
    jwks_url: `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`,
    attribute_mapping: {
      email: 'email',
      token_id: 'sub',
      external_member_id: 'sub',
      organization_id: 'org_id',
    },
  });
  return response.data.profile.profile_id;
}

async function createStytchProjectSecret(projectId: string): Promise<string> {
  const response = await stytchman.post(`/projects/${projectId}/secrets`, {});
  return response.data.created_secret.secret;
}

async function getStytchProjectPublicToken(projectId: string): Promise<string> {
  const response = await stytchman.get(`/projects/${projectId}/public_tokens`);
  return response.data.public_tokens[0].public_token;
}

async function enableStytchFrontendSDKs(projectId: string) {
  await stytchman.put(`/projects/${projectId}/sdk/b2b`, {
    config: {
      basic: {
        enabled: true,
        domains: [
          {
            domain: 'http://localhost:3000',
            slug_pattern: '',
          },
        ],
      },
    },
  });
}

function getExistingConfig(): StytchSetupResult | null {
  const existingConfig: StytchSetupResult = {
    trustedTokenProfileId: process.env.VITE_STYTCH_TOKEN_PROFILE ?? '',
    projectId: process.env.STYTCH_PROJECT_ID ?? '',
    projectDomain: process.env.STYTCH_IDP_DOMAIN ?? '',
    projectSecretKey: process.env.STYTCH_SECRET ?? '',
    projectPublicToken: process.env.VITE_STYTCH_PUBLIC_TOKEN ?? '',
  };

  if (
    existingConfig.trustedTokenProfileId &&
    existingConfig.projectId &&
    existingConfig.projectDomain &&
    existingConfig.projectSecretKey &&
    existingConfig.projectPublicToken
  ) {
    return existingConfig;
  }

  return null;
}

async function performStytchSetup(firebaseResult: FirebaseSetupResult): Promise<StytchSetupResult> {
  const existingConfig = getExistingConfig();
  if (existingConfig) {
    console.log(
      `\nStytch variables are already set in your .env.local file. To restart Stytch steps, remove them or set them to empty values. Skipping setup...`,
    );
    return existingConfig;
  }

  console.log(`Starting Stytch setup...`);
  console.log(`This script will guide you through the steps to set up a Stytch project for this app.`);

  console.log(
    '\nFirst, create a Stytch account. Then, generate a Workspace API Key (https://stytch.com/dashboard/settings/management-api).',
  );
  const workspaceApiKeyId = await inquirer
    .prompt<{ id: string }>([
      {
        type: 'input',
        name: 'id',
        message: 'Enter the Workspace API Key ID (workspace-key-prod-...)',
        validate: (id) => (id.match(/^workspace-key-prod-/) ? true : 'Invalid ID. Must start with workspace-key-prod-'),
      },
    ])
    .then((answer) => answer.id);

  const workspaceApiKeySecret = await inquirer
    .prompt<{ secret: string }>([
      {
        type: 'password',
        name: 'secret',
        mask: '*',
        message: 'Enter the Workspace API Key Secret',
      },
    ])
    .then((answer) => answer.secret);

  stytchman.defaults.auth = {
    username: workspaceApiKeyId,
    password: workspaceApiKeySecret,
  };

  console.log('\nNext, select or create a new Stytch project.');

  const projects = await listStytchProjects();
  let selectedProjectName: string = 'Create new project';
  if (projects.length > 0) {
    selectedProjectName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'list',
          name: 'name',
          message: 'Select a project',
          choices: [...projects.map((project) => project.name), 'Create new project'],
          default: projects[0]?.name,
        },
      ])
      .then((answer) => answer.name);
  }

  let selectedProject: StytchProject | null = null;
  if (selectedProjectName === 'Create new project') {
    const newProjectName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'Enter a name for the new project',
          default: 'stytch-mcp-demo',
        },
      ])
      .then((answer) => answer.name);

    selectedProject = await createStytchProject(newProjectName);
  } else {
    selectedProject = projects.find((project) => project.name === selectedProjectName)!;
  }

  console.log(
    `\nNext, let's set up a trusted auth token profile for your project. This will allow you to exchange Firebase access tokens for Stytch sessions.`,
  );
  const trustedTokenProfileId = await createStytchTrustedTokenProfile(
    selectedProject.test_project_id,
    firebaseResult.projectId,
  );
  console.log(`Using trusted auth token profile with ID: ${trustedTokenProfileId}`);

  console.log(
    `\nNext, let's set up your Connected Apps Authorization URL and enable Dynamic Client Registration. We'll also add a custom access token template so that Stytch attaches the Firebase user ID to Stytch sessions.`,
  );
  await updateStytchProject(selectedProject, 'http://localhost:3000/oauth/authorize');
  console.log(`Project updated.`);

  console.log(`\nNext, let's enable the Frontend SDKs.`);
  await enableStytchFrontendSDKs(selectedProject.test_project_id);
  console.log('Frontend SDKs enabled.');

  const projectId = selectedProject.test_project_id;
  const projectSecretKey = await createStytchProjectSecret(projectId);
  const projectPublicToken = await getStytchProjectPublicToken(projectId);

  console.log(`\nStytch setup complete! Configuration summary:`);
  console.log(`Project ID: ${projectId}`);
  console.log(`Project Secret Key: ${projectSecretKey}`);
  console.log(`Project Domain: ${selectedProject.test_unique_project_name}.customers.stytch.dev`);
  console.log(`Project Public Token: ${projectPublicToken}`);
  console.log(`Trusted Token Profile ID: ${trustedTokenProfileId}`);

  return {
    trustedTokenProfileId,
    projectId,
    projectDomain: `https://${selectedProject.test_unique_project_name}.customers.stytch.dev`,
    projectSecretKey,
    projectPublicToken,
  };
}

export default performStytchSetup;
export type { StytchSetupResult };
