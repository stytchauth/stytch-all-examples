import {
  CalloutAlert,
  Link,
  List,
  TextBox,
  Typography,
} from "@stytch-all-examples/internal";
import {
  DISCOVERY_EMAIL_MAGIC_LINK_URL,
  DISCOVERY_OAUTH_LOGIN_URL,
  INTRO_CALLOUT_ALERT_TITLE,
  INTRO_TITLE,
} from "@stytch-all-examples/internal/lib/constants";

const HEADLESS_LIST_ITEMS = [
  "Your end users log into your app using your own frontend authentication flow.",
  "Your app utilizes the Stytch SDK to call the Stytch API.",
  "Stytch API processes the request and returns a response to your frontend.",
  "The SDK automatically manages the session upon successful authentication.",
];

export function HeadlessIntroTextBox() {
  return (
    <TextBox className="max-w-2xl" title={INTRO_TITLE}>
      <Typography variant="body1">
        See how Stytch simplifies user auth with just a few lines of code. This
        application demonstrates a Stytch API integration that{" "}
        <b>uses your own frontend</b>:
      </Typography>
      <List className="text-body1" items={HEADLESS_LIST_ITEMS} />
      <CalloutAlert
        title={INTRO_CALLOUT_ALERT_TITLE}
        description={
          <Typography variant="body1">
            Log in with email to{" "}
            <Link
              href={DISCOVERY_EMAIL_MAGIC_LINK_URL}
              text="send an email magic link"
              className="font-semibold"
            />{" "}
            via the API or{" "}
            <Link
              href={DISCOVERY_OAUTH_LOGIN_URL}
              text="login with OAuth."
              className="font-semibold"
            />
          </Typography>
        }
      />
    </TextBox>
  );
}
