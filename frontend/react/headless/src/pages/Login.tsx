import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";

export function Login() {
  const stytch = useStytchB2BClient();

  const [sendingEmail, setSendingEmail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleEmailLogin = async (email: string) => {
    try {
      await stytch.magicLinks.email.discovery.send({
        email_address: email,
      });
      setSendingEmail(true);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await stytch.oauth.google.discovery.start({});
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <SplitPage
      leftSide={
        sendingEmail ? (
          <RedirectUrlTextBox appType="headless" />
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
          showGoogleLogin={ENABLE_OAUTH}
        />
      }
      error={
        apiError && (
          <ErrorBox title="You've hit an API error" error={apiError} />
        )
      }
    />
  );
}
