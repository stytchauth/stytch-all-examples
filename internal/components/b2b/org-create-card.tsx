import { LoadingSpinner } from "@stytch-all-examples/internal";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export function OrgCreateCard({
  onCreateOrg,
  setCreatingOrg,
}: {
  onCreateOrg: (orgName: string) => Promise<void>;
  setCreatingOrg: (creatingOrg: boolean) => void;
}) {
  const [orgName, setOrgName] = useState("");
  const [submittingOrgCreate, setSubmittingOrgCreate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orgName.trim()) {
      setSubmittingOrgCreate(true);
      await onCreateOrg(orgName);
      setSubmittingOrgCreate(false);
      setCreatingOrg(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New organization</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="org-name" className="text-sm">
              Organization name
            </label>
            <Input
              id="org-name"
              className="w-full"
              placeholder="Acme, Inc."
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              className="w-fit"
              onClick={() => setCreatingOrg(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-fit"
              disabled={!orgName.trim() || submittingOrgCreate}
            >
              {submittingOrgCreate ? (
                <div className="flex flex-row gap-2 items-center">
                  <LoadingSpinner />
                  Authenticating
                </div>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
