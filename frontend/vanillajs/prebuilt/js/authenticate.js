import { stytch } from "./stytch-client.js";

const orgsTextBox = document.getElementById("orgs-text-box");
const orgCreateTextBox = document.getElementById("org-create-text-box");
const createOrgContainer = document.getElementById("create-org-container");
const stytchSDK = document.getElementById("stytch-sdk");
const orgCreateForm = document.getElementById("org-create-form");
const orgNameInput = document.getElementById("org-name-input");
const createOrgBtn = document.getElementById("create-org-btn");

// Initialize the page
function init() {
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
          orgsTextBox.classList.add("hidden");
          orgCreateTextBox.classList.remove("hidden");
          createOrgContainer.classList.remove("hidden");
          stytchSDK.classList.add("hidden");
        } else if (type === "B2B_DISCOVERY_INTERMEDIATE_SESSION_EXCHANGE") {
          window.location.href = "/view-session";
        }
      },
    },
  });

  // Set up event listeners for org creation
  setupOrgCreateEventListeners();
}

function setupOrgCreateEventListeners() {
  // Handle form submission
  orgCreateForm.addEventListener("submit", handleCreateOrg);

  // Handle input changes to update button states
  orgNameInput.addEventListener("input", updateButtonStates);
}

async function handleCreateOrg(event) {
  event.preventDefault();

  const orgName = orgNameInput.value.trim();
  if (!orgName) return;

  // Disable form during submission
  createOrgBtn.disabled = true;
  createOrgBtn.innerHTML = `
    <div class="flex flex-row gap-2 items-center">
      <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Creating
    </div>
  `;

  try {
    // Update the organization name using the Stytch SDK
    await stytch.organization.update({ organization_name: orgName });

    // Redirect to view-session page
    window.location.href = "/view-session";
  } catch (error) {
    console.error("Error creating organization:", error);

    // Re-enable form on error
    createOrgBtn.disabled = false;
    createOrgBtn.textContent = "Create";

    // You could add error handling here if needed
  }
}

function updateButtonStates() {
  const hasInput = orgNameInput.value.trim().length > 0;
  createOrgBtn.disabled = !hasInput;
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
