import {
  ErrorBox,
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient } from "@stytch/react/b2b";
import { useState } from "react";

export function Login() {
  const stytch = useStytchB2BClient();

  const [sendingEmail, setSendingEmail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleEmailLogin = async (email: string) => {
    stytch.magicLinks.email.discovery
      .send({
        email_address: email,
      })
      .then(() => {
        setSendingEmail(true);
      })
      .catch((error) => {
        setApiError(error.message);
      });
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
    // handle the Google login logic
  };

  return (
    <div>
      <div className="flex flex-row items-center p-16 gap-8">
        <div className="flex-1">
          {sendingEmail ? <RedirectUrlTextBox /> : <IntroTextBox />}
        </div>
        <div className="flex-1 flex flex-col items-center p-16">
          <LoginForm
            isSendingEmail={sendingEmail}
            setIsSendingEmail={setSendingEmail}
            onEmailLogin={handleEmailLogin}
            onGoogleLogin={handleGoogleLogin}
          />
        </div>
      </div>
      {apiError && (
        <div className="flex justify-center items-center">
          <ErrorBox title="You've hit an API error" error={apiError} />
        </div>
      )}
    </div>
  );
}
