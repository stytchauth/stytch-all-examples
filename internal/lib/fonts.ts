// Font loading utilities for React components
export const loadGoogleFont = (
  fontFamily: string,
  weights: string[] = ["400"]
) => {
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
    " ",
    "+"
  )}:wght@${weights.join(";")}&display=swap`;
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

// Load fonts on initialization
export const initializeFonts = () => {
  // Load Google Fonts
  loadGoogleFont("Inter", ["300", "400", "500", "600", "700"]);

  // If you have local fonts, they should be loaded via CSS @font-face declarations
  // in your styles.css file
};

// Font family constants for custom Booton font
export const fonts = {
  primary: 'Booton, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  secondary: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"Fira Code", "Monaco", "Cascadia Code", "Segoe UI Mono", monospace',
} as const;

// CSS class utilities
export const fontClasses = {
  primary: "font-default",
  secondary: "font-secondary",
  mono: "font-mono",
} as const;
