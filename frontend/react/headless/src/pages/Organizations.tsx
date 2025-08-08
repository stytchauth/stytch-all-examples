import {
  LoadingSpinner,
  OrgDiscoveryCard,
  OrgsTextBox,
  TextBox,
  Typography,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/react/b2b";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Organizations() {
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    setLoading(true);
    // load all the organizations that the member is part of, or can join
    stytch.discovery.organizations
      .list()
      .then((response) => {
        setOrgs(
          response.discovered_organizations.map((org) => ({
            id: org.organization.organization_id,
            name: org.organization.organization_name,
          }))
        );
        setLoading(false);
      })
      .catch((error) => {
        setError("Unable to load organizations: " + error.message);
        setLoading(false);
      });
  }, []);

  const handleCreateOrg = async (orgName: string) => {
    // Creating an org will automatically create a session for the member in that org
    const response = await stytch.discovery.organizations.create({
      organization_name: orgName,
      sso_jit_provisioning: "ALL_ALLOWED",
      session_duration_minutes: 60,
    });
    if (response.status_code === 200) {
      navigate("/view-session");
    } else {
      setError("Unable to create organization: " + response.status_code);
    }
  };

  const handleOrgSelect = async (orgId: string) => {
    let response: any;
    if (session) {
      // If the member already has a session, exchange it for the new organization
      response = await stytch.session.exchange({
        organization_id: orgId,
        session_duration_minutes: 60,
      });
      if (response.status_code === 200) {
        navigate("/view-session");
      }
    } else {
      // otherwise, use the discovery flow to exchange an intermediate session for a session in that org
      response = await stytch.discovery.intermediateSessions.exchange({
        organization_id: orgId,
        session_duration_minutes: 60,
      });
    }
    if (response.status_code === 200) {
      navigate("/view-session");
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TextBox title="There was an error loading organizations">
          <Typography>{error}</Typography>
        </TextBox>
      </div>
    );
  }

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
        <OrgsTextBox />
      </div>
      <div className="flex-1 flex flex-col items-center p-16">
        <OrgDiscoveryCard
          orgs={orgs}
          onOrgSelect={handleOrgSelect}
          onCreateOrg={handleCreateOrg}
        />
      </div>
    </div>
  );
}
