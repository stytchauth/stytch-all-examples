// DOM manipulation utilities for the headless vanillajs app
import { showErrorInContainer, hideErrorContainer } from "./errors.js";

// Generic DOM utilities
export function getElementById(id) {
  return document.getElementById(id);
}

export function addEventListener(element, event, handler) {
  if (element) {
    element.addEventListener(event, handler);
  }
}

export function toggleElementVisibility(element, show) {
  if (element) {
    if (show) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  }
}

export function setElementText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

export function setElementValue(element, value) {
  if (element) {
    element.value = value;
  }
}

export function setElementHTML(element, html) {
  if (element) {
    element.innerHTML = html;
  }
}

export function setElementDisabled(element, disabled) {
  if (element) {
    element.disabled = disabled;
  }
}

// Login page DOM utilities
let currentEmail = "";
let isSendingEmail = false;
let apiError = null;

export function setupLoginEventListeners(handlers) {
  const emailForm = getElementById("email-form");
  const emailInput = getElementById("email-input");
  const resendBtn = getElementById("resend-btn");
  const changeEmailBtn = getElementById("change-email-btn");
  const googleLoginBtn = getElementById("google-login-btn");

  addEventListener(emailForm, "submit", (e) => {
    e.preventDefault();
    currentEmail = emailInput.value.trim();
    handlers.handleEmailLogin(currentEmail);
  });

  addEventListener(resendBtn, "click", () => handlers.handleResendEmail());
  addEventListener(changeEmailBtn, "click", handlers.showLoginForm);

  if (handlers.handleGoogleLogin) {
    addEventListener(googleLoginBtn, "click", handlers.handleGoogleLogin);
  }
}

export function setApiError(error) {
  apiError = error;
  updateErrorDisplay();
}

export function updateErrorDisplay() {
  if (apiError) {
    showErrorInContainer("You've hit an API error", apiError);
  } else {
    hideErrorContainer();
  }
}

export function showMagicLinkSent() {
  isSendingEmail = true;
  updateLoginUI(isSendingEmail);
}

export function showLoginForm() {
  isSendingEmail = false;
  updateLoginUI(isSendingEmail);
}

export function getCurrentEmail() {
  return currentEmail;
}

export function configureOAuthVisibility(enableOAuth) {
  const oauthDivider = document.querySelector(
    ".flex.gap-2.w-full.items-center.mt-4"
  );
  const oauthButtonContainer = document.querySelector(
    ".flex.flex-col.gap-2.w-full.mt-4"
  );

  if (enableOAuth) {
    toggleElementVisibility(oauthDivider, true);
    toggleElementVisibility(oauthButtonContainer, true);
  } else {
    toggleElementVisibility(oauthDivider, false);
    toggleElementVisibility(oauthButtonContainer, false);
  }
}

export function updateLoginUI(isSendingEmail) {
  const loginForm = getElementById("login-form");
  const magicLinkSent = getElementById("magic-link-sent");
  const cardTitle = getElementById("card-title");
  const introTextBox = getElementById("intro-text-box");
  const redirectUrlTextBox = getElementById("redirect-url-text-box");
  const emailInput = getElementById("email-input");

  if (isSendingEmail) {
    toggleElementVisibility(loginForm, false);
    toggleElementVisibility(magicLinkSent, true);
    setElementText(cardTitle, "Check your email");
    toggleElementVisibility(introTextBox, false);
    toggleElementVisibility(redirectUrlTextBox, true);
  } else {
    toggleElementVisibility(loginForm, true);
    toggleElementVisibility(magicLinkSent, false);
    setElementText(cardTitle, "Log in or sign up");
    toggleElementVisibility(introTextBox, true);
    toggleElementVisibility(redirectUrlTextBox, false);
    setElementValue(emailInput, "");
  }
}

// Organizations page DOM utilities
let creatingOrg = false;

export function setupOrganizationsEventListeners(handlers) {
  const createOrgBtn = getElementById("create-org-btn");
  const orgForm = getElementById("org-form");

  addEventListener(createOrgBtn, "click", handlers.showCreateOrgForm);
  addEventListener(orgForm, "submit", handlers.handleCreateOrg);
}

export function renderOrganizations(
  organizations,
  createOrgButton,
  handlers,
  stytch
) {
  const orgsList = getElementById("orgs-list");
  const createButtonContainer = getElementById("create-org-btn")?.parentElement;
  const cardTitle = getElementById("card-title");

  // Update card title
  if (organizations.length > 0) {
    setElementText(cardTitle, "Select an organization");
  } else {
    setElementText(cardTitle, "No organizations found");
  }

  if (organizations.length === 0) {
    setElementHTML(orgsList, "");
    if (createButtonContainer) {
      createButtonContainer.classList.remove("mt-6");
    }
    removeOrgDivider();
    return;
  }

  // Clear and populate organization list
  setElementHTML(orgsList, "");
  organizations.forEach((org) => {
    const button = createOrgButton(org.id, org.name);
    addEventListener(button, "click", () =>
      handlers.selectOrganization(org.id)
    );
    orgsList.appendChild(button);
  });

  addOrgDivider();
  if (createButtonContainer) {
    createButtonContainer.classList.remove("mt-6");
  }

  // Update create button visibility based on session state
  const session = stytch.session.getSync();
  updateCreateButtonVisibility(!!session);
}

