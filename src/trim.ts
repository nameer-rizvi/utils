import * as validate from "./validate.js";

/**
 * Trims leading and trailing whitespace from a string and replaces internal whitespace sequences with a delimiter.
 * Returns `undefined` if the input is not a string.
 * @example
 * trim("  hello   world  ")       // "hello world"   - default space delimiter
 * trim("  hello   world  ", "-")  // "hello-world"   - custom delimiter
 * trim("  hello   world  ", "")   // "helloworld"    - no delimiter
 * trim("hello")                   // "hello"         - no change
 * trim(123)                       // undefined       - not a string
 */
export function trim(input: unknown, delimiter = " "): string | undefined {
  if (validate.isString(input)) {
    return input.replace(/\p{Cf}/gu, "").trim().replace(/\s+/g, delimiter);
  }
}
