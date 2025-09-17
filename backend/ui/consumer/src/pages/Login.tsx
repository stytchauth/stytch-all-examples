import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { sendMagicLinkEmail } from "../api";
import { useCodeSnippets } from "../contexts/code-snippets";
import { ENABLE_OAUTH } from "../config";

export function Login() {
  const { codeTabs, addResponse } = useCodeSnippets();
  const [sentEmail, setSentEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (email: string) => {
    try {
      const response = await sendMagicLinkEmail(email);
      if (response.error) {
        throw response.error;
      }
      addResponse(response, { replace: true });
      setSentEmail(true);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleGoogleLogin = async () => {
    const startUrl = new URL(
      "https://test.stytch.com/v1/public/oauth/google/start"
    );
    startUrl.searchParams.set(
      "public_token",
      import.meta.env.VITE_STYTCH_PUBLIC_TOKEN ?? ""
    );
    startUrl.searchParams.set(
      "login_redirect_url",
      "http://localhost:3000/authenticate"
    );
    startUrl.searchParams.set(
      "signup_redirect_url",
      "http://localhost:3000/authenticate"
    );
    window.location.href = startUrl.toString();
  };

  return (
    <PageWithContent
      content={
        sentEmail ? (
          <RedirectUrlTextBox appType="backend" vertical="consumer" />
        ) : (
          <IntroTextBox
            appType="backend"
            oauthEnabled={ENABLE_OAUTH}
            vertical="consumer"
          />
        )
      }
      error={
        error && <ErrorBox title="You've hit an API error" error={error} />
      }
      codeTabs={codeTabs}
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
