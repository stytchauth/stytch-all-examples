import { ExampleAppHeader } from "../example-app-header";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export type OrgDiscoveryCardProps = {
  orgs: { id: string; name: string }[];
  onOrgSelect: (orgId: string) => Promise<void>;
  onClickCreateOrg: () => void;
  showCreateOrg: boolean;
};

export function OrgDiscoveryCard({
  orgs,
  onOrgSelect,
  onClickCreateOrg,
  showCreateOrg,
}: OrgDiscoveryCardProps) {
  return (
    <Card className="w-sm">
      <CardHeader className="items-center flex flex-col gap-8">
        <ExampleAppHeader />
        <CardTitle>
          {orgs.length > 0
            ? "Select an organization"
            : "No organizations found"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ViewOrgsList
          orgs={orgs}
          onOrgSelect={onOrgSelect}
          showCreateOrg={showCreateOrg}
          onClickCreateOrg={onClickCreateOrg}
        />
      </CardContent>
    </Card>
  );
}

function ViewOrgsList({
  orgs,
  onOrgSelect,
  onClickCreateOrg,
  showCreateOrg,
}: {
  orgs: { id: string; name: string }[];
  onOrgSelect: (orgId: string) => void;
  onClickCreateOrg: (creatingOrg: boolean) => void;
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
        <>
          {orgs.length > 0 && (
            <div className="flex gap-2 w-full items-center mt-4 mb-4">
              <div className="flex-grow border-t border-gray-200" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
          )}
          <Button
            variant="outline"
            className="text-sm w-fit mx-auto"
            onClick={() => onClickCreateOrg(true)}
          >
            Create organization
          </Button>
        </>
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 18L19 12"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6L19 12"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
