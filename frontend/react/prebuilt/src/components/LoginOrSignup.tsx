import { StytchB2B } from "@stytch/react/b2b";
import {
  AuthFlowType,
  B2BOAuthProviders,
  B2BProducts,
  StytchEventType,
} from "@stytch/vanilla-js";

export function LoginOrSignup({
  onEmailSend,
  onCreateOrg,
}: {
  onEmailSend?: () => void;
  onCreateOrg?: () => void;
}) {
  // To test OAuth, uncomment the oauthOptions the B2BProducts.oauth product type
  const config = {
    products: [B2BProducts.emailMagicLinks, B2BProducts.oauth],
    sessionOptions: { sessionDurationMinutes: 60 },
    authFlowType: AuthFlowType.Discovery,

    oauthOptions: {
      providers: [{ type: B2BOAuthProviders.Google }],
    },
  };
  return (
    <StytchB2B
      config={config}
      callbacks={{
        // The onEvent callbacks allow you to add custom functionality outside of the prebuilt UI, such as renaming an organization
        onEvent: (event) => {
          if (
            onEmailSend &&
            event.type === StytchEventType.B2BMagicLinkEmailDiscoverySend
          ) {
            onEmailSend();
          }
          if (
            onCreateOrg &&
            event.type === StytchEventType.B2BDiscoveryOrganizationsCreate
          ) {
            onCreateOrg();
          }
        },
      }}
    />
  );
}
