import { AdditionalResources, Typography } from "@stytch-all-examples/internal";
import { TextBox } from "../ui/text-box";
import { AppType } from "../types";
import { Link } from "../ui/link";

const DISCOVERED_ORGANIZATION_DOCS_URL =
  "https://stytch.com/docs/b2b/api/discovered-organization-object";

const MEMBER_SESSION_DOCS_URL =
  "https://stytch.com/docs/b2b/api/session-object";

const getExchangeSessionEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/b2b/api/exchange-session"
    : "https://stytch.com/docs/b2b/sdks/session-management/exchange-session";
};

const getExchangeIntermediateSessionEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/b2b/api/exchange-intermediate-session"
    : "https://stytch.com/docs/b2b/sdks/discovery/exchange-intermediate-session";
};

const getListDiscoveredOrganizationsEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/b2b/api/list-discovered-organizations"
    : "https://stytch.com/docs/b2b/sdks/discovery/list-discovered-organizations";
};

export function OrgsTextBox({
  hasSession,
  hasOrgs,
  appType,
}: {
  hasSession: boolean;
  hasOrgs?: boolean;
  appType: AppType;
}) {
  const title = hasSession
    ? "Exchanging sessions between organizations."
    : hasOrgs
    ? "Joining an existing organization."
    : "A session needs an organization to call home.";

  const content = hasSession ? (
    <>
      <Typography variant="body1">
        Stytch's{" "}
        <Link
          href={getExchangeSessionEndpointDocsUrl(appType)}
          text="Exchange Session endpoint"
        />{" "}
        lets end users seamlessly switch between different organizations without
        needing to re-authenticate by exchanging their current session for a
        session in a specified organization.
      </Typography>
    </>
  ) : hasOrgs ? (
    <Typography variant="body1">
      Stytch’s{" "}
      <Link
        href={getExchangeIntermediateSessionEndpointDocsUrl(appType)}
        text="Exchange intermediate session endpoint"
      />{" "}
      lets end users log into an existing Organization, exchanging the
      <i>Intermediate Session token</i> into a fully realized{" "}
      <Link href={MEMBER_SESSION_DOCS_URL} text="Member session" /> for the
      selected Organization.
    </Typography>
  ) : (
    <>
      <Typography variant="body1">
        The <i>Intermediate Session token</i> has a 10-minute lifespan and can
        only be used for <i>Discovery</i>—a step in authentication where a
        Member (end user) has yet to be provisioned to an Organization.
      </Typography>
      <Typography variant="body1">
        {appType === "prebuilt" ? (
          <>
            Stytch UI handles the <i>Discovery</i> state, listing
          </>
        ) : (
          <>
            Stytch provides a
            <Link
              href={getListDiscoveredOrganizationsEndpointDocsUrl(appType)}
              text="Discovery endpoint"
            />
            to list
          </>
        )}{" "}
        Organizations that a Member is eligible to authenticate into, informed
        by the <i>Intermediate Session token.</i>
      </Typography>
    </>
  );

  return (
    <TextBox className="max-w-2xl" title={title}>
      {content}
      <AdditionalResources
        links={[
          {
            href: DISCOVERED_ORGANIZATION_DOCS_URL,
            text: "Discovered Organization object",
          },
        ]}
      />
    </TextBox>
  );
}
