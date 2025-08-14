"use client";

import {
  B2BSessionCard,
  B2BSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  Page,
  SessionTokens,
} from "@stytch-all-examples/internal";
import {
  useStytchB2BClient,
  useStytchMember,
  useStytchOrganization,
} from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SESSION_LINKS } from "../utils/constants";

export function ViewSession() {
  const stytch = useStytchB2BClient();
  const { member, isInitialized: isMemberInitialized } = useStytchMember();
  const { organization, isInitialized: isOrganizationInitialized } =
    useStytchOrganization();
  const [sessionTokens, setSessionTokens] = useState<SessionTokens | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (member) {
      const tokens = stytch.session.getTokens();
      setSessionTokens(tokens);
    }
  }, [member]);

  if (!isMemberInitialized || !isOrganizationInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Page
      leftSide={<B2BSessionTextBox links={SESSION_LINKS} />}
      rightSide={
        <B2BSessionCard
          email={member?.email_address ?? ""}
          memberId={member?.member_id ?? ""}
          organizationName={organization?.organization_name ?? ""}
          sessionTokens={
            sessionTokens ?? {
              session_token: "",
              session_jwt: "",
            }
          }
          handleSwitchOrgs={() => {
            router.push("/organizations");
          }}
          handleLogout={() => {
            stytch.session.revoke();
            router.push("/");
          }}
        />
      }
      error={
        !sessionTokens && (
          <ErrorBox
            title="No session tokens found"
            error="Unable to load session tokens from the SDK. Please ensure you are logged in and have a session."
          />
        )
      }
    />
  );
}
