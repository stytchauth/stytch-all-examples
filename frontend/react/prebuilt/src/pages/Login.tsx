import {
  IntroTextBox,
  RedirectUrlTextBox,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { LoginOrSignup } from "../components/LoginOrSignup";

export function Login() {
  const [sendingEmail, setSendingEmail] = useState(false);

  return (
    <div>
      <div className="flex flex-row items-center p-16 gap-8">
        <div className="flex-1">
          {sendingEmail ? <RedirectUrlTextBox /> : <IntroTextBox />}
        </div>
        <div className="flex-1 flex flex-col items-center p-16">
          <LoginOrSignup />
        </div>
      </div>
    </div>
  );
}
