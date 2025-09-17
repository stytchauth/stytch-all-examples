"use client";

import { StytchProvider } from "@stytch/nextjs";
import { createStytchHeadlessClient } from "@stytch/nextjs/headless";

// Create the Stytch client
const stytch = createStytchHeadlessClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN ||
    console.error("No Stytch public token found") ||
    ""
);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <StytchProvider stytch={stytch}>{children}</StytchProvider>;
};
