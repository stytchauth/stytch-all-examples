"use client";

import {
  B2BSessionCard,
  B2BSessionTextBox,
  LoadingSpinner,
  SessionTokens,
} from "@stytch-all-examples/internal";
import {
  useStytchB2BClient,
  useStytchMember,
  useStytchOrganization,
} from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SESSION_LINKS } from "../utils/constants";

export function ViewSession() {
  const stytch = useStytchB2BClient();
  const { member, isInitialized: isMemberInitialized } = useStytchMember();
  const { organization, isInitialized: isOrganizationInitialized } =
    useStytchOrganization();
  const [sessionTokens, setSessionTokens] = useState<SessionTokens | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (member) {
      const tokens = stytch.session.getTokens();
      setSessionTokens(tokens);
    }
  }, [member]);

  if (!isMemberInitialized || !isOrganizationInitialized || !sessionTokens) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-row items-center gap-8 p-16">
      <div className="flex-1">
        <B2BSessionTextBox links={SESSION_LINKS} />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <B2BSessionCard
          email={member?.email_address ?? ""}
          memberId={member?.member_id ?? ""}
          organizationName={organization?.organization_name ?? ""}
          sessionTokens={sessionTokens}
          handleSwitchOrgs={() => {
            router.push("/organizations");
          }}
          handleLogout={() => {
            stytch.session.revoke();
            router.push("/");
          }}
        />
      </div>
    </div>
  );
}
