import * as validate from "./validate.js";
import { escaper } from "./escaper.js";

/**
 * Removes one or more strings or regex patterns from a string.
 * Matches are case-insensitive and global.
 * Returns the original string if `removes` is empty.
 * Returns an empty string if the input is not a string.
 * @example
 * removeStrings("Hello, World!", ["World"])          // "Hello, !"
 * removeStrings("Hello, World!", ["hello", "world"]) // ", !"           - case-insensitive
 * removeStrings("Hello, World!", [/world/i])         // "Hello, !"      - regex pattern
 * removeStrings("Hello, World!", [])                 // "Hello, World!" - no removals
 * removeStrings(123, ["hello"])                      // ""              - not a string
 */
export function removeStrings(
  input: unknown,
  removes: (string | RegExp)[] = [],
): string {
  if (!validate.isString(input) || !validate.isArrayNonEmpty(removes)) {
    return validate.isString(input) ? input : "";
  }

  let result = input;

  for (const r of removes) {
    if (validate.isRegex(r)) {
      result = result.replace(new RegExp(r.source, "gi"), "");
    } else if (validate.isString(r)) {
      const escaped = escaper(r);
      if (escaped) result = result.replace(new RegExp(escaped, "gi"), "");
    }
  }

  return result;
}
