"use client";

import {
  ConsumerSessionCard,
  ConsumerSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytch } from "@stytch/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";
import { User } from "stytch";

// The ViewSession page is the landing page for the authenticated user.
// It receives the user, session token, and session JWT from the server and
// uses the Stytch Next.js SDK to handle logout.
export function ViewSession({
  user,
  sessionToken,
  sessionJwt,
  initialError,
}: {
  user: User | null;
  sessionToken: string | null;
  sessionJwt: string | null;
  initialError?: string;
}) {
  const stytch = useStytch();
  const [error, setError] = useState<string | null>(initialError || null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await stytch.session.revoke();
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <PageWithContent
      content={
        <ConsumerSessionTextBox
          appType="headless"
          framework="nextjs"
          oauthEnabled={ENABLE_OAUTH}
        />
      }
    >
      <ConsumerSessionCard
        email={user?.emails.at(0)?.email ?? ""}
        userId={user?.user_id ?? ""}
        sessionTokens={
          sessionToken && sessionJwt
            ? {
                session_token: sessionToken,
                session_jwt: sessionJwt,
              }
            : {
                session_token: "",
                session_jwt: "",
              }
        }
        handleLogout={handleLogout}
        appType="headless"
      />
      {error && <ErrorBox title="There was an error" error={error} />}
    </PageWithContent>
  );
}
