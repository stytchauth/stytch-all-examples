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
    // Stytch SDK method to send a magic link email
    await stytch.magicLinks.email.loginOrCreate(email, {
      login_magic_link_url: "http://localhost:3000/authenticate",
      login_expiration_minutes: 60,
      signup_magic_link_url: "http://localhost:3000/authenticate",
      signup_expiration_minutes: 60,
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
    // Stytch SDK method to start a Google oauth flow
    await stytch.oauth.google.start({});
    setApiError(null);
  } catch (error) {
    console.error("Error starting Google OAuth:", error);
    setApiError(error.message);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
