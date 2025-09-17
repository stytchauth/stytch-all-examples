import {
  ConsumerSessionCard,
  ConsumerSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ENABLE_OAUTH } from "../config";
import { getCurrentSession, logout } from "../api";
import { User } from "../types";
import { useCodeSnippets } from "../contexts/code-snippets";

export function ViewSession() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTokens, setSessionTokens] = useState<SessionTokens>({
    session_token: "",
    session_jwt: "",
  });
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { codeTabs, addResponse } = useCodeSnippets();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await getCurrentSession();

        if (response.error) {
          throw response.error;
        }

        // Add mock authentication snippets to show what happened behind the scenes
        // This simulates the authentication flow that just completed
        if (ENABLE_OAUTH) {
          addResponse(
            {
              codeSnippet: `// OAuth authenticate
resp, err := c.api.OAuth.Authenticate(
  r.Context(), 
  &oauth.AuthenticateParams{
    Token: token,
    SessionDurationMinutes: 60,
  },
)`,
              stytchResponse: `// OAuth authenticate sample response
{
  "request_id": "",
  "status_code": 200,
  "user_id": "",
  "session_token": "",
  "session_jwt": "",
  "user": {
    "user_id": "",
    "name": "",
    "emails": [{"email": "", "verified": true}],
    "status": "active"
  },
  "session": {
    "session_id": "",
    "user_id": "",
    "authentication_factors": []
  }
}`,
            },
            { replace: true }
          );
        }

        addResponse(
          {
            codeSnippet: `// ${
              ENABLE_OAUTH ? "OR " : ""
            } Magic links authenticate
resp, err := c.api.MagicLinks.Authenticate(
  r.Context(), 
  &magiclinks.AuthenticateParams{
    Token: token,
    SessionDurationMinutes: 60,
  },
)`,
            stytchResponse: `// Magic link authenticate sample response
{
  "request_id": "",
  "status_code": 200,
  "user_id": "",
  "session_token": "",
  "session_jwt": "",
  "user": {
    "user_id": "",
    "name": "",
    "emails": [{"email": "", "verified": true}],
    "status": "active"
  },
  "session": {
    "session_id": "",
    "user_id": "",
    "authentication_factors": []
  }
}`,
          },
          { replace: !ENABLE_OAUTH }
        );

        addResponse(response, { replace: false });

        setSessionTokens({
          session_token: response.stytchResponse.session_token,
          session_jwt: response.stytchResponse.session_jwt,
        });
        setUser(response.stytchResponse.user);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      }

      setIsLoading(false);
    };

    if (!user) {
      fetchSession();
    }
  }, [addResponse, user]);

  return (
    <PageWithContent
      content={
        <ConsumerSessionTextBox appType="backend" oauthEnabled={ENABLE_OAUTH} />
      }
      codeTabs={codeTabs}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ConsumerSessionCard
          email={user?.emails?.[0]?.email || ""}
          userId={user?.user_id || ""}
          sessionTokens={sessionTokens}
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
      )}
      {error && <ErrorBox title="Error loading session" error={error} />}
    </PageWithContent>
  );
}
