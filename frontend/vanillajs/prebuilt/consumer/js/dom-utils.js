// DOM manipulation utilities for the prebuilt vanillajs app

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
export function updateLoginUI(eventType) {
  const introTextBox = getElementById("intro-text-box");
  const redirectUrlTextBox = getElementById("redirect-url-text-box");

  if (eventType === "MAGIC_LINK_LOGIN_OR_CREATE") {
    toggleElementVisibility(introTextBox, false);
    toggleElementVisibility(redirectUrlTextBox, true);
  }
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

export function showMainContent() {
  const loadingContainer = getElementById("loading-container");
  const mainContainer = getElementById("main-container");

  toggleElementVisibility(loadingContainer, false);
  toggleElementVisibility(mainContainer, true);
}

export function showSessionTokensCard(tokens) {
  const mainCard = getElementById("main-card");
  const sessionTokensCard = getElementById("session-tokens-card");
  const sessionTokenDisplay = getElementById("session-token-display");
  const jwtDisplay = getElementById("jwt-display");

  setElementText(sessionTokenDisplay, tokens.session_token);
  setElementText(jwtDisplay, tokens.session_jwt.substring(0, 300) + "...");
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
