import { useStytchB2BClient } from "@stytch/nextjs/b2b";
import { useState } from "react";
import {
  IntroTextBox,
  LoginForm,
  RedirectUrlTextBox,
} from "@stytch-all-examples/internal";

export default function Login() {
  const stytch = useStytchB2BClient();

  const [sendingEmail, setSendingEmail] = useState(false);

  const handleEmailLogin = async (email: string) => {
    const response = await stytch.magicLinks.email.discovery.send({
      email_address: email,
      discovery_redirect_url: "http://localhost:5173/authenticate",
    });
    if (response.status_code === 200) {
      setSendingEmail(true);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
    // handle the Google login logic
  };

  return (
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
  );
}
