import * as validate from "./validate.js";
import { escaper } from "./escaper.js";

/**
 * Replaces one or more strings or regex patterns in a string with a replacement value.
 * Matches are case-insensitive and global.
 * Returns the original string if `replaces` is empty.
 * Returns an empty string if the input is not a string.
 * @example
 * replaceStrings("Hello, World!", [["World", "Earth"]])         // "Hello, Earth!"
 * replaceStrings("Hello, World!", [["hello", "Hi"]])            // "Hi, World!"  - case-insensitive
 * replaceStrings("Hello, World!", [[/world/i, "Earth"]])        // "Hello, Earth!" - regex pattern
 * replaceStrings("aabbcc", [["a", "x"], ["b", "y"]])           // "xxyycc" - multiple replacements
 * replaceStrings("Hello, World!", [])                           // "Hello, World!" - no replacements
 * replaceStrings(123, [["hello", "world"]])                     // '' - not a string
 */
export function replaceStrings(
  input: unknown,
  replaces: [string | RegExp, string][] = [],
): string {
  if (!validate.isString(input) || !validate.isArrayNonEmpty(replaces)) {
    return validate.isString(input) ? input : "";
  }

  let result = input;

  for (const [pattern, replacement] of replaces) {
    if (validate.isRegex(pattern)) {
      result = result.replace(new RegExp(pattern.source, "gi"), replacement);
    } else if (validate.isString(pattern)) {
      const escaped = escaper(pattern);
      if (escaped) {
        result = result.replace(new RegExp(escaped, "gi"), replacement);
      }
    }
  }

  return result;
}
