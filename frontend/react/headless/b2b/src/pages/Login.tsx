import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";

// The Login page is the landing page for the login flow.
// It uses Stytch SDK methods to initiate discovery login flows.
export function Login() {
  const [sentEmail, setSentEmail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // useStytchB2BClient returns the Stytch B2B client
  const stytch = useStytchB2BClient();

  const handleEmailLogin = async (email: string) => {
    try {
      // Stytch SDK method to send a discovery magic link email
      await stytch.magicLinks.email.discovery.send({
        email_address: email,
      });
      setSentEmail(true);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Stytch SDK method to start a Google discovery oauth flow
      await stytch.oauth.google.discovery.start({});
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <PageWithContent
      content={
        sentEmail ? (
          <RedirectUrlTextBox appType="headless" />
        ) : (
          <IntroTextBox appType="headless" oauthEnabled={ENABLE_OAUTH} />
        )
      }
      error={
        apiError && (
          <ErrorBox title="You've hit an API error" error={apiError} />
        )
      }
    >
      <LoginForm
        isSendingEmail={sentEmail}
        setIsSendingEmail={setSentEmail}
        onEmailLogin={handleEmailLogin}
        onGoogleLogin={handleGoogleLogin}
        showGoogleLogin={ENABLE_OAUTH}
      />
    </PageWithContent>
  );
}
