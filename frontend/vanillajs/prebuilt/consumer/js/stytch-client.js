// Import config and Stytch SDK
import { STYTCH_PUBLIC_TOKEN } from "./env.js";
const { StytchUI, createStytchClient } = stytch;

if (
  !STYTCH_PUBLIC_TOKEN ||
  STYTCH_PUBLIC_TOKEN === "your-project-public-token-here"
) {
  console.error(
    "Please update the STYTCH_PUBLIC_TOKEN in your .env file with your actual Stytch project token",
  );
}

// Define the custom element for Stytch UI
customElements.define("stytch-ui", StytchUI);

// Export stytch so that the other scripts in this application can interact with it.
export const stytchClient = createStytchClient(STYTCH_PUBLIC_TOKEN);

// Session management utilities
export const getCurrentSession = () => stytchClient.session.getSync();
export const getCurrentUser = () => stytchClient.user.getSync();
