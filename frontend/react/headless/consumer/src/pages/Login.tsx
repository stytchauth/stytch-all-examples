import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useStytch } from "@stytch/react";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";

// The Login page is the landing page for the login flow.
// It uses Stytch SDK methods to initiate login flows.
export function Login() {
  const [sentEmail, setSentEmail] = useState(false);
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
      setSentEmail(true);
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Stytch SDK method to start a Google oauth flow
      await stytch.oauth.google.start({});
    } catch (error: any) {
      setApiError(error.message);
    }
  };

  return (
    <PageWithContent
      content={
        sentEmail ? (
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
        isSendingEmail={sentEmail}
        setIsSendingEmail={setSentEmail}
        onEmailLogin={handleEmailLogin}
        onGoogleLogin={handleGoogleLogin}
        showGoogleLogin={ENABLE_OAUTH}
      />
    </PageWithContent>
  );
}
