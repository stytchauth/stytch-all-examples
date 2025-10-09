import dotenv from 'dotenv';
import { existsSync, copyFileSync } from 'fs';
import inquirer from 'inquirer';
import { promptForSupabaseVariables, promptForStytchVariables, writeEnvFile } from '@/scripts/envvars';
import performStytchSetup, { StytchSetupResult } from '@/scripts/stytch';
import performSupabaseSetup, { SupabaseSetupResult } from '@/scripts/supabase';
import performVercelSetup from '@/scripts/vercel';

if (!existsSync('.env.local')) {
  copyFileSync('.env.example', '.env.local');
}
dotenv.config({ path: '.env.local', quiet: true });

async function main() {
  console.log(`=========================================`);
  console.log(`=    SUPABASE AUTH + STYTCH IDP DEMO    =`);
  console.log(`=========================================`);
  console.log(
    `This script will walk you through setting up a demo app that uses Supabase for auth/data storage and Stytch for an OAuth implementation for MCP servers.`,
  );
  console.log(`We'll walk you through the steps to set up a Supabase project, a Stytch project, and a Vercel project.`);
  console.log(`You'll need to have a Supabase account, a Stytch account, and a Vercel account to complete the setup.`);
  console.log(`We'll ask you for the relevant credentials and set up most of the project for you.`);
  console.log(`\n`);
  console.log(`If you're not sure how to do this yourself, just follow the prompts.`);
  console.log(`Let's get started!`);
  console.log(`\n`);

  const all = process.argv.includes('--all');
  const localhost = process.argv.includes('--localhost');
  const supabase = process.argv.includes('--supabase') || all || localhost;
  const stytch = process.argv.includes('--stytch') || all || localhost;
  const vercel = process.argv.includes('--vercel') || all;

  let supabaseResult: SupabaseSetupResult | undefined;
  if (supabase) {
    console.log(`================`);
    console.log(`=== SUPABASE ===`);
    console.log(`================`);
    supabaseResult = await performSupabaseSetup();
  } else {
    supabaseResult = await promptForSupabaseVariables();
  }

  writeEnvFile(supabaseResult);

  let stytchResult: StytchSetupResult | undefined;
  if (stytch) {
    if (all || localhost) {
      const continueAnswer = await inquirer
        .prompt<{ continue: boolean }>([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Continue with Stytch setup?',
          },
        ])
        .then((answer) => answer.continue);
      if (!continueAnswer) {
        console.log(`Exiting...`);
        process.exit(0);
      }
    }
    console.log(`================`);
    console.log(`===  STYTCH  ===`);
    console.log(`================`);
    stytchResult = await performStytchSetup(supabaseResult);
  } else {
    stytchResult = await promptForStytchVariables();
  }

  writeEnvFile(supabaseResult, stytchResult);

  if (localhost) {
    console.log(`\nLocal setup complete. Run "npm run dev" to start the app!`);
    console.log(`When you're ready to deploy to Vercel, run "npm run setup:vercel".`);
  }

  if (vercel) {
    if (all) {
      const continueAnswer = await inquirer
        .prompt<{ continue: boolean }>([
          {
            type: 'confirm',
            name: 'continue',
            message: 'Continue with Vercel setup?',
          },
        ])
        .then((answer) => answer.continue);
      if (!continueAnswer) {
        console.log(`Exiting...`);
        process.exit(0);
      }
    }
    console.log(`================`);
    console.log(`===  VERCEL  ===`);
    console.log(`================`);
    await performVercelSetup(supabaseResult, stytchResult);
  }

  console.log(`\nSetup complete! Once your app is running, your MCP server will be available at /mcp.`);
  console.log(`To test the MCP server, you can use the MCP inspector:`);
  console.log(`$ npx @modelcontextprotocol/inspector@latest`);
}

main();
