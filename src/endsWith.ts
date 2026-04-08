interface Punctuation {
  period: boolean;
  question: boolean;
  exclamation: boolean;
  comma: boolean;
  colon: boolean;
  semicolon: boolean;
  dash: boolean;
  hyphen: boolean;
  bracket: boolean;
  brace: boolean;
  parenthesis: boolean;
  apostrophe: boolean;
  quotation: boolean;
  ellipsis: boolean;
  isSentence: boolean;
  isIncomplete: boolean;
  isIncomplete1: boolean;
  isIncomplete2: boolean;
  isIncomplete3: boolean;
}

/**
 * Analyzes the trailing punctuation of a string and returns a structured result.
 * - `isSentence`   → ends with a period, question mark, exclamation, or ellipsis
 * - `isIncomplete1` → ends with a comma, colon, or semicolon
 * - `isIncomplete2` → ends with a dash or hyphen
 * - `isIncomplete3` → ends with a bracket, brace, parenthesis, apostrophe, or quotation mark
 * - `isIncomplete`  → any of the above incomplete conditions
 * @example
 * endsWith("Hello.")        // { period: true, isSentence: true, ... }
 * endsWith("Hello?")        // { question: true, isSentence: true, ... }
 * endsWith("Hello,")        // { comma: true, isIncomplete: true, isIncomplete1: true, ... }
 * endsWith("Hello...")      // { ellipsis: true, isSentence: true, ... }
 * endsWith("Hello")         // all false
 * endsWith("")              // all false
 */
export function endsWith(input = ""): Punctuation {
  const string = input.trim();

  const last = string[string.length - 1];

  const period = last === ".";

  const question = last === "?";

  const exclamation = last === "!";

  const comma = last === ",";

  const colon = last === ":";

  const semicolon = last === ";";

  const hyphen = last === "-";

  const dash = last === "—";

  const bracket = last === "]";

  const brace = last === "}";

  const parenthesis = last === ")";

  const apostrophe = last === "'";

  const quotation = last === '"';

  const ellipsis = string.endsWith("...") || string.endsWith("…");

  const isSentence = period || question || exclamation || ellipsis;

  const isIncomplete1 = comma || colon || semicolon;

  const isIncomplete2 = dash || hyphen;

  const isIncomplete3 =
    bracket || brace || parenthesis || apostrophe || quotation;

  const isIncomplete = isIncomplete1 || isIncomplete2 || isIncomplete3;

  return {
    period,
    question,
    exclamation,
    comma,
    colon,
    semicolon,
    dash,
    hyphen,
    bracket,
    brace,
    parenthesis,
    apostrophe,
    quotation,
    ellipsis,
    isSentence,
    isIncomplete,
    isIncomplete1,
    isIncomplete2,
    isIncomplete3,
  };
}
