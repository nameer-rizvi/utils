import * as validate from "./validate.js";

/* ----------------------- Constants / Caches ---------------------- */

/** Represents a value that can be resolved to a `Date` object. */
export type DateType = Date | string | number;

// Caches for Intl.DateTimeFormat instances keyed by locale

export const WEEKDAY_LONG: Record<string, Intl.DateTimeFormat> = {};

export const WEEKDAY_SHORT: Record<string, Intl.DateTimeFormat> = {};

export const MONTH_LONG: Record<string, Intl.DateTimeFormat> = {};

export const MONTH_SHORT: Record<string, Intl.DateTimeFormat> = {};

/* -------------------- Date Arrays / Accessors -------------------- */

/**
 * Returns an array of localized weekday names starting from Sunday.
 * Results are cached per locale for performance.
 * @example
 * getWeekdays()        // ["Sunday", "Monday", ..., "Saturday"]  - default locale
 * getWeekdays("fr-FR") // ["dimanche", "lundi", ..., "samedi"]   - French
 * getWeekdays("de-DE") // ["Sonntag", "Montag", ..., "Samstag"]  - German
 * getWeekdays("ja-JP") // ["日曜日", "月曜日", ..., "土曜日"]       - Japanese
 */
export function getWeekdays(locale?: string): readonly string[] {
  const fmt = getFormatter(WEEKDAY_LONG, locale, { weekday: "long" });
  return Object.freeze(
    Array.from({ length: 7 }, (_, i) => fmt.format(new Date(1970, 0, 4 + i))), // Jan 4, 1970 was a Sunday — used as a stable reference point for weekday names
  );
}

/**
 * Returns an array of localized abbreviated weekday names starting from Sunday.
 * Results are cached per locale for performance.
 * @example
 * getWeekdaysShort()        // ["Sun", "Mon", ..., "Sat"]    - default locale
 * getWeekdaysShort("fr-FR") // ["dim.", "lun.", ..., "sam."] - French
 * getWeekdaysShort("de-DE") // ["So", "Mo", ..., "Sa"]       - German
 * getWeekdaysShort("ja-JP") // ["日", "月", ..., "土"]        - Japanese
 */
export function getWeekdaysShort(locale?: string): readonly string[] {
  const fmt = getFormatter(WEEKDAY_SHORT, locale, { weekday: "short" });
  return Object.freeze(
    Array.from({ length: 7 }, (_, i) => fmt.format(new Date(1970, 0, 4 + i))), // Jan 4, 1970 was a Sunday — used as a stable reference point for weekday names
  );
}

/**
 * Returns the localized full weekday name for a given date.
 * Defaults to the current date if no input is provided.
 * @example
 * getWeekday(new Date(2024, 0, 1))           // "Monday"
 * getWeekday("2024-01-01")                   // "Sunday"
 * getWeekday("2024-01-01", "fr-FR")          // "dimanche"
 * getWeekday("2024-01-01", "de-DE")          // "Sonntag"
 * getWeekday()                               // current weekday name
 */
export function getWeekday(input?: DateType, locale?: string): string {
  return getFormatter(WEEKDAY_LONG, locale, { weekday: "long" }).format(
    resolve(input),
  );
}

/**
 * Returns the localized abbreviated weekday name for a given date.
 * Defaults to the current date if no input is provided.
 * @example
 * getWeekdayShort(new Date(2024, 0, 1))          // "Mon"
 * getWeekdayShort("2024-01-01")                  // "Sun"
 * getWeekdayShort("2024-01-01", "fr-FR")         // "dim."
 * getWeekdayShort("2024-01-01", "de-DE")         // "So"
 * getWeekdayShort()                              // current abbreviated weekday name
 */
export function getWeekdayShort(input?: DateType, locale?: string): string {
  return getFormatter(WEEKDAY_SHORT, locale, { weekday: "short" }).format(
    resolve(input),
  );
}

/**
 * Returns an array of localized full month names starting from January.
 * Results are cached per locale for performance.
 * @example
 * getMonths()        // ["January", "February", ..., "December"]    - default locale
 * getMonths("fr-FR") // ["janvier", "février", ..., "décembre"]     - French
 * getMonths("de-DE") // ["Januar", "Februar", ..., "Dezember"]      - German
 * getMonths("ja-JP") // ["1月", "2月", ..., "12月"]                  - Japanese
 */
