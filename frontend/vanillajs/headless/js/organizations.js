import { stytch } from "./stytch-client.js";
import { showErrorInContainer } from "./errors.js";
import { createOrgButton } from "./template-helpers.js";

// DOM elements
const loadingContainer = document.getElementById("loading-container");
const mainContainer = document.getElementById("main-container");
const orgsList = document.getElementById("orgs-list");
const createOrgBtn = document.getElementById("create-org-btn");
const mainContent = document.getElementById("main-content");
const createOrgContent = document.getElementById("create-org-content");
const orgForm = document.getElementById("org-form");
const orgNameInput = document.getElementById("org-name-input");
const cancelCreateBtn = document.getElementById("cancel-create-btn");
const orgsTextBox = document.getElementById("orgs-text-box");
const orgCreateTextBox = document.getElementById("org-create-text-box");

let organizations = [];
let creatingOrg = false;

// Initialize the page
function init() {
  // Set up event listeners
  setupEventListeners();

  // Load organizations
  loadOrganizations();
}

function setupEventListeners() {
  createOrgBtn.addEventListener("click", showCreateOrgForm);
  cancelCreateBtn.addEventListener("click", hideCreateOrgForm);
  orgForm.addEventListener("submit", handleCreateOrg);
}

async function loadOrganizations() {
  try {
    const response = await stytch.discovery.organizations.list();

    organizations = response.discovered_organizations.map((org) => ({
      id: org.organization.organization_id,
      name: org.organization.organization_name,
    }));

    renderOrganizations();
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

function renderOrganizations() {
  // Update card title based on state
  const cardTitle = document.getElementById("card-title");
  if (creatingOrg) {
    cardTitle.textContent = "New organization";
  } else if (organizations.length > 0) {
    cardTitle.textContent = "Select an organization";
  } else {
    cardTitle.textContent = "No organizations found";
  }

  if (organizations.length === 0) {
    orgsList.innerHTML = "";
    // Remove margin-top from create button container when no orgs
    const createButtonContainer = createOrgBtn.parentElement;
    createButtonContainer.classList.remove("mt-6");
    return;
  }

  // Clear the list and add organization buttons
  orgsList.innerHTML = "";
  organizations.forEach((org) => {
    const button = createOrgButton(org.id, org.name);
    button.addEventListener("click", () => selectOrganization(org.id));
    orgsList.appendChild(button);
  });

  // Show/hide create button based on session
  updateCreateButtonVisibility();

  // Add margin-top back when there are orgs
  const createButtonContainer = createOrgBtn.parentElement;
  createButtonContainer.classList.add("mt-6");
}

async function selectOrganization(orgId) {
  try {
    const session = stytch.session.getSync();

    if (session) {
      // If the member already has a session, exchange it for the new organization
      await stytch.session.exchange({
        organization_id: orgId,
        session_duration_minutes: 60,
      });
    } else {
      // Otherwise, use the discovery flow to exchange an intermediate session for a session in that org
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

function showCreateOrgForm() {
  creatingOrg = true;
  updateUI();
}

function hideCreateOrgForm() {
  creatingOrg = false;
  updateUI();
}

async function handleCreateOrg(event) {
  event.preventDefault();

  const orgName = orgNameInput.value.trim();
  if (!orgName) return;

  try {
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

function updateUI() {
  if (creatingOrg) {
    mainContent.classList.add("hidden");
    createOrgContent.classList.remove("hidden");
    orgsTextBox.classList.add("hidden");
    orgCreateTextBox.classList.remove("hidden");
  } else {
    mainContent.classList.remove("hidden");
    createOrgContent.classList.add("hidden");
    orgsTextBox.classList.remove("hidden");
    orgCreateTextBox.classList.add("hidden");
    orgNameInput.value = "";
  }
}

function updateCreateButtonVisibility() {
  const session = stytch.session.getSync();
  const showCreateOrg = !session; // Only show create button if no session

  const createButtonContainer = createOrgBtn.parentElement;

  if (showCreateOrg) {
    createButtonContainer.classList.remove("hidden");
  } else {
    createButtonContainer.classList.add("hidden");
  }
}

function showMainContent() {
  loadingContainer.classList.add("hidden");
  mainContainer.classList.remove("hidden");
}

// Remove the old showError function since we're using showErrorInContainer now

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
