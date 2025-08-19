import {
  OrgCreateCard,
  OrgCreateTextBox,
  OrgsTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/react/b2b";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginOrSignup } from "../components/LoginOrSignup";

export function Authenticate() {
  const [creatingOrg, setCreatingOrg] = useState(false);
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !creatingOrg) {
      window.location.href = "/view-session";
    }
  }, [session?.member_session_id]);

  const handleCreateOrg = async (orgName: string) => {
    await stytch.organization.update({ organization_name: orgName });
    setCreatingOrg(false);
    navigate("/view-session");
  };

  if (creatingOrg) {
    // If the user creates an organization from the prebuilt UI component, it defaults to name "Stytch"
    // Using the onEvent callback, we can add custom UI when the user clicks Create Organization so they can pick a name
    return (
      <SplitPage
        leftSide={<OrgCreateTextBox appType="prebuilt" />}
        rightSide={
          <OrgCreateCard
            onCreateOrg={handleCreateOrg}
            onCancel={() => setCreatingOrg(false)}
            appType="prebuilt"
          />
        }
      />
    );
  }

  return (
    <SplitPage
      leftSide={<OrgsTextBox />}
      rightSide={<LoginOrSignup onCreateOrg={() => setCreatingOrg(true)} />}
    />
  );
}
