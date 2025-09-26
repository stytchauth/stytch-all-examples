import { StytchClient } from "./stytchClient.js";

/**
 * This mapping is for internal use and displays metadata about the method name
 * and code excerpts for invoking it in the demo app's UI.
 *
 * You can ignore this when building your own Stytch integration.
 */
export const codeSnippets = {
  MagicLinks: {
    Send: {
      method: "MagicLinks.Email.Send",
      snippet: `const resp = await StytchClient.magicLinks.email.send({
  email: inviteReq.email_address,
});`,
    },
    Authenticate: {
      method: "MagicLinks.Authenticate",
      snippet: `const resp = await StytchClient.magicLinks.authenticate({
  token,
});`,
    },
  },
  Sessions: {
    Authenticate: {
      method: "Sessions.Authenticate",
      snippet: `const resp = await StytchClient.sessions.authenticate({
  session_token: sessionToken,
});`
    },
    Revoke: {
      method: "Sessions.Revoke",
      snippet: `const resp = await StytchClient.sessions.revoke({
  session_token: sessionToken,
});`
    }
  }
} as const;
