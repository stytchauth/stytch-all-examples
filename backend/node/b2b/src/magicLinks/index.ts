import { NextFunction, Request, Response } from "express";
import {
  B2BMagicLinksAuthenticateResponse,
  B2BMagicLinksEmailDiscoverySendResponse,
  B2BMagicLinksEmailInviteResponse, B2BMagicLinksEmailLoginOrSignupResponse
} from "stytch";
import { ResponseBody } from "../utils/response.js";
import { StytchClient } from "../utils/stytchClient.js";
import { setIntermediateSessionCookie, setSessionCookie } from "../utils/cookies.js";
import { codeSnippets } from "../utils/snippets.js";

type InviteRequest = {
  organization_id: string;
  email_address: string;
  name?: string;
};

/**
 * Wraps Stytch's Email Magic Links Invite endpoint and sends an email to the specified
 * email address that can be used to create an account and authenticate into the specified Stytch
 * Organization.
 */
export async function invite(req: Request, res: Response) {
  const inviteReq: InviteRequest = req.body;

  const resp = await StytchClient.magicLinks.email.invite({
    organization_id: inviteReq.organization_id,
    email_address: inviteReq.email_address,
    name: inviteReq.name,
  });

  res.json({
    method: codeSnippets.MagicLinks.Invite.method,
    codeSnippet: codeSnippets.MagicLinks.Invite.snippet,
    stytchResponse: resp,
  } as ResponseBody<B2BMagicLinksEmailInviteResponse>);
}

type LoginOrSignupRequest = {
  organization_id: string;
  email_address: string;
};

export async function loginOrSignup(req: Request, res: Response) {
  const loginSignupReq: LoginOrSignupRequest = req.body;
  const resp = await StytchClient.magicLinks.email.loginOrSignup({
    organization_id: loginSignupReq.organization_id,
    email_address: loginSignupReq.email_address,
  });

  res.json({
    method: codeSnippets.MagicLinks.Invite.method,
    codeSnippet: codeSnippets.MagicLinks.Invite.snippet,
    stytchResponse: resp,
  } as ResponseBody<B2BMagicLinksEmailLoginOrSignupResponse>);
}

type DiscoveryRequest = {
  email_address: string;
};

/**
 * DiscoveryEmailSend uses Email Magic Links to begin a Discovery flow that, when
 * completed, will create an intermediate session for the end user that can be used
 * to surface Organizations the user is eligible to authenticate into.
 */
export async function discoverySend(req: Request, res: Response) {
  const discoveryReq: DiscoveryRequest = req.body;
  const resp = await StytchClient.magicLinks.email.discovery.send({
    email_address: discoveryReq.email_address,
    discovery_redirect_url: "http://localhost:3000/authenticate",
  });

  res.json({
    method: codeSnippets.MagicLinks.DiscoverySend.method,
    codeSnippet: codeSnippets.MagicLinks.DiscoverySend.snippet,
    stytchResponse: resp,
  } as ResponseBody<B2BMagicLinksEmailDiscoverySendResponse>);
}

/**
 * Authenticate is the final step in Email Magic Links flows where the Magic Links token
 * (retrieved when the user clicks the link in the email they received) can be exchanged
 * for either an intermediate or full session, depending on whether the user has satisfied
 * the authentication requirements for the target Organization.
 */
export async function authenticate(req: Request, res: Response) {
  console.log("MLA");

  // Retrieve the token from the query parameter.
  const token = req.query.token;
  if (!token || typeof token !== "string") {
    res.status(400).send("No token provided");
    return;
  }

  const resp = await StytchClient.magicLinks.authenticate({
    magic_links_token: token,
  });
  // A full session OR an intermediate session may be returned, depending on the
  // auth requirements of the organization that the user is attempting to
  // authenticate into.
  if (resp.session_token) {
    res = setSessionCookie(res, resp.session_token);
  }
  if (resp.intermediate_session_token) {
    res = setIntermediateSessionCookie(res, resp.intermediate_session_token);
  }

  res.json({
    method: codeSnippets.MagicLinks.Authenticate.method,
    codeSnippet: codeSnippets.MagicLinks.Authenticate.snippet,
    stytchResponse: resp,
  } as ResponseBody<B2BMagicLinksAuthenticateResponse>);
}

/**
 * DiscoveryAuthenticate is the final step in Discovery Email Magic Links flows where
 * the Magic Links token (retrieved when the user clicks the link in the email they
 * received) can be exchanged for either an intermediate session.
 */
export async function discoveryAuthenticate(req: Request, res: Response) {
  // Retrieve the token from the query parameter.
  const token = req.query.token;
  console.log(`Token: ${token}`);
  if (!token || typeof token !== "string") {
    res.status(400).send("No token provided");
    return;
  }

  const resp = await StytchClient.magicLinks.discovery.authenticate({
    discovery_magic_links_token: token,
  });

  console.log(`Resp: ${JSON.stringify(resp)}`);

  // An intermediate session token will be returned from successful Discovery
  // flows that establishes a session for an end user that is not associated
  // with any organization in particular.
  // This helps prevent account enumeration attacks.
  res = setIntermediateSessionCookie(res, resp.intermediate_session_token);

  // Redirect to the organizations page after successful authentication.
  res.writeHead(303, { Location: "http://localhost:3001/organizations" });
}
