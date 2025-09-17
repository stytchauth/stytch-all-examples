// Import config and Stytch SDK
import { STYTCH_PUBLIC_TOKEN } from "./env.js";
import { StytchHeadlessClient } from "https://www.unpkg.com/@stytch/vanilla-js@5.29.1/dist/index.headless.esm.js";

if (
  !STYTCH_PUBLIC_TOKEN ||
  STYTCH_PUBLIC_TOKEN === "your-project-public-token-here"
) {
  console.error(
    "Please update the STYTCH_PUBLIC_TOKEN in your .env file with your actual Stytch project token"
  );
}

// Export stytch so that the other scripts in this application can interact with it.
export const stytch = new StytchHeadlessClient(STYTCH_PUBLIC_TOKEN);

// Session management utilities
export const getCurrentSession = () => stytch.session.getSync();
export const getCurrentUser = () => stytch.user.getSync();
