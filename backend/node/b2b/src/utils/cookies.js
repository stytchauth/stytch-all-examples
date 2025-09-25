const stytchSessionKey = "stytch_session_key";
const stytchIntermediateSessionKey = "stytch_intermediate_session_key";
export function getCookies(req) {
    return {
        sessionCookie: req.cookies[stytchSessionKey],
        intermediateSessionCookie: req.cookies[stytchIntermediateSessionKey],
    };
}
export function setSessionCookie(res, token) {
    return res.cookie(stytchSessionKey, token);
}
export function setIntermediateSessionCookie(res, token) {
    return res.cookie(stytchIntermediateSessionKey, token);
}
export function clearSession(res) {
    return res.clearCookie(stytchSessionKey);
}
export function clearIntermediateSession(res) {
    return res.clearCookie(stytchIntermediateSessionKey);
}
