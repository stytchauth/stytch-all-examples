import { Request, Response } from "express";
import { StytchClient } from "../utils/stytchClient.js";
import { StytchSessionKey } from "../utils/cookies.js";

/**
 * Authenticate completes an OAuth flow by exchanging the OAuth token received from the IdP
 * for a full session.
 */
export async function oauthAuthenticate(req: Request, res: Response) {
  // Retrieve the token from the query parameter.
  const token = req.query.token;
  if (!token || typeof token !== "string") {
    res.status(400).send("No token provided");
    return;
  }

  const resp = await StytchClient.oauth.authenticate({
    token,
    session_duration_minutes: 60,
  });

  // Store the session token in a cookie
  res.cookie(StytchSessionKey, resp.session_token);

  // Redirect to the frontend after successful authentication
  console.log("OAuthAuthenticate successful, redirecting...");
  res.redirect(303, "http://localhost:3001/view-session");
}
