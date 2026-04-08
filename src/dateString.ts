import { DateType, resolve } from "./date.js";

const FORMAT_CACHE = new Map<string, CompiledToken[]>();

type Token = "MM" | "DD" | "YYYY" | "HH" | "hh" | "mm" | "ss" | "A" | "LITERAL";

interface DateStringOptions {
  /** If `true`, uses 24-hour time and suppresses the AM/PM token. */
  military?: boolean;
}

interface CompiledToken {
  type: Token;
  value?: string;
}

/**
 * Formats a date into a string using a custom format pattern.
 * Defaults to the current date if no input is provided.
 * Supported tokens:
 * - `YYYY`   → full year (e.g. 2024)
 * - `MM`     → zero-padded month (01–12)
 * - `DD`     → zero-padded day (01–31)
 * - `HH`     → zero-padded 24-hour (00–23)
 * - `hh`     → zero-padded 12-hour (01–12), or 24-hour if `military: true`
 * - `mm`     → zero-padded minutes (00–59)
 * - `ss`     → zero-padded seconds (00–59)
 * - `A`      → AM/PM, omitted if `military: true`
 * - `[text]` → escaped literal
 * @example
 * dateString("2024-01-15T14:30:45")                                // "01/15/2024 02:30:45 PM"
 * dateString("2024-01-15T14:30:45", "YYYY-MM-DD")                  // "2024-01-15"
 * dateString("2024-01-15T14:30:45", "hh:mm A")                     // "02:30 PM"
 * dateString("2024-01-15T14:30:45", "hh:mm A", { military: true }) // "14:30"
 * dateString("2024-01-15T14:30:45", "[Date:] MM/DD/YYYY")          // "Date: 01/15/2024"
 * dateString()                                                     // current date formatted
 */
export function dateString(
  input?: DateType,
  format = "MM/DD/YYYY hh:mm:ss A",
  options: DateStringOptions = {},
): string {
  const date = resolve(input);
  const tokens = compileFormat(format);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const output = new Array<string>(tokens.length);
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    switch (t.type) {
      case "YYYY":
        output[i] = String(year);
        break;
      case "MM":
        output[i] = zero2(month);
        break;
      case "DD":
        output[i] = zero2(day);
        break;
      case "HH":
        output[i] = zero2(hours24);
        break;
      case "hh":
        output[i] = zero2(options.military ? hours24 : hours12);
        break;
      case "mm":
        output[i] = zero2(minutes);
        break;
      case "ss":
        output[i] = zero2(seconds);
        break;
      case "A":
        output[i] = options.military ? "" : hours24 >= 12 ? "PM" : "AM";
        break;
      case "LITERAL":
        output[i] = t.value!;
        break;
    }
  }
  // Collapse any whitespace left by suppressed tokens (e.g. military mode drops "A")
  return output.join("").replace(/\s+/g, " ").trim();
}

function compileFormat(format: string): CompiledToken[] {
  const cached = FORMAT_CACHE.get(format);
  if (cached) return cached;
  const tokens: CompiledToken[] = [];
  let i = 0;
  while (i < format.length) {
    const c = format[i];
    // Escaped literal: [text]
    if (c === "[") {
      const end = format.indexOf("]", i + 1);
      if (end === -1)
        throw new Error(`Unclosed literal bracket in format: "${format}"`);
      tokens.push({ type: "LITERAL", value: format.slice(i + 1, end) });
      i = end + 1;
      continue;
    }
    // Four-char token
    if (format.slice(i, i + 4) === "YYYY") {
      tokens.push({ type: "YYYY" });
      i += 4;
      continue;
    }
    // Two-char tokens
    const two = format.slice(i, i + 2) as Token;
    if (["MM", "DD", "HH", "hh", "mm", "ss"].includes(two)) {
      tokens.push({ type: two });
      i += 2;
      continue;
    }
    // Single-char tokens
    if (c === "A") {
      tokens.push({ type: "A" });
      i++;
      continue;
    }
    // Literal character
    tokens.push({ type: "LITERAL", value: c });
    i++;
  }
  FORMAT_CACHE.set(format, tokens);
  return tokens;
}

function zero2(n: number): string {
  return String(n).padStart(2, "0");
}
