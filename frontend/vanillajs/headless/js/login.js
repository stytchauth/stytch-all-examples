import { stytch } from './stytch-client.js';
import { showErrorInContainer, hideErrorContainer } from './errors.js';

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
const googleLoginBtn = document.getElementById('google-login-btn');

let currentEmail = '';
let isSendingEmail = false;
let apiError = null;

// Initialize the page
function init() {
    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Email form submission
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleEmailLogin(emailInput.value.trim());
    });
    
    // Magic link sent buttons
    resendBtn.addEventListener('click', () => handleEmailLogin(currentEmail));
    changeEmailBtn.addEventListener('click', showLoginForm);
    
    // Google login button
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
}

async function handleEmailLogin(email) {
    currentEmail = email;
    try {
        await stytch.magicLinks.email.discovery.send({
            email_address: currentEmail,
        });
        
        setApiError(null);
        showMagicLinkSent();
    } catch (error) {
        console.error('Error sending magic link:', error);
        setApiError(error.message);
    }
}

async function handleGoogleLogin() {
    try {
        await stytch.oauth.google.discovery.start({});
        setApiError(null);
    } catch (error) {
        console.error('Error starting Google OAuth:', error);
        setApiError(error.message);
    }
}

function setApiError(error) {
    apiError = error;
    updateErrorDisplay();
}

function updateErrorDisplay() {
    if (apiError) {
        showErrorInContainer("You've hit an API error", apiError);
    } else {
        hideErrorContainer();
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
