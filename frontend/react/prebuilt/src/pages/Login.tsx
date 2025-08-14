import {
  IntroTextBox,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { LoginOrSignup } from "../components/LoginOrSignup";

export function Login() {
  const [sendingEmail, setSendingEmail] = useState(false);

  return (
    <SplitPage
      leftSide={sendingEmail ? <RedirectUrlTextBox /> : <IntroTextBox />}
      rightSide={<LoginOrSignup />}
    />
  );
}
