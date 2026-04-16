import * as validate from "./validate.js";

/**
 * Extracts a number from a string by stripping non-numeric characters.
 * Accepts strings and numbers directly.
 * Returns `undefined` if the input is neither a string nor a number,
 * or if the extracted value is not a finite number.
 * @example
 * stringNumber("$1,234.56")   // 1234.56  - currency string
 * stringNumber("42px")        // 42       - unit string
 * stringNumber("-3.14")       // -3.14    - negative number
 * stringNumber("abc")         // 0        - converts to empty string which translates to 0
 * stringNumber(42)            // 42       - number passed through
 * stringNumber(NaN)           // NaN      - invalid number passed through
 * stringNumber(null)          // undefined
 */
export function stringNumber(input: unknown): number | undefined {
  if (validate.isString(input)) return Number(input.replace(/[^0-9.-]+/g, ""));
  if (validate.isNumber(input)) return input;
}
