import { useState } from "react";
import { ExampleAppHeader } from "../example-app-header";
import { SessionTokensCard } from "../shared/session-tokens-card";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface B2BSessionCardProps {
  email: string;
  memberId: string;
  organizationName: string;
  sessionTokens: SessionTokens;
  // optional, because in prebuilt we don't support this (yet)
  handleSwitchOrgs?: () => void;
  handleLogout: () => void;
  appType: "headless" | "prebuilt";
}

export interface SessionTokens {
  session_token: string;
  session_jwt: string;
}

export function B2BSessionCard({
  email,
  memberId,
  organizationName,
  sessionTokens,
  handleSwitchOrgs,
  handleLogout,
  appType,
}: B2BSessionCardProps) {
  const [isViewingToken, setIsViewingToken] = useState(false);
  const handleViewToken = () => {
    setIsViewingToken(true);
  };

  if (isViewingToken) {
    return (
      <SessionTokensCard
        sessionTokens={sessionTokens}
        handleBack={() => setIsViewingToken(false)}
      />
    );
  }

  return (
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
            <p className="font-bold">Member ID</p>
            <p>{memberId}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-bold">Organization</p>
            <p>{organizationName}</p>
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
          {handleSwitchOrgs && (
            <Button
              variant="outline"
              className="text-sm"
              onClick={handleSwitchOrgs}
            >
              Switch Orgs
            </Button>
          )}
          <Button className="text-sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
