import { stytch } from "./stytch-client.js";

const orgsTextBox = document.getElementById("orgs-text-box");
const orgCreateTextBox = document.getElementById("org-create-text-box");
const createOrgContainer = document.getElementById("create-org-container");
const stytchSDK = document.getElementById("stytch-sdk");

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
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
