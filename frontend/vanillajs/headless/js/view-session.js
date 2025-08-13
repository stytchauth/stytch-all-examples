import { stytch } from './stytch-client.js';

// DOM elements
const loadingContainer = document.getElementById('loading-container');
const mainContainer = document.getElementById('main-container');
const emailDisplay = document.getElementById('email-display');
const memberIdDisplay = document.getElementById('member-id-display');
const orgNameDisplay = document.getElementById('org-name-display');
const viewTokenBtn = document.getElementById('view-token-btn');
const switchOrgsBtn = document.getElementById('switch-orgs-btn');
const logoutBtn = document.getElementById('logout-btn');

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
}

function loadSessionData() {
    const member = stytch.member.getSync();
    const organization = stytch.organization.getSync();
    const tokens = stytch.session.getTokens();
    
    if (member && organization && tokens) {
        // Display session information
        emailDisplay.textContent = member.email_address || 'N/A';
        memberIdDisplay.textContent = member.member_id || 'N/A';
        orgNameDisplay.textContent = organization.organization_name || 'N/A';
        
        // Show main content
        loadingContainer.classList.add('hidden');
        mainContainer.classList.remove('hidden');
    } else {
        // Session data not available, redirect to login
        window.location.href = '/';
    }
}

function handleViewToken() {
    const tokens = stytch.session.getTokens();
    console.log(tokens.session_token);
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
