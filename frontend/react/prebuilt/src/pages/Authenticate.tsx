import {
  OrgCreateCard,
  OrgCreateTextBox,
  OrgsTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useStytchMemberSession } from "@stytch/react/b2b";
import { useEffect, useState } from "react";
import { LoginOrSignup } from "../components/LoginOrSignup";

export function Authenticate() {
  const [creatingOrg, setCreatingOrg] = useState(false);
  const { session } = useStytchMemberSession();

  useEffect(() => {
    if (session) {
      window.location.href = "/view-session";
    }
  }, [session?.member_session_id]);

  const handleCreateOrg = async (orgName: string) => {
    console.log("Creating org", orgName);
  };

  if (creatingOrg) {
    return (
      <SplitPage
        leftSide={<OrgCreateTextBox type="prebuilt" />}
        rightSide={
          <OrgCreateCard
            onCreateOrg={handleCreateOrg}
            setCreatingOrg={setCreatingOrg}
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
