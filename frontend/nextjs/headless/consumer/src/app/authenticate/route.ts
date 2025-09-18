import { NextRequest, NextResponse } from "next/server";
import { stytchClient } from "../../../lib/stytch-client";
import { SESSION_TOKEN_COOKIE } from "../../../lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// The authenticate route handles the redirect URL from OAuth or magic link login flows.
// It uses Stytch Node.js SDK methods to authenticate the provided token and sets the session token in a cookie.
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_TOKEN_COOKIE);

  if (sessionToken) {
    return redirect("/view-session");
  }

  const params = req.nextUrl.searchParams;
  const token = params.get("token");
  const tokenType = params.get("stytch_token_type");

  if (!token || !tokenType) {
    return redirect("/login");
  }

  let sessionTokenResult: string | null = null;
  try {
    if (tokenType === "oauth") {
      const res = await stytchClient.oauth.authenticate({
        token: token,
        session_duration_minutes: 60,
      });
      sessionTokenResult = res.session_token;
    } else if (tokenType === "magic_links") {
      const res = await stytchClient.magicLinks.authenticate({
        token: token,
        session_duration_minutes: 60,
      });
      sessionTokenResult = res.session_token;
    } else {
      return redirect("/login");
    }
  } catch (e) {
    console.error("Authentication error:", e);
    return redirect("/login");
  }

  if (!sessionTokenResult) {
    return redirect("/login");
  }

  const response = NextResponse.redirect(new URL("/view-session", req.url));
  response.cookies.set(SESSION_TOKEN_COOKIE, sessionTokenResult);

  return response;
}
