// Import config and Stytch SDK
import { STYTCH_PUBLIC_TOKEN } from "./env.js";
const { createStytchB2BClient } = stytch;

if (
  !STYTCH_PUBLIC_TOKEN ||
  STYTCH_PUBLIC_TOKEN === "your-project-public-token-here"
) {
  console.error(
    "Please update the STYTCH_PUBLIC_TOKEN in your .env file with your actual Stytch project token",
  );
}

// Export stytch so that the other scripts in this application can interact with it.
export const stytchClient = createStytchB2BClient(STYTCH_PUBLIC_TOKEN);

// Session management utilities
export const getCurrentSession = () => stytchClient.session.getSync();
export const getCurrentMember = () => stytchClient.member.getSync();
export const getCurrentOrganization = () => stytchClient.organization.getSync();
