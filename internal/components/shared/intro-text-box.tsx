import {
  DISCOVERY_EMAIL_MAGIC_LINK_URL,
  DISCOVERY_OAUTH_LOGIN_URL,
  HEADLESS_LIST_ITEMS,
} from "@stytch-all-examples/internal/lib/constants";
import {
  CalloutAlert,
  Link,
  List,
  TextBox,
  Typography,
} from "@stytch-all-examples/internal";

export const INTRO_TITLE = "Hello World 👋";
export const CALLOUT_ALERT_TITLE =
  "Get Started to see the life cycle of a Stytch session 👉";

export function IntroTextBox() {
  return (
    <TextBox className="w-2xl" title={INTRO_TITLE}>
      <Typography variant="body1">
        See how Stytch simplifies user auth with just a few lines of code. This
        application demonstrates a Stytch API integration that{" "}
        <b>uses your own frontend</b>:
      </Typography>
      <List className="text-body1" items={HEADLESS_LIST_ITEMS} />
      <CalloutAlert
        title={CALLOUT_ALERT_TITLE}
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
