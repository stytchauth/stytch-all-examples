// ErrorBox Component for Vanilla JS
export function createErrorBox(title, error, redirectUrl = null, redirectText = null) {
    const errorBox = document.createElement('div');
    errorBox.className = 'relative w-full rounded-lg border px-4 py-3 text-sm grid gap-y-0.5 items-start max-w-md text-red-500 bg-white border-gray-200';
    errorBox.setAttribute('role', 'alert');
    
    const titleElement = document.createElement('div');
    titleElement.className = 'font-default font-semibold tracking-tight text-red-500';
    titleElement.textContent = title;
    
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'grid justify-items-start gap-1 text-body2';
    
    const errorText = document.createElement('p');
    errorText.className = 'leading-relaxed text-red-500/90';
    errorText.textContent = error;
    descriptionElement.appendChild(errorText);
    
    // Add redirect link if provided
    if (redirectUrl && redirectText) {
        const link = document.createElement('a');
        link.href = redirectUrl;
        link.className = 'underline text-red-500/90';
        link.textContent = redirectText;
        descriptionElement.appendChild(link);
    }
    
    errorBox.appendChild(titleElement);
    errorBox.appendChild(descriptionElement);
    
    return errorBox;
}

// Helper function to show error in a centered container
export function showErrorInContainer(container, title, error, redirectUrl = null, redirectText = null) {
    container.innerHTML = '';
    const errorBox = createErrorBox(title, error, redirectUrl, redirectText);
    container.appendChild(errorBox);
}

// Helper function to show error as a toast notification
export function showToastError(title, error) {
    const errorBox = document.createElement('div');
    errorBox.className = 'fixed top-4 right-4 z-50';
    errorBox.appendChild(createErrorBox(title, error));
    document.body.appendChild(errorBox);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorBox.parentNode) {
            errorBox.parentNode.removeChild(errorBox);
        }
    }, 5000);
}
