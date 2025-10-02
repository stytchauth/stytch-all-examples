import { Request, Response } from "express";
import {
  B2BDiscoveryIntermediateSessionsExchangeResponse,
  B2BSessionsAuthenticateResponse,
  B2BSessionsExchangeResponse, B2BSessionsRevokeResponse
} from "stytch";
import { StytchClient } from "../utils/stytchClient.js";
import { ResponseBody } from "../utils/response.js";
import { codeSnippets } from "../utils/snippets.js";
import { parseTokensFromCookies, StytchIntermediateSessionKey, StytchSessionKey } from "../utils/cookies.js";

type ExchangeRequest = {
  organizationId: string;
};

/**
 * Exchanges an intermediate session token for a full session in the specified Stytch
 * Organization. If the incoming request already has a full session attached, it
 * attempts to perform a full session exchange and return a new session in the specified
 * Organization.
 */
export async function exchange(req: Request, res: Response) {
  const reqBody = req.body as ExchangeRequest;

  const { sessionToken, intermediateSessionToken } = parseTokensFromCookies(req);
  if (!sessionToken && !intermediateSessionToken) {
    res.status(400).send("No token provided");
    return;
  }

  if (intermediateSessionToken) {
    console.log("Exchanging intermediate session...");

    const resp = await StytchClient.discovery.intermediateSessions.exchange({
      organization_id: reqBody.organizationId,
      intermediate_session_token: intermediateSessionToken,
    });

    res.cookie(StytchSessionKey, resp.session_token);
    res.clearCookie(StytchSessionKey);
    res.json({
      method: codeSnippets.Sessions.IntermediateSessionExchange.method,
      codeSnippet: codeSnippets.Sessions.IntermediateSessionExchange.snippet,
      stytchResponse: resp,
    } as ResponseBody<B2BDiscoveryIntermediateSessionsExchangeResponse>);
    return;
  }

  if (sessionToken) {
    console.log("Exchanging full session...");

    const resp = await StytchClient.sessions.exchange({
      organization_id: reqBody.organizationId,
      session_token: sessionToken,
    });

    res.cookie(StytchSessionKey, resp.session_token);
    res.json(({
      method: codeSnippets.Sessions.SessionExchange.method,
      codeSnippet: codeSnippets.Sessions.SessionExchange.snippet,
      stytchResponse: resp,
    } as ResponseBody<B2BSessionsExchangeResponse>));
    return;
  }
}

/**
 * Wraps Stytch's SessionAuthenticate endpoint and returns information about the
 * requester's current session, as determined by the presence of session cookies
 * in the request headers.
 */
export async function getCurrentSession(req: Request, res: Response) {
  const { sessionToken } = parseTokensFromCookies(req);
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
  } as ResponseBody<B2BSessionsAuthenticateResponse>));
  return;
}

/**
 * Revokes any active sessions on the request and clears the requester's session
 * cookie cache.
 */
export async function logout(req: Request, res: Response) {
  const { sessionToken } = parseTokensFromCookies(req);
  if (!sessionToken) {
    res.status(400).send("No session token found");
    return;
  }

  const resp = await StytchClient.sessions.revoke({
    session_token: sessionToken,
  });

  // Clear all session token cookies.
  res.clearCookie(StytchSessionKey);
  res.clearCookie(StytchIntermediateSessionKey);

  res.json(({
    method: codeSnippets.Sessions.Revoke.method,
    codeSnippet: codeSnippets.Sessions.Revoke.snippet,
    stytchResponse: resp,
  } as ResponseBody<B2BSessionsRevokeResponse>));
}
