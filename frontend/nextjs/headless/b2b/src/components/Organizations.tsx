"use client";

import {
  ErrorBox,
  LoadingSpinner,
  OrgCreateCard,
  OrgCreateTextBox,
  OrgDiscoveryCard,
  OrgsTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// The Organizations page provides a list of organizations that the member
// is eligible to authenticate into.
// It uses Stytch SDK methods to list organizations and exchange sessions.
export const Organizations = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const [creatingOrg, setCreatingOrg] = useState(false);

  // useStytchB2BClient returns the Stytch B2B client
  const stytch = useStytchB2BClient();

  // useStytchMemberSession returns the current Stytch session
  const { session } = useStytchMemberSession();

  useEffect(() => {
    const loadOrganizations = async () => {
      setLoading(true);
      try {
        // Stytch SDK method to list organizations that the member is eligible to authenticate into
        const response = await stytch.discovery.organizations.list();
        setOrgs(
          response.discovered_organizations.map((org) => ({
            id: org.organization.organization_id,
            name: org.organization.organization_name,
          }))
        );
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

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
      if (session) {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageWithContent
      content={
        creatingOrg ? (
          <OrgCreateTextBox appType="headless" />
        ) : (
          <OrgsTextBox
            hasSession={!!session}
            appType="headless"
            hasOrgs={!!orgs.length}
          />
        )
      }
      error={error && <ErrorBox title="There was an error" error={error} />}
    >
      {creatingOrg ? (
        <OrgCreateCard onCreateOrg={handleCreateOrg} appType="headless" />
      ) : (
        <OrgDiscoveryCard
          orgs={orgs}
          onOrgSelect={handleOrgSelect}
          onClickCreateOrg={() => setCreatingOrg(true)}
          // create org is part of the discovery flow, so we only show it if the member doesn't have a session
          showCreateOrg={!session}
        />
      )}
    </PageWithContent>
  );
};
