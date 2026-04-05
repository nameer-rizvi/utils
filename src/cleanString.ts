import * as validate from "./validate.js";
import { trim } from "./trim.js";
import he from "he";
import { stripHtml } from "string-strip-html";

/**
 * Cleans a string by stripping HTML tags, decoding HTML entities, and normalizing whitespace.
 * Returns `undefined` if the input is not a string.
 * @example
 * cleanString("<p>Hello &amp; World</p>")  // "Hello & World"
 * cleanString("  <b>hello</b>   world  ")  // "hello world"
 * cleanString("&lt;script&gt;")            // "<script>"
 * cleanString(123)                         // undefined - not a string
 */
export function cleanString(input: unknown): string | undefined {
  if (validate.isString(input)) {
    return trim(he.decode(stripHtml(input).result));
  }
}