export function getMonths(locale?: string): readonly string[] {
  const fmt = getFormatter(MONTH_LONG, locale, { month: "long" });
  return Object.freeze(
    Array.from({ length: 12 }, (_, i) => fmt.format(new Date(1970, i, 1))), // Jan 1, 1970 used as a stable reference — iterating month index for each name
  );
}

/**
 * Returns an array of localized abbreviated month names starting from January.
 * Results are cached per locale for performance.
 * @example
 * getMonthsShort()        // ["Jan", "Feb", ..., "Dec"]          - default locale
 * getMonthsShort("fr-FR") // ["janv.", "févr.", ..., "déc."]     - French
 * getMonthsShort("de-DE") // ["Jan", "Feb", ..., "Dez"]          - German
 * getMonthsShort("ja-JP") // ["1月", "2月", ..., "12月"]          - Japanese
 */
export function getMonthsShort(locale?: string): readonly string[] {
  const fmt = getFormatter(MONTH_SHORT, locale, { month: "short" });
  return Object.freeze(
    Array.from({ length: 12 }, (_, i) => fmt.format(new Date(1970, i, 1))), // Jan 1, 1970 used as a stable reference — iterating month index for each name
  );
}

/**
 * Returns the localized full month name for a given date.
 * Defaults to the current date if no input is provided.
 * @example
 * getMonth(new Date(2024, 0, 1))         // "January"
 * getMonth("2024-06-15")                 // "June"
 * getMonth("2024-01-01", "fr-FR")        // "décembre"
 * getMonth("2024-01-01", "de-DE")        // "Dezember"
 * getMonth()                             // current month name
 */
export function getMonth(input?: DateType, locale?: string): string {
  return getFormatter(MONTH_LONG, locale, { month: "long" }).format(
    resolve(input),
  );
}

/**
 * Returns the localized abbreviated month name for a given date.
 * Defaults to the current date if no input is provided.
 * @example
 * getMonthShort(new Date(2024, 0, 1))        // "Jan"
 * getMonthShort("2024-06-15")                // "Jun"
 * getMonthShort("2024-01-01", "fr-FR")       // "déc."
 * getMonthShort("2024-01-01", "de-DE")       // "Dez"
 * getMonthShort()                            // current abbreviated month name
 */
export function getMonthShort(input?: DateType, locale?: string): string {
  return getFormatter(MONTH_SHORT, locale, { month: "short" }).format(
    resolve(input),
  );
}

/* ----------------------- Date Manipulation ----------------------- */

/**
 * Adds a number of seconds to a date.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized string if `asString` is `true`.
 * @example
 * addSeconds(30, "2024-01-01T00:00:00")          // Date: 2024-01-01T00:00:30
 * addSeconds(-30, "2024-01-01T00:00:30")         // Date: 2024-01-01T00:00:00
 * addSeconds(30, "2024-01-01T00:00:00", true)    // "1/1/2024, 12:00:30 AM"
 * addSeconds(30)                                 // current date + 30 seconds
 * addSeconds()                                   // current date unchanged
 */
export function addSeconds(
  seconds = 0,
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  if (validate.isNumber(seconds)) d.setSeconds(d.getSeconds() + seconds);
  return asString ? d.toLocaleString() : d;
}

/**
 * Adds a number of minutes to a date.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized string if `asString` is `true`.
 * @example
 * addMinutes(30, "2024-01-01T00:00:00")        // Date: 2024-01-01T00:30:00
 * addMinutes(-30, "2024-01-01T00:30:00")       // Date: 2024-01-01T00:00:00
 * addMinutes(30, "2024-01-01T00:00:00", true)  // "1/1/2024, 12:30:00 AM"
 * addMinutes(30)                               // current date + 30 minutes
 * addMinutes()                                 // current date unchanged
 */
export function addMinutes(
  minutes = 0,
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  if (validate.isNumber(minutes)) d.setMinutes(d.getMinutes() + minutes);
  return asString ? d.toLocaleString() : d;
}

/**
 * Adds a number of hours to a date.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized string if `asString` is `true`.
 * @example
 * addHours(6, "2024-01-01T00:00:00")        // Date: 2024-01-01T06:00:00
 * addHours(-6, "2024-01-01T06:00:00")       // Date: 2024-01-01T00:00:00
 * addHours(6, "2024-01-01T00:00:00", true)  // "1/1/2024, 6:00:00 AM"
 * addHours(6)                               // current date + 6 hours
 * addHours()                                // current date unchanged
 */
