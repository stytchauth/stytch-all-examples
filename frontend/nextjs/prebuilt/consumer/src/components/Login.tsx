"use client";

import {
  IntroTextBox,
  RedirectUrlTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";
import {
  OAuthProviders,
  Products,
  StytchEventType,
  StytchEvent,
  StytchLogin,
  StytchLoginConfig,
} from "@stytch/nextjs";

// The Login page is the landing page for the login flow.
// It uses the pre-built Stytch UI component.
export const Login = () => {
  const [sentEmail, setSentEmail] = useState(false);

  // The config object for the pre-built Stytch UI component
  // Note that it is duplicated here and in Authenticate.tsx for clarity
  const config: StytchLoginConfig = {
    products: [
      Products.emailMagicLinks,
      ...(ENABLE_OAUTH ? [Products.oauth] : []),
    ],
    emailMagicLinksOptions: {
      loginRedirectURL: "http://localhost:3000/authenticate",
      signupRedirectURL: "http://localhost:3000/authenticate",
      loginExpirationMinutes: 60,
      signupExpirationMinutes: 60,
    },
    ...(ENABLE_OAUTH
      ? {
          oauthOptions: {
            providers: [{ type: OAuthProviders.Google }],
          },
        }
      : {}),
  };

  // The callbacks object for the pre-built Stytch UI component
  // We are using it here to update copy when an magic link is sent
  const callbacks = {
    onEvent: (event: StytchEvent) => {
      if (event.type === StytchEventType.MagicLinkLoginOrCreateEvent) {
        setSentEmail(true);
      }
    },
  };

  return (
    <PageWithContent
      content={
        sentEmail ? (
          <RedirectUrlTextBox appType="prebuilt" vertical="consumer" />
        ) : (
          <IntroTextBox
            appType="prebuilt"
            oauthEnabled={ENABLE_OAUTH}
            vertical="consumer"
          />
        )
      }
    >
      {/* The pre-built Stytch UI component */}
      <StytchLogin config={config} callbacks={callbacks} />
    </PageWithContent>
  );
};
