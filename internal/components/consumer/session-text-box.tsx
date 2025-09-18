import { CalloutAlert } from "../callout-alert";
import { AdditionalResources } from "../shared/additional-resources";
import { AppType, Framework } from "../types";
import { Link } from "../ui/link";
import { List } from "../ui/list";
import { TextBox } from "../ui/text-box";
import { Typography } from "../ui/typography";

const TITLE = "A full session begins.";

const SESSION_DOCS_URL = "https://stytch.com/docs/api/session-object";
const SESSION_COMPARISON_DOCS_URL =
  "https://stytch.com/docs/guides/sessions/session-tokens-vs-jwts";
const SESSIONS_OVERVIEW_DOCS_URL =
  "https://stytch.com/docs/guides/sessions/using-sessions";
const COOKIES_AND_SESSION_MANAGEMENT_DOCS_URL =
  "https://stytch.com/docs/sdks/resources/cookies-and-session-management";
const OAUTH_OVERVIEW_DOCS_URL =
  "https://stytch.com/docs/guides/oauth/idp-overview";

function getConfigPath(
  appType: AppType,
  framework: Framework,
  vertical: "b2b" | "consumer"
): string {
  switch (appType) {
    case "headless":
      if (framework === "nextjs") {
        return `frontend/nextjs/headless/${vertical}/src/config.ts`;
      } else if (framework === "vanillajs") {
        return `frontend/vanillajs/headless/${vertical}/js/config.js`;
      } else {
        return `frontend/react/headless/${vertical}/src/config.ts`;
      }
    case "prebuilt":
      if (framework === "nextjs") {
        return `frontend/nextjs/prebuilt/${vertical}/src/config.ts`;
      } else if (framework === "vanillajs") {
        return `frontend/vanillajs/prebuilt/${vertical}/js/config.js`;
      } else {
        return `frontend/react/prebuilt/${vertical}/src/config.ts`;
      }
    case "backend":
      return `backend/ui/${vertical}/src/config.ts`;
    default:
      return `frontend/react/headless/${vertical}/src/config.ts`;
  }
}

const getAuthenticateSessionEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/api/session-auth"
    : "https://stytch.com/docs/sdks/session-management/authenticate-session";
};

const getRevokeSessionEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/api/session-revoke"
    : "https://stytch.com/docs/sdks/session-management/revoke-session";
};

export function ConsumerSessionTextBox({
  appType,
  framework = "react",
  oauthEnabled = false,
}: {
  appType: AppType;
  framework?: Framework;
  oauthEnabled?: boolean;
}) {
  return (
    <TextBox title={TITLE} className="max-w-2xl">
      <Typography variant="body1">
        Your authentication token was exchanged for a fully realized{" "}
        <Link href={SESSION_DOCS_URL} text="Session" />
        —meaning you're now fully authenticated for your app!
      </Typography>
      <Typography variant="body1">
        Sessions are stored as{" "}
        <Link
          href={SESSION_COMPARISON_DOCS_URL}
          text="JWTs or session tokens"
        />{" "}
        in browser cookies or mobile storage and let you authenticate and
        authorize requests between your client and server, for example:
      </Typography>
      <List
        items={[
          <Typography variant="body1">
            Extend a user's session duration with{" "}
            <Link
              href={getAuthenticateSessionEndpointDocsUrl(appType)}
              text="Authenticate"
            />
            .
          </Typography>,
          <Typography variant="body1">
            <Link
              href={getRevokeSessionEndpointDocsUrl(appType)}
              className="font-bold"
              text="Revoke"
            />{" "}
            a session on logout.
          </Typography>,
        ]}
      />
      <AdditionalResources
        links={[
          {
            href: SESSIONS_OVERVIEW_DOCS_URL,
            text: "Sessions overview & how to use sessions",
          },
          {
            href: COOKIES_AND_SESSION_MANAGEMENT_DOCS_URL,
            text: "Cookies & session management",
          },
        ]}
      />
      {!oauthEnabled && (
        <CalloutAlert
          title="Next steps"
          description={
            <Typography variant="body1">
              Try adding <Link href={OAUTH_OVERVIEW_DOCS_URL} text="OAuth" /> to
              your example app by enabling it in{" "}
              <Link
                href={`https://github.com/stytchauth/stytch-all-examples/blob/main/${getConfigPath(
                  appType,
                  framework,
                  "consumer"
                )}`}
                text="the config file"
              />
              .
            </Typography>
          }
        />
      )}
    </TextBox>
  );
}
