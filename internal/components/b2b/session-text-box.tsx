import { CalloutAlert } from "../callout-alert";
import { AdditionalResources } from "../shared/additional-resources";
import { AppType } from "../types";
import { Link } from "../ui/link";
import { List } from "../ui/list";
import { TextBox } from "../ui/text-box";
import { Typography } from "../ui/typography";

const TITLE = "A full session begins.";

const MEMBER_SESSION_DOCS_URL =
  "https://stytch.com/docs/b2b/api/session-object";
const SESSION_COMPARISON_DOCS_URL =
  "https://stytch.com/docs/b2b/guides/sessions/resources/jwts-vs-tokens";
const SESSIONS_OVERVIEW_DOCS_URL =
  "https://stytch.com/docs/b2b/guides/sessions/resources/overview";
const COOKIES_AND_SESSION_MANAGEMENT_DOCS_URL =
  "https://stytch.com/docs/b2b/sdks/resources/cookies-and-session-management";
const OAUTH_OVERVIEW_DOCS_URL =
  "https://stytch.com/docs/b2b/guides/oauth/overview";

const getExchangeSessionEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/b2b/api/exchange-session"
    : "https://stytch.com/docs/b2b/sdks/session-management/exchange-session";
};

const getAuthenticateSessionEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/b2b/api/authenticate-session"
    : "https://stytch.com/docs/b2b/sdks/session-management/authenticate-session";
};

const getRevokeSessionEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/b2b/api/revoke-session"
    : "https://stytch.com/docs/b2b/sdks/session-management/revoke-session";
};

export function B2BSessionTextBox({
  appType,
  oauthEnabled = false,
}: {
  appType: AppType;
  oauthEnabled?: boolean;
}) {
  return (
    <TextBox title={TITLE} className="max-w-2xl">
      <Typography variant="body1">
        Your <i>Intermediate Session token</i> was exchanged for a fully
        realized <Link href={MEMBER_SESSION_DOCS_URL} text="Member Session" />
        Session—meaning you’re now fully authenticated for your app!
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
            Use{" "}
            <Link
              href={getExchangeSessionEndpointDocsUrl(appType)}
              text="Exchange session"
            />{" "}
            to let Members switch between their Organizations without having to
            re-login.
          </Typography>,
          <Typography variant="body1">
            Extend a Member’s session duration with{" "}
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
            text: "Sessions overview & how to use member sessions",
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
                href="https://github.com/stytch/stytch-all-examples/blob/main/frontend/react/headless/b2b/src/config.ts"
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
