import { B2B_BASICS_URL, B2B_VS_CONSUMER_URL } from "@/lib/constants";
import {
  AdditionalResources,
  List,
  Typography,
} from "@stytch-all-examples/internal";
import { TextBox } from "../ui/text-box";

export function OrgsTextBox() {
  return (
    <TextBox
      className="w-2xl"
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
          "Invite: Members can be invited to join a specific Organization",
          "Just-in-time (JIT): Eligible Organizations are shown in a Discovery flow so Members can find and join teammates.",
          "SCIM: Organizations can manage Members directly from their workforce IdP.",
          "Manual: Members can be manually provisioned via direct API calls.",
        ]}
      />
      <Typography variant="body1">
        In this example, we’ll create two organizations for you to be
        provisioned to with JIT provisioning.
      </Typography>
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
