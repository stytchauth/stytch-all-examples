import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

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
        <AnimatePresence mode="wait">
          sendingEmail ? (
          <RedirectUrlTextBox />
          ) : (
          <IntroTextBox appType="headless" />)
        </AnimatePresence>
      }
      rightSide={
        <LoginForm
          isSendingEmail={sendingEmail}
          setIsSendingEmail={setSendingEmail}
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
          // To test out OAuth, set this to true
          showGoogleLogin={false}
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
