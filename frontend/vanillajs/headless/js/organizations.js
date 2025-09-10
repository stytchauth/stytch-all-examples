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
const orgsTextBox = document.getElementById("orgs-text-box");
const orgCreateTextBox = document.getElementById("org-create-text-box");
const orgsTextNoSession = document.getElementById("orgs-text-no-session");
const orgsTextWithSession = document.getElementById("orgs-text-with-session");

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
  const createButtonContainer = createOrgBtn.parentElement;

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
    createButtonContainer.classList.remove("mt-6");

    // Remove any existing divider when no organizations
    const existingDivider = document.getElementById("org-divider");
    if (existingDivider) {
      existingDivider.remove();
    }

    return;
  }

  // Clear the list and add organization buttons
  orgsList.innerHTML = "";
  organizations.forEach((org) => {
    const button = createOrgButton(org.id, org.name);
    button.addEventListener("click", () => selectOrganization(org.id));
    orgsList.appendChild(button);
  });

  // Add OR divider when there are organizations (outside the space-y-3 container)
  const mainContent = document.getElementById("main-content");

  // Remove any existing divider
  const existingDivider = document.getElementById("org-divider");
  if (existingDivider) {
    existingDivider.remove();
  }

  // Add new divider
  const divider = document.createElement("div");
  divider.id = "org-divider";
  divider.className = "flex gap-2 w-full items-center mt-6 mb-6 px-6";
  divider.innerHTML = `
    <div class="flex-grow border-t border-gray-200"></div>
    <span class="text-xs text-gray-500">OR</span>
    <div class="flex-grow border-t border-gray-200"></div>
  `;

  // Insert divider between orgs-list and create button
  mainContent.insertBefore(divider, createButtonContainer);

  // Show/hide create button based on session
  updateCreateButtonVisibility();

  // Remove margin-top from create button since divider provides spacing
  createButtonContainer.classList.remove("mt-6");
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

  // Update the text box content based on session state
  updateOrgsTextBox(session);
}

function updateOrgsTextBox(hasSession) {
  if (hasSession) {
    orgsTextNoSession.classList.add("hidden");
    orgsTextWithSession.classList.remove("hidden");
  } else {
    orgsTextNoSession.classList.remove("hidden");
    orgsTextWithSession.classList.add("hidden");
  }
}

function showMainContent() {
  loadingContainer.classList.add("hidden");
  mainContainer.classList.remove("hidden");
}

// Remove the old showError function since we're using showErrorInContainer now

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
