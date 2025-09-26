import * as stytch from "stytch";

/**
 * Load Stytch SDK’s Consumer client.
 *
 * @see https://github.com/stytchauth/stytch-node?tab=readme-ov-file#example-b2c-usage
 */
export let StytchClient: stytch.Client;

export function loadStytchClient() {
  const projectID = process.env.PROJECT_ID;
  const projectSecret = process.env.PROJECT_SECRET;
  if (!projectID || !projectSecret) {
    throw new Error("Unable to parse project ID or secret - ensure you have populated them in a .env file.");
  }
  StytchClient = new stytch.Client({
    project_id: projectID,
    secret: projectSecret,
  });
}
