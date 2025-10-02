import { Request } from "express";

/*
  This file wraps Express.js' cookie management API. In this example app, session
  tokens are set as cookies in the client's browser.

  Depending on the way in which you implement Stytch, you may want to transmit
  Stytch's session tokens to the client as is done here, or you may wish to
  generate your own, application-specific session tokens or cookies.
 */

/*
 * The below constant is an arbitrary key for storing retrieved Stytch session tokens
 * as cookies in the client's browser.
 */
export const StytchSessionKey = "stytch_session_key" as const;

export function parseTokenFromCookie(req: Request): string | undefined {
  return req.cookies[StytchSessionKey];
}
