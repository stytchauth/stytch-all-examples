"use client";

import {
  IntroTextBox,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { LoginOrSignup } from "./LoginOrSignup";

export const Login = () => {
  const [sendingEmail, setSendingEmail] = useState(false);

  return (
    <SplitPage
      leftSide={
        sendingEmail ? (
          <RedirectUrlTextBox />
        ) : (
          <IntroTextBox appType="headless" />
        )
      }
      rightSide={<LoginOrSignup onEmailSend={() => setSendingEmail(true)} />}
    />
  );
};
