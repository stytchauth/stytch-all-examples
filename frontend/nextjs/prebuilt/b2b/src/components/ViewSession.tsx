"use client";

import {
  B2BSessionCard,
  B2BSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
  PageWithContent,
} from "@stytch-all-examples/internal";
import {
  useStytchB2BClient,
  useStytchMember,
  useStytchMemberSession,
  useStytchOrganization,
} from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ENABLE_OAUTH } from "../config";

export function ViewSession() {
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const { member, isInitialized: isMemberInitialized } = useStytchMember();
  const { organization, isInitialized: isOrganizationInitialized } =
    useStytchOrganization();
  const [sessionTokens, setSessionTokens] = useState<SessionTokens | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (member) {
      const tokens = stytch.session.getTokens();
      setSessionTokens(tokens);
    }
  }, [member]);

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  if (!isMemberInitialized || !isOrganizationInitialized) {
    return <LoadingSpinner />;
  }

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
          appType="prebuilt"
          framework="nextjs"
          oauthEnabled={ENABLE_OAUTH}
        />
      }
    >
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
        handleLogout={handleLogout}
        appType="prebuilt"
      />
      {(!sessionTokens && (
        <ErrorBox
          title="No session tokens found"
          error="Unable to load session tokens from the SDK. Please ensure you are logged in and have a session."
        />
      )) ||
        (error && <ErrorBox title="There was an error" error={error} />)}
    </PageWithContent>
  );
}
