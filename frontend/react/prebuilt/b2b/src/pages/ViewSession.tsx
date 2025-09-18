import {
  B2BSessionCard,
  B2BSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
  PageWithContent,
} from "@stytch-all-examples/internal";
import {
  useStytchB2BClient,
  useStytchMember,
  useStytchMemberSession,
  useStytchOrganization,
} from "@stytch/react/b2b";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ENABLE_OAUTH } from "../config";

// The ViewSession page is the landing page for the authenticated user.
// Note that there is no pre-built UI component rendered on this page.
export function ViewSession() {
  const [sessionTokens, setSessionTokens] = useState<SessionTokens | null>(
    null
  );
  const navigate = useNavigate();

  // useStytchB2BClient returns the Stytch B2B client
  const stytch = useStytchB2BClient();

  // useStytchMemberSession returns the current Stytch session
  const { session } = useStytchMemberSession();

  // useStytchMember returns the currently authenticated Stytch member
  const { member, isInitialized: isMemberInitialized } = useStytchMember();

  // useStytchOrganization returns the currently authenticated Stytch organization
  const { organization, isInitialized: isOrganizationInitialized } =
    useStytchOrganization();

  useEffect(() => {
    if (member) {
      // Get the session tokens for the current session
      const tokens = stytch.session.getTokens();
      setSessionTokens(tokens);
    }
  }, [member]);

  // If the user doesn't have a session, redirect to the home page
  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  });

  if (!isMemberInitialized || !isOrganizationInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <PageWithContent
      content={
        <B2BSessionTextBox appType="prebuilt" oauthEnabled={ENABLE_OAUTH} />
      }
    >
      {/* This is your own app code */}
      <B2BSessionCard
        email={member?.email_address || ""}
        memberId={member?.member_id || ""}
        organizationName={organization?.organization_name || ""}
        sessionTokens={sessionTokens}
        handleLogout={() => {
          // Stytch SDK method to revoke the current session
          stytch.session.revoke();
          navigate("/");
        }}
        appType="prebuilt"
      />
      {!sessionTokens && (
        <ErrorBox
          title="No session tokens found"
          error="Unable to load session tokens from the SDK. Please ensure you are logged in and have a session."
        />
      )}
    </PageWithContent>
  );
}
