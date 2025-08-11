import { AdditionalResources } from "@stytch-all-examples/internal";
import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { TextBox } from "@stytch-all-examples/internal/components/ui/text-box";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import {
  ACCOUNT_ENUMERATION_URL,
  B2B_BASICS_URL,
  SESSION_OVERVIEW_URL,
} from "@stytch-all-examples/internal/lib/constants";

export function OrgCreateTextBox({
  discoveryEmailMagicLinkUrl,
}: {
  discoveryEmailMagicLinkUrl: string;
}) {
  return (
    <TextBox
      className="w-2xl"
      title="Creating an organization results in a fully authenticated session. "
    >
      <Typography variant="body1">
        You may want to build a Discovery sign-up and login flow in your own
        app. <b>Discovery</b> is the step after a Member authenticates and
        enables a better user experience for discovering and joining the
        Organizations they belong to, or creating one if none exist.
      </Typography>
      <Typography variant="body1">
        The <Link href={discoveryEmailMagicLinkUrl} text="Discovery endpoint" />{" "}
        returns an intermediate session token (IST), establishing an
        intermediate session to help prevent{" "}
        <Link href={ACCOUNT_ENUMERATION_URL} text="account enumeration" />. This
        lets you to preserve the Member’s auth state while you present options
        on how to proceed.
      </Typography>
      <AdditionalResources
        links={[
          {
            href: B2B_BASICS_URL,
            text: "Auth for Orgs basics",
          },
          {
            href: SESSION_OVERVIEW_URL,
            text: "Session management",
          },
        ]}
      />
    </TextBox>
  );
}
