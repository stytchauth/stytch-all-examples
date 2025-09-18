"use client";

import {
  ErrorBox,
  OrgCreateCard,
  OrgCreateTextBox,
  OrgDiscoveryCard,
  OrgsTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DiscoveredOrganization } from "stytch";

// The Organizations page displays a list of organizations that the member
// is eligible to authenticate into.
// It receives the organizations and hasSession flag from the server and
// uses Stytch Next.js SDK methods to exchange sessions.
export const Organizations = ({
  organizations,
  initialError,
  hasSession,
}: {
  organizations: DiscoveredOrganization[];
  initialError?: string;
  hasSession: boolean;
}) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError ?? null);
  // const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const [creatingOrg, setCreatingOrg] = useState(false);

  // useStytchB2BClient returns the Stytch B2B client
  const stytch = useStytchB2BClient();

  const handleCreateOrg = async (orgName: string) => {
    try {
      // Stytch SDK method to create a new organization
      // Creating an org will automatically create a session for the member in that org
      await stytch.discovery.organizations.create({
        organization_name: orgName,
        sso_jit_provisioning: "ALL_ALLOWED",
        session_duration_minutes: 60,
      });
      setCreatingOrg(false);
      // if the create is successful, navigate to the session page
      router.push("/view-session");
    } catch (error: any) {
      // if the create is not successful, set the error
      setError(error.message);
    }
  };

  const handleOrgSelect = async (orgId: string) => {
    try {
      if (hasSession) {
        // Stytch SDK method to exchange an existing session for a new organization
        await stytch.session.exchange({
          organization_id: orgId,
          session_duration_minutes: 60,
        });
      } else {
        // Stytch SDK method to exchange an intermediate session for a session
        await stytch.discovery.intermediateSessions.exchange({
          organization_id: orgId,
          session_duration_minutes: 60,
        });
      }
      // if the exchange is successful, navigate to the session page
      router.push("/view-session");
    } catch (error: any) {
      // if the exchange is not successful, set the error
      setError(error.message);
    }
  };

  return (
    <PageWithContent
      content={
        creatingOrg ? (
          <OrgCreateTextBox appType="headless" />
        ) : (
          <OrgsTextBox
            hasSession={hasSession}
            appType="headless"
            hasOrgs={!!organizations.length}
          />
        )
      }
      error={error && <ErrorBox title="There was an error" error={error} />}
    >
      {creatingOrg ? (
        <OrgCreateCard onCreateOrg={handleCreateOrg} appType="headless" />
      ) : (
        // TODO: Update this component to receive full orgs
        <OrgDiscoveryCard
          orgs={organizations.map((org) => ({
            id: org.organization?.organization_id ?? "",
            name: org.organization?.organization_name ?? "",
          }))}
          onOrgSelect={handleOrgSelect}
          onClickCreateOrg={() => setCreatingOrg(true)}
          // create org is part of the discovery flow, so we only show it if the member doesn't have a session
          showCreateOrg={!hasSession}
        />
      )}
    </PageWithContent>
  );
};
