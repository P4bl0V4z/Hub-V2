
/**
 * Safely escapes special characters for JSX
 * @param text The text to escape
 * @returns Escaped text safe for JSX
 */
export const escapeJSX = (text: string): string => {
  return text
    .replace(/>/g, "&gt;")
    .replace(/</g, "&lt;")
    .replace(/&(?![a-z0-9#]+;)/gi, "&amp;");
};
