import safeR from "safe-regex";
import * as jwt from "./jwt.js";

/** Returns `true` if the input is an array. */
export const isArray = Array.isArray;

/**
 * Returns `true` if the input is a non-empty array.
 * @example
 * isArrayNonEmpty([1, 2, 3]) // true
 * isArrayNonEmpty([])        // false
 * isArrayNonEmpty("hello")   // false
 */
export function isArrayNonEmpty<T = unknown>(test: unknown): test is T[] {
  return isArray(test) && test.length > 0;
}

/**
 * Returns `true` if the input is an array or a string.
 * @example
 * isArrayOrString([1, 2, 3]) // true
 * isArrayOrString("hello")   // true
 * isArrayOrString(123)       // false
 */
export function isArrayOrString(test: unknown): test is unknown[] | string {
  return isArray(test) || isString(test);
}

/**
 * Returns `true` if the input is a valid base64 or base64url encoded string.
 * Whitespace is ignored. Empty or whitespace-only strings are considered invalid.
 * @example
 * isBase64("SGVsbG8gV29ybGQ=") // true  - valid base64 ("Hello World")
 * isBase64("SGVsbG8tV29ybGQ")  // true  - valid base64url (no padding)
 * isBase64("")                 // false - empty string is invalid
 * isBase64("SGVsbG8!")         // false - invalid character
 * isBase64(123)                // false - not a string
 */
export function isBase64(test: unknown): test is string {
  if (!isStringNonEmpty(test)) return false;
  return /^[A-Za-z0-9+/\-_]*={0,2}$/.test(test.trim());
}

/** Returns `true` if the input is a boolean. */
export function isBoolean(test: unknown): test is boolean {
  return typeof test === "boolean";
}

/**
 * Returns `true` if the input is a boolean-like number (0 or 1).
 * @example
 * isBooleanNumber(1)     // true
 * isBooleanNumber(0)     // true
 * isBooleanNumber(2)     // false
 * isBooleanNumber(true)  // false
 */
export function isBooleanNumber(test: unknown): test is 0 | 1 {
  return test === 0 || test === 1;
}

/**
 * Returns `true` if the input is a boolean-like string ("true" or "false").
 * @example
 * isBooleanString("true")  // true
 * isBooleanString("false") // true
 * isBooleanString("yes")   // false
 * isBooleanString(true)    // false
 */
export function isBooleanString(test: unknown): test is "true" | "false" {
  return test === "true" || test === "false";
}

/**
 * Returns `true` if the input is a boolean or any boolean-like value (0, 1, "true", "false").
 * @example
 * isBooleanAny(true)    // true
 * isBooleanAny(1)       // true
 * isBooleanAny("false") // true
 * isBooleanAny(2)       // false
 * isBooleanAny("yes")   // false
 */
export function isBooleanAny(
  test: unknown,
): test is boolean | 0 | 1 | "true" | "false" {
  return isBoolean(test) || isBooleanNumber(test) || isBooleanString(test);
}

/**
 * Returns `true` if the input is a valid credit card number using the Luhn algorithm.
 * Non-digit characters (e.g. spaces, dashes) are stripped before validation,
 * and the resulting digit sequence must be between 13 and 19 digits long.
 * @example
 * isCreditCardNumber("4532015112830366")    // true  - valid Visa
 * isCreditCardNumber("4532-0151-1283-0366") // true  - dashes are stripped
 * isCreditCardNumber("1234567890123456")    // false - invalid Luhn checksum
 * isCreditCardNumber("123")                 // false - too short
 * isCreditCardNumber(1234)                  // false - not a string
 */
