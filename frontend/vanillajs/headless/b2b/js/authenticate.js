import { stytch } from "./stytch-client.js";
import { showErrorInContainer } from "./errors.js";

let isAuthenticating = false;

// Initialize the page
function init() {
  // Check if user already has a session
  const session = stytch.session.getSync();
  if (session) {
    // User already has a session, redirect to view-session
    window.location.href = "/view-session";
    return;
  }

  // Start authentication process
  authenticateToken();
}

async function authenticateToken() {
  // Get the token and token type from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const tokenType = urlParams.get("stytch_token_type");

  if (!token || !tokenType) {
    showErrorInContainer(
      "You've hit an error",
      "There is no token found in the URL. This likely means you didn't go through the login flow.",
      "/login",
      "Go to login"
    );
    return;
  }

  if (isAuthenticating) {
    // if already authenticating, don't do anything
    return;
  }

  isAuthenticating = true;

  try {
    if (tokenType === "discovery_oauth") {
      // Stytch SDK method to authenticate an OAuth token
      await stytch.oauth.discovery.authenticate({
        discovery_oauth_token: token,
      });
    } else if (tokenType === "discovery") {
      // Stytch SDK method to authenticate a magic link token
      await stytch.magicLinks.discovery.authenticate({
        discovery_magic_links_token: token,
      });
    } else {
      throw new Error(
        "The token type found in the URL is not supported for this example app."
      );
    }

    // Authentication successful, redirect to organizations
    window.location.href = "/organizations";
  } catch (error) {
    console.error("Authentication error:", error);
    isAuthenticating = false; // Reset on error
    showErrorInContainer(
      "You've hit an error",
      error.message || "There was an error authenticating your token",
      "/login",
      "Go to login"
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
