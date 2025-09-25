import { Request, Response } from "express";
import { StytchClient } from "../utils/stytchClient.js";
import { setIntermediateSessionCookie } from "../utils/cookies.js";

/**
 * DiscoveryOAuthAuthenticate completes a Discovery OAuth flow by exchanging the OAuth
 * token received from the IdP for an intermediate session token.
 * The intermediate session token can be used in subsequent requests to show Organizations
 * that the end user is eligible to authenticate into.
 */
export async function discoveryOAuthAuthenticate(req: Request, res: Response) {
  // Retrieve the token from the query parameter.
  const token = req.query.token;
  if (!token || typeof token !== "string") {
    res.status(400).send("No token provided");
    return;
  }

  const resp = await StytchClient.oauth.discovery.authenticate({
    discovery_oauth_token: token,
  });

  // An intermediate session token will be returned from successful Discovery
  // flows that establishes a session for an end user that is not associated
  // with any organization in particular.
  // This helps prevent account enumeration attacks.
  res = setIntermediateSessionCookie(res, resp.intermediate_session_token);

  res.writeHead(303, { Location: "http://localhost:3001/organizations" });
}
