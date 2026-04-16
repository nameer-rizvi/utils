/**
 * A collection of test strings covering edge cases for string manipulation utilities.
 * Useful for validating Unicode handling, HTML entity decoding, whitespace normalization, and more.
 * @see https://en.wikipedia.org/wiki/List_of_Unicode_characters
 * @see https://dev.w3.org/html5/html-author/charref
 */
export const stringTest: Record<string, string> = {
  /** Multi-codepoint emoji sequences */
  emoji: "❤️🚨⚡🐬➡️🔨🔺🚚📫👷🚧",
  /** ASCII and extended punctuation, math symbols, and special characters */
  punctuation: `\`~!@#$%^&*()-_=+[{]}\\|;",<.>/?Ω≈ç√∫˜µ≤≥÷æ…¬˚∆˙©ƒ∂ßåœ∑´®†¥¨ˆøπ"'«≠–ºª•¶§∞¢£™¡`,
  /** Common HTML entities */
  htmlEntities: "&amp; &lt; &gt; &Agrave; &sect;",
  /** Accents and diacritics */
  accented: "Café naïve façade coöperate",
  /** Mixed scripts: Latin, Arabic, Japanese, Cyrillic */
  mixedScripts: "Hello مرحبا こんにちは Привет",
  /** Spaces, tabs, newlines, and multiple consecutive whitespace */
  whitespace: " \t\n\r  Multiple   spaces \n\t",
  /** Hyphenated words and contractions */
  hyphensAndApostrophes: "It's a test-case with hyphens and apostrophes",
  /** Integers, decimals, negatives, and currency-formatted numbers */
  numericStrings: "123 45.67 -89 $1,234.56",
  /** Math and copyright symbols */
  specialSymbols: "© ™ ∑ ∆ Ω ∞ ≈ ≠ ≤ ≥",
};
