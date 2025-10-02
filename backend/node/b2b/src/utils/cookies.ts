import { Request } from "express";

/*
  This file wraps Express.js' cookie management API. In this example app, session
  and intermediate session tokens are set as cookies in the client's browser.

  Unlike Stytch's consumer (B2C) vertical, B2B has two different flavors of session
  token that are returned depending on the level of authentication that the end user
  has performed. You can read more about the different kinds of session at:
  https://stytch.com/docs/b2b/guides/sessions/resources/overview.

  Depending on the way in which you implement Stytch, you may want to transmit
  Stytch's session tokens to the client as is done here, or you may wish to
  generate your own, application-specific session tokens or cookies.
 */

type StytchSessionTokens = {
  sessionToken?: string;
  intermediateSessionToken?: string;
}

/*
 * The below constants are arbitrary keys for storing retrieved Stytch session tokens
 * as cookies in the client's browser.
 */
export const StytchSessionKey = "stytch_session_key" as const;
export const StytchIntermediateSessionKey = "stytch_intermediate_session_key" as const;

export function parseTokensFromCookies(req: Request): StytchSessionTokens {
  return {
    sessionToken: req.cookies[StytchSessionKey],
    intermediateSessionToken: req.cookies[StytchIntermediateSessionKey]
  };
}
