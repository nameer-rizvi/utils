import * as validate from "./validate.js";
import { trim } from "./trim.js";
import { escaper } from "./escaper.js";

const PAIRS: Record<string, string> = {
  "[": "]",
  "(": ")",
  "{": "}",
  "<": ">",
  "«": "»",
  "\u201C": "\u201D", // " "
  "\u2018": "\u2019", // ' '
};

/**
 * Trims matching boundary characters (e.g. brackets, quotes) from both ends of a string.
 * Optionally trims additional inner characters after boundary removal.
 * Defaults to auto-detecting the boundary from the first character of the string.
 * @example
 * trimBoundary("[hello]")           // "hello"   - auto-detected brackets
 * trimBoundary("((hello))")         // "hello"   - nested brackets
 * trimBoundary("«hello»")           // "hello"   - guillemets
 * trimBoundary(""hello"")           // "hello"   - curly quotes
 * trimBoundary("[hello]", "(")      // "[hello]" - wrong boundary, no match
 * trimBoundary("--hello--", "-")    // "hello"   - custom boundary
 * trimBoundary("[  hello  ]", " ")  // "hello"   - innerTrim spaces
 * trimBoundary(123)                 // undefined - not a string
 */
export function trimBoundary(
  input: unknown,
  boundary?: string,
  innerTrim?: string,
): string | undefined {
  if (!validate.isString(input)) return;

  let str = trim(input) ?? "";

  const open = boundary ?? str.charAt(0);

  const close = PAIRS[open] ?? open;

  while (str.length >= 2 && str.startsWith(open) && str.endsWith(close)) {
    str = str.slice(open.length, str.length - close.length).trim();
  }

  if (innerTrim) {
    const escaped = escaper(innerTrim) ?? innerTrim;

    const pattern = new RegExp(`^[${escaped}]+|[${escaped}]+$`, "g");

    str = str.replace(pattern, "").trim();
  }

  return str;
}
