import { Request, Response } from "express";
import { MagicLinksEmailSendResponse } from "stytch";
import { StytchSessionKey } from "../utils/cookies.js";
import { ResponseBody } from "../utils/response.js";
import { StytchClient } from "../utils/stytchClient.js";
import { codeSnippets } from "../utils/snippets.js";

type SendRequest = {
  email_address: string;
};

/**
 * SendEmail wraps Stytch's Email Magic Links Send endpoint and sends an email to the specified
 * email address that can be used to log in or create an account.
 */
export async function sendEmail(req: Request, res: Response) {
  const inviteReq: SendRequest = req.body;

  const resp = await StytchClient.magicLinks.email.send({
    email: inviteReq.email_address,
  });

  res.json({
    method: codeSnippets.MagicLinks.Send.method,
    codeSnippet: codeSnippets.MagicLinks.Send.snippet,
    stytchResponse: resp,
  } as ResponseBody<MagicLinksEmailSendResponse>);
}

/**
 * Authenticate is the final step in Email Magic Links flows where the Magic Links token
 * (retrieved when the user clicks the link in the email they received) can be exchanged
 * for a full session.
 */
export async function authenticate(req: Request, res: Response) {
  // Retrieve the token from the query parameter.
  const token = req.query.token;
  if (!token || typeof token !== "string") {
    res.status(400).send("No token provided");
    return;
  }

  const resp = await StytchClient.magicLinks.authenticate({
    token,
    session_duration_minutes: 60,
  });

  // Store the session token in a cookie
  res.cookie(StytchSessionKey, resp.session_token);

  console.log("Authenticate successful, redirecting...");
  res.redirect(303, "http://localhost:3001/view-session");
}
