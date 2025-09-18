"use client";

import {
  ConsumerSessionCard,
  ConsumerSessionTextBox,
  ErrorBox,
  LoadingSpinner,
  SessionTokens,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytch, useStytchUser, useStytchSession } from "@stytch/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ENABLE_OAUTH } from "../config";

export function ViewSession() {
  const stytch = useStytch();
  const { session } = useStytchSession();
  const { user, isInitialized: isUserInitialized } = useStytchUser();
  const [sessionTokens, setSessionTokens] = useState<SessionTokens | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const tokens = stytch.session.getTokens();
      setSessionTokens(tokens);
    }
  }, [user]);

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  if (!isUserInitialized) {
    return <LoadingSpinner />;
  }

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
          appType="prebuilt"
          framework="nextjs"
          oauthEnabled={ENABLE_OAUTH}
        />
      }
    >
      <ConsumerSessionCard
        email={user?.emails.at(0)?.email ?? ""}
        userId={user?.user_id ?? ""}
        sessionTokens={
          sessionTokens ?? {
            session_token: "",
            session_jwt: "",
          }
        }
        handleLogout={handleLogout}
        appType="prebuilt"
      />
      {(!sessionTokens && (
        <ErrorBox
          title="No session tokens found"
          error="Unable to load session tokens from the SDK. Please ensure you are logged in and have a session."
        />
      )) ||
        (error && <ErrorBox title="There was an error" error={error} />)}
    </PageWithContent>
  );
}
