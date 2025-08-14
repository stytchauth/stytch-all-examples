import { stytch } from './stytch-client.js';
import { showErrorInContainer } from './errors.js';

// DOM elements
const loadingContainer = document.getElementById('loading-container');
const errorContainer = document.getElementById('error-container');
const mainContainer = document.getElementById('main-container');
const orgsList = document.getElementById('orgs-list');
const createOrgBtn = document.getElementById('create-org-btn');
const mainContent = document.getElementById('main-content');
const createOrgContent = document.getElementById('create-org-content');
const orgForm = document.getElementById('org-form');
const orgNameInput = document.getElementById('org-name-input');
const cancelCreateBtn = document.getElementById('cancel-create-btn');
const orgsTextBox = document.getElementById('orgs-text-box');
const orgCreateTextBox = document.getElementById('org-create-text-box');

let organizations = [];
let creatingOrg = false;

// Initialize the page
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Load organizations
    loadOrganizations();
}

function setupEventListeners() {
    createOrgBtn.addEventListener('click', showCreateOrgForm);
    cancelCreateBtn.addEventListener('click', hideCreateOrgForm);
    orgForm.addEventListener('submit', handleCreateOrg);
}

async function loadOrganizations() {
    try {
        const response = await stytch.discovery.organizations.list();
        
        if (response.status_code === 200) {
            organizations = response.discovered_organizations.map((org) => ({
                id: org.organization.organization_id,
                name: org.organization.organization_name,
            }));
            
            renderOrganizations();
            showMainContent();
        } else {
            throw new Error(`Failed to load organizations: ${response.status_code}`);
        }
    } catch (error) {
        console.error('Error loading organizations:', error);
        showErrorInContainer(
            "Unable to load organizations",
            error.message,
            "/login",
            "Go to login"
        );
    }
}

function renderOrganizations() {
    // Update card title based on state
    const cardTitle = document.getElementById('card-title');
    if (creatingOrg) {
        cardTitle.textContent = 'New organization';
    } else if (organizations.length > 0) {
        cardTitle.textContent = 'Select an organization';
    } else {
        cardTitle.textContent = 'No organizations found';
    }
    
    if (organizations.length === 0) {
        orgsList.innerHTML = '';
        // Remove margin-top from create button container when no orgs
        const createButtonContainer = createOrgBtn.parentElement;
        createButtonContainer.classList.remove('mt-6');
        return;
    }
    
    orgsList.innerHTML = organizations.map(org => `
        <button
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-blue-500 focus-visible:ring-blue-500/50 focus-visible:ring-[3px] bg-white text-black shadow-sm hover:bg-gray-100 h-12 px-4 py-2 has-[>svg]:px-3 border border-gray-200 w-full"
            onclick="window.selectOrganization('${org.id}')"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 22V4C6 3.46957 6.21071 2.96086 6.58579 2.58579C6.96086 2.21071 7.46957 2 8 2H16C16.5304 2 17.0391 2.21071 17.4142 2.58579C17.7893 2.96086 18 3.46957 18 4V22M6 22H18M6 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V14C2 13.4696 2.21071 12.9609 2.58579 12.5858C2.96086 12.2107 3.46957 12 4 12H6M18 22H20C20.5304 22 21.0391 21.7893 21.4142 21.4142C21.7893 21.0391 22 20.5304 22 20V11C22 10.4696 21.7893 9.96086 21.4142 9.58579C21.0391 9.21071 20.5304 9 20 9H18M10 6H14M10 10H14M10 14H14M10 18H14" stroke="#09090B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="flex-1 text-left text-body1 font-bold">${org.name}</p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13 18L19 12" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13 6L19 12" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `).join('');
    
    // Make selectOrganization available globally
    window.selectOrganization = selectOrganization;
    
    // Show/hide create button based on session
    updateCreateButtonVisibility();
    
    // Add margin-top back when there are orgs
    const createButtonContainer = createOrgBtn.parentElement;
    createButtonContainer.classList.add('mt-6');
}

async function selectOrganization(orgId) {
    try {
        const session = stytch.session.getSync();
        let response;
        
        if (session) {
            // If the member already has a session, exchange it for the new organization
            response = await stytch.session.exchange({
                organization_id: orgId,
                session_duration_minutes: 60,
            });
        } else {
            // Otherwise, use the discovery flow to exchange an intermediate session for a session in that org
            response = await stytch.discovery.intermediateSessions.exchange({
                organization_id: orgId,
                session_duration_minutes: 60,
            });
        }
        
        if (response.status_code === 200) {
            window.location.href = '/view-session';
        } else {
            throw new Error(`Failed to select organization: ${response.status_code}`);
        }
            } catch (error) {
            console.error('Error selecting organization:', error);
            showErrorInContainer("There was an error", error.message, "/login", "Go to login");
        }
}

function showCreateOrgForm() {
    creatingOrg = true;
    updateUI();
}

function hideCreateOrgForm() {
    creatingOrg = false;
    updateUI();
}

async function handleCreateOrg(event) {
    event.preventDefault();
    
    const orgName = orgNameInput.value.trim();
    if (!orgName) return;
    
    try {
        const response = await stytch.discovery.organizations.create({
            organization_name: orgName,
            sso_jit_provisioning: "ALL_ALLOWED",
            session_duration_minutes: 60,
        });
        
        if (response.status_code === 200) {
            window.location.href = '/view-session';
        } else {
            throw new Error(`Failed to create organization: ${response.status_code}`);
        }
            } catch (error) {
            console.error('Error creating organization:', error);
            showErrorInContainer("There was an error", error.message, "/login", "Go to login");
        }
}

function updateUI() {
    if (creatingOrg) {
        mainContent.classList.add('hidden');
        createOrgContent.classList.remove('hidden');
        orgsTextBox.classList.add('hidden');
        orgCreateTextBox.classList.remove('hidden');
    } else {
        mainContent.classList.remove('hidden');
        createOrgContent.classList.add('hidden');
        orgsTextBox.classList.remove('hidden');
        orgCreateTextBox.classList.add('hidden');
        orgNameInput.value = '';
    }
}

function updateCreateButtonVisibility() {
    const session = stytch.session.getSync();
    const showCreateOrg = !session; // Only show create button if no session
    
    const createButtonContainer = createOrgBtn.parentElement;
    
    if (showCreateOrg) {
        createButtonContainer.classList.remove('hidden');
    } else {
        createButtonContainer.classList.add('hidden');
    }
}

function showMainContent() {
    loadingContainer.classList.add('hidden');
    mainContainer.classList.remove('hidden');
}

// Remove the old showError function since we're using showErrorInContainer now

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
