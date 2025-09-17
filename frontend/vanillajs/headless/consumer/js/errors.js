// Error handling utilities for the vanilla JS app

/**
 * Shows an error in the existing error container
 * @param {string} title - Error title
 * @param {string} error - Error message
 * @param {string} redirectUrl - Optional redirect URL
 * @param {string} redirectText - Optional redirect button text
 */
export function showErrorInContainer(title, error, redirectUrl = null, redirectText = null) {
    const errorContainer = document.getElementById('error-container');
    const loadingContainer = document.getElementById('loading-container');
    
    if (!errorContainer) {
        console.error('Error container not found');
        return;
    }

    // Hide loading container if it exists
    if (loadingContainer) {
        loadingContainer.classList.add('hidden');
    }

    // Create error box HTML
    let errorBoxHTML = `
        <div class="bg-red-50 border border-gray-200 rounded-lg p-4 max-w-md">
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">${title}</h3>
                    <div class="mt-2 text-sm text-red-700">
                        <p>${error}</p>
                    </div>`;

    if (redirectUrl && redirectText) {
        errorBoxHTML += `
                    <div class="mt-4">
                        <a href="${redirectUrl}" class="text-sm font-medium text-red-800 underline hover:text-red-900">
                            ${redirectText}
                        </a>
                    </div>`;
    }

    errorBoxHTML += `
                </div>
            </div>
        </div>`;

    // Clear container and show error
    errorContainer.innerHTML = errorBoxHTML;
    errorContainer.classList.remove('hidden');
}

/**
 * Hides the error container
 */
export function hideErrorContainer() {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.classList.add('hidden');
        errorContainer.innerHTML = '';
    }
}
