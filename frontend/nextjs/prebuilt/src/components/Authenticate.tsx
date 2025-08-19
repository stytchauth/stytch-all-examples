"use client";

import {
  OrgCreateCard,
  OrgCreateTextBox,
  OrgsTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginOrSignup } from "./LoginOrSignup";

export function Authenticate() {
  const [creatingOrg, setCreatingOrg] = useState(false);
  const stytch = useStytchB2BClient();
  const { session } = useStytchMemberSession();
  const router = useRouter();

  // If user has a session and isn't creating an org, redirect to view-session
  if (session && !creatingOrg) {
    router.push("/view-session");
    return null;
  }

  const handleCreateOrg = async (orgName: string) => {
    await stytch.organization.update({ organization_name: orgName });
    setCreatingOrg(false);
    router.push("/view-session");
  };

  if (creatingOrg) {
    // If the user creates an organization from the prebuilt UI component, it defaults to name "Stytch"
    // Using the onEvent callback, we can add custom UI when the user clicks Create Organization so they can pick a name
    return (
      <SplitPage
        leftSide={<OrgCreateTextBox appType="prebuilt" />}
        rightSide={
          <OrgCreateCard
            onCreateOrg={handleCreateOrg}
            onCancel={() => setCreatingOrg(false)}
            appType="prebuilt"
          />
        }
      />
    );
  }

  return (
    <SplitPage
      leftSide={<OrgsTextBox />}
      rightSide={<LoginOrSignup onCreateOrg={() => setCreatingOrg(true)} />}
    />
  );
}
