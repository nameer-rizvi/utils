import * as validate from "./validate.js";

/**
 * Converts a number, numeric string, or abbreviated string to a number.
 * Supports `k` (thousands), `m` (millions), `b` (billions), and `t` (trillions).
 * Returns `undefined` if the input cannot be converted.
 * @example
 * abbreviationToNumber(1000)     // 1000
 * abbreviationToNumber("1000")   // 1000
 * abbreviationToNumber("1k")     // 1000
 * abbreviationToNumber("1.5m")   // 1500000
 * abbreviationToNumber("2b")     // 2000000000
 * abbreviationToNumber("1.2 T")  // 1200000000000
 * abbreviationToNumber("abc")    // undefined
 * abbreviationToNumber(null)     // undefined
 */
export function abbreviationToNumber(input: unknown): number | undefined {
  if (validate.isNumber(input)) {
    return input;
  }

  if (validate.isNumberString(input)) {
    return Number(input);
  }

  if (validate.isString(input)) {
    const clean = input.replace(/\s+|,/g, "");

    if (!clean) return undefined;

    const suffix = clean[clean.length - 1].toLowerCase();

    const power = { k: 3, m: 6, b: 9, t: 12 }[suffix];

    if (power === undefined) {
      return parseFloat(clean) || undefined;
    }

    const number = Number(clean.slice(0, -1));

    if (validate.isNumberValid(number)) {
      return number * 10 ** power;
    }
  }
}
