import { ViewSession } from "@/components/ViewSession";
import { cookies } from "next/headers";
import { SESSION_TOKEN_COOKIE } from "../../../lib/constants";
import { redirect } from "next/navigation";
import { stytchClient } from "../../../lib/stytch-client";

// The ViewSessionPage component is a server component that fetches the session tokens using the Node.js SDK,
// and renders the ViewSession component.
export default async function ViewSessionPage() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get(SESSION_TOKEN_COOKIE);

  if (!sessionToken) {
    redirect("/login");
  }

  try {
    const response = await stytchClient.sessions.authenticate({
      session_token: sessionToken.value,
    });

    return (
      <ViewSession
        user={response.user}
        sessionToken={response.session_token}
        sessionJwt={response.session_jwt}
      />
    );
  } catch (error) {
    console.error("Error loading session:", error);
    return (
      <ViewSession
        user={null}
        sessionToken={null}
        sessionJwt={null}
        initialError="Error loading session"
      />
    );
  }
}
