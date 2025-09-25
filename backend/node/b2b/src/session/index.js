import { clearIntermediateSession, clearSession, getCookies, setSessionCookie } from "../utils/cookies.js";
import { StytchClient } from "../utils/stytchClient.js";
import { codeSnippets } from "../utils/snippets.js";
/**
 * Exchanges an intermediate session token for a full session in the specified Stytch
 * Organization. If the incoming request already has a full session attached, it
 * attempts to perform a full session exchange and return a new session in the specified
 * Organization.
 */
export async function exchange(req, res) {
    const reqBody = req.body;
    const cookieJar = getCookies(req);
    if (!cookieJar.intermediateSessionCookie && !cookieJar.sessionCookie) {
        res.status(400).send("No token provided");
        return;
    }
    if (cookieJar.intermediateSessionCookie) {
        const resp = await StytchClient.discovery.intermediateSessions.exchange({
            organization_id: reqBody.organizationId,
            intermediate_session_token: cookieJar.intermediateSessionCookie,
        });
        res = setSessionCookie(res, resp.session_token);
        res = clearIntermediateSession(res);
        res.json({
            method: codeSnippets.Sessions.IntermediateSessionExchange.method,
            codeSnippet: codeSnippets.Sessions.IntermediateSessionExchange.snippet,
            stytchResponse: resp,
        });
        return;
    }
    if (cookieJar.sessionCookie) {
        const resp = await StytchClient.sessions.exchange({
            organization_id: reqBody.organizationId,
            session_token: cookieJar.sessionCookie,
        });
        res = setSessionCookie(res, resp.session_token);
        res.json({
            method: codeSnippets.Sessions.SessionExchange.method,
            codeSnippet: codeSnippets.Sessions.SessionExchange.snippet,
            stytchResponse: resp,
        });
        return;
    }
}
/**
 * Wraps Stytch's SessionAuthenticate endpoint and returns information about the
 * requester's current session, as determined by the presence of session cookies
 * in the request headers.
 */
export async function getCurrentSession(req, res) {
    const cookieJar = getCookies(req);
    if (!cookieJar.sessionCookie) {
        res.status(400).send("No session token found");
        return;
    }
    const resp = await StytchClient.sessions.authenticate({
        session_token: cookieJar.sessionCookie,
    });
    res.json({
        method: codeSnippets.Sessions.Authenticate.method,
        codeSnippet: codeSnippets.Sessions.Authenticate.snippet,
        stytchResponse: resp,
    });
    return;
}
/**
 * Revokes any active sessions on the request and clears the requester's session
 * cookie cache.
 */
export async function logout(req, res) {
    const cookieJar = getCookies(req);
    if (!cookieJar.sessionCookie) {
        res.status(400).send("No session token found");
        return;
    }
    const resp = await StytchClient.sessions.revoke({
        session_token: cookieJar.sessionCookie,
    });
    res = clearSession(res);
    res = clearIntermediateSession(res);
    res.json({
        method: codeSnippets.Sessions.Revoke.method,
        codeSnippet: codeSnippets.Sessions.Revoke.snippet,
        stytchResponse: resp,
    });
}
