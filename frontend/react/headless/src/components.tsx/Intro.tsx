import {
  CALLOUT_ALERT_TITLE,
  CalloutAlert,
  INTRO_TITLE,
  Link,
  List,
  TextBox,
  Typography,
} from "@stytch-all-examples/internal";
import {
  DISCOVERY_EMAIL_MAGIC_LINK_URL,
  DISCOVERY_OAUTH_LOGIN_URL,
  HEADLESS_LIST_ITEMS,
} from "../utils/constants";

function Intro() {
  return (
    <TextBox title={INTRO_TITLE}>
      <Typography variant="body1">
        This application demonstrates integrating with the Stytch API{" "}
        <b>using your own frontend</b> and the Headless SDK at a high-level.
      </Typography>
      <List className="text-body2" items={HEADLESS_LIST_ITEMS} />
      <CalloutAlert
        title={CALLOUT_ALERT_TITLE}
        description={
          <Typography variant="body1">
            Log in with email to{" "}
            <Link
              href={DISCOVERY_EMAIL_MAGIC_LINK_URL}
              text="send an email magic link"
            />{" "}
            via the API or{" "}
            <Link href={DISCOVERY_OAUTH_LOGIN_URL} text="login with OAuth." />
          </Typography>
        }
      />
    </TextBox>
  );
}

export default Intro;
