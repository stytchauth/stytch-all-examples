"use client";

import {
  IntroTextBox,
  RedirectUrlTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";
import { LoginOrSignup } from "./LoginOrSignup";

export const Login = () => {
  const [sendingEmail, setSendingEmail] = useState(false);

  return (
    <SplitPage
      leftSide={
        sendingEmail ? (
          <RedirectUrlTextBox appType="prebuilt" />
        ) : (
          <IntroTextBox appType="prebuilt" oauthEnabled={ENABLE_OAUTH} />
        )
      }
      rightSide={<LoginOrSignup onEmailSend={() => setSendingEmail(true)} />}
    />
  );
};
