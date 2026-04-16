import * as validate from "./validate.js";

export interface TokenizeResult {
  tokens: string[];
  set: string[];
  tokensCount: number;
  setCount: number;
  count: Record<string, number>;
}

const EMPTY_RESULT: TokenizeResult = {
  tokens: [],
  set: [],
  tokensCount: 0,
  setCount: 0,
  count: {},
};

/**
 * Tokenizes a string into words, with optional lowercasing.
 * Normalizes unicode, strips non-word characters, and collapses whitespace before splitting.
 * Returns a result containing the full token list, unique set, counts per token, and totals.
 * @example
 * tokenize("Hello world hello", true)
 * // { tokens: ["hello", "world", "hello"], set: ["hello", "world"], tokensCount: 3, setCount: 2, count: { hello: 2, world: 1 } }
 *
 * tokenize("it's a test-case", false)
 * // { tokens: ["it's", "a", "test-case"], set: ["it's", "a", "test-case"], tokensCount: 3, setCount: 3, ... }
 *
 * tokenize("Hello 👋 World", false)
 * // { tokens: ["Hello", "👋", "World"], ... } - emoji preserved
 *
 * tokenize(123)
 * // { tokens: [], set: [], tokensCount: 0, setCount: 0, count: {} }
 */
export function tokenize(input: unknown, asLowerCase = false): TokenizeResult {
  if (!validate.isString(input)) return EMPTY_RESULT;

  const cleaned = input
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\p{Emoji_Presentation}\s'-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned.length) return EMPTY_RESULT;

  const tokens = (asLowerCase ? cleaned.toLowerCase() : cleaned).split(" ");

  const set = Array.from(new Set(tokens));

  const count: Record<string, number> = {};

  for (const token of tokens) count[token] = (count[token] ?? 0) + 1;

  return {
    tokens,
    set,
    tokensCount: tokens.length,
    setCount: set.length,
    count,
  };
}
