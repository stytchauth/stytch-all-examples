import { stytch } from './stytch-client.js';

// DOM elements
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email-input');
const loginForm = document.getElementById('login-form');
const magicLinkSent = document.getElementById('magic-link-sent');
const cardTitle = document.getElementById('card-title');
const introTextBox = document.getElementById('intro-text-box');
const redirectUrlTextBox = document.getElementById('redirect-url-text-box');
const resendBtn = document.getElementById('resend-btn');
const changeEmailBtn = document.getElementById('change-email-btn');

let currentEmail = '';
let isSendingEmail = false;

// Initialize the page
function init() {
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Email form submission
    emailForm.addEventListener('submit', handleEmailLogin);
    
    // Magic link sent buttons
    resendBtn.addEventListener('click', () => handleEmailLogin(currentEmail));
    changeEmailBtn.addEventListener('click', showLoginForm);
}

async function handleEmailLogin(email) {
    if (typeof email === 'string') {
        currentEmail = email;
    } else {
        // Form submission event
        email.preventDefault();
        currentEmail = emailInput.value.trim();
    }
    
    if (!currentEmail) {
        return;
    }
    
    try {
        const response = await stytch.magicLinks.email.discovery.send({
            email_address: currentEmail,
            discovery_redirect_url: "http://localhost:3000/authenticate",
        });
        
        if (response.status_code === 200) {
            showMagicLinkSent();
        } else {
            throw new Error(`Failed to send magic link: ${response.status_code}`);
        }
    } catch (error) {
        console.error('Error sending magic link:', error);
        alert('Failed to send magic link. Please try again.');
    }
}

function showMagicLinkSent() {
    isSendingEmail = true;
    updateUI();
}

function showLoginForm() {
    isSendingEmail = false;
    updateUI();
}

function updateUI() {
    if (isSendingEmail) {
        // Show magic link sent state
        loginForm.classList.add('hidden');
        magicLinkSent.classList.remove('hidden');
        cardTitle.textContent = 'Check your email';
        introTextBox.classList.add('hidden');
        redirectUrlTextBox.classList.remove('hidden');
    } else {
        // Show login form
        loginForm.classList.remove('hidden');
        magicLinkSent.classList.add('hidden');
        cardTitle.textContent = 'Log in or sign up';
        introTextBox.classList.remove('hidden');
        redirectUrlTextBox.classList.add('hidden');
        emailInput.value = '';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
