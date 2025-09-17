"use client";

import { ErrorBox, LoadingSpinner, Page } from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// The Authenticate page handles the redirect URL from magic link or OAuth login flows.
// It uses Stytch SDK methods to authenticate the provided token and exchange it
// for an intermediate session token.
export const Authenticate = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isAuthenticatingRef = useRef(false);

  // useStytchB2BClient returns the Stytch B2B client
  const stytch = useStytchB2BClient();

  // useStytchMemberSession returns the current Stytch session
  const { session } = useStytchMemberSession();

  useEffect(() => {
    // If the user already has a session, redirect to the logged-in landing page
    if (session) {
      router.push("/view-session");
    } else {
      // Get the token from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const tokenType = urlParams.get("stytch_token_type");

      const authenticate = async () => {
        if (!token || !tokenType) {
          setError(
            "There is no token found in the URL. This likely means you didn't go through the login flow."
          );
          return;
        }
        isAuthenticatingRef.current = true;

        try {
          if (tokenType === "discovery_oauth") {
            // Stytch SDK method to authenticate an OAuth token
            await stytch.oauth.discovery.authenticate({
              discovery_oauth_token: token,
            });
          } else if (tokenType === "discovery") {
            // Stytch SDK method to authenticate a magic link token
            await stytch.magicLinks.discovery.authenticate({
              discovery_magic_links_token: token,
            });
          } else {
            setError(
              "The token type found in the URL is not supported for this example app."
            );
          }
          router.push("/organizations");
        } catch (error: any) {
          isAuthenticatingRef.current = false; // Reset on error
          setError(error.message);
        }
      };

      if (isAuthenticatingRef.current) {
        // if already authenticating, don't do anything
        return;
      }
      authenticate();
    }
  }, [session?.member_session_id]);

  return (
    <Page>
      {error ? (
        <ErrorBox title="You've hit an error" error={error} />
      ) : (
        <LoadingSpinner />
      )}
    </Page>
  );
};
