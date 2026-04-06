import * as validate from "./validate.js";

/**
 * Copies a string to the clipboard.
 * Uses the modern `navigator.clipboard` API where available,
 * with a legacy `execCommand` fallback for older browsers.
 * No-op if the input is not a string or if not in a browser environment.
 * @example
 * await copyText("hello")  // "hello" is copied to clipboard
 * await copyText(123)      // no-op - not a string
 */
export async function copyText(input: unknown): Promise<void> {
  if (validate.isEnvDocument && validate.isString(input)) {
    try {
      await navigator.clipboard.writeText(input);
    } catch {
      // Fallback for older browsers — execCommand is deprecated but widely supported
      const element = document.createElement("textarea");
      element.value = input;
      element.style.cssText =
        "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(element);
      element.select();
      document.execCommand("copy");
      document.body.removeChild(element);
    }
  }
}
