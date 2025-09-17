import {
  ConsumerSessionCard,
  ConsumerSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytch, useStytchUser, useStytchSession } from "@stytch/react";
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

  // useStytch returns the Stytch client
  const stytch = useStytch();

  // useStytchSession returns the current Stytch session
  const { session } = useStytchSession();

  // useStytchUser returns the currently authenticated Stytch user
  const { user, isInitialized: isUserInitialized } = useStytchUser();

  useEffect(() => {
    if (user) {
      // Get the session tokens for the current session
      const tokens = stytch.session.getTokens();
      setSessionTokens(tokens);
    }
  }, [user]);

  // If the user doesn't have a session, redirect to the home page
  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  });

  if (!isUserInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <PageWithContent
      content={
        <ConsumerSessionTextBox
          appType="prebuilt"
          oauthEnabled={ENABLE_OAUTH}
        />
      }
    >
      {/* This is your own app code */}
      <ConsumerSessionCard
        email={user?.emails.at(0)?.email || ""}
        userId={user?.user_id || ""}
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
