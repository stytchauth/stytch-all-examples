// Import config and Stytch SDK
import { STYTCH_PUBLIC_TOKEN } from "./env.js";
import { StytchB2BHeadlessClient } from "https://www.unpkg.com/@stytch/vanilla-js@5.29.1/dist/b2b/index.headless.esm.js";

if (
  !STYTCH_PUBLIC_TOKEN ||
  STYTCH_PUBLIC_TOKEN === "your-project-public-token-here"
) {
  console.error(
    "Please update the STYTCH_PUBLIC_TOKEN in your .env file with your actual Stytch project token"
  );
}

// Export stytch so that the other scripts in this application can interact with it.
export const stytch = new StytchB2BHeadlessClient(STYTCH_PUBLIC_TOKEN);

// Session management utilities
export const getCurrentSession = () => stytch.session.getSync();
export const getCurrentMember = () => stytch.member.getSync();
export const getCurrentOrganization = () => stytch.organization.getSync();
