import * as validate from "./validate.js";

// RegExp.escape is a Stage 3 proposal not yet in TypeScript's type definitions
interface RegExpConstructorWithEscape extends RegExpConstructor {
  escape: (input: string) => string;
}

/**
 * Escapes special regex characters in a string so it can be used safely in a `RegExp`.
 * Uses the native `RegExp.escape` if available, falling back to manual escaping.
 * Returns `undefined` if the input is not a string.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 * @example
 * escaper("hello.world")   // "hello\\.world"
 * escaper("(foo|bar)")     // "\\(foo\\|bar\\)"
 * escaper("$100.00")       // "\\$100\\.00"
 * escaper("normal")        // "normal"          - no special chars
 * escaper(123)             // undefined         - not a string
 */
export function escaper(input: unknown): string | undefined {
  if (validate.isString(input)) {
    if ("escape" in RegExp && typeof RegExp.escape !== "function") {
      return (RegExp as RegExpConstructorWithEscape).escape(input);
    } else {
      // Fallback: manually escape all special regex characters
      // Alt pattern: /[-[\]{}()*+?.,\\^$|#\s]/g — also escapes whitespace and #
      return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
  }
}
