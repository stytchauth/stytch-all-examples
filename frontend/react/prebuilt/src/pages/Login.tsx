import {
  PrebuiltIntroTextBox,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { LoginOrSignup } from "../components/LoginOrSignup";

export function Login() {
  const [sendingEmail, setSendingEmail] = useState(false);
  console.log("sendingEmail", sendingEmail);

  return (
    <SplitPage
      leftSide={
        sendingEmail ? <RedirectUrlTextBox /> : <PrebuiltIntroTextBox />
      }
      rightSide={<LoginOrSignup setSendingEmail={setSendingEmail} />}
    />
  );
}
