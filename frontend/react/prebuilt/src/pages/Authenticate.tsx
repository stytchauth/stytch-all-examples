import { OrgsTextBox } from "@stytch-all-examples/internal";
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

  return (
    <div className="flex flex-row items-center p-16 gap-8">
      <div className="flex-1">
        <OrgsTextBox />
      </div>
      <div className="flex-1 flex flex-col items-center p-16">
        <LoginOrSignup />
      </div>
    </div>
  );
}
