import * as validate from "./validate.js";
import * as math from "./math.js";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type NumberStringType = "$" | "#" | "%" | "x" | "+" | ".-" | ".+";

/**
 * Formats a number or numeric string into a styled string based on the provided type flags.
 * Returns `undefined` if the input is not a valid number or numeric string.
 * Type flags:
 * - `"$"`  → formats as USD currency (e.g. `$1,234.56`)
 * - `"#"`  → prefixes with `#` (e.g. `#1,234`)
 * - `"%"`  → suffixes with `%` (e.g. `1,234%`)
 * - `"x"`  → suffixes with `x` (e.g. `1,234x`)
 * - `"+"`  → prefixes positive numbers with `+` (e.g. `+1,234`)
 * - `".-"` → strips decimal portion (e.g. `1,234`)
 * - `".+"` → ensures decimal portion exists (e.g. `1,234.00`)
 * @example
 * numberString(1234.56)              // "1,234.56"
 * numberString(1234.56, ["$"])       // "$1,234.56"
 * numberString(1234.56, ["%"])       // "1,234.56%"
 * numberString(1234.56, ["x"])       // "1,234.56x"
 * numberString(1234.56, ["#"])       // "#1,234.56"
 * numberString(1234.56, ["+"])       // "+1,234.56"
 * numberString(1234.56, [".-"])      // "1,234"
 * numberString(1234, [".+"])         // "1,234.00"
 * numberString("1234.56", ["$"])     // "$1,234.56" - numeric string accepted
 * numberString("abc")                // undefined   - not numeric
 */
export function numberString(
  input: unknown,
  types: readonly NumberStringType[] = [],
): string | undefined {
  if (!validate.isNumeric(input)) return;

  const number = math.num(Number(input));

  if (number === undefined) return;

  let output: string;

  if (types.includes("$")) {
    output = currencyFormatter.format(number);
  } else {
    output = number.toLocaleString();
    if (types.includes("#")) output = `#${output}`;
    else if (types.includes("%")) output += "%";
    else if (types.includes("x")) output += "x";
  }

  if (types.includes("+") && number > 0) output = `+${output}`;

  if (types.includes(".-")) {
    const dot = output.indexOf(".");
    if (dot !== -1) output = output.slice(0, dot);
  } else if (types.includes(".+") && !output.includes(".")) {
    output += ".00";
  }

  return output;
}
