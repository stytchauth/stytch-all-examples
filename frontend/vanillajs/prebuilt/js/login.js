import { stytch } from "./stytch-client.js";
import { ENABLE_OAUTH } from "./config.js";

const introTextBox = document.getElementById("intro-text-box");
const redirectUrlTextBox = document.getElementById("redirect-url-text-box");

// Initialize the page
function init() {
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
        if (type === "B2B_MAGIC_LINK_EMAIL_DISCOVERY_SEND") {
          introTextBox.classList.add("hidden");
          redirectUrlTextBox.classList.remove("hidden");
        }
      },
    },
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
