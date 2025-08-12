import {
  AdditionalResources,
  List,
  Typography,
} from "@stytch-all-examples/internal";
import {
  B2B_BASICS_URL,
  B2B_VS_CONSUMER_URL,
} from "@stytch-all-examples/internal/lib/constants";
import { TextBox } from "../ui/text-box";

export function OrgsTextBox() {
  return (
    <TextBox
      className="max-w-2xl"
      title="The session needs an organization to call home."
    >
      <Typography variant="body1">
        All <b>Members</b> (end users) belong to an <b>Organization</b> when
        using Stytch B2B: Auth for Orgs. Stytch supports four different methods
        for provisioning Members:
      </Typography>
      <List
        className="text-body1"
        items={[
          <Typography variant="body1">
            <b>Invite:</b> Members can be invited to join a specific
            Organization
          </Typography>,
          <Typography variant="body1">
            <b>Just-in-time (JIT):</b> Eligible Organizations are shown in a
            Discovery flow so Members can find and join teammates.
          </Typography>,
          <Typography variant="body1">
            <b>SCIM:</b> Organizations can manage Members directly from their
            workforce IdP.
          </Typography>,
          <Typography variant="body1">
            <b>Manual:</b> Members can be manually provisioned via direct API
            calls.
          </Typography>,
        ]}
      />
      <AdditionalResources
        links={[
          {
            href: B2B_BASICS_URL,
            text: "Auth for Orgs basics",
          },
          {
            href: B2B_VS_CONSUMER_URL,
            text: "Organization vs Consumer Auth",
          },
        ]}
      />
    </TextBox>
  );
}
