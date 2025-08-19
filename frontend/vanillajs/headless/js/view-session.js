import { showErrorInContainer } from "./errors.js";
import { stytch } from "./stytch-client.js";

// DOM elements
const loadingContainer = document.getElementById("loading-container");
const mainContainer = document.getElementById("main-container");
const emailDisplay = document.getElementById("email-display");
const memberIdDisplay = document.getElementById("member-id-display");
const orgNameDisplay = document.getElementById("org-name-display");
const viewTokenBtn = document.getElementById("view-token-btn");
const switchOrgsBtn = document.getElementById("switch-orgs-btn");
const logoutBtn = document.getElementById("logout-btn");

// Session tokens card elements
const mainCard = document.getElementById("main-card");
const sessionTokensCard = document.getElementById("session-tokens-card");
const sessionTokenDisplay = document.getElementById("session-token-display");
const jwtDisplay = document.getElementById("jwt-display");
const copyJwtBtn = document.getElementById("copy-jwt-btn");
const launchJwtDecoderBtn = document.getElementById("launch-jwt-decoder-btn");
const backToSessionBtn = document.getElementById("back-to-session-btn");

let sessionTokens = null;

// Initialize the page
function init() {
  // Set up event listeners
  setupEventListeners();

  // Load session data
  loadSessionData();
}

function setupEventListeners() {
  viewTokenBtn.addEventListener("click", handleViewToken);
  switchOrgsBtn.addEventListener("click", () => {
    window.location.href = "/organizations";
  });

  logoutBtn.addEventListener("click", handleLogout);

  // Session tokens card event listeners
  copyJwtBtn.addEventListener("click", handleCopyJwt);
  launchJwtDecoderBtn.addEventListener("click", handleLaunchJwtDecoder);
  backToSessionBtn.addEventListener("click", handleBackToSession);
}

function loadSessionData() {
  const member = stytch.member.getSync();
  const organization = stytch.organization.getSync();
  sessionTokens = stytch.session.getTokens();

  if (member && organization && sessionTokens) {
    // Display session information
    emailDisplay.textContent = member.email_address || "N/A";
    memberIdDisplay.textContent = member.member_id || "N/A";
    orgNameDisplay.textContent = organization.organization_name || "N/A";

    // Show main content
    loadingContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
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

function handleViewToken() {
  if (sessionTokens) {
    // Populate the session tokens card
    sessionTokenDisplay.textContent = sessionTokens.session_token;

    // Show the session tokens card
    mainCard.classList.add("hidden");
    sessionTokensCard.classList.remove("hidden");
  }
}

function handleCopyJwt() {
  if (sessionTokens) {
    navigator.clipboard
      .writeText(sessionTokens.session_jwt)
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
  // Hide the session tokens card and show the main card
  sessionTokensCard.classList.add("hidden");
  mainCard.classList.remove("hidden");
}

async function handleLogout() {
  try {
    // Revoke the session
    await stytch.session.revoke();

    // Redirect to login page
    window.location.href = "/";
  } catch (error) {
    console.error("Error during logout:", error);
    // Even if there's an error, redirect to login
    window.location.href = "/";
  }
}

// Toast notification system
function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `
        flex items-center gap-2 px-4 py-3 rounded-md shadow-lg text-sm font-medium
        transform transition-all duration-300 ease-in-out translate-x-full opacity-0
        ${
          type === "success"
            ? "bg-green-100 text-green-800 border border-green-200"
            : "bg-red-100 text-red-800 border border-red-200"
        }
    `;

  toast.innerHTML = `
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            ${
              type === "success"
                ? '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>'
                : '<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>'
            }
        </svg>
        <span>${message}</span>
    `;

  toastContainer.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove("translate-x-full", "opacity-0");
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    toast.classList.add("translate-x-full", "opacity-0");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
