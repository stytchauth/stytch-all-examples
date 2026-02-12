// Import config and Stytch SDK
import { STYTCH_PUBLIC_TOKEN } from "./env.js";
const { createStytchClient } = stytch;

if (
  !STYTCH_PUBLIC_TOKEN ||
  STYTCH_PUBLIC_TOKEN === "your-project-public-token-here"
) {
  console.error(
    "Please update the STYTCH_PUBLIC_TOKEN in your .env file with your actual Stytch project token",
  );
}

// Export stytch so that the other scripts in this application can interact with it.
export const stytchClient = createStytchClient(STYTCH_PUBLIC_TOKEN);

// Session management utilities
export const getCurrentSession = () => stytchClient.session.getSync();
export const getCurrentUser = () => stytchClient.user.getSync();
