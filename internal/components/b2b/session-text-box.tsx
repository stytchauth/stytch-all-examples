import { AdditionalResources } from "../shared/additional-resources";
import { Link } from "../ui/link";
import { List } from "../ui/list";
import { TextBox } from "../ui/text-box";
import { Typography } from "../ui/typography";

export type LinkMap = {
  exchangeSessions: string;
  authenticate: string;
  revoke: string;
};

export function B2BSessionTextBox({ links }: { links: LinkMap }) {
  return (
    <TextBox
      title={`Sessions eventually terminate;\n whether through timeout, logout, or revocation`}
      className="max-w-2xl"
    >
      <Typography variant="body1">
        Your intermediate session was exchanged for a fully realized Member
        Session—meaning you’re now fully authenticated for your app!
      </Typography>
      <Typography variant="body1">
        Sessions are stored as{" "}
        <Link
          href="https://stytch.com/docs/b2b/guides/sessions/resources/using-jwts"
          className="font-bold"
          text="JWTs"
        />{" "}
        or{" "}
        <Link
          href="https://stytch.com/docs/b2b/guides/sessions/resources/jwts-vs-tokens"
          className="font-bold"
          text="session tokens"
        />{" "}
        in browser storage and let you authenticate and authorize requests
        between your client and server, for example:
      </Typography>
      <List
        items={[
          <Typography variant="body1">
            Use{" "}
            <Link
              href={links.exchangeSessions}
              className="font-bold"
              text="Exchange Sessions"
            />{" "}
            to let Members switch between their Organizations without having to
            re-login.
          </Typography>,
          <Typography variant="body1">
            Extend a Member’s session duration with{" "}
            <Link
              href={links.authenticate}
              className="font-bold"
              text="Authenticate"
            />
            .
          </Typography>,
          <Typography variant="body1">
            <Link href={links.revoke} className="font-bold" text="Revoke" /> a
            session on logout.
          </Typography>,
        ]}
      />
      <AdditionalResources
        links={[
          {
            href: "https://stytch.com/docs/b2b/guides/sessions/resources/overview",
            text: "Sessions overview & how to use member sessions",
          },
          {
            href: "https://stytch.com/docs/b2b/sdks/resources/cookies-and-session-management",
            text: "Cookies & session management",
          },
          {
            href: "https://stytch.com/docs/b2b/guides/sessions/resources/jwts-vs-tokens",
            text: "JWTs vs session tokens",
          },
        ]}
      />
    </TextBox>
  );
}
