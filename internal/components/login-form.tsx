import { Button } from "@stytch-all-examples/internal/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@stytch-all-examples/internal/components/ui/card";
import { Input } from "@stytch-all-examples/internal/components/ui/input";
import { useState } from "react";
import { ExampleAppHeader } from "./example-app-header";
import { GoogleIcon } from "./ui/google-icon";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  isSendingEmail: boolean;
  setIsSendingEmail: (isSendingEmail: boolean) => void;
  onEmailLogin: (email: string) => void;
  onGoogleLogin: () => void;
  showGoogleLogin: boolean;
}

export function LoginForm({
  className,
  isSendingEmail,
  setIsSendingEmail,
  onEmailLogin,
  onGoogleLogin,
  showGoogleLogin,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");

  return (
    <Card className="shadow-lg w-sm" {...props}>
      <CardHeader className="items-center flex flex-col gap-8">
        <ExampleAppHeader />
        <CardTitle className="text-center">
          {isSendingEmail ? "Check your email" : "Log in or sign up"}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-24">
        {isSendingEmail ? (
          <MagicLinkCardContent
            onResendClick={() => onEmailLogin(email)}
            onEmailChangeClick={() => setIsSendingEmail(false)}
          />
        ) : (
          <LoginCardContent
            email={email}
            setEmail={setEmail}
            onEmailLogin={onEmailLogin}
            onGoogleLogin={onGoogleLogin}
            showGoogleLogin={showGoogleLogin}
          />
        )}
      </CardContent>
    </Card>
  );
}

function LoginCardContent({
  email,
  setEmail,
  onEmailLogin,
  onGoogleLogin,
  showGoogleLogin,
}: {
  email: string;
  setEmail: (email: string) => void;
  onEmailLogin: (email: string) => void;
  onGoogleLogin: () => void;
  showGoogleLogin: boolean;
}) {
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onEmailLogin(email);
    }
  };

  return (
    <>
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <Input
            id="email"
            type="email"
            placeholder="email@example.com"
            required
            width="full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Log in with email
        </Button>
      </form>
      {showGoogleLogin && (
        <>
          <div className="flex gap-2 w-full items-center mt-4">
            <div className="flex-grow border-t border-gray-200" />
            <span className="text-xs text-gray-500">OR CONTINUE WITH</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>
          <div className="flex flex-col gap-2 w-full mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onGoogleLogin}
            >
              <div className="flex items-center justify-center gap-1.5">
                <GoogleIcon /> Continue with Google
              </div>
            </Button>
          </div>
        </>
      )}
    </>
  );
}

function MagicLinkCardContent({
  onResendClick,
  onEmailChangeClick,
}: {
  onResendClick: () => void;
  onEmailChangeClick: () => void;
}) {
  return (
    <div className="flex flex-col w-full items-center">
      <p className="text-center text-md font-semibold">Didn't get it?</p>
      <p className="text-center">
        <Button
          variant="link"
          onClick={onResendClick}
          className="p-0 text-blue-500 font-normal"
        >
          Resend
        </Button>{" "}
        or{" "}
        <Button
          variant="link"
          onClick={onEmailChangeClick}
          className="p-0 text-blue-500 font-normal"
        >
          Change email
        </Button>{" "}
      </p>
    </div>
  );
}
