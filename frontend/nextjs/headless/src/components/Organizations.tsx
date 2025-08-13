"use client";

import {
  ErrorBox,
  LoadingSpinner,
  OrgCreateTextBox,
  OrgDiscoveryCard,
  OrgsTextBox,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Organizations = () => {
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const [creatingOrg, setCreatingOrg] = useState(false);

  useEffect(() => {
    const loadOrganizations = async () => {
      setLoading(true);
      try {
        // load all the organizations that the member is part of, or can join
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
    // Creating an org will automatically create a session for the member in that org
    try {
      await stytch.discovery.organizations.create({
        organization_name: orgName,
        sso_jit_provisioning: "ALL_ALLOWED",
        session_duration_minutes: 60,
      });
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
        // If the member already has a session, exchange it for the new organization
        await stytch.session.exchange({
          organization_id: orgId,
          session_duration_minutes: 60,
        });
      } else {
        // otherwise, use the discovery flow to exchange an intermediate session for a session in that org
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
    <div className="flex flex-row items-center p-16 gap-8">
      <div className="flex-1">
        {creatingOrg ? <OrgCreateTextBox /> : <OrgsTextBox />}
      </div>
      <div className="flex-1 flex flex-col items-center p-16">
        {error ? (
          <ErrorBox
            title="There was an error"
            error={error}
            redirectUrl="/login"
            redirectText="Go to login"
          />
        ) : (
          <div className="flex-1">
            <OrgDiscoveryCard
              orgs={orgs}
              onOrgSelect={handleOrgSelect}
              onCreateOrg={handleCreateOrg}
              creatingOrg={creatingOrg}
              setCreatingOrg={setCreatingOrg}
              // create org is part of the discovery flow, so we only show it if the member doesn't have a session
              showCreateOrg={!session}
            />
          </div>
        )}
      </div>
    </div>
  );
};