export function addHours(
  hours = 0,
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  if (validate.isNumber(hours)) d.setHours(d.getHours() + hours);
  return asString ? d.toLocaleString() : d;
}

/**
 * Adds a number of days to a date.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized string if `asString` is `true`.
 * @example
 * addDays(7, "2024-01-01")        // Date: 2024-01-08
 * addDays(-7, "2024-01-08")       // Date: 2024-01-01
 * addDays(7, "2024-01-01", true)  // "1/8/2024, 12:00:00 AM"
 * addDays(7)                      // current date + 7 days
 * addDays()                       // current date unchanged
 */
export function addDays(
  days = 0,
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  if (validate.isNumber(days)) d.setDate(d.getDate() + days);
  return asString ? d.toLocaleString() : d;
}

/**
 * Adds a number of months to a date.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized string if `asString` is `true`.
 * Note: adding months to dates near the end of a month may produce unexpected results
 * (e.g. Jan 31 + 1 month = Mar 3 in non-leap years, as February has no 31st).
 * @example
 * addMonths(3, "2024-01-01")        // Date: 2024-04-01
 * addMonths(-3, "2024-04-01")       // Date: 2024-01-01
 * addMonths(3, "2024-01-01", true)  // "4/1/2024, 12:00:00 AM"
 * addMonths(3)                      // current date + 3 months
 * addMonths()                       // current date unchanged
 */
export function addMonths(
  months = 0,
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  if (validate.isNumber(months)) d.setMonth(d.getMonth() + months);
  return asString ? d.toLocaleString() : d;
}

/**
 * Adds a number of years to a date.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized string if `asString` is `true`.
 * Note: adding years to Feb 29 (leap day) will produce Mar 1 in non-leap years.
 * @example
 * addYears(1, "2024-01-01")        // Date: 2025-01-01
 * addYears(-1, "2024-01-01")       // Date: 2023-01-01
 * addYears(1, "2024-01-01", true)  // "1/1/2025, 12:00:00 AM"
 * addYears(1)                      // current date + 1 year
 * addYears()                       // current date unchanged
 */
export function addYears(
  years = 0,
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  if (validate.isNumber(years)) d.setFullYear(d.getFullYear() + years);
  return asString ? d.toLocaleString() : d;
}

/**
 * Adds a number of working days (Monday–Friday) to a date, skipping weekends.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized date string if `asString` is `true`.
 * Note: does not account for public holidays.
 * @example
 * addWorkDays(5, "2024-01-01")        // Date: 2024-01-08 - skips weekend
 * addWorkDays(-5, "2024-01-08")       // Date: 2024-01-01 - skips weekend
 * addWorkDays(1, "2024-01-05")        // Date: 2024-01-08 - Friday + 1 = Monday
 * addWorkDays(5, "2024-01-01", true)  // "1/8/2024"
 * addWorkDays(5)                      // current date + 5 work days
 * addWorkDays()                       // current date unchanged
 */
export function addWorkDays(
  workdays = 0,
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  if (validate.isNumber(workdays)) {
    const direction = workdays < 0 ? -1 : 1;
    let remaining = Math.abs(workdays);
    while (remaining) {
      d.setDate(d.getDate() + direction);
      const day = d.getDay();
      if (day !== 0 && day !== 6) remaining--;
    }
  }
  return asString ? d.toLocaleDateString() : d;
}

/**
 * Returns the most recent working day (Monday–Friday) for a given date.
 * If the date is a Saturday, returns the previous Friday.
 * If the date is a Sunday, returns the previous Friday.
 * If the date is already a weekday, returns it unchanged.
 * Defaults to the current date if no input is provided.
 * Returns a `Date` object by default, or a localized string if `asString` is `true`.
 * Note: does not account for public holidays.
 * @example
 * getMostRecentWorkDate("2024-01-06")        // Date: 2024-01-05 - Saturday → Friday
 * getMostRecentWorkDate("2024-01-07")        // Date: 2024-01-05 - Sunday → Friday
 * getMostRecentWorkDate("2024-01-05")        // Date: 2024-01-05 - Friday unchanged
 * getMostRecentWorkDate("2024-01-05", true)  // "1/5/2024, 12:00:00 AM"
 * getMostRecentWorkDate()                    // most recent weekday from today
 */
export function getMostRecentWorkDate(
  input?: DateType,
  asString?: boolean,
): Date | string {
  const d = resolve(input);
  const day = d.getDay();
  const offset = day === 6 ? -1 : day === 0 ? -2 : 0;
  return addDays(offset, d, asString);
}

