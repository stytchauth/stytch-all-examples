import { useState } from "react";
import { ExampleAppHeader } from "../example-app-header";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../ui/loading-spinner";

export type OrgDiscoveryCardProps = {
  orgs: { id: string; name: string }[];
  onOrgSelect: (orgId: string) => Promise<void>;
  onCreateOrg: (orgName: string) => Promise<void>;
  creatingOrg: boolean;
  setCreatingOrg: (creatingOrg: boolean) => void;
  showCreateOrg: boolean;
};

export function OrgDiscoveryCard({
  orgs,
  onOrgSelect,
  onCreateOrg,
  creatingOrg,
  setCreatingOrg,
  showCreateOrg,
}: OrgDiscoveryCardProps) {
  return (
    <Card className="w-sm">
      <CardHeader className="items-center flex flex-col gap-8">
        <ExampleAppHeader />
        <CardTitle>
          {creatingOrg
            ? "New organization"
            : orgs.length > 0
            ? "Select an organization"
            : "No organizations found"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showCreateOrg && creatingOrg ? (
          <CreateOrgForm
            onCreateOrg={onCreateOrg}
            setCreatingOrg={setCreatingOrg}
          />
        ) : (
          <ViewOrgsList
            orgs={orgs}
            onOrgSelect={onOrgSelect}
            setCreatingOrg={setCreatingOrg}
            showCreateOrg={showCreateOrg}
          />
        )}
      </CardContent>
    </Card>
  );
}

function CreateOrgForm({
  onCreateOrg,
  setCreatingOrg,
}: {
  onCreateOrg: (orgName: string) => Promise<void>;
  setCreatingOrg: (creatingOrg: boolean) => void;
}) {
  const [orgName, setOrgName] = useState("");
  const [submittingOrgCreate, setSubmittingOrgCreate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orgName.trim()) {
      setSubmittingOrgCreate(true);
      onCreateOrg(orgName).then(() => {
        setCreatingOrg(false);
        setSubmittingOrgCreate(false);
      });
    }
  };

  return (
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
  );
}

function ViewOrgsList({
  orgs,
  onOrgSelect,
  setCreatingOrg,
  showCreateOrg,
}: {
  orgs: { id: string; name: string }[];
  onOrgSelect: (orgId: string) => void;
  setCreatingOrg: (creatingOrg: boolean) => void;
  showCreateOrg: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 px-4">
      {orgs.map((org) => (
        <Button
          key={org.id}
          variant="outline"
          className="h-12"
          onClick={() => onOrgSelect(org.id)}
        >
          <BuildingIcon />
          <p className="flex-1 text-left text-body1 font-bold">{org.name}</p>
          <ArrowRightIcon />
        </Button>
      ))}
      {showCreateOrg && (
        <Button
          variant="outline"
          className="text-sm w-fit mx-auto"
          onClick={() => setCreatingOrg(true)}
        >
          Create organization
        </Button>
      )}
    </div>
  );
}

const BuildingIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22M6 22H18M6 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V14C2 13.4696 2.21071 12.9609 2.58579 12.5858C2.96086 12.2107 3.46957 12 4 12H6M18 22H20C20.5304 22 21.0391 21.7893 21.4142 21.4142C21.7893 21.0391 22 20.5304 22 20V11C22 10.4696 21.7893 9.96086 21.4142 9.58579C21.0391 9.21071 20.5304 9 20 9H18M10 6H14M10 10H14M10 14H14M10 18H14"
        stroke="#09090B"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const ArrowRightIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="#2563EB"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13 18L19 12"
        stroke="#2563EB"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13 6L19 12"
        stroke="#2563EB"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
