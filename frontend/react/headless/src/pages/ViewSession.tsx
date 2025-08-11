import {
  B2BSessionCard,
  B2BSessionTextBox,
  LoadingSpinner,
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
  const [sessionToken, setSessionToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (member) {
      const tokens = stytch.session.getTokens();
      setSessionToken(tokens.session_token);
    }
  }, [member]);

  if (!isMemberInitialized || !isOrganizationInitialized || !sessionToken) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-row items-center gap-8 p-16">
      <div className="flex-1">
        <B2BSessionTextBox links={SESSION_LINKS} />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <B2BSessionCard
          email={member?.email_address}
          memberId={member?.member_id}
          organizationName={organization?.organization_name}
          sessionToken={sessionToken}
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
