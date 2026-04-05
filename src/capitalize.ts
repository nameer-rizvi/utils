import * as validate from "./validate.js";

/**
 * Capitalizes the first character of a string.
 * Returns `undefined` if the input is not a string, and `""` if the string is empty or whitespace-only.
 * @example
 * capitalize("hello")       // "Hello"
 * capitalize("hello world") // "Hello world"
 * capitalize("  hello")     // "Hello" - leading whitespace is trimmed
 * capitalize("")            // ""
 * capitalize(123)           // undefined - not a string
 */
export function capitalize(input: unknown): string | undefined {
  if (validate.isString(input)) {
    const trimmed = input.trim();

    if (!trimmed) return "";

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }
}
