import { Request, Response } from "express";
import {
  SessionsAuthenticateResponse,
  SessionsRevokeResponse
} from "stytch";
import { clearSession, getSessionCookie } from "../utils/cookies.js";
import { StytchClient } from "../utils/stytchClient.js";
import { ResponseBody } from "../utils/response.js";
import { codeSnippets } from "../utils/snippets.js";

/**
 * Wraps Stytch's SessionAuthenticate endpoint and returns information about the
 * requester's current session, as determined by the presence of session cookies
 * in the request headers.
 */
export async function getCurrentSession(req: Request, res: Response) {
  const sessionToken = getSessionCookie(req);
  if (!sessionToken) {
    res.status(400).send("No session token found");
    return;
  }

  const resp = await StytchClient.sessions.authenticate({
    session_token: sessionToken,
  });

  res.json(({
    method: codeSnippets.Sessions.Authenticate.method,
    codeSnippet: codeSnippets.Sessions.Authenticate.snippet,
    stytchResponse: resp,
  } as ResponseBody<SessionsAuthenticateResponse>));
  return;
}

/**
 * Revokes any active sessions on the request and clears the requester's session
 * cookie cache.
 */
export async function logout(req: Request, res: Response) {
  const sessionToken = getSessionCookie(req);
  if (!sessionToken) {
    res.status(400).send("No session token found");
    return;
  }

  const resp = await StytchClient.sessions.revoke({
    session_token: sessionToken,
  });

  res = clearSession(res);

  res.json(({
    method: codeSnippets.Sessions.Revoke.method,
    codeSnippet: codeSnippets.Sessions.Revoke.snippet,
    stytchResponse: resp,
  } as ResponseBody<SessionsRevokeResponse>));
}
