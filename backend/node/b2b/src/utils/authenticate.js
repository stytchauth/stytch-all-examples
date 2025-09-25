import { authenticate, discoveryAuthenticate } from "../magicLinks/index.js";
import { discoveryOAuthAuthenticate } from "../oauth/index.js";
// Token types are passed as query parameters in the Redirect URL and serve
// to identify which Stytch product and authentication flow the user is completing.
//
// For full list of token types, see: https://stytch.com/docs/workspace-management/redirect-urls.
var TokenType;
(function (TokenType) {
    TokenType["MagicLinks"] = "multi_tenant_magic_links";
    TokenType["Discovery"] = "discovery";
    TokenType["DiscoveryOAuth"] = "discovery_oauth";
})(TokenType || (TokenType = {}));
export async function universalAuthenticate(req, res, next) {
    // Retrieve the token type from the query parameter.
    const tokenType = req.query.stytch_token_type;
    if (!tokenType || typeof tokenType !== "string") {
        res.status(400).send("Invalid token type.");
        return;
    }
    console.log(`Found token type: ${tokenType}`);
    // Match the token type to the correct product, or return an
    // error if the token type if for an unsupported authentication
    // flow.
    switch (tokenType) {
        case TokenType.MagicLinks:
            await authenticate(req, res);
            return;
        case TokenType.Discovery:
            await discoveryAuthenticate(req, res, next);
            return;
        case TokenType.DiscoveryOAuth:
            await discoveryOAuthAuthenticate(req, res);
            return;
        default:
            res.status(400).send("Invalid token type.");
    }
}
