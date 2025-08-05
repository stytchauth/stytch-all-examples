import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface B2BSessionCardProps {
  email: string;
  memberId: string;
  organization: string;
}

export function B2BSessionCard({
  email,
  memberId,
  organization,
}: B2BSessionCardProps) {
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
            <p>{organization}</p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button variant="outline" className="text-sm">
            View Token
          </Button>
          <Button variant="outline" className="text-sm">
            Switch Orgs
          </Button>
          <Button className="text-sm">Logout</Button>
        </div>
      </CardContent>
    </Card>
  );
}
