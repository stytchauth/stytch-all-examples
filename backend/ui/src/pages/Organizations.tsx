import {
  ErrorBox,
  LoadingSpinner,
  OrgCreateCard,
  OrgCreateTextBox,
  OrgDiscoveryCard,
  OrgsTextBox,
  SplitPage,
} from "@stytch-all-examples/internal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  createOrganizationViaDiscovery,
  exchangeSession,
  listDiscoveredOrganizations,
} from "../api";
import { useCodeSnippets } from "../contexts/code-snippets";

export function Organizations() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [orgs, setOrgs] = useState<{ id: string; name: string }[]>([]);
  const [creatingOrg, setCreatingOrg] = useState(false);
  const [canCreateOrganization, setCanCreateOrganization] = useState(false);
  const { codeTabs, addResponse, restorePreviousSnippets } = useCodeSnippets();

  useEffect(() => {
    const loadOrganizations = async () => {
      setIsLoaded(false);
      try {
        const response = await listDiscoveredOrganizations();
        if (response.error) {
          throw response.error;
        }

        // TODO: Also include oauth if it's enabled
        // If canCreateOrganization is true, display a mock authenticate request/response
        if (response.metadata?.canCreateOrganization) {
          addResponse(
            {
              codeSnippet: `// Magic links discovery authenticate
resp, err := c.api.MagicLinks.Discovery.Authenticate(
  r.Context(), 
  &mldiscovery.AuthenticateParams{
		DiscoveryMagicLinksToken: token,
	},
)`,
              stytchResponse: `// The server at your redirect URL authenticates the discovery magic link token. We’ve included a sample response here to show what the response looks like.
{
	"request_id": "",
	"status_code": 200,
	"intermediate_session_token": "",
	"email_address": "",
	"discovered_organizations": []
}`,
            },
            { replace: true }
          );
        }

        addResponse(response, {
          replace: !response.metadata?.canCreateOrganization,
        });

        setOrgs(
          response.stytchResponse.discovered_organizations?.map((org) => ({
            id: org.organization.organization_id,
            name: org.organization.organization_name,
          })) || []
        );

        setCanCreateOrganization(
          response.metadata?.canCreateOrganization ?? false
        );

        setIsLoaded(true);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setIsLoaded(true);
      }
    };

    if (!isLoaded) {
      loadOrganizations();
    }
  }, [addResponse, orgs.length, isLoaded]);

  const handleCreateOrg = async (orgName: string) => {
    // Creating an org will automatically create a session for the member in that org
    try {
      const response = await createOrganizationViaDiscovery(orgName);
      if (response.error) {
        throw response.error;
      }
      addResponse(response, { replace: true });
      setCreatingOrg(false);
      // if the create is successful, navigate to the session page
      navigate("/view-session");
    } catch (error) {
      // if the create is not successful, set the error
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleOrgSelect = async (orgId: string) => {
    // see if there's a full session token
    try {
      const response = await exchangeSession(orgId);
      if (response.error) {
        throw response.error;
      }
      addResponse(response, { replace: true });
      // if the exchange is successful, navigate to the session page
      navigate("/view-session");
    } catch (error) {
      // if the exchange is not successful, set the error
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleClickCreateOrg = () => {
    addResponse(
      {
        codeSnippet:
          "// This step only involves your frontend.\n// There is no backend SDK code with this step.",
        stytchResponse:
          "// This step only involves your frontend.\n// No response returned in this step.",
      },
      { replace: true }
    );
    setCreatingOrg(true);
  };

  const handleCancelCreateOrg = () => {
    restorePreviousSnippets();
    setCreatingOrg(false);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SplitPage
      leftSide={
        creatingOrg ? (
          <OrgCreateTextBox appType="headless" />
        ) : (
          <OrgsTextBox hasSession={!canCreateOrganization} />
        )
      }
      rightSide={
        creatingOrg ? (
          <OrgCreateCard
            onCreateOrg={handleCreateOrg}
            onCancel={handleCancelCreateOrg}
            appType="headless"
          />
        ) : (
          <OrgDiscoveryCard
            orgs={orgs}
            onOrgSelect={handleOrgSelect}
            onClickCreateOrg={handleClickCreateOrg}
            showCreateOrg={canCreateOrganization}
          />
        )
      }
      error={error && <ErrorBox title="There was an error" error={error} />}
      codeTabs={codeTabs}
    />
  );
}
