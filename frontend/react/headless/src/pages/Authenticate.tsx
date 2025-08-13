import { ErrorBox, LoadingSpinner } from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/react/b2b";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Authenticate() {
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const isAuthenticatingRef = useRef(false); // Add this ref to track if we've already authenticated

  useEffect(() => {
    if (session) {
      window.location.href = "/organizations";
    } else {
      // Get the token from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const tokenType = urlParams.get("stytch_token_type");

      const authenticate = async () => {
        try {
          if (tokenType === "discovery_oauth") {
            await stytch.oauth.discovery.authenticate({
              discovery_oauth_token: token,
            });
          } else if (tokenType === "magic_link") {
            await stytch.magicLinks.discovery.authenticate({
              discovery_magic_links_token: token,
            });
          } else {
            setError(
              "The token type found in the URL is not supported for this example app."
            );
          }
          navigate("/organizations");
        } catch (error: any) {
          isAuthenticatingRef.current = false; // Reset on error
          setError(error.message);
        }
      };
      if (token) {
        if (isAuthenticatingRef.current) {
          // if already authenticating, don't do anything
          return;
        }
        isAuthenticatingRef.current = true;
        authenticate();
      } else {
        setError(
          "There is no token found in the URL. This likely means you didn't go through the login flow."
        );
      }
    }
  }, [session?.member_session_id]);

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <ErrorBox
          title="You've hit an error"
          error={error}
          redirectUrl="/login"
          redirectText="Go to login"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
    </div>
  );
}
