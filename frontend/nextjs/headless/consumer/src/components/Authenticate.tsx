"use client";

import { ErrorBox, LoadingSpinner, Page } from "@stytch-all-examples/internal";
import { useStytch, useStytchSession } from "@stytch/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// The Authenticate page handles the redirect URL from magic link or OAuth login flows.
// It uses Stytch SDK methods to authenticate the provided token.
export const Authenticate = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isAuthenticatingRef = useRef(false);

  // useStytch returns the Stytch client
  const stytch = useStytch();

  // useStytchSession returns the current Stytch session
  const { session } = useStytchSession();

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
          if (tokenType === "oauth") {
            // Stytch SDK method to authenticate an OAuth token
            await stytch.oauth.authenticate(token, {
              session_duration_minutes: 60,
            });
          } else if (tokenType === "magic_links") {
            // Stytch SDK method to authenticate a magic link token
            await stytch.magicLinks.authenticate(token, {
              session_duration_minutes: 60,
            });
          } else {
            setError(
              "The token type found in the URL is not supported for this example app."
            );
          }
          router.push("/view-session");
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
  }, [session?.session_id]);

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