/* ------------------------ Date Conversions ----------------------- */

/**
 * Converts a date to a MySQL-compatible datetime string in the format `YYYY-MM-DD HH:MM:SS`.
 * Defaults to the current date if no input is provided.
 * Note: the output is always in UTC time.
 * @example
 * toMysqlDatetime("2024-01-01T12:30:45.000Z")   // "2024-01-01 12:30:45"
 * toMysqlDatetime(new Date(2024, 0, 1, 12, 30)) // "2024-01-01 12:30:00" - UTC
 * toMysqlDatetime(1704067200000)                // "2024-01-01 00:00:00"
 * toMysqlDatetime()                             // current UTC datetime as MySQL string
 */
export function toMysqlDatetime(input?: DateType): string {
  return resolve(input).toISOString().split(".")[0].replace("T", " ");
}

/* -------------------- Relative / Friendly Time ------------------- */

// export function getDaysTill(input1?: DateType, input2?: DateType): number {
//   const target = resolve(input1);
//   const from = resolve(input2);
//   const diff = (target.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);
//   return Math.ceil(diff);
// }

// export function getDaysDiff(input1?: DateType, input2?: DateType): number {
//   return Math.abs(getDaysTill(input1, input2));
// }

// export function getRelative(
//   input?: DateType,
//   asShort?: boolean,
//   locale?: string,
// ): string {
//   const d = resolve(input);
//   const now = new Date();
//   const diffMs = d.getTime() - now.getTime();
//   const diffSec = Math.round(diffMs / 1000);
//   const diffMin = Math.round(diffSec / 60);
//   const diffHour = Math.round(diffMin / 60);
//   const diffDay = Math.round(diffHour / 24);
//   const diffWeek = Math.round(diffDay / 7);
//   const diffMonth =
//     (d.getFullYear() - now.getFullYear()) * 12 +
//     (d.getMonth() - now.getMonth());
//   const diffYear = d.getFullYear() - now.getFullYear();
//   const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
//   if (Math.abs(diffSec) < 15) {
//     return "now";
//   } else if (Math.abs(diffSec) < 60) {
//     return asShort ? `${diffSec}s` : rtf.format(diffSec, "second");
//   } else if (Math.abs(diffMin) < 60) {
//     return asShort ? `${diffMin}m` : rtf.format(diffMin, "minute");
//   } else if (Math.abs(diffHour) < 24) {
//     return asShort ? `${diffHour}h` : rtf.format(diffHour, "hour");
//   } else if (diffDay === 0) {
//     return asShort ? "today" : "today";
//   } else if (diffDay === 1) {
//     return asShort ? "tomorrow" : "tomorrow";
//   } else if (diffDay === -1) {
//     return asShort ? "yesterday" : "yesterday";
//   } else if (Math.abs(diffDay) < 7) {
//     return asShort ? `${diffDay}d` : rtf.format(diffDay, "day");
//   } else if (Math.abs(diffWeek) < 5) {
//     return asShort ? `${diffWeek}w` : rtf.format(diffWeek, "week");
//   } else if (Math.abs(diffMonth) < 12) {
//     return asShort ? `${diffMonth}M` : rtf.format(diffMonth, "month");
//   } else return asShort ? `${diffYear}y` : rtf.format(diffYear, "year");
// }

/* --------------------------- Validators -------------------------- */

// export function isDay(
//   input?: DateType,
//   option: {
//     date?: DateType;
//     addYears?: number;
//     addMonths?: number;
//     addDays?: number;
//   } = {},
// ): boolean {
//   const { date, addYears = 0, addMonths = 0, addDays = 0 } = option;
//   const dateA = resolve(input);
//   const dateB = resolve(date);
//   return (
//     dateA.getFullYear() === dateB.getFullYear() + addYears &&
//     dateA.getMonth() === dateB.getMonth() + addMonths &&
//     dateA.getDate() === dateB.getDate() + addDays
//   );
// }

// export function isPast(input1?: DateType, input2?: DateType): boolean {
//   return resolve(input1) < resolve(input2);
// }

// export function isPresent(input1?: DateType, input2?: DateType): boolean {
//   return resolve(input1) === resolve(input2);
// }

// export function isFuture(input1?: DateType, input2?: DateType): boolean {
//   return resolve(input1) > resolve(input2);
// }

