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
} from "@stytch-all-examples/internal/lib/constants";

const PREBUILT_LIST_ITEMS = [
  "Your end users log into your app through Stytch UI components.",
  "Stytch SDK automatically handles UI events to call the Stytch API.",
  "Stytch UI handles the API response as needed via redirect URLs or event callbacks.",
  "The SDK automatically manages the session upon successful authentication.",
];

export function PrebuiltIntroTextBox() {
  return (
    <TextBox className="max-w-2xl" title={INTRO_TITLE}>
      <Typography variant="body1">
        See how Stytch simplifies user auth with just a few lines of code. This
        application demonstrates an integration using both the Stytch SDK and UI
        components.
      </Typography>
      <List className="text-body1" items={PREBUILT_LIST_ITEMS} />
      <CalloutAlert
        title={INTRO_CALLOUT_ALERT_TITLE}
        description={
          <Typography variant="body1">
            Log in with email to{" "}
            <Link
              href={MAGIC_LINKS_OVERVIEW_URL}
              text="send an email magic link"
            />{" "}
            via the API
          </Typography>
        }
      />
    </TextBox>
  );
}
