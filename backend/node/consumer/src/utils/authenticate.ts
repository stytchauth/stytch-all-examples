import { NextFunction, Request, Response } from "express";
import { authenticate } from "../magicLinks/index.js";
import { oauthAuthenticate } from "../oauth/index.js";

// Token types are passed as query parameters in the Redirect URL and serve
// to identify which Stytch product and authentication flow the user is completing.
//
// For full list of token types, see: https://stytch.com/docs/workspace-management/redirect-urls.
enum TokenType {
  MagicLinks = "magic_links",
  OAuth = "oauth",
}

/**
 * Universal endpoint for routing different kinds of authentication callbacks to the correct
 * handler. Stytch will include a "stytch_token_type" query parameter in callback requests
 * that indicate which flow initiated the auth flow.
 */
export async function universalAuthenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Retrieve the token type from the query parameter.
  const tokenType = req.query.stytch_token_type;
  if (!tokenType || typeof tokenType !== "string") {
    res.status(400).send("Invalid token type.");
    return;
  }

  // Match the token type to the correct product, or return an
  // error if the token type if for an unsupported authentication
  // flow.
  switch (tokenType) {
    case TokenType.MagicLinks:
      await authenticate(req, res);
      break;
    case TokenType.OAuth:
      await oauthAuthenticate(req, res);
      break;
    default:
      res.status(400).send("Invalid token type.");
  }
  next();
}
