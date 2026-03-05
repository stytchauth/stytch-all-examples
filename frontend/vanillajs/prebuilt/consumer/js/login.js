import { stytchClient } from "./stytch-client.js";
import { ENABLE_OAUTH } from "./config.js";
import { updateLoginUI } from "./dom-utils.js";

const { Products } = stytch;

// Initialize the page
function init() {
  // Stytch SDK method to render the prebuilt UI components using custom elements
  const element = document.getElementById("stytch-sdk");
  element.render({
    client: stytchClient,
    config: {
      products: [
        Products.emailMagicLinks,
        ...(ENABLE_OAUTH ? [Products.oauth] : []),
      ],
      emailMagicLinksOptions: {
        loginRedirectURL: "http://localhost:3000/authenticate",
        signupRedirectURL: "http://localhost:3000/authenticate",
        loginExpirationMinutes: 60,
        signupExpirationMinutes: 60,
      },
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
