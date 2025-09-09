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
import { AppType } from "../types";

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

const BACKEND_LIST_ITEMS = [
  "Your end users log into your app using your own custom frontend.",
  "Your app utilizes one of our backend SDKs to communicate with the Stytch API.",
  "Stytch API processes the request and returns a response to your backend.",
  "Your backend automatically manages the session upon successful authentication.",
];

const introTextForAppType = {
  headless:
    "See how Stytch simplifies user auth with just a few lines of code. This application demonstrates a Stytch API integration that uses your own frontend:",
  prebuilt:
    "See how Stytch simplifies user auth with just a few lines of code. This application demonstrates an integration using both the Stytch SDK and UI components.",
  backend:
    "See how Stytch simplifies user auth with just a few lines of code. This application demonstrates a Stytch API integration using a custom backend authentication flow:",
};

const listItemsForAppType = {
  headless: HEADLESS_LIST_ITEMS,
  prebuilt: PREBUILT_LIST_ITEMS,
  backend: BACKEND_LIST_ITEMS,
};

export function IntroTextBox({
  appType,
  oauthEnabled = false,
}: {
  appType: AppType;
  oauthEnabled?: boolean;
}) {
  return (
    <TextBox className="max-w-2xl" title={INTRO_TITLE}>
      <Typography variant="body1">{introTextForAppType[appType]}</Typography>
      <List className="text-body1" items={listItemsForAppType[appType]} />
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
            via the API
            {oauthEnabled ? (
              <>
                {" "}
                or{" "}
                <Link
                  href={OAUTH_OVERVIEW_URL}
                  text="login with OAuth."
                  className="font-semibold"
                />
              </>
            ) : (
              "."
            )}
          </Typography>
        }
      />
    </TextBox>
  );
}
