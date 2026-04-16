import * as validate from "./validate.js";

/**
 * Converts a number or numeric string to its ordinal representation.
 * Returns `undefined` if the input is not a valid number or numeric string.
 * @example
 * ordinalized(1)      // "1st"
 * ordinalized(2)      // "2nd"
 * ordinalized(3)      // "3rd"
 * ordinalized(4)      // "4th"
 * ordinalized(11)     // "11th" - special case
 * ordinalized(12)     // "12th" - special case
 * ordinalized(13)     // "13th" - special case
 * ordinalized(21)     // "21st"
 * ordinalized(1000)   // "1,000th"
 * ordinalized("42")   // "42nd" - numeric string accepted
 * ordinalized("abc")  // undefined - not numeric
 */
export function ordinalized(input: unknown): string | undefined {
  if (validate.isNumeric(input)) {
    const number = Number(input);

    const index = (number / 10) % 10 ^ 1 && number % 10;

    const suffix = ["th", "st", "nd", "rd"][Math.abs(index)] || "th";

    return number.toLocaleString() + suffix;
  }
}