export function isCreditCardNumber(test: unknown): test is string {
  if (!isString(test)) return false;
  const digits = test.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits.charCodeAt(i) - 48;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Returns `true` if the input is a valid date — accepts `Date` objects, date strings, and timestamps.
 * Invalid `Date` objects (e.g. `new Date("invalid")`) and `NaN` timestamps are rejected.
 * @example
 * isDate(new Date())               // true  - valid Date object
 * isDate("2024-01-01")             // true  - valid date string
 * isDate(1704067200000)            // true  - valid Unix timestamp (ms)
 * isDate(new Date("invalid"))      // false - invalid Date object
 * isDate("not a date")             // false - invalid date string
 * isDate(null)                     // false - not a date
 */
export function isDate(test: unknown): test is Date | string | number {
  if (test instanceof Date) {
    return !Number.isNaN(test.getTime());
  } else if (isString(test) || isNumber(test)) {
    return !Number.isNaN(new Date(test).getTime());
  } else return false;
}

/**
 * Returns `true` if the input is a plausible email address.
 * Checks for a valid local/domain structure and length limits per RFC-5321,
 * but intentionally avoids strict RFC-5322 parsing for practicality.
 * @example
 * isEmail("user@example.com")   // true
 * isEmail("user@sub.domain.co") // true
 * isEmail("@example.com")       // false - missing local part
 * isEmail("user@")              // false - missing domain
 * isEmail("user@domain")        // false - no TLD
 * isEmail("user@domain.")       // false - trailing dot
 * isEmail("notanemail")         // false - missing @
 * isEmail(123)                  // false - not a string
 */
export function isEmail(test: unknown): test is string {
  if (!isStringSafeRegex(test)) return false;
  const email = test.trim();
  const match = email.match(/^([^@]+)@([^@]+)$/);
  if (!match) return false;
  const local = match[1] ?? "";
  const domain = match[2] ?? "";
  if (!local.length || !domain.length) return false;
  if (local.length > 64 || domain.length > 253) return false;
  const parts = domain.split(".");
  return parts.length >= 2 && parts.every((part) => part.length > 0);
}

/*
 * Environment Validations: Core Globals
 */

/** Returns `true` if running in a Node.js environment. */
export const isEnvNode =
  typeof process !== "undefined" && typeof process.versions?.node === "string";

/** Returns `true` if `window` is defined (e.g. browser, jsdom). */
export const isEnvWindow = typeof window !== "undefined";

/** Returns `true` if `document` is defined (e.g. browser, jsdom). */
export const isEnvDocument = typeof document !== "undefined";

/** Returns `true` if running in a browser environment (both `window` and `document` are defined). */
export const isEnvBrowser = isEnvWindow && isEnvDocument;

/** Returns `true` if running in a Web Worker environment. */
export const isEnvWorker =
  typeof self !== "undefined" &&
  typeof (self as unknown as { importScripts?: unknown }).importScripts ===
    "function";

/*
 * Environment Validations: NODE_ENV
 */

/** The current `NODE_ENV` value, or `undefined` if not running in Node.js. */
export const nodeEnv = isEnvNode ? process.env.NODE_ENV : undefined;

/** Returns `true` if `NODE_ENV` is `"development"` or `"dev"`. */
export const isEnvDevelopment = nodeEnv === "development" || nodeEnv === "dev";

/** Returns `true` if `NODE_ENV` is `"production"` or `"prod"`. */
export const isEnvProduction = nodeEnv === "production" || nodeEnv === "prod";

/** Returns `true` if `NODE_ENV` is `"staging"` or `"stage"`. */
export const isEnvStaging = nodeEnv === "staging" || nodeEnv === "stage";

/** Returns `true` if `NODE_ENV` is `"test"`. */
export const isEnvTest = nodeEnv === "test";

/** Returns `true` if `NODE_ENV` is `"production"`, `"prod"`, `"staging"` or `"stage"`. */
export const isEnvLive = isEnvProduction || isEnvStaging;

/*
 * Environment Validations: Browser-Specific
 */

/**
 * Returns `true` if the given property exists on `window`.
 * Safe to call in non-browser environments.
 * @example
 * isEnvWindowProperty("location")     // true  - in a browser
 * isEnvWindowProperty("location")     // false - in Node.js
 * isEnvWindowProperty("nonExistent")  // false
 */
export function isEnvWindowProperty(name: string): boolean {
  return isEnvWindow && name in window;
}

/** Returns `true` if the current host is `localhost` or `127.0.0.1`. */
export const isEnvLocalhost =
  isEnvWindowProperty("location") &&
  /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);

