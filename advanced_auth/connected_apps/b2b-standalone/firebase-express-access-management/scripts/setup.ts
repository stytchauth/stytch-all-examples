import dotenv from 'dotenv';
import { existsSync, copyFileSync } from 'fs';
import inquirer from 'inquirer';
import { promptForFirebaseVariables, promptForStytchVariables, writeEnvFile } from '@/scripts/envvars';
import performStytchSetup, { StytchSetupResult } from '@/scripts/stytch';
import performFirebaseSetup, { FirebaseSetupResult } from './firebase';

if (!existsSync('.env.local')) {
  copyFileSync('.env.example', '.env.local');
}
dotenv.config({ path: '.env.local', quiet: true });

async function main() {
  console.log(`=========================================`);
  console.log(`=    FIREBASE AUTH + STYTCH IDP DEMO    =`);
  console.log(`=========================================`);
  console.log(
    `This script will walk you through setting up a demo app that uses Firebase for auth/data storage and Stytch for an OAuth implementation for MCP servers.`,
  );
  console.log(`We'll walk you through the steps to set up a Firebase project, a Stytch project, and a Vercel project.`);
  console.log(`You'll need to have a Firebase account, a Stytch account, and a Vercel account to complete the setup.`);
  console.log(`We'll ask you for the relevant credentials and set up most of the project for you.`);
  console.log(`\n`);
  console.log(`If you're not sure how to do this yourself, just follow the prompts.`);
  console.log(`Let's get started!`);
  console.log(`\n`);

  const all = process.argv.includes('--all');
  const localhost = process.argv.includes('--localhost');
  const firebase = process.argv.includes('--firebase') || all || localhost;
  const stytch = process.argv.includes('--stytch') || all || localhost;
  const vercel = process.argv.includes('--vercel') || all;

  let firebaseResult: FirebaseSetupResult | undefined;
  if (firebase) {
    console.log(`================`);
    console.log(`=== FIREBASE ===`);
    console.log(`================`);
    firebaseResult = await performFirebaseSetup();
  } else {
    firebaseResult = await promptForFirebaseVariables();
  }

  writeEnvFile(firebaseResult);

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
    stytchResult = await performStytchSetup(firebaseResult);
  } else {
    stytchResult = await promptForStytchVariables();
  }

  writeEnvFile(firebaseResult, stytchResult);

  console.log(`\nLocal setup complete. Run "npm run dev" to start the app!`);

  console.log(`\nSetup complete! Once your app is running, your MCP server will be available at /mcp.`);
  console.log(`To test the MCP server, you can use the MCP inspector:`);
  console.log(`$ npx @modelcontextprotocol/inspector@latest`);
}

main();
