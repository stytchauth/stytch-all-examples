import { LoadingSpinner } from "@stytch-all-examples/internal";
import { useState } from "react";
import { ExampleAppHeader } from "../example-app-header";
import { YourOwnUIBadge } from "../shared/your-own-ui-badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export function OrgCreateCard({
  onCreateOrg,
  onCancel,
  appType,
}: {
  onCreateOrg: (orgName: string) => Promise<void>;
  onCancel: () => void;
  appType: "headless" | "prebuilt";
}) {
  const [orgName, setOrgName] = useState("");
  const [submittingOrgCreate, setSubmittingOrgCreate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orgName.trim()) {
      setSubmittingOrgCreate(true);
      await onCreateOrg(orgName.trim());
      setSubmittingOrgCreate(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <Card
        className={`w-sm ${
          appType === "prebuilt"
            ? "border-dashed border-3 bg-transparent shadow-none"
            : ""
        }`}
      >
        <CardHeader className="items-center flex flex-col gap-8">
          <ExampleAppHeader />
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
                onClick={onCancel}
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
                    Creating
                  </div>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {appType === "prebuilt" && <YourOwnUIBadge />}
    </div>
  );
}