/** Returns `true` if the Service Worker API is available in the current browser. */
export const isEnvServiceWorker =
  isEnvWindowProperty("navigator") && !!window.navigator.serviceWorker;

/** Returns `true` if the user has granted notification permissions. */
export function isEnvNotificationGranted(): boolean {
  return (
    isEnvWindowProperty("Notification") &&
    window.Notification.permission === "granted"
  );
}

/**
 * Returns `true` if the input is an `Error` object.
 * Handles errors across different realms (e.g. iframes, vm contexts)
 * where `instanceof Error` may return `false` for legitimate error objects.
 * @example
 * isError(new Error("oops"))      // true
 * isError(new TypeError("oops"))  // true  - Error subclasses
 * isError({ message: "oops" })    // false - plain object
 * isError("oops")                 // false - string
 * isError(null)                   // false
 */
export function isError(test: unknown): test is Error {
  return (
    test instanceof Error ||
    Object.prototype.toString.call(test) === "[object Error]"
  );
}

/**
 * Returns `true` if the input is a function.
 * @example
 * isFunction(() => {})        // true
 * isFunction(function() {})   // true
 * isFunction(class Foo {})    // true  - classes are functions
 * isFunction("hello")         // false
 * isFunction(null)            // false
 */
export function isFunction(
  test: unknown,
): test is (...args: unknown[]) => unknown {
  return typeof test === "function";
}

/**
 * Returns `true` if the input is a string beginning with `http://` or `https://`.
 * Does not perform full URL validation — use `isURL` for stricter checks if needed.
 * @example
 * isHTTP("https://example.com") // true
 * isHTTP("http://example.com")  // true
 * isHTTP("HTTP://example.com")  // true  - case-insensitive
 * isHTTP("ftp://example.com")   // false - wrong protocol
 * isHTTP("example.com")         // false - missing protocol
 * isHTTP(123)                   // false - not a string
 */
export function isHTTP(test: unknown): test is string {
  return isStringSafeRegex(test) && /^https?:\/\//i.test(test);
}

/**
 * Returns `true` if the input is a JSON-serializable value.
 * Validates by round-tripping through `JSON.stringify` and `JSON.parse`.
 * Note: `undefined`, functions, and symbols are not JSON-serializable.
 * @example
 * isJSON({ a: 1 })        // true
 * isJSON([1, 2, 3])       // true
 * isJSON("hello")         // true
 * isJSON(undefined)       // false - not serializable
 * isJSON(() => {})        // false - functions are not serializable
 */
