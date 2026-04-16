import * as validate from "./validate.js";

/**
 * Parses a commafied number string into a numeric value.
 * Handles parentheses for negative numbers (accounting format), commas as thousand separators,
 * and decimal points.
 * Returns `0` if the input is not a string or cannot be parsed.
 * @example
 * parseCommafiedNumber("1,234.56")    // 1234.56
 * parseCommafiedNumber("1,234,567")  // 1234567
 * parseCommafiedNumber("(1,234.56)") // -1234.56 - accounting negative format
 * parseCommafiedNumber("-1,234.56")  // -1234.56
 * parseCommafiedNumber(1234)         // 1234
 * parseCommafiedNumber("abc")        // 0        - not a number
 * parseCommafiedNumber("")           // 0        - empty string
 */
export function parseCommafiedNumber(input: unknown): number {
  if (validate.isString(input)) {
    const trimmed = input.trim();

    const isNegative = trimmed.startsWith("(") && trimmed.endsWith(")");

    const match = trimmed.match(/^\(?-?[\d,]+(?:\.\d+)?\)?/);

    if (!match) return 0;

    const normalized = match[0].replace(/[(),]/g, "").trim();

    const value = Number(normalized);

    if (!Number.isFinite(value)) return 0;

    return isNegative ? -value : value;
  }

  return validate.isNumber(input) ? input : 0;
}
