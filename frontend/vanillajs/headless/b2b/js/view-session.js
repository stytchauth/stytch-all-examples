import { showErrorInContainer } from "./errors.js";
import { stytch } from "./stytch-client.js";
import { ENABLE_OAUTH } from "./config.js";
import {
  setupViewSessionEventListeners,
  displaySessionData,
  showMainContent,
  showSessionTokensCard,
  showMainCard,
  showToast,
  setSessionTokens,
  getSessionTokens,
} from "./dom-utils.js";

// Initialize the page
function init() {
  // Set up event listeners
  setupEventListeners();

  // Configure OAuth callout visibility
  configureOAuthCalloutVisibility();

  // Load session data
  loadSessionData();
}

function setupEventListeners() {
  setupViewSessionEventListeners({
    handleViewToken,
    handleSwitchOrgs: () => {
      window.location.href = "/organizations";
    },
    handleLogout,
    handleCopyJwt,
    handleLaunchJwtDecoder,
    handleBackToSession,
  });
}

function loadSessionData() {
  // Stytch SDK method to get the current session synchronously
  const session = stytch.session.getSync();

  // Check if user has a session, if not redirect to home
  if (!session) {
    window.location.href = "/";
    return;
  }

  // Stytch SDK method to get the current member synchronously
  const member = stytch.member.getSync();
  // Stytch SDK method to get the current organization synchronously
  const organization = stytch.organization.getSync();
  // Stytch SDK method to get the current session tokens
  const tokens = stytch.session.getTokens();
  setSessionTokens(tokens);

  if (member && organization && tokens) {
    // Display session information
    displaySessionData(member, organization);

    // Show main content
    showMainContent();
  } else {
    // Show error for missing session data
    showErrorInContainer(
      "No session data found",
      "Unable to load session data from the SDK. Please ensure you are logged in and have a valid session.",
      "/",
      "Go to login"
    );
  }
}

async function handleLogout() {
  try {
    // Stytch SDK method to revoke the current session
    await stytch.session.revoke();

    // Redirect to login page
    window.location.href = "/";
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if there's an error, redirect to login
    window.location.href = "/";
  }
}

// UI handlers
function handleViewToken() {
  const tokens = getSessionTokens();
  if (tokens) {
    showSessionTokensCard(tokens);
  }
}

function handleCopyJwt() {
  const tokens = getSessionTokens();
  if (tokens) {
    navigator.clipboard
      .writeText(tokens.session_jwt)
      .then(() => {
        showToast("JWT copied to clipboard", "success");
      })
      .catch((err) => {
        console.error("Failed to copy JWT:", err);
        showToast("Failed to copy JWT", "error");
      });
  }
}

function handleLaunchJwtDecoder() {
  window.open("https://jwts.dev");
}

function handleBackToSession() {
  showMainCard();
}

function configureOAuthCalloutVisibility() {
  // Hide the OAuth callout if OAuth is already enabled
  if (ENABLE_OAUTH) {
    const oauthCallout = document.getElementById("oauth-callout");
    if (oauthCallout) {
      oauthCallout.style.display = "none";
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
