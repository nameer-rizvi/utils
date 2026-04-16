import * as validate from "./validate.js";

/**
 * Returns the number of Unicode characters in a string.
 * Unlike `String.length`, correctly counts multi-byte characters (e.g. emoji) as single characters.
 * Returns `undefined` if the input is not a string.
 * @example
 * charLength("hello")   // 5
 * charLength("👋🌍")    // 2  - emoji counted correctly
 * charLength("")        // 0
 * charLength(123)       // undefined
 */
function charLength(input: unknown): number | undefined {
  if (validate.isString(input)) {
    return Array.from(input).length;
  }
}

/**
 * Returns the number of words in a string using Unicode-aware regex.
 * Words are defined as sequences of letters, numbers, and apostrophes.
 * Returns `undefined` if the input is not a string.
 * @example
 * wordLength("Hello, World!")    // 2
 * wordLength("it's a test")      // 3  - contractions counted as one word
 * wordLength("  spaces  ")       // 1
 * wordLength("")                 // 0
 * wordLength(123)                // undefined
 */
function wordLength(input: unknown): number | undefined {
  if (validate.isString(input)) {
    return input.match(/[\p{L}\p{N}''-]+/gu)?.length ?? 0;
  }
}

/**
 * Returns the number of words in a string by counting whitespace-delimited tokens.
 * Faster than `wordLength` but less Unicode-aware — any non-whitespace sequence counts as a word.
 * Returns `undefined` if the input is not a string.
 * @example
 * wordLength2("Hello, World!")   // 2
 * wordLength2("it's a test")     // 3
 * wordLength2("  spaces  ")      // 1
 * wordLength2("hello---world")   // 1  - no whitespace = one word
 * wordLength2("")                // 0
 * wordLength2(123)               // undefined
 */
function wordLength2(input: unknown): number | undefined {
  if (validate.isString(input)) {
    let count = 0;
    let inWord = false;
    for (let i = 0; i < input.length; i++) {
      if (/\s/.test(input[i])) {
        inWord = false;
      } else if (!inWord) {
        count++;
        inWord = true;
      }
    }
    return count;
  }
}

/**
 * A collection of string length utilities.
 * - `char`  → Unicode-aware character count
 * - `word`  → Unicode-aware word count via regex
 * - `word2` → Fast whitespace-delimited word count
 */
export const stringLength = {
  char: charLength,
  word: wordLength,
  word2: wordLength2,
};
