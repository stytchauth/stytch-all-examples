"use client";

import {
  B2BSessionCard,
  B2BSessionTextBox,
  ErrorBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";
import { Member, Organization } from "stytch";

// The ViewSession page is the landing page for the authenticated user.
// It receives the member, organization, session token, and session JWT from the server and
// uses the Stytch Next.js SDK to handle logout.
export function ViewSession({
  member,
  organization,
  sessionToken,
  sessionJwt,
  initialError,
}: {
  member: Member | null;
  organization: Organization | null;
  sessionToken: string | null;
  sessionJwt: string | null;
  initialError?: string;
}) {
  const stytch = useStytchB2BClient();

  const [error, setError] = useState<string | null>(initialError ?? null);
  const router = useRouter();

  const handleSwitchOrgs = () => {
    router.push("/organizations");
  };

  const handleLogout = async () => {
    try {
      await stytch.session.revoke();
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <PageWithContent
      content={
        <B2BSessionTextBox
          appType="headless"
          framework="nextjs"
          oauthEnabled={ENABLE_OAUTH}
        />
      }
      error={error && <ErrorBox title="There was an error" error={error} />}
    >
      <B2BSessionCard
        email={member?.email_address ?? ""}
        memberId={member?.member_id ?? ""}
        organizationName={organization?.organization_name ?? ""}
        sessionTokens={{
          session_token: sessionToken ?? "",
          session_jwt: sessionJwt ?? "",
        }}
        handleSwitchOrgs={handleSwitchOrgs}
        handleLogout={handleLogout}
        appType="headless"
      />
    </PageWithContent>
  );
}
