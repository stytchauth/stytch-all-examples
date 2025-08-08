import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface B2BSessionCardProps {
  email: string;
  memberId: string;
  organizationName: string;
  sessionToken: string;
  handleSwitchOrgs: () => void;
}

export function B2BSessionCard({
  email,
  memberId,
  organizationName,
  sessionToken,
  handleSwitchOrgs,
}: B2BSessionCardProps) {
  const [isViewingToken, setIsViewingToken] = useState(false);
  const handleViewToken = () => {
    console.log(sessionToken);
  };

  return (
    <Card className="w-lg">
      <CardHeader>
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
          <Button
            variant="outline"
            className="text-sm"
            onClick={handleSwitchOrgs}
          >
            Switch Orgs
          </Button>
          <Button className="text-sm">Logout</Button>
        </div>
      </CardContent>
    </Card>
  );
}
