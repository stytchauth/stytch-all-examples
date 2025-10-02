import axios from 'axios';
import inquirer from 'inquirer';
import { StytchSetupResult } from '@/scripts/stytch';
import { SupabaseSetupResult } from '@/scripts/supabase';

const vercel = axios.create({
  baseURL: 'https://api.vercel.com',
});

type VercelTeam = {
  id: string;
  name: string;
  slug: string;
};

type VercelProject = {
  id: string;
  name: string;
};

async function listVercelTeams(): Promise<VercelTeam[]> {
  const teams = await vercel.get('/v2/teams');
  return teams.data.teams;
}

async function createVercelTeam(slug: string, name: string): Promise<VercelTeam> {
  const team = await vercel.post('/v1/teams', {
    name: name,
    slug: slug,
  });
  return {
    id: team.data.id,
    name: name,
    slug: slug,
  };
}

async function listVercelProjects(teamId: string): Promise<VercelProject[]> {
  const projects = await vercel.get(`/v10/projects?teamId=${teamId}`);
  return projects.data.projects;
}

async function createVercelProject(teamId: string, name: string): Promise<VercelProject> {
  const project = await vercel.post(`/v11/projects?teamId=${teamId}`, {
    name: name,
    framework: 'nextjs',
    buildCommand: 'npm run build',
    installCommand: 'npm install',
  });
  return {
    id: project.data.id,
    name: name,
  };
}

async function setVercelEnvironmentVariable(
  projectId: string,
  teamId: string,
  name: string,
  value: string,
  type: 'plain' | 'encrypted' | 'sensitive',
) {
  await vercel.post(`/v10/projects/${projectId}/env?teamId=${teamId}&upsert=true`, {
    key: name,
    value: value,
    type: type,
    target: ['production'],
  });
}

async function getVercelProjectDomain(projectId: string, teamId: string): Promise<string> {
  const project = await vercel.get(`/v9/projects/${projectId}/domains?teamId=${teamId}&production=true&limit=1`);
  return project.data.domains[0].name;
}

async function performVercelSetup(supabaseResult: SupabaseSetupResult, stytchResult: StytchSetupResult) {
  console.log(`Starting Vercel setup...`);
  console.log(`This script will create a new project for you and add the necessary environment variables to it.`);

  console.log(
    '\nFirst, create a Vercel account and generate a personal access token (https://vercel.com/account/settings/tokens).',
  );
  console.log(
    'You can scope your token to the team you want to create a project in, or to your entire account if you want to create a team.',
  );
  const personalAccessToken = await inquirer.prompt<{ token: string }>([
    {
      type: 'password',
      name: 'token',
      mask: '*',
      message: 'Enter your personal access token',
    },
  ]);

  vercel.defaults.headers.common['Authorization'] = `Bearer ${personalAccessToken.token}`;

  console.log(`\nNext, select or create a team to contain your project.`);

  const teams = await listVercelTeams();
  let selectedTeamName: string = 'Create new team';
  if (teams.length > 0) {
    selectedTeamName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'list',
          name: 'name',
          message: 'Select a team',
          choices: [...teams.map((team) => team.name), 'Create new team'],
        },
      ])
      .then((answer) => answer.name);
  }

  let selectedTeam: VercelTeam;
  if (selectedTeamName === 'Create new team') {
    const newTeamName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'Enter a name for your new team',
        },
      ])
      .then((answer) => answer.name);

    selectedTeam = await createVercelTeam(newTeamName, newTeamName);
  } else {
    selectedTeam =
      teams.find((team) => team.name === selectedTeamName) ||
      (await createVercelTeam(selectedTeamName, selectedTeamName));
  }

  console.log(`\nNext, select or create a project to contain your app.`);

  const projects = await listVercelProjects(selectedTeam.id);
  let selectedProjectName: string = 'Create new project';
  if (projects.length > 0) {
    selectedProjectName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'list',
          name: 'name',
          message: 'Select a project',
          choices: [...projects.map((project) => project.name), 'Create new project'],
        },
      ])
      .then((answer) => answer.name);
  }

  let selectedProject: VercelProject | null = null;
  if (selectedProjectName === 'Create new project') {
    const newProjectName = await inquirer
      .prompt<{ name: string }>([
        {
          type: 'input',
          name: 'name',
          message: 'Enter a name for your new project',
          default: 'stytch-mcp-blog',
        },
      ])
      .then((answer) => answer.name);

    selectedProject = await createVercelProject(selectedTeam.id, newProjectName);
  } else {
    selectedProject = projects.find((project) => project.name === selectedProjectName)!;
  }

  console.log(`\nNext, let's set up your project's environment variables.`);

  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'NEXT_PUBLIC_SUPABASE_URL',
    supabaseResult.supabaseUrl,
    'plain',
  );
  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    supabaseResult.supabasePublishableKey,
    'encrypted',
  );
  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'SUPABASE_SECRET_KEY',
    supabaseResult.supabaseSecretKey,
    'sensitive',
  );
  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'STYTCH_PROJECT_ID',
    stytchResult.projectId,
    'plain',
  );
  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'STYTCH_SECRET',
    stytchResult.projectSecretKey,
    'sensitive',
  );
  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'STYTCH_IDP_DOMAIN',
    stytchResult.projectDomain,
    'plain',
  );
  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN',
    stytchResult.projectPublicToken,
    'encrypted',
  );
  await setVercelEnvironmentVariable(
    selectedProject.id,
    selectedTeam.id,
    'NEXT_PUBLIC_STYTCH_TOKEN_PROFILE',
    stytchResult.trustedTokenProfileId,
    'plain',
  );

  const projectDomain = await getVercelProjectDomain(selectedProject.id, selectedTeam.id);

  console.log(`\nVercel setup complete! You'll need to set up your Stytch project to use the following:`);
  console.log(
    `- Frontend SDK Authorized Domain (https://stytch.com/dashboard/sdk-configuration): https://${projectDomain}`,
  );
  console.log(
    `- Connected Apps Authorization URL (https://stytch.com/dashboard/connected-apps): https://${projectDomain}/oauth/authorize`,
  );

  console.log(`\nOnce you've done that, you can use the Vercel CLI to deploy your app.`);
  console.log(`$ npx vercel login`);
  console.log(`$ npx vercel link --project ${selectedProject.name} --yes`);
  console.log(`$ npx vercel deploy --prod --yes`);

  console.log(
    `\nYou can also use the Vercel dashboard to deploy your app (e.g. by connecting to a GitHub repository).`,
  );
  console.log(`https://vercel.com/${selectedTeam.slug}/${selectedProject.name}`);
}

export default performVercelSetup;
