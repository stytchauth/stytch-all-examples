"use client";

import {
  LoadingSpinner,
  TextBox,
  Typography,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const Authenticate = () => {
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isAuthenticatingRef = useRef(false); // Add this ref to track if we've already authenticated

  useEffect(() => {
    if (session) {
      window.location.href = "/organizations";
    } else {
      // Get the token from the URL
      const token = new URLSearchParams(window.location.search).get("token");

      if (token && !isAuthenticatingRef.current) {
        isAuthenticatingRef.current = true; // Set this immediately

        // authenticate the token
        stytch.magicLinks.discovery
          .authenticate({
            discovery_magic_links_token: token,
          })
          .then((response) => {
            // if the response is successful, navigate to the organizations page
            if (response.status_code === 200) {
              router.push("/organizations");
            } else {
              isAuthenticatingRef.current = false; // Reset on error
              setError(
                `There was an error authenticating your magic link token: ${response.status_code}`
              );
            }
          })
          .catch((error) => {
            isAuthenticatingRef.current = false; // Reset on error
            setError(error.message);
            return null;
          });
      }
    }
  }, [session?.member_session_id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <TextBox title="There was an error authenticating your magic link token">
          <Typography>{error}</Typography>
        </TextBox>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
    </div>
  );
};
