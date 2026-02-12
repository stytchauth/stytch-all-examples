import { stytchClient } from "./stytch-client.js";
import {
  setupOrganizationsEventListeners,
  updateOrganizationsUI,
  updateCreateOrgButton,
  getOrgNameValue,
} from "./dom-utils.js";

const { Products } = stytch;

// Initialize the page
function init() {
  // Stytch SDK method to get the current session synchronously
  const session = stytchClient.session.getSync();
  if (session) {
    // User already has a session, redirect to view-session
    window.location.href = "/view-session";
    return;
  }

  // Stytch SDK method to render the prebuilt UI components using custom elements
  const element = document.getElementById("stytch-sdk");
  element.render({
    client: stytchClient,
    config: {
      authFlowType: "Discovery",
      products: [Products.emailMagicLinks],
      sessionOptions: { sessionDurationMinutes: 60 },
    },
    callbacks: {
      onEvent: ({ type }) => {
        if (type === "B2B_DISCOVERY_ORGANIZATIONS_CREATE") {
          updateOrganizationsUI(type);
        } else if (type === "B2B_DISCOVERY_INTERMEDIATE_SESSION_EXCHANGE") {
          window.location.href = "/view-session";
        }
      },
    },
  });

  // Set up event listeners for org creation
  setupEventListeners();
}

function setupEventListeners() {
  setupOrganizationsEventListeners({
    handleCreateOrg,
    updateButtonStates,
  });
}

async function handleCreateOrg(event) {
  event.preventDefault();

  const orgName = getOrgNameValue();
  if (!orgName) return;

  // Disable form during submission
  updateCreateOrgButton(true, true);

  try {
    // Stytch SDK method to update the organization name
    await stytchClient.organization.update({ organization_name: orgName });

    // Redirect to view-session page
    window.location.href = "/view-session";
  } catch (error) {
    console.error("Error creating organization:", error);

    // Re-enable form on error
    updateCreateOrgButton(false, false);
  }
}

function updateButtonStates() {
  const hasInput = getOrgNameValue().length > 0;
  updateCreateOrgButton(!hasInput, false);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
