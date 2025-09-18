import { Organizations } from "@/components/Organizations";
import { stytchClient } from "../../../lib/stytch-client";
import { cookies } from "next/headers";
import {
  INTERMEDIATE_SESSION_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
} from "../../../lib/constants";
import { redirect } from "next/navigation";
import { B2BDiscoveryOrganizationsListRequest } from "stytch";

// The OrganizationsPage component is a server component that fetches the organizations using the Node.js SDK,
// determines if the member has a full session, and renders the Organizations component.
// Note that the Next.js SDK does provide similar methods, but they must be used in a client component.
export default async function OrganizationsPage() {
  const cookieStore = await cookies();
  const intermediateSessionToken = cookieStore.get(
    INTERMEDIATE_SESSION_TOKEN_COOKIE
  );
  const sessionToken = cookieStore.get(SESSION_TOKEN_COOKIE);

  if (!intermediateSessionToken && !sessionToken) {
    redirect("/login");
  }

  const req: B2BDiscoveryOrganizationsListRequest = intermediateSessionToken
    ? {
        intermediate_session_token: intermediateSessionToken?.value,
      }
    : {
        session_token: sessionToken?.value,
      };

  try {
    const response = await stytchClient.discovery.organizations.list(req);

    return (
      <Organizations
        organizations={response.discovered_organizations}
        hasSession={!!sessionToken}
      />
    );
  } catch (error) {
    console.error("Error loading organizations:", error);
    return (
      <Organizations
        organizations={[]}
        initialError="Error loading organizations"
        hasSession={!!sessionToken}
      />
    );
  }
}
