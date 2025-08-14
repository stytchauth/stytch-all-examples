import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  Page,
  RedirectUrlTextBox,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/react/b2b";
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
    <Page
      leftSide={sendingEmail ? <RedirectUrlTextBox /> : <IntroTextBox />}
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
}
