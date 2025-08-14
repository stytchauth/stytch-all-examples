import { stytch } from './stytch-client.js';
import { showErrorInContainer } from './errors.js';

// DOM elements
const loadingContainer = document.getElementById('loading-container');
const mainContainer = document.getElementById('main-container');
const emailDisplay = document.getElementById('email-display');
const memberIdDisplay = document.getElementById('member-id-display');
const orgNameDisplay = document.getElementById('org-name-display');
const viewTokenBtn = document.getElementById('view-token-btn');
const switchOrgsBtn = document.getElementById('switch-orgs-btn');
const logoutBtn = document.getElementById('logout-btn');

// Session tokens card elements
const mainCard = document.getElementById('main-card');
const sessionTokensCard = document.getElementById('session-tokens-card');
const sessionTokenDisplay = document.getElementById('session-token-display');
const jwtDisplay = document.getElementById('jwt-display');
const copyJwtBtn = document.getElementById('copy-jwt-btn');
const launchJwtDecoderBtn = document.getElementById('launch-jwt-decoder-btn');
const backToSessionBtn = document.getElementById('back-to-session-btn');

let sessionTokens = null;

// Initialize the page
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Load session data
    loadSessionData();
}

function setupEventListeners() {
    viewTokenBtn.addEventListener('click', handleViewToken);
    switchOrgsBtn.addEventListener('click', () => {
        window.location.href = '/organizations';
    });
    
    logoutBtn.addEventListener('click', handleLogout);
    
    // Session tokens card event listeners
    copyJwtBtn.addEventListener('click', handleCopyJwt);
    launchJwtDecoderBtn.addEventListener('click', handleLaunchJwtDecoder);
    backToSessionBtn.addEventListener('click', handleBackToSession);
}

function loadSessionData() {
    const member = stytch.member.getSync();
    const organization = stytch.organization.getSync();
    sessionTokens = stytch.session.getTokens();
    
    if (member && organization && sessionTokens) {
        // Display session information
        emailDisplay.textContent = member.email_address || 'N/A';
        memberIdDisplay.textContent = member.member_id || 'N/A';
        orgNameDisplay.textContent = organization.organization_name || 'N/A';
        
        // Show main content
        loadingContainer.classList.add('hidden');
        mainContainer.classList.remove('hidden');
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
        jwtDisplay.textContent = sessionTokens.session_jwt.substring(0, 300) + '...';
        
        // Show the session tokens card
        mainCard.classList.add('hidden');
        sessionTokensCard.classList.remove('hidden');
    }
}

function handleCopyJwt() {
    if (sessionTokens) {
        navigator.clipboard.writeText(sessionTokens.session_jwt);
    }
}

function handleLaunchJwtDecoder() {
    window.open('https://jwts.dev');
}

function handleBackToSession() {
    // Hide the session tokens card and show the main card
    sessionTokensCard.classList.add('hidden');
    mainCard.classList.remove('hidden');
}

async function handleLogout() {
    try {
        // Revoke the session
        await stytch.session.revoke();
        
        // Redirect to login page
        window.location.href = '/';
    } catch (error) {
        console.error('Error during logout:', error);
        // Even if there's an error, redirect to login
        window.location.href = '/';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
