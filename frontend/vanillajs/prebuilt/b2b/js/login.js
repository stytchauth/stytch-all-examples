import { stytch } from "./stytch-client.js";
import { ENABLE_OAUTH } from "./config.js";
import { updateLoginUI } from "./dom-utils.js";

// Initialize the page
function init() {
  // Stytch SDK method to mount the prebuilt UI components
  stytch.mount({
    elementId: "#stytch-sdk",
    config: {
      authFlowType: "Discovery",
      products: ["emailMagicLinks", ...(ENABLE_OAUTH ? ["oauth"] : [])],
      sessionOptions: { sessionDurationMinutes: 60 },
      ...(ENABLE_OAUTH && {
        oauthOptions: {
          providers: [{ type: "google" }],
        },
      }),
    },
    callbacks: {
      onEvent: ({ type }) => {
        updateLoginUI(type);
      },
    },
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
