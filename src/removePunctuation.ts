import * as validate from "./validate.js";

/**
 * Removes punctuation from a string, replacing it with a delimiter.
 * Returns `undefined` if the input is not a string.
 * @example
 * removePunctuation("Hello, World!")      // "Hello  World "  - default space delimiter
 * removePunctuation("Hello, World!", "")  // "Hello World"    - no delimiter
 * removePunctuation("Hello, World!", "-") // "Hello- World-"  - custom delimiter
 * removePunctuation("it's_a_test")        // "it s a test"    - underscores removed
 * removePunctuation(123)                  // undefined        - not a string
 */
export function removePunctuation(
  input: unknown,
  delimiter = " ",
): string | undefined {
  if (validate.isString(input)) {
    return input.replace(/[^\w\s]|_/g, delimiter);
  }
}
