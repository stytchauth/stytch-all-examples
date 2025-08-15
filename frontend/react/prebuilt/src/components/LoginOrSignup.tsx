import { StytchB2B } from "@stytch/react/b2b";
import { AuthFlowType, B2BProducts, StytchEventType } from "@stytch/vanilla-js";

export function LoginOrSignup({
  setSendingEmail,
  setCreatingOrg,
}: {
  setSendingEmail?: (sendingEmail: boolean) => void;
  setCreatingOrg?: (creatingOrg: boolean) => void;
}) {
  // To test OAuth, uncomment the oauthOptions the B2BProducts.oauth product type
  const config = {
    products: [
      B2BProducts.emailMagicLinks,
      // B2BProducts.oauth
    ],
    sessionOptions: { sessionDurationMinutes: 60 },
    authFlowType: AuthFlowType.Discovery,
    /*
    oauthOptions: {
      providers: [{ type: B2BOAuthProviders.Google }],
    },
    */
  };
  return (
    <StytchB2B
      config={config}
      callbacks={{
        onEvent: (event) => {
          if (
            setSendingEmail &&
            event.type === StytchEventType.B2BMagicLinkEmailDiscoverySend
          ) {
            setSendingEmail(true);
          }
          if (
            setCreatingOrg &&
            event.type === StytchEventType.B2BDiscoveryOrganizationsCreate
          ) {
            setCreatingOrg(true);
          }
        },
      }}
    />
  );
}
