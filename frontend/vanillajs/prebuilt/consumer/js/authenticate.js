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
      "/",
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
    if (tokenType === "oauth") {
      // Stytch SDK method to authenticate an OAuth token
      await stytch.oauth.authenticate(token, {
        session_duration_minutes: 60,
      });
    } else if (tokenType === "magic_links") {
      // Stytch SDK method to authenticate a magic link token
      await stytch.magicLinks.authenticate(token, {
        session_duration_minutes: 60,
      });
    } else {
      throw new Error(
        "The token type found in the URL is not supported for this example app."
      );
    }

    // Authentication successful, redirect to view-session
    window.location.href = "/view-session";
  } catch (error) {
    console.error("Authentication error:", error);
    isAuthenticating = false; // Reset on error
    showErrorInContainer(
      "You've hit an error",
      error.message || "There was an error authenticating your token",
      "/",
      "Go to login"
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
