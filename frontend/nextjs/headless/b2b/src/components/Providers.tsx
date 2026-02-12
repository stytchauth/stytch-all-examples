"use client";

import { StytchB2BProvider } from "@stytch/nextjs/b2b";
import { createStytchB2BClient } from "@stytch/nextjs/b2b";

// Create the Stytch client
const stytch = createStytchB2BClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ""
);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <StytchB2BProvider stytch={stytch}>{children}</StytchB2BProvider>;
};
