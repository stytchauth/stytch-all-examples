import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { TextBox } from "@stytch-all-examples/internal/components/ui/text-box";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import {
  CUSTOM_EMAIL_TEMPLATES_URL,
  REDIRECT_URL_DOCS_URL,
} from "../../constants/text-box";
import { AdditionalResources } from "./additional-resources";

export function RedirectUrlTextBox() {
  return (
    <TextBox
      className="w-2xl"
      title="An authentication session starts with a token"
    >
      <Typography variant="body1">
        When a user successfully authenticates via magic link, OAuth, SSO, or
        password, a token springs to life with a member_id, organization_id, and
        a 60-minute lifespan.
      </Typography>
      <Typography variant="body1">
        After authentication, Stytch routes users back to your application based
        on the{" "}
        <Link
          href={REDIRECT_URL_DOCS_URL}
          text="redirect URL"
          className="font-semibold"
        />{" "}
        configured in the Stytch dashboard.
      </Typography>
      <Typography variant="body1">
        For this example app, the redirect URL has been set to:
      </Typography>
      <Typography variant="body1">
        <code className="bg-code rounded-md p-1">
          https://localhost:3000/authenticate
        </code>
      </Typography>
      <AdditionalResources
        links={[
          { href: REDIRECT_URL_DOCS_URL, text: "Redirect URLs" },
          {
            href: CUSTOM_EMAIL_TEMPLATES_URL,
            text: "Customizing email templates",
          },
        ]}
      />
    </TextBox>
  );
}
