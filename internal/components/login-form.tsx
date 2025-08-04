import { Button } from "@stytch-all-examples/internal/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@stytch-all-examples/internal/components/ui/card";
import { Input } from "@stytch-all-examples/internal/components/ui/input";
import React, { useState } from "react";
import { ExampleIcon } from "./example-icon";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  onEmailLogin: (email: string) => void;
  onGoogleLogin: () => void;
}

export function LoginForm({
  className,
  onEmailLogin,
  onGoogleLogin,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col gap-4 w-sm" {...props}>
      <Card className="shadow-lg">
        <CardHeader className="items-center flex flex-col gap-4">
          <div className="flex justify-center">
            <ExampleIcon />
          </div>
          <CardTitle className="text-center">Log in or Sign up</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 w-full">
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
            <Button
              type="submit"
              className="w-full"
              onClick={() => onEmailLogin(email)}
            >
              Log in with email
            </Button>
          </div>
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
              Continue with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
