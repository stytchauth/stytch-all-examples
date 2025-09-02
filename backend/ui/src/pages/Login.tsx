import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { sendDiscoveryEmail } from "../api";
import { useCodeSnippets } from "../contexts/code-snippets";

export function Login() {
  const { codeTabs, addResponse } = useCodeSnippets();
  const [sentEmail, setSentEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (email: string) => {
    try {
      const response = await sendDiscoveryEmail(email);
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
      "https://test.stytch.com/v1/b2b/public/oauth/google/discovery/start"
    );
    startUrl.searchParams.set(
      "public_token",
      import.meta.env.VITE_STYTCH_PUBLIC_TOKEN ?? ""
    );
    window.location.href = startUrl.toString();
  };

  return (
    <SplitPage
      leftSide={
        sentEmail ? <RedirectUrlTextBox /> : <IntroTextBox appType="backend" />
      }
      rightSide={
        <LoginForm
          isSendingEmail={sentEmail}
          setIsSendingEmail={setSentEmail}
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
          showGoogleLogin={false}
        />
      }
      error={
        error && <ErrorBox title="You've hit an API error" error={error} />
      }
      codeTabs={codeTabs}
    />
  );
}
