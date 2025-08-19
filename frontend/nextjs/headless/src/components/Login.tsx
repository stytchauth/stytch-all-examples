"use client";

import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/nextjs/b2b";
import { useState } from "react";

export const Login = () => {
  const stytch = useStytchB2BClient();

  const [sendingEmail, setSendingEmail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleEmailLogin = async (email: string) => {
    try {
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
      await stytch.oauth.google.discovery.start({});
      setApiError(null);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <SplitPage
      leftSide={
        sendingEmail ? (
          <RedirectUrlTextBox />
        ) : (
          <IntroTextBox appType="headless" />
        )
      }
      rightSide={
        <LoginForm
          isSendingEmail={sendingEmail}
          setIsSendingEmail={setSendingEmail}
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
          showGoogleLogin={true}
        />
      }
      error={
        apiError && (
          <ErrorBox title="You've hit an API error" error={apiError} />
        )
      }
    />
  );
};
