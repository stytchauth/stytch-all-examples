import {
  CalloutAlert,
  Link,
  List,
  TextBox,
  Typography,
} from "@stytch-all-examples/internal";
import {
  INTRO_CALLOUT_ALERT_TITLE,
  INTRO_TITLE,
  MAGIC_LINKS_OVERVIEW_URL,
  OAUTH_OVERVIEW_URL,
} from "@stytch-all-examples/internal/lib/constants";

const HEADLESS_LIST_ITEMS = [
  "Your end users log into your app using your own frontend authentication flow.",
  "Your app utilizes the Stytch SDK to call the Stytch API.",
  "Stytch API processes the request and returns a response to your frontend.",
  "The SDK automatically manages the session upon successful authentication.",
];

const PREBUILT_LIST_ITEMS = [
  "Your end users log into your app through Stytch UI components.",
  "Stytch SDK automatically handles UI events to call the Stytch API.",
  "Stytch UI handles the API response as needed via redirect URLs or event callbacks.",
  "The SDK automatically manages the session upon successful authentication.",
];

export function IntroTextBox({
  appType,
}: {
  appType: "headless" | "prebuilt";
}) {
  const introText =
    appType === "headless" ? (
      <Typography variant="body1">
        See how Stytch simplifies user auth with just a few lines of code. This
        application demonstrates a Stytch API integration that{" "}
        <b>uses your own frontend</b>:
      </Typography>
    ) : (
      <Typography variant="body1">
        See how Stytch simplifies user auth with just a few lines of code. This
        application demonstrates an integration using both the Stytch SDK and UI
        components.
      </Typography>
    );
  return (
    <TextBox className="max-w-2xl" title={INTRO_TITLE}>
      {introText}
      <List
        className="text-body1"
        items={
          appType === "headless" ? HEADLESS_LIST_ITEMS : PREBUILT_LIST_ITEMS
        }
      />
      <CalloutAlert
        title={INTRO_CALLOUT_ALERT_TITLE}
        description={
          <Typography variant="body1">
            Log in with email to{" "}
            <Link
              href={MAGIC_LINKS_OVERVIEW_URL}
              text="send an email magic link"
              className="font-semibold"
            />{" "}
            via the API or{" "}
            <Link
              href={OAUTH_OVERVIEW_URL}
              text="login with OAuth."
              className="font-semibold"
            />
          </Typography>
        }
      />
    </TextBox>
  );
}
