import { StytchB2B } from "@stytch/react/b2b";
import { AuthFlowType, B2BProducts } from "@stytch/vanilla-js";

export function LoginOrSignup() {
  const config = {
    products: [B2BProducts.emailMagicLinks],
    sessionOptions: { sessionDurationMinutes: 60 },
    authFlowType: AuthFlowType.Discovery,
  };
  return <StytchB2B config={config} />;
}
