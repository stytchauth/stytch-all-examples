import {
  B2BSessionCard,
  B2BSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
} from "@stytch-all-examples/internal";
import {
  useStytchB2BClient,
  useStytchMember,
  useStytchOrganization,
} from "@stytch/react/b2b";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SESSION_LINKS } from "../utils/constants";

export function ViewSession() {
  const stytch = useStytchB2BClient();
  const { member, isInitialized: isMemberInitialized } = useStytchMember();
  const { organization, isInitialized: isOrganizationInitialized } =
    useStytchOrganization();
  const [sessionTokens, setSessionTokens] = useState<SessionTokens | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (member) {
      const tokens = stytch.session.getTokens();
      setSessionTokens(tokens);
    }
  }, [member]);

  if (!isMemberInitialized || !isOrganizationInitialized) {
    return <LoadingSpinner />;
  }

  if (!sessionTokens) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorBox
          title="No session tokens found"
          error="Unable to load session tokens from the SDK. Please ensure you are logged in and have a session."
          redirectUrl="/login"
          redirectText="Go to login"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center gap-8 p-16">
      <div className="flex-1">
        <B2BSessionTextBox links={SESSION_LINKS} />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <B2BSessionCard
          email={member.email_address}
          memberId={member.member_id}
          organizationName={organization.organization_name}
          sessionTokens={sessionTokens}
          handleSwitchOrgs={() => {
            navigate("/organizations");
          }}
          handleLogout={() => {
            stytch.session.revoke();
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}
