import { NextRequest, NextResponse } from "next/server";
import { stytchClient } from "../../../lib/stytch-client";
import {
  INTERMEDIATE_SESSION_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
} from "../../../lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// The authenticate route handles the redirect URL from discovery OAuth or discovery magic link login flows.
// It uses Stytch Node.js SDK methods to authenticate the provided token and sets the intermediate session token in a cookie.
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

  let ist: string | null = null;
  try {
    if (tokenType === "discovery_oauth") {
      const res = await stytchClient.oauth.discovery.authenticate({
        discovery_oauth_token: token,
      });
      ist = res.intermediate_session_token;
    } else if (tokenType === "discovery") {
      const res = await stytchClient.magicLinks.discovery.authenticate({
        discovery_magic_links_token: token,
      });
      ist = res.intermediate_session_token;
    } else {
      return redirect("/login");
    }
  } catch (e) {
    console.error(e);
    return redirect("/login");
  }

  if (!ist) {
    return redirect("/login");
  }

  const response = NextResponse.redirect(new URL("/organizations", req.url));
  response.cookies.set(INTERMEDIATE_SESSION_TOKEN_COOKIE, ist);

  return response;
}
