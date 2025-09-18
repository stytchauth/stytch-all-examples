import {
  IntroTextBox,
  RedirectUrlTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import { useState } from "react";
import { ENABLE_OAUTH } from "../config";
import {
  AuthFlowType,
  B2BOAuthProviders,
  B2BProducts,
  StytchEventType,
  StytchEvent,
} from "@stytch/vanilla-js";
import { StytchB2B } from "@stytch/react/b2b";

// The Login page is the landing page for the login flow.
// It uses the pre-built Stytch B2B UI component.
export function Login() {
  const [sentEmail, setSentEmail] = useState(false);

  // The config object for the pre-built Stytch B2B UI component
  // Note that it is duplicated here and in Authenticate.tsx for clarity
  const config = {
    products: [
      B2BProducts.emailMagicLinks,
      ...(ENABLE_OAUTH ? [B2BProducts.oauth] : []),
    ],
    sessionOptions: { sessionDurationMinutes: 60 },
    authFlowType: AuthFlowType.Discovery,
    ...(ENABLE_OAUTH
      ? {
          oauthOptions: {
            providers: [{ type: B2BOAuthProviders.Google }],
          },
        }
      : {}),
  };

  // The callbacks object for the pre-built Stytch B2B UI component
  // We are using it here to update copy when an magic link is sent
  const callbacks = {
    onEvent: (event: StytchEvent) => {
      if (event.type === StytchEventType.B2BMagicLinkEmailDiscoverySend) {
        setSentEmail(true);
      }
    },
  };

  return (
    <PageWithContent
      content={
        sentEmail ? (
          <RedirectUrlTextBox appType="prebuilt" vertical="b2b" />
        ) : (
          <IntroTextBox
            appType="prebuilt"
            oauthEnabled={ENABLE_OAUTH}
            vertical="b2b"
          />
        )
      }
    >
      {/* The pre-built Stytch B2B UI component */}
      <StytchB2B config={config} callbacks={callbacks} />
    </PageWithContent>
  );
}
