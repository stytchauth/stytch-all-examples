import { useState } from "react";
import { ExampleAppHeader } from "../example-app-header";
import { SessionTokensCard } from "../shared/session-tokens-card";
import { YourOwnUIBadge } from "../shared/your-own-ui-badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AppType } from "../types";

interface ConsumerSessionCardProps {
  email: string;
  userId: string;
  sessionTokens: SessionTokens | null;
  handleLogout: () => void;
  appType: AppType;
}

export interface SessionTokens {
  session_token: string;
  session_jwt: string;
}

export function ConsumerSessionCard({
  email,
  userId,
  sessionTokens,
  handleLogout,
  appType,
}: ConsumerSessionCardProps) {
  const [isViewingToken, setIsViewingToken] = useState(false);
  const handleViewToken = () => {
    setIsViewingToken(true);
  };

  if (isViewingToken) {
    return (
      <SessionTokensCard
        sessionTokens={sessionTokens}
        handleBack={() => setIsViewingToken(false)}
        appType={appType}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <Card
        className={`w-lg ${
          appType === "prebuilt"
            ? "border-dashed border-3 bg-transparent shadow-none"
            : ""
        }`}
      >
        <CardHeader>
          <ExampleAppHeader />

          <CardTitle className="justify-start">Logged in as:</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <p className="font-bold">Email</p>
              <p>{email}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-bold">User ID</p>
              <p>{userId}</p>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              className="text-sm"
              onClick={handleViewToken}
            >
              View Token
            </Button>
            <Button className="text-sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
      {appType === "prebuilt" && <YourOwnUIBadge />}
    </div>
  );
}
