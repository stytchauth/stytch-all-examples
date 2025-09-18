import { stytch } from "./stytch-client.js";
import { ENABLE_OAUTH } from "./config.js";
import {
  setupLoginEventListeners,
  configureOAuthVisibility,
  setApiError,
  showMagicLinkSent,
  showLoginForm,
  getCurrentEmail,
} from "./dom-utils.js";

// Initialize the page
function init() {
  // Set up event listeners
  setupEventListeners();

  // Configure OAuth visibility
  configureOAuthVisibility(ENABLE_OAUTH);
}

function setupEventListeners() {
  setupLoginEventListeners({
    handleEmailLogin,
    handleResendEmail: () => handleEmailLogin(getCurrentEmail()),
    showLoginForm,
    handleGoogleLogin: ENABLE_OAUTH ? handleGoogleLogin : null,
  });
}

async function handleEmailLogin(email) {
  try {
    // Stytch SDK method to send a discovery magic link email
    await stytch.magicLinks.email.discovery.send({
      email_address: email,
    });

    setApiError(null);
    showMagicLinkSent();
  } catch (error) {
    console.error("Error sending magic link:", error);
    setApiError(error.message);
  }
}

async function handleGoogleLogin() {
  try {
    // Stytch SDK method to start a Google discovery oauth flow
    await stytch.oauth.google.discovery.start({});
    setApiError(null);
  } catch (error) {
    console.error("Error starting Google OAuth:", error);
    setApiError(error.message);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
