import {
  ErrorBox,
  LoadingSpinner,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authenticateMagicLink, authenticateOAuth } from "../api";
import { useCodeSnippets } from "../contexts/code-snippets";

// The Authenticate page handles the redirect URL from magic link or OAuth login flows.
// It extracts tokens from the URL and authenticates them using backend SDK methods.
export function Authenticate() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { addResponse } = useCodeSnippets();

  useEffect(() => {
    const authenticate = async () => {
      if (isAuthenticating) return;

      setIsAuthenticating(true);

      try {
        // Get the token from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const tokenType = urlParams.get("stytch_token_type");

        if (!token || !tokenType) {
          setError(
            "There is no token found in the URL. This likely means you didn't go through the login flow."
          );
          return;
        }

        let response;
        if (tokenType === "oauth") {
          // Backend SDK method to authenticate an OAuth token
          response = await authenticateOAuth(token);
        } else if (tokenType === "magic_links") {
          // Backend SDK method to authenticate a magic link token
          response = await authenticateMagicLink(token);
        } else {
          setError(
            "The token type found in the URL is not supported for this example app."
          );
          return;
        }

        if (response.error) {
          setError(response.error);
          return;
        }

        addResponse(response, { replace: true });
        navigate("/view-session");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsAuthenticating(false);
      }
    };

    authenticate();
  }, [navigate, addResponse, isAuthenticating]);

  return (
    <PageWithContent>
      {error ? (
        <ErrorBox title="You've hit an error" error={error} />
      ) : (
        <LoadingSpinner />
      )}
    </PageWithContent>
  );
}
