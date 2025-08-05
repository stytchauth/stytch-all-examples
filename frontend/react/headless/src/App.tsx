// This import will automatically load the CSS as a side effect
import {
  B2BSessionCard,
  LoginForm,
  MagicLinkSentCard,
  OrganizationDiscoveryCard,
  Page,
} from "@stytch-all-examples/internal";
import { IntroTextBox } from "./components.tsx/IntroTextBox";

function App() {
  const handleEmailLogin = (email: string) => {
    console.log("Login with email:", email);
    // handle the email login logic
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
    // handle the Google login logic
  };

  const handleOrgSelect = (orgId: string) => {
    console.log("Org selected:", orgId);
    // handle the org select logic
  };

  const SHOW_COMPONENTS = true;

  return (
    <Page>
      <div className="flex flex-col">
        <div className="flex flex-row items-center">
          <div className="flex-1 m-10">
            <IntroTextBox />
          </div>
          <div className="flex-1 flex flex-col items-center m-10">
            <LoginForm
              onEmailLogin={handleEmailLogin}
              onGoogleLogin={handleGoogleLogin}
            />
          </div>
        </div>
        {SHOW_COMPONENTS && (
          <div className="flex flex-col justify-center items-center gap-4 m-10">
            <MagicLinkSentCard
              onResendClick={() => {}}
              onEmailChangeClick={() => {}}
            />
            <OrganizationDiscoveryCard
              orgs={[
                { id: "1", name: "Stytch" },
                { id: "2", name: "Acme" },
              ]}
              onOrgSelect={handleOrgSelect}
            />
            <B2BSessionCard
              email="example@email.com"
              memberId="member-test-32fc5024-9c09-4da3-bd2e-c9ce4da9375f"
              organization="Stytch"
            />
          </div>
        )}
      </div>
    </Page>
  );
}

export default App;
