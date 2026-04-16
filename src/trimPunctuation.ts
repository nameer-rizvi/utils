import { trim } from "./trim.js";
import { removePunctuation } from "./removePunctuation.js";

/**
 * Removes punctuation from a string and trims the result.
 * Combines `removePunctuation` and `trim` in a single call.
 * Returns `undefined` if the input is not a string.
 * @example
 * trimPunctuation("Hello, World!")      // "Hello World"
 * trimPunctuation("...hello...")        // "hello"
 * trimPunctuation("Hello, World!", "-") // "Hello-World"  - custom delimiter
 * trimPunctuation(123)                  // undefined      - not a string
 */
export function trimPunctuation(
  input: unknown,
  delimiter?: string,
): string | undefined {
  return trim(removePunctuation(input, delimiter), delimiter);
}
