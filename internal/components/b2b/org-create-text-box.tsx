import { AdditionalResources } from "@stytch-all-examples/internal";
import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { TextBox } from "@stytch-all-examples/internal/components/ui/text-box";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";

export function OrgCreateTextBox({}: {}) {
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
        The <Link href="TODO" text="Discovery endpoint" /> returns an
        intermediate session token (IST), establishing an intermediate session
        to help prevent <Link href="TODO" text="account enumeration" />. This
        lets you to preserve the Member’s auth state while you present options
        on how to proceed.
      </Typography>
      <AdditionalResources
        links={[
          {
            href: "TODO",
            text: "Auth for Orgs basics",
          },
          {
            href: "TODO",
            text: "Session management",
          },
        ]}
      />
    </TextBox>
  );
}
