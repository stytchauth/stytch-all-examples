"use client";

import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/nextjs/b2b";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";

// The Login page is the landing page for the login flow.
// It uses Stytch SDK methods to initiate discovery login flows.
export const Login = () => {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // useStytchB2BClient returns the Stytch B2B client
  const stytch = useStytchB2BClient();

  const handleEmailLogin = async (email: string) => {
    try {
      // Stytch SDK method to send a discovery magic link email
      await stytch.magicLinks.email.discovery.send({
        email_address: email,
      });
      setSendingEmail(true);
      setApiError(null);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Stytch SDK method to start a Google discovery oauth flow
      await stytch.oauth.google.discovery.start({});
      setApiError(null);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <PageWithContent
      content={
        sendingEmail ? (
          <RedirectUrlTextBox appType="headless" vertical="b2b" />
        ) : (
          <IntroTextBox
            appType="headless"
            oauthEnabled={ENABLE_OAUTH}
            vertical="b2b"
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
