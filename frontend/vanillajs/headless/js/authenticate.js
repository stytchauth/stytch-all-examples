import { stytch } from './stytch-client.js';

// DOM elements
const loadingContainer = document.getElementById('loading-container');
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');

// Initialize the page
function init() {
    // Start authentication process
    authenticateToken();
}

async function authenticateToken() {
    // Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError('No authentication token found in URL');
        return;
    }

    try {
        const response = await stytch.magicLinks.discovery.authenticate({
            discovery_magic_links_token: token,
        });
        
        if (response.status_code === 200) {
            // Authentication successful, redirect to organizations
            window.location.href = '/organizations';
        } else {
            throw new Error(`Authentication failed: ${response.status_code}`);
        }
    } catch (error) {
        console.error('Authentication error:', error);
        showError(error.message || 'There was an error authenticating your magic link token');
    }
}

function showError(message) {
    loadingContainer.classList.add('hidden');
    errorContainer.classList.remove('hidden');
    errorMessage.textContent = message;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