export function isJSON(test: unknown): test is unknown {
  if (test === undefined) return false;
  try {
    JSON.parse(JSON.stringify(test));
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns `true` if the input is a string containing valid JSON.
 * @example
 * isJSONString('{"a":1}')     // true
 * isJSONString('[1, 2, 3]')   // true
 * isJSONString('"hello"')     // true  - quoted strings are valid JSON
 * isJSONString('undefined')   // false - not valid JSON
 * isJSONString("{a: 1}")      // false - unquoted keys are not valid JSON
 * isJSONString(123)           // false - not a string
 */
export function isJSONString(test: unknown): test is string {
  if (!isString(test)) return false;
  try {
    JSON.parse(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns `true` if the input is a valid base64url encoded string that can be decoded.
 * Uses the internal non-secure JWT-style decoder — not a real JWT validator.
 * @example
 * isJWT(jwt.encode({ id: 1 })) // true  - valid encoded payload
 * isJWT("not-a-jwt")           // false - not a valid encoded string
 * isJWT("")                    // false - empty string
 * isJWT(123)                   // false - not a string
 */
export function isJWT(test: unknown): test is string {
  return jwt.decode(test) !== undefined;
}

/**
 * Returns `true` if the given module name can be resolved in the current Node.js environment.
 * Always returns `false` in non-Node.js environments (e.g. browser, edge runtimes).
 * @example
 * isModule("fs")           // true  - built-in Node.js module
 * isModule("express")      // true  - if installed
 * isModule("nonexistent")  // false - not resolvable
 * isModule(123)            // false - not a string
 * isModule("fs")           // false - in a browser environment
 */
export function isModule(test: unknown): test is string {
  if (!isString(test) || !isEnvNode) return false;
  try {
    require.resolve(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns `true` if the input is of type `number`.
 * Note: returns `true` for `NaN` and `Infinity` — use `isNumberValid` for stricter checks.
 * @example
 * isNumber(123)       // true
 * isNumber(NaN)       // true  - NaN is typeof "number"
 * isNumber(Infinity)  // true  - Infinity is typeof "number"
 * isNumber("123")     // false - string
 * isNumber(null)      // false
 */
export function isNumber(test: unknown): test is number {
  return typeof test === "number";
}

/**
 * Returns `true` if the input is a non-empty string that represents a valid finite number.
 * @example
 * isNumberString("123")   // true
 * isNumberString("12.3")  // true
 * isNumberString("")      // false - empty string
 * isNumberString("abc")   // false - not a number
 * isNumberString(123)     // false - not a string
 */
export function isNumberString(test: unknown): test is string {
  return isStringNonEmpty(test) && isNumberValid(Number(test));
}

/**
 * Returns `true` if the input is a finite, non-NaN number.
 * @example
 * isNumberValid(123)       // true
 * isNumberValid(NaN)       // false
 * isNumberValid(Infinity)  // false
 * isNumberValid("123")     // false - string
 */
export function isNumberValid(test: unknown): test is number {
  return isNumber(test) && !Number.isNaN(test) && Number.isFinite(test);
}

/**
 * Returns `true` if the input is a valid finite number or a string representing one.
 * @example
 * isNumeric(123)      // true
 * isNumeric("123")    // true
 * isNumeric("12.3")   // true
 * isNumeric(NaN)      // false
 * isNumeric("")       // false
 * isNumeric("abc")    // false
 */
export function isNumeric(test: unknown): test is string | number {
  return isNumberValid(test) || isNumberString(test);
}

/**
 * Returns `true` if the input is a plain object (i.e. created via `{}`, `Object.create(null)`, or `new Object()`).
 * Excludes arrays, class instances, `null`, and other non-plain objects.
 * @example
 * isObject({})                      // true
 * isObject({ a: 1 })                // true
 * isObject(Object.create(null))     // true  - null-prototype object
 * isObject([])                      // false - array
 * isObject(new Map())               // false - class instance
 * isObject(null)                    // false
 * isObject(123)                     // false
 */
export function isObject(test: unknown): test is Record<string, unknown> {
  return (
    !!test &&
    typeof test === "object" &&
    (test.constructor === Object || Object.getPrototypeOf(test) === null)
  );
}

/**
 * Returns `true` if the input is a plain object with at least one key.
 * @example
 * isObjectNonEmpty({ a: 1 })  // true
 * isObjectNonEmpty({})        // false - empty object
 * isObjectNonEmpty([])        // false - array
 * isObjectNonEmpty(null)      // false
 */
export function isObjectNonEmpty(
  test: unknown,
): test is Record<string, unknown> {
  return isObject(test) && Object.keys(test).length > 0;
}

/**
 * Returns `true` if the input is a valid phone number in E.164 format.
 * E.164 allows an optional leading `+`, followed by 2–15 digits starting with a non-zero digit.
 * Note: does not strip spaces or formatting — use `test.replace(/\D/g, "")` to normalize first.
 * @example
 * isPhoneNumber("+14155552671")  // true  - US number with country code
 * isPhoneNumber("14155552671")   // true  - without leading +
 * isPhoneNumber("+441234567890") // true  - UK number
 * isPhoneNumber("0044123456")    // false - leading zero not allowed
 * isPhoneNumber("+1")            // false - too short
 * isPhoneNumber("123 456 7890")  // false - spaces not allowed
 * isPhoneNumber(123)             // false - not a string
 */
export function isPhoneNumber(test: unknown): test is string {
  return isString(test) && /^\+?[1-9]\d{1,14}$/.test(test); // E.164 format
}

/**
 * Returns `true` if the input is a `RegExp` object.
 * @example
 * isRegex(/hello/)          // true
 * isRegex(new RegExp("hi")) // true
 * isRegex("hello")          // false - string pattern, not a RegExp
 * isRegex(null)             // false
 */
export function isRegex(test: unknown): test is RegExp {
  return (
    test instanceof RegExp ||
    Object.prototype.toString.call(test) === "[object RegExp]"
  );
}

/** Returns `true` if the input is a string. */
export function isString(test: unknown): test is string {
  return typeof test === "string";
}

/**
 * Returns `true` if the input is a non-empty string (ignoring whitespace).
 * @example
 * isStringNonEmpty("hello") // true
 * isStringNonEmpty("  ")    // false - whitespace only
 * isStringNonEmpty("")      // false - empty string
 * isStringNonEmpty(123)     // false - not a string
 */
export function isStringNonEmpty(test: unknown): test is string {
  return isString(test) && test.trim().length > 0;
}

/**
 * Returns `true` if the input is a string that is safe to use as a regex pattern.
 * Uses `safe-regex` to detect patterns vulnerable to ReDoS (Regular Expression Denial of Service).
 * @example
 * isStringSafeRegex("hello")  // true  - simple pattern, safe
 * isStringSafeRegex("(a+)+")  // false - catastrophic backtracking risk
 * isStringSafeRegex(123)      // false - not a string
 */
export function isStringSafeRegex(test: unknown): test is string {
  return isString(test) && safeR(test);
}

/**
 * Returns `true` if the input is a `URL` object.
 * @example
 * isURL(new URL("https://example.com")) // true
 * isURL("https://example.com")          // false - string, not a URL object
 * isURL(null)                           // false
 */
export function isURL(test: unknown): test is URL {
  return test instanceof URL;
}

/**
 * Returns `true` if the input is a string representing a valid URL.
 * Accepts `http://`, `https://`, and protocol-relative URLs, as well as `localhost`.
 * For stricter validation, consider `isHTTP` to require an explicit protocol.
 * @example
 * isURLString("https://example.com")      // true
 * isURLString("http://localhost:3000")    // true
 * isURLString("example.com")              // true  - protocol is optional
 * isURLString("not a url")                // false - spaces
 * isURLString("")                         // false - empty string
 * isURLString(123)                        // false - not a string
 */
export function isURLString(test: unknown): test is string {
  if (!isStringSafeRegex(test)) return false;
  return /^(https?:\/\/)?([^\s.]+\.[^\s]{2,}|localhost[:\d]*)\S*$/i.test(
    test.trim(),
  );
}

/**
 * Returns `true` if the input is a non-null, non-undefined value.
 * When `testAll` is `true`, applies stricter validation based on the input's type:
 * - `string`  → must be non-empty (see `isStringNonEmpty`)
 * - `number`  → must be finite and non-NaN (see `isNumberValid`)
 * - `object`  → must be a non-empty plain object (see `isObjectNonEmpty`)
 * - `array`   → must be a non-empty array (see `isArrayNonEmpty`)
 * @example
 * isValid(0)              // true
 * isValid("")             // true
 * isValid(null)           // false
 * isValid(undefined)      // false
 * isValid("", true)       // false - empty string fails strict check
 * isValid(NaN, true)      // false - NaN fails strict check
 * isValid({}, true)       // false - empty object fails strict check
 * isValid([], true)       // false - empty array fails strict check
 */
export function isValid(test: unknown, testAll = false): boolean {
  if (test === undefined || test === null) return false;
  if (testAll) {
    return (
      isStringNonEmpty(test) ||
      isNumberValid(test) ||
      isObjectNonEmpty(test) ||
      isArrayNonEmpty(test)
    );
  } else return true;
}

// Aliases for backwards compatibility
export const isHttp = isHTTP;
export const isJson = isJSON;
export const isJsonString = isJSONString;
export const isJwt = isJWT;
export const isStringOrArray = isArrayOrString;
export const isStringSafe = isStringSafeRegex;
export const isUrl = isURL;
export const isUrlString = isURLString;
