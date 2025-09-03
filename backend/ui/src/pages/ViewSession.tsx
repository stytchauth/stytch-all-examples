import {
  B2BSessionCard,
  B2BSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCurrentSession, logout } from "../api";
import { Member, Organization } from "../types";
import { SESSION_LINKS } from "../utils/constants";
import { useCodeSnippets } from "../contexts/code-snippets";

export function ViewSession() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTokens, setSessionTokens] = useState<SessionTokens>({
    session_token: "",
    session_jwt: "",
  });
  const [member, setMember] = useState<Member | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const navigate = useNavigate();
  const { codeTabs, addResponse } = useCodeSnippets();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getCurrentSession();

        if (response.error) {
          throw response.error;
        }
        addResponse(response);

        setSessionTokens({
          session_token: response.stytchResponse.session_token,
          session_jwt: response.stytchResponse.session_jwt,
        });
        setMember(response.stytchResponse.member);
        setOrganization(response.stytchResponse.organization);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }

      setIsLoading(false);
    };

    if (!member) {
      fetchSession();
    }
  }, [addResponse, member]);

  return (
    <SplitPage
      leftSide={<B2BSessionTextBox links={SESSION_LINKS} appType="backend" />}
      rightSide={
        isLoading ? (
          <LoadingSpinner />
        ) : (
          <B2BSessionCard
            email={member?.email_address || ""}
            memberId={member?.member_id || ""}
            organizationName={organization?.organization_name || ""}
            sessionTokens={sessionTokens}
            handleSwitchOrgs={() => {
              navigate("/organizations");
            }}
            handleLogout={async () => {
              const response = await logout();
              if (response.error) {
                setError(response.error);
                return;
              }
              addResponse(response, { replace: true });
              navigate("/");
            }}
            appType="backend"
          />
        )
      }
      error={error && <ErrorBox title="Error loading session" error={error} />}
      codeTabs={codeTabs}
    />
  );
}
