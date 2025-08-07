import {
  CALLOUT_ALERT_TITLE,
  CalloutAlert,
  INTRO_TITLE,
  Link,
  List,
  LoginForm,
  TextBox,
  Typography,
} from "@stytch-all-examples/internal";
import { useNavigate } from "react-router-dom";
import {
  DISCOVERY_EMAIL_MAGIC_LINK_URL,
  DISCOVERY_OAUTH_LOGIN_URL,
  HEADLESS_LIST_ITEMS,
} from "../utils/constants";

const handleEmailLogin = (email: string) => {
  console.log("Login with email:", email);
  // handle the email login logic
};

const handleGoogleLogin = () => {
  console.log("Login with Google");
  // handle the Google login logic
};

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-center p-16 gap-8">
      <div className="flex-1">
        <IntroTextBox />
      </div>
      <div className="flex-1 flex flex-col items-center p-16">
        <LoginForm
          onEmailLogin={() => navigate("/redirect-urls")}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
    </div>
  );
}

function IntroTextBox() {
  return (
    <TextBox title={INTRO_TITLE}>
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
