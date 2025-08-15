import { AdditionalResources } from "@stytch-all-examples/internal";
import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { TextBox } from "@stytch-all-examples/internal/components/ui/text-box";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import {
  ACCOUNT_ENUMERATION_URL,
  B2B_BASICS_URL,
  DISCOVERY_EML_AUTHENTICATE_URL,
  SESSION_OVERVIEW_URL,
} from "@stytch-all-examples/internal/lib/constants";

export function OrgCreateTextBox({ type }: { type: "headless" | "prebuilt" }) {
  const headlessParagraphs = [
    <Typography variant="body1">
      You may want to build a Discovery sign-up and login flow in your own app.{" "}
      <b>Discovery</b> is the step after a Member authenticates and enables a
      better user experience for discovering and joining the Organizations they
      belong to, or creating one if none exist.
    </Typography>,
    <Typography variant="body1">
      The{" "}
      <Link
        href={DISCOVERY_EML_AUTHENTICATE_URL}
        text="Discovery authenticate endpoint"
      />{" "}
      returns an intermediate session token (IST), establishing an intermediate
      session to help prevent{" "}
      <Link
        className="font-bold"
        href={ACCOUNT_ENUMERATION_URL}
        text="account enumeration"
      />
      . This lets you to preserve the Member’s auth state while you present
      options on how to proceed.
    </Typography>,
  ];

  const prebuiltParagraphs = [
    <Typography variant="body1">
      Prior to joining an organization, Stytch returns an intermediate session
      token (IST) establishing an intermediate authenticated session to help
      prevent <Link href={ACCOUNT_ENUMERATION_URL} text="account enumeration" />
    </Typography>,
    <Typography variant="body1">
      Stytch UI components provide end-to-end authentication flows for login and
      signup. Your authentication flows can be further extended with{" "}
      <Link
        className="font-bold"
        href={ACCOUNT_ENUMERATION_URL}
        text="UI callbacks"
      />{" "}
      to handle things like creating new organizations.
    </Typography>,
  ];

  return (
    <TextBox
      className="max-w-2xl"
      title="Creating an organization results in a fully authenticated session. "
    >
      {type === "headless" ? headlessParagraphs : prebuiltParagraphs}

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
