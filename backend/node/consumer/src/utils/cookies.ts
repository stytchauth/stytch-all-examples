import { Request, Response } from "express";

const stytchSessionKey = "stytch_session_key";

export function getSessionCookie(req: Request): string {
  return req.cookies[stytchSessionKey];
}

export function setSessionCookie(res: Response, token: string): Response {
  return res.cookie(stytchSessionKey, token);
}

export function clearSession(res: Response): Response {
  return res.clearCookie(stytchSessionKey);
}
