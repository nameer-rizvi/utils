import * as validate from "./validate.js";
import { trimPunctuation } from "./trimPunctuation.js";
import { cleanString } from "./cleanString.js";

/**
 * Converts a string into a URL-safe slug.
 * Normalizes unicode, expands common symbols, strips punctuation, and encodes the result.
 * Returns `""` if the input is not a string or `maxlength` is invalid.
 * @example
 * slug("Hello, World!")           // "hello-world"
 * slug("Hello, World!", "_")      // "hello_world"               - custom delimiter
 * slug("100% off & more")         // "100-percent-off-and-more"
 * slug("user@example.com")        // "user-at-example-com"
 * slug("a=b")                     // "a-is-b"
 * slug("Hello, World!", "_", 5)   // "hello"                     - maxlength applied
 * slug(123)                       // ""                          - not a string
 */
export function slug(
  input: unknown,
  delimiter = "-",
  maxlength = 2000,
): string {
  if (!validate.isString(input) || maxlength <= 0) return "";

  const expanded = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[&+]/g, " and ")
    .replace(/@/g, " at ")
    .replace(/%/g, " percent ")
    .replace(/=/g, " is ");

  const cleaned = trimPunctuation(cleanString(expanded) ?? "") ?? "";

  const output = cleaned
    .replace(/\s+/g, delimiter)
    .slice(0, maxlength)
    .replace(new RegExp(`^${delimiter}+|${delimiter}+$`, "g"), "") // remove trailing/repeating delimiters
    .toLowerCase();

  return encodeURIComponent(output); // encode after all mutations are complete
}
