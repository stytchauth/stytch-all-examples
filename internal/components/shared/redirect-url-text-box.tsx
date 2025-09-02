import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { TextBox } from "@stytch-all-examples/internal/components/ui/text-box";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import {
  CUSTOM_EMAIL_TEMPLATES_URL,
  REDIRECT_URL_DOCS_URL,
} from "../../lib/constants";
import { AdditionalResources } from "./additional-resources";
import { AppType } from "../types";
import { OrderedList } from "../ui/ordered-list";

export function RedirectUrlTextBox({ appType }: { appType: AppType }) {
  const contents =
    appType === "backend" ? (
      <>
        <Typography variant="body1">
          After a user clicks a magic link, Stytch generates a Magic Links
          Token, which can be exchanged via the authenticate endpoint for a
          session token.
        </Typography>
        <Typography variant="body1">
          To complete the authentication flow, you'll need to implement a
          backend endpoint (typically /authenticate) that:
        </Typography>
        <Typography variant="body1">
          <OrderedList
            items={[
              "Receives the token when Stytch redirects to your configured redirect URL.",
              "Calls the Stytch API to validate the token.",
              "Establishes the user session in your application.",
            ]}
          />
        </Typography>
      </>
    ) : (
      <>
        <Typography variant="body1">
          When a user successfully authenticates via magic link, OAuth, SSO, or
          password, a token springs to life with a member_id, organization_id,
          and a 60-minute lifespan.
        </Typography>
        <Typography variant="body1">
          After authentication, Stytch routes users back to your application
          based on the <Link href={REDIRECT_URL_DOCS_URL} text="redirect URL" />{" "}
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
      </>
    );
  return (
    <TextBox
      className="max-w-2xl"
      title="An authentication session starts with a token"
    >
      {contents}
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
