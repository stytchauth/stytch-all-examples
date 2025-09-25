import { Request, Response } from "express";

export type CookieJar = {
  sessionCookie?: string;
  intermediateSessionCookie?: string;
}

const stytchSessionKey = "stytch_session_key";
const stytchIntermediateSessionKey = "stytch_intermediate_session_key";

export function getCookies(req: Request): CookieJar {
  return {
    sessionCookie: req.cookies[stytchSessionKey],
    intermediateSessionCookie: req.cookies[stytchIntermediateSessionKey],
  };
}

export function setSessionCookie(res: Response, token: string): Response {
  return res.cookie(stytchSessionKey, token);
}

export function setIntermediateSessionCookie(res: Response, token: string): Response {
  return res.cookie(stytchIntermediateSessionKey, token);
}

export function clearSession(res: Response): Response {
  return res.clearCookie(stytchSessionKey);
}

export function clearIntermediateSession(res: Response): Response {
  return res.clearCookie(stytchIntermediateSessionKey);
}
