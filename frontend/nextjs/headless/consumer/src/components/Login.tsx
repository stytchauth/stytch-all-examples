"use client";

import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytch } from "@stytch/nextjs";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";

// The Login page is the landing page for the login flow.
// It uses Stytch SDK methods to initiate login flows.
export const Login = () => {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // useStytch returns the Stytch client
  const stytch = useStytch();

  const handleEmailLogin = async (email: string) => {
    try {
      // Stytch SDK method to send a magic link email
      await stytch.magicLinks.email.loginOrCreate(email, {
        login_magic_link_url: "http://localhost:3000/authenticate",
        login_expiration_minutes: 60,
        signup_magic_link_url: "http://localhost:3000/authenticate",
        signup_expiration_minutes: 60,
      });
      setSendingEmail(true);
      setApiError(null);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Stytch SDK method to start a Google oauth flow
      await stytch.oauth.google.start({});
      setApiError(null);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <PageWithContent
      content={
        sendingEmail ? (
          <RedirectUrlTextBox appType="headless" vertical="consumer" />
        ) : (
          <IntroTextBox
            appType="headless"
            oauthEnabled={ENABLE_OAUTH}
            vertical="consumer"
          />
        )
      }
      error={
        apiError && (
          <ErrorBox title="You've hit an API error" error={apiError} />
        )
      }
    >
      <LoginForm
        isSendingEmail={sendingEmail}
        setIsSendingEmail={setSendingEmail}
        onEmailLogin={handleEmailLogin}
        onGoogleLogin={handleGoogleLogin}
        showGoogleLogin={ENABLE_OAUTH}
      />
    </PageWithContent>
  );
};
