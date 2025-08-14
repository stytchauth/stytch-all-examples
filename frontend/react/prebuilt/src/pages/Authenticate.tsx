import { OrgsTextBox, SplitPage } from "@stytch-all-examples/internal";
import { useStytchMemberSession } from "@stytch/react/b2b";
import { useEffect } from "react";
import { LoginOrSignup } from "../components/LoginOrSignup";

export function Authenticate() {
  const { session } = useStytchMemberSession();

  useEffect(() => {
    if (session) {
      window.location.href = "/view-session";
    }
  }, [session?.member_session_id]);

  return <SplitPage leftSide={<OrgsTextBox />} rightSide={<LoginOrSignup />} />;
}
