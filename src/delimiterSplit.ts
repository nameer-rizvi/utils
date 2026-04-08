import { delimiter as defaultDelimiter } from "./delimiter.js";
import * as validate from "./validate.js";
import { cleanString } from "./cleanString.js";

/**
 * Splits a string by a delimiter (and optional secondary delimiter) into a deduplicated array of clean strings.
 * Line breaks (`<br>`, `<br/>`, `\n`) are normalized to the primary delimiter before splitting.
 * Empty strings and an optional filter value are excluded from the result.
 * @example
 * delimiterSplit("a{{DELIMITER}}b{{DELIMITER}}c")           // ["a", "b", "c"]
 * delimiterSplit("a,b,c", ",")                              // ["a", "b", "c"]
 * delimiterSplit("a,b|c", ",", "|")                         // ["a", "b", "c"]
 * delimiterSplit("a,b,c", ",", undefined, "b")              // ["a", "c"] - "b" filtered out
 * delimiterSplit("a,a,b", ",")                              // ["a", "b"] - deduped
 * delimiterSplit("a<br>b<br/>c", ",")                       // ["a", "b", "c"] - br normalized
 * delimiterSplit(123)                                       // [] - not a string
 */
export function delimiterSplit(
  input: unknown,
  delimiter = defaultDelimiter,
  delimiter2?: string,
  filter?: string,
): string[] {
  if (!validate.isString(input)) return [];

  const normalized = input.replace(/<br\s*\/?>|\n/g, delimiter);

  const filterLower = filter?.toLowerCase();

  const result = new Set<string>();

  for (const part of normalized.split(delimiter)) {
    const pieces = delimiter2 ? part.split(delimiter2) : [part];

    for (const piece of pieces) {
      const clean = cleanString(piece);

      if (!validate.isStringNonEmpty(clean)) continue;

      if (filterLower && clean.toLowerCase() === filterLower) continue;

      result.add(clean);
    }
  }

  return [...result];
}
