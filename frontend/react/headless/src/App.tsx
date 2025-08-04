// This import will automatically load the CSS as a side effect
import { LoginForm, Page } from "@stytch-all-examples/internal";
import Intro from "./components.tsx/Intro";

function App() {
  const handleEmailLogin = (email: string) => {
    console.log("Login with email:", email);
    // handle the email login logic
  };

  const handleGoogleLogin = () => {
    console.log("Login with Google");
    // handle the Google login logic
  };

  return (
    <Page>
      <div className="flex flex-row gap-10 items-center w-full">
        <div className="flex-1 m-20">
          <Intro />
        </div>
        <div className="flex-1">
          <LoginForm
            onEmailLogin={handleEmailLogin}
            onGoogleLogin={handleGoogleLogin}
          />
        </div>
      </div>
    </Page>
  );
}

export default App;
