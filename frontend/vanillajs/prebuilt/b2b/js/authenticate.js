import { stytch } from "./stytch-client.js";
import {
  setupOrganizationsEventListeners,
  updateOrganizationsUI,
  updateCreateOrgButton,
  getOrgNameValue,
} from "./dom-utils.js";

// Initialize the page
function init() {
  // Stytch SDK method to get the current session synchronously
  const session = stytch.session.getSync();
  if (session) {
    // User already has a session, redirect to view-session
    window.location.href = "/view-session";
    return;
  }

  // Stytch SDK method to mount the prebuilt UI components
  stytch.mount({
    elementId: "#stytch-sdk",
    config: {
      authFlowType: "Discovery",
      products: ["emailMagicLinks"],
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
    await stytch.organization.update({ organization_name: orgName });

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
