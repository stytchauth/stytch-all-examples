import { stytch } from "./stytch-client.js";
import { showErrorInContainer } from "./errors.js";
import { createOrgButton } from "./template-helpers.js";
import {
  setupOrganizationsEventListeners,
  renderOrganizations,
  updateCreateButtonVisibility,
  showMainContent,
  getOrgNameValue,
  showCreateOrgForm,
} from "./dom-utils.js";

let organizations = [];

// Initialize the page
function init() {
  // Set up event listeners
  setupEventListeners();

  // Load organizations
  loadOrganizations();
}

function setupEventListeners() {
  setupOrganizationsEventListeners({
    showCreateOrgForm,
    handleCreateOrg,
    selectOrganization,
  });
}

async function loadOrganizations() {
  try {
    // Stytch SDK method to list organizations that the member is eligible to authenticate into
    const response = await stytch.discovery.organizations.list();

    organizations = response.discovered_organizations.map((org) => ({
      id: org.organization.organization_id,
      name: org.organization.organization_name,
    }));

    renderOrganizations(
      organizations,
      createOrgButton,
      { selectOrganization },
      stytch
    );
    showMainContent();
  } catch (error) {
    console.error("Error loading organizations:", error);
    showErrorInContainer(
      "Unable to load organizations",
      error.message,
      "/login",
      "Go to login"
    );
  }
}

async function selectOrganization(orgId) {
  try {
    const session = stytch.session.getSync();

    if (session) {
      // Stytch SDK method to exchange an existing session for a new organization
      await stytch.session.exchange({
        organization_id: orgId,
        session_duration_minutes: 60,
      });
    } else {
      // Stytch SDK method to exchange an intermediate session for a session
      await stytch.discovery.intermediateSessions.exchange({
        organization_id: orgId,
        session_duration_minutes: 60,
      });
    }

    window.location.href = "/view-session";
  } catch (error) {
    console.error("Error selecting organization:", error);
    showErrorInContainer(
      "There was an error",
      error.message,
      "/login",
      "Go to login"
    );
  }
}

async function handleCreateOrg(event) {
  event.preventDefault();

  const orgName = getOrgNameValue();
  if (!orgName) return;

  try {
    // Stytch SDK method to create a new organization
    // Creating an org will automatically create a session for the member in that org
    await stytch.discovery.organizations.create({
      organization_name: orgName,
      sso_jit_provisioning: "ALL_ALLOWED",
      session_duration_minutes: 60,
    });

    window.location.href = "/view-session";
  } catch (error) {
    console.error("Error creating organization:", error);
    showErrorInContainer(
      "There was an error",
      error.message,
      "/login",
      "Go to login"
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
