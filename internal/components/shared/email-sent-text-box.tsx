import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { TextBox } from "@stytch-all-examples/internal/components/ui/text-box";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import { AdditionalResources } from "./additional-resources";
import { AppType, Vertical } from "../types";

const getAuthenticateEndpointDocsUrl = (
  appType: AppType,
  vertical: Vertical
) => {
  if (appType === "backend") {
    return vertical === "b2b"
      ? "https://stytch.com/docs/b2b/api/authenticate-discovery-magic-link"
      : "https://stytch.com/docs/api/authenticate-magic-link";
  }

  return vertical === "b2b"
    ? "https://stytch.com/docs/b2b/sdks/email-magic-links/authenticate-discovery-magic-link"
    : "https://stytch.com/docs/sdks/email-magic-links/authenticate";
};

const TITLE = "The first step to a session.";
const REDIRECT_URLS_DASHBOARD_URL =
  "https://stytch.com/dashboard/redirect-urls";
const REDIRECT_URL_DOCS_URL =
  "https://stytch.com/docs/workspace-management/redirect-urls";

const getEmailTemplatesDocsUrl = (vertical: Vertical) => {
  return vertical === "b2b"
    ? "https://stytch.com/docs/b2b/api/email-templates"
    : "https://stytch.com/docs/api/email-templates";
};

export function EmailSentTextBox({
  appType,
  vertical,
}: {
  appType: AppType;
  vertical: Vertical;
}) {
  return (
    <TextBox className="max-w-2xl" title={TITLE}>
      <Typography variant="body1">
        After a user clicks a magic link, they are routed back to your
        application based on the{" "}
        <Link href={REDIRECT_URLS_DASHBOARD_URL} text="Redirect URL" />{" "}
        configured in the Stytch Dashboard.
      </Typography>
      <Typography variant="body1">
        The redirect includes a <i>Magic Links token</i>, which{" "}
        {appType === "prebuilt" && vertical === "b2b"
          ? "the Stytch UI will"
          : "your application must"}{" "}
        exchange for{" "}
        {vertical === "b2b" ? (
          <>
            an <i>Intermediate Session token</i>
          </>
        ) : (
          <>
            a <i>Session token</i>
          </>
        )}
        {appType === "prebuilt" ? (
          <></>
        ) : (
          <>
            {" "}
            through an{" "}
            <Link
              href={getAuthenticateEndpointDocsUrl(appType, vertical)}
              text="Authenticate endpoint"
            />
          </>
        )}
        .
      </Typography>
      <Typography variant="body1">
        For this example app, the redirect URL has been set to:
      </Typography>
      <Typography variant="body1">
        <code className="bg-code rounded-md p-1">
          http://localhost:3000/authenticate
        </code>
      </Typography>
      <AdditionalResources
        links={[
          { href: REDIRECT_URL_DOCS_URL, text: "Redirect URLs" },
          {
            href: getEmailTemplatesDocsUrl(vertical),
            text: "Email templates",
          },
        ]}
      />
    </TextBox>
  );
}
