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
    navigate("/view-session");
  };

  if (creatingOrg) {
    return (
      <SplitPage
        leftSide={<OrgCreateTextBox appType="prebuilt" />}
        rightSide={
          <OrgCreateCard
            onCreateOrg={handleCreateOrg}
            setCreatingOrg={setCreatingOrg}
            appType="prebuilt"
          />
        }
      />
    );
  }

  return (
    <SplitPage
      leftSide={<OrgsTextBox />}
      rightSide={<LoginOrSignup setCreatingOrg={setCreatingOrg} />}
    />
  );
}