// export function isDayPast(input1?: DateType, input2?: DateType): boolean {
//   const d1 = resolve(input1);
//   const d2 = resolve(input2);
//   return (
//     isMonthPast(d1, d2) ||
//     (isMonthPresent(d1, d2) && d1.getDate() < d2.getDate())
//   );
// }

// export function isDayPresent(input1?: DateType, input2?: DateType): boolean {
//   const d1 = resolve(input1);
//   const d2 = resolve(input2);
//   return isMonthPresent(d1, d2) && d1.getDate() === d2.getDate();
// }

// export function isDayFuture(input1?: DateType, input2?: DateType): boolean {
//   const d1 = resolve(input1);
//   const d2 = resolve(input2);
//   return (
//     isMonthFuture(d1, d2) ||
//     (isMonthPresent(d1, d2) && d1.getDate() > d2.getDate())
//   );
// }

// export function isMonthPast(input1?: DateType, input2?: DateType): boolean {
//   const d1 = resolve(input1);
//   const d2 = resolve(input2);
//   return (
//     isYearPast(d1, d2) ||
//     (isYearPresent(d1, d2) && d1.getMonth() < d2.getMonth())
//   );
// }

// export function isMonthPresent(input1?: DateType, input2?: DateType): boolean {
//   const d1 = resolve(input1);
//   const d2 = resolve(input2);
//   return isYearPresent(d1, d2) && d1.getMonth() === d2.getMonth();
// }

// export function isMonthFuture(input1?: DateType, input2?: DateType): boolean {
//   const d1 = resolve(input1);
//   const d2 = resolve(input2);
//   return (
//     isYearFuture(d1, d2) ||
//     (isYearPresent(d1, d2) && d1.getMonth() > d2.getMonth())
//   );
// }

// export function isYearPast(input1?: DateType, input2?: DateType): boolean {
//   return resolve(input1).getFullYear() < resolve(input2).getFullYear();
// }

// export function isYearPresent(input1?: DateType, input2?: DateType): boolean {
//   return resolve(input1).getFullYear() === resolve(input2).getFullYear();
// }

// export function isYearFuture(input1?: DateType, input2?: DateType): boolean {
//   return resolve(input1).getFullYear() > resolve(input2).getFullYear();
// }

// export function isWeekend(input?: DateType): boolean {
//   const day = resolve(input).getDay();
//   return day === 0 || day === 6;
// }

// export function isWeekday(input?: DateType): boolean {
//   const day = resolve(input).getDay();
//   return day >= 1 && day <= 5;
// }

// export function isWeekdayName(input?: unknown, locale?: string): boolean {
//   if (validate.isStringNonEmpty(input)) {
//     const v = input.toLowerCase();
//     const long = getWeekdays(locale);
//     const short = getWeekdaysShort(locale);
//     for (let i = 0; i < long.length; i++)
//       if (long[i].toLowerCase() === v || short[i].toLowerCase() === v)
//         return true;
//   }
//   return false;
// }

// export function isMonthName(input?: unknown, locale?: string): boolean {
//   if (validate.isStringNonEmpty(input)) {
//     const v = input.toLowerCase();
//     const long = getMonths(locale);
//     const short = getMonthsShort(locale);
//     for (let i = 0; i < long.length; i++)
//       if (long[i].toLowerCase() === v || short[i].toLowerCase() === v)
//         return true;
//   }
//   return false;
// }

/* --------------------- Internals / Utilities --------------------- */

/**
 * Resolves a `DateType` value to a `Date` object.
 * Returns the current date if the input is undefined or invalid.
 * @example
 * resolve("2024-01-01")   // Date object for Jan 1, 2024
 * resolve(1704067200000)  // Date object for the given timestamp
 * resolve(new Date())     // same Date as a new instance
 * resolve()               // current date
 * resolve("invalid")      // current date - invalid input falls back to now
 */
export function resolve(input?: DateType): Date {
  return validate.isDate(input) ? new Date(input) : new Date();
}

/**
 * Returns a cached `Intl.DateTimeFormat` instance for the given locale and options.
 * Creates and caches a new instance on first call for each unique locale.
 * @example
 * getFormatter(WEEKDAY_LONG, "en-US", { weekday: "long" })  // Intl.DateTimeFormat
 * getFormatter(MONTH_SHORT, "fr-FR", { month: "short" })    // Intl.DateTimeFormat (French)
 */
export function getFormatter(
  cache: Record<string, Intl.DateTimeFormat>,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  return (cache[locale] ??= new Intl.DateTimeFormat(locale, options));
}
