import { AdditionalResources } from "@stytch-all-examples/internal";
import { Link } from "@stytch-all-examples/internal/components/ui/link";
import { TextBox } from "@stytch-all-examples/internal/components/ui/text-box";
import { Typography } from "@stytch-all-examples/internal/components/ui/typography";
import { AppType } from "../types";
import { OrderedList } from "../ui/ordered-list";

const TITLE =
  "Creating an organization results in a fully authenticated session.";

const ORGANIZATION_OBJECT_DOCS_URL =
  "https://stytch.com/docs/b2b/api/organization-object";

const MEMBER_OBJECT_DOCS_URL = "https://stytch.com/docs/b2b/api/member-object";

const getCreateOrganizationEndpointDocsUrl = (appType: AppType) => {
  return appType === "backend"
    ? "https://stytch.com/docs/b2b/api/create-organization-via-discovery"
    : "https://stytch.com/docs/b2b/sdks/discovery/create-organization-via-discovery";
};

export function OrgCreateTextBox({ appType }: { appType: AppType }) {
  return (
    <TextBox className="max-w-2xl" title={TITLE}>
      <Typography variant="body1">
        This example of using the{" "}
        <Link
          text="Create Organization endpoint"
          href={getCreateOrganizationEndpointDocsUrl(appType)}
        />
        :
      </Typography>
      <OrderedList
        items={[
          "Creates a new Organization object and Member object",
          <>
            Exchanges the <i>Intermediate Session token</i> for a full Member
            session, completing the <i>Discovery</i> authentication flow
          </>,
        ]}
      />
      <AdditionalResources
        links={[
          {
            href: ORGANIZATION_OBJECT_DOCS_URL,
            text: "Organization object",
          },
          {
            href: MEMBER_OBJECT_DOCS_URL,
            text: "Member object",
          },
        ]}
      />
    </TextBox>
  );
}
