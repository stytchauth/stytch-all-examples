import {
  OrgCreateCard,
  OrgCreateTextBox,
  OrgsTextBox,
  PageWithContent,
} from "@stytch-all-examples/internal";
import {
  StytchB2B,
  useStytchB2BClient,
  useStytchMemberSession,
} from "@stytch/react/b2b";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  AuthFlowType,
  B2BOAuthProviders,
  B2BProducts,
  StytchEvent,
  StytchEventType,
} from "@stytch/vanilla-js";
import { ENABLE_OAUTH } from "../config";

// The Authenticate page handles the redirect URL from magic link or OAuth login flows.
// It uses the pre-built Stytch B2B UI component.
export function Authenticate() {
  const [creatingOrg, setCreatingOrg] = useState(false);
  const navigate = useNavigate();

  // useStytchB2BClient returns the Stytch B2B client
  const stytch = useStytchB2BClient();

  // useStytchMemberSession returns the Stytch member session
  const { session } = useStytchMemberSession();

  // If user has a session and isn't creating an org, redirect to the logged-in landing page
  useEffect(() => {
    if (session && !creatingOrg) {
      navigate("/view-session");
    }
  }, [session?.member_session_id]);

  // The config object for the pre-built Stytch B2B UI component.
  // Note that it is duplicated here and in Login.tsx for clarity.
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

  // The callbacks object for the pre-built Stytch B2B UI component.
  // We are using it here to set state when the user creates an organization
  // in the pre-built UI. We use this state to serve a custom UI that allows
  // the user to pick a name for the new organization.
  const callbacks = {
    onEvent: (event: StytchEvent) => {
      if (event.type === StytchEventType.B2BDiscoveryOrganizationsCreate) {
        setCreatingOrg(true);
      }
    },
  };

  if (creatingOrg) {
    return (
      <PageWithContent content={<OrgCreateTextBox appType="prebuilt" />}>
        <OrgCreateCard
          onCreateOrg={async (orgName: string) => {
            // We call update to set the name of the organization because the
            // pre-built UI already handled creation.
            await stytch.organization.update({ organization_name: orgName });
            setCreatingOrg(false);
            navigate("/view-session");
          }}
          appType="prebuilt"
        />
      </PageWithContent>
    );
  }

  return (
    <PageWithContent
      content={<OrgsTextBox hasSession={!!session} appType="prebuilt" />}
    >
      {/* The pre-built Stytch B2B UI component */}
      <StytchB2B config={config} callbacks={callbacks} />
    </PageWithContent>
  );
}