function addOrgDivider() {
  const mainContent = getElementById("main-content");
  const createButtonContainer = getElementById("create-org-btn")?.parentElement;

  removeOrgDivider();

  const divider = document.createElement("div");
  divider.id = "org-divider";
  divider.className = "flex gap-2 w-full items-center mt-6 mb-6 px-6";
  divider.innerHTML = `
    <div class="flex-grow border-t border-gray-200"></div>
    <span class="text-xs text-gray-500">OR</span>
    <div class="flex-grow border-t border-gray-200"></div>
  `;

  if (mainContent && createButtonContainer) {
    mainContent.insertBefore(divider, createButtonContainer);
  }
}

function removeOrgDivider() {
  const existingDivider = getElementById("org-divider");
  if (existingDivider) {
    existingDivider.remove();
  }
}

export function showCreateOrgForm() {
  creatingOrg = true;
  updateOrganizationsUI(creatingOrg);
}

export function updateOrganizationsUI(creatingOrg) {
  const mainContent = getElementById("main-content");
  const createOrgContent = getElementById("create-org-content");
  const orgsTextBox = getElementById("orgs-text-box");
  const orgCreateTextBox = getElementById("org-create-text-box");
  const orgNameInput = getElementById("org-name-input");
  const cardTitle = getElementById("card-title");

  if (creatingOrg) {
    toggleElementVisibility(mainContent, false);
    toggleElementVisibility(createOrgContent, true);
    toggleElementVisibility(orgsTextBox, false);
    toggleElementVisibility(orgCreateTextBox, true);
    setElementText(cardTitle, "New organization");
  } else {
    toggleElementVisibility(mainContent, true);
    toggleElementVisibility(createOrgContent, false);
    toggleElementVisibility(orgsTextBox, true);
    toggleElementVisibility(orgCreateTextBox, false);
    setElementValue(orgNameInput, "");
  }
}

export function updateCreateButtonVisibility(hasSession) {
  const createOrgBtn = getElementById("create-org-btn");
  const createButtonContainer = createOrgBtn?.parentElement;
  const orgsTextNoSession = getElementById("orgs-text-no-session");
  const orgsTextWithSession = getElementById("orgs-text-with-session");

  const showCreateOrg = !hasSession;

  if (showCreateOrg) {
    toggleElementVisibility(createButtonContainer, true);
  } else {
    toggleElementVisibility(createButtonContainer, false);
  }

  // Update text box content based on session state
  if (hasSession) {
    toggleElementVisibility(orgsTextNoSession, false);
    toggleElementVisibility(orgsTextWithSession, true);
  } else {
    toggleElementVisibility(orgsTextNoSession, true);
    toggleElementVisibility(orgsTextWithSession, false);
  }
}

export function showMainContent() {
  const loadingContainer = getElementById("loading-container");
  const mainContainer = getElementById("main-container");

  toggleElementVisibility(loadingContainer, false);
  toggleElementVisibility(mainContainer, true);
}

// View session page DOM utilities
let sessionTokens = null;

export function setupViewSessionEventListeners(handlers) {
  const viewTokenBtn = getElementById("view-token-btn");
  const logoutBtn = getElementById("logout-btn");
  const copyJwtBtn = getElementById("copy-jwt-btn");
  const launchJwtDecoderBtn = getElementById("launch-jwt-decoder-btn");
  const backToSessionBtn = getElementById("back-to-session-btn");

  addEventListener(viewTokenBtn, "click", handlers.handleViewToken);
  addEventListener(logoutBtn, "click", handlers.handleLogout);
  addEventListener(copyJwtBtn, "click", handlers.handleCopyJwt);
  addEventListener(
    launchJwtDecoderBtn,
    "click",
    handlers.handleLaunchJwtDecoder
  );
  addEventListener(backToSessionBtn, "click", handlers.handleBackToSession);
}

export function setSessionTokens(tokens) {
  sessionTokens = tokens;
}

export function getSessionTokens() {
  return sessionTokens;
}

export function displaySessionData(user) {
  const emailDisplay = getElementById("email-display");
  const userIdDisplay = getElementById("user-id-display");

  setElementText(emailDisplay, user.emails?.[0]?.email || "N/A");
  setElementText(userIdDisplay, user.user_id || "N/A");
}

export function getOrgNameInput() {
  return getElementById("org-name-input");
}

export function getOrgNameValue() {
  const input = getOrgNameInput();
  return input ? input.value.trim() : "";
}

export function showSessionTokensCard(tokens) {
  const mainCard = getElementById("main-card");
  const sessionTokensCard = getElementById("session-tokens-card");
  const sessionTokenDisplay = getElementById("session-token-display");

  setElementText(sessionTokenDisplay, tokens.session_token);
  toggleElementVisibility(mainCard, false);
  toggleElementVisibility(sessionTokensCard, true);
}

export function showMainCard() {
  const mainCard = getElementById("main-card");
  const sessionTokensCard = getElementById("session-tokens-card");

  toggleElementVisibility(sessionTokensCard, false);
  toggleElementVisibility(mainCard, true);
}

// Toast notification system
export function showToast(message, type = "success") {
  const toastContainer = getElementById("toast-container");
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
