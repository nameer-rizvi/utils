import * as validate from "./validate.js";

export interface GeneralCountOptions {
  lang?: string;
  upperCase?: boolean;
  lowerCase?: boolean;
  [key: string]: unknown;
}

/**
 * Formats a number into a compact, human-readable string using `Intl.NumberFormat`.
 * Returns `undefined` if the input is not a valid finite number or formatting fails.
 * @example
 * generalCount(1000)                        // "1k"
 * generalCount(1500000)                     // "1.5m"
 * generalCount(1000, { upperCase: true })   // "1K"
 * generalCount(1000, { lang: "de-DE" })     // "1.000"   - German locale
 * generalCount(0.5)                         // "0.5"
 * generalCount(NaN)                         // undefined
 * generalCount("1000")                      // undefined - not a number
 */
export function generalCount(
  input: unknown,
  option: GeneralCountOptions = {},
): string | undefined {
  if (validate.isNumberValid(input)) {
    const { lang = "en-US", upperCase, lowerCase, ...rest } = option;

    const formatted = new Intl.NumberFormat(lang, {
      maximumFractionDigits: 1,
      notation: "compact",
      compactDisplay: "short",
      ...rest,
    }).format(input);

    return upperCase
      ? formatted.toUpperCase()
      : lowerCase
      ? formatted.toLowerCase()
      : formatted;
  }
}
