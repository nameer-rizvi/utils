import * as validate from "./validate.js";

/* ----------------------- Constants / Caches ---------------------- */

/** Represents a value that can be resolved to a `Date` object. */
export type DateType = Date | string | number;

/** Cache for Intl.DateTimeFormat instance keyed by locale for long weekday names. */
export const WEEKDAY_LONG: Record<string, Intl.DateTimeFormat> = {};

/** Cache for Intl.DateTimeFormat instance keyed by locale for short weekday names. */
export const WEEKDAY_SHORT: Record<string, Intl.DateTimeFormat> = {};

/** Cache for Intl.DateTimeFormat instance keyed by locale for long month names. */
export const MONTH_LONG: Record<string, Intl.DateTimeFormat> = {};

/** Cache for Intl.DateTimeFormat instance keyed by locale for short month names. */
export const MONTH_SHORT: Record<string, Intl.DateTimeFormat> = {};

/** Cache for Intl.DateTimeFormat instance keyed by locale for relative format. */
export const RELATIVE_FORMAT: Record<string, Intl.RelativeTimeFormat> = {};

/** Represents number of milliseconds in a second. */
export const MS_PER_SECOND = 1000;

/** Represents number of milliseconds in a minute. */
export const MS_PER_MINUTE = MS_PER_SECOND * 60;

/** Represents number of milliseconds in an hour. */
export const MS_PER_HOUR = MS_PER_MINUTE * 60;

/** Represents number of milliseconds in a day. */
export const MS_PER_DAY = MS_PER_HOUR * 24;

/** Represents number of milliseconds in a week. */
export const MS_PER_WEEK = MS_PER_DAY * 7;

/** Represents number of milliseconds in a month (average). */
export const MS_PER_MONTH = MS_PER_DAY * 30.44;

/** Represents number of milliseconds in a year (average). */
export const MS_PER_YEAR = MS_PER_DAY * 365.25;

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

/**
 * Calculates the number of days from one date to another.
 * Defaults both dates to the current date if not provided.
 * Returns a positive number if `target` is in the future, negative if in the past.
 * @example
 * getDaysTill("2024-12-31", "2024-01-01")  // 365  - days from Jan 1 to Dec 31
 * getDaysTill("2024-01-01", "2024-12-31")  // -365 - negative, target is in the past
 * getDaysTill("2024-01-01")                // days from today to Jan 1, 2024
 * getDaysTill()                            // 0    - same date
 */
export function getDaysTill(input1?: DateType, input2?: DateType): number {
  const target = resolve(input1);
  const from = resolve(input2);
  return Math.ceil((target.getTime() - from.getTime()) / MS_PER_DAY);
}

/**
 * Calculates the absolute number of days between two dates.
 * Unlike `getDaysTill`, order does not matter — the result is always non-negative.
 * Defaults both dates to the current date if not provided.
 * @example
 * getDaysDiff("2024-12-31", "2024-01-01")  // 365 - same as getDaysTill
 * getDaysDiff("2024-01-01", "2024-12-31")  // 365 - order doesn't matter
 * getDaysDiff("2024-01-01")                // days between today and Jan 1, 2024
 * getDaysDiff()                            // 0   - same date
 */
export function getDaysDiff(input1?: DateType, input2?: DateType): number {
  return Math.abs(getDaysTill(input1, input2));
}

/**
 * Returns a human-readable relative time string for a given date.
 * Defaults to the current date if no input is provided.
 * @example
 * getRelative(addSeconds(10))             // "in 10 seconds"
 * getRelative(addMinutes(-30))            // "30 minutes ago"
 * getRelative(addHours(2))                // "in 2 hours"
 * getRelative(addDays(1))                 // "tomorrow"
 * getRelative(addDays(-1))                // "yesterday"
 * getRelative(addDays(3))                 // "in 3 days"
 * getRelative(addDays(3), true)           // "3d"
 * getRelative(addMonths(2))               // "in 2 months"
 * getRelative(addYears(1))                // "next year"
 * getRelative(addYears(1), true, "fr-FR") // "1a"
 */
export function getRelative(
  input?: DateType,
  asShort?: boolean,
  locale = "en-US",
): string {
  const d = resolve(input);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth =
    (d.getFullYear() - now.getFullYear()) * 12 +
    (d.getMonth() - now.getMonth());
  const diffYear = d.getFullYear() - now.getFullYear();
  const rtf = (RELATIVE_FORMAT[locale] ??= new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  }));
  if (Math.abs(diffSec) < 15) {
    return "now";
  } else if (Math.abs(diffSec) < 60) {
    return asShort ? `${diffSec}s` : rtf.format(diffSec, "second");
  } else if (Math.abs(diffMin) < 60) {
    return asShort ? `${diffMin}m` : rtf.format(diffMin, "minute");
  } else if (Math.abs(diffHour) < 24) {
    return asShort ? `${diffHour}h` : rtf.format(diffHour, "hour");
  } else if (diffDay === 1) {
    return "tomorrow";
  } else if (diffDay === -1) {
    return "yesterday";
  } else if (Math.abs(diffDay) < 7) {
    return asShort ? `${diffDay}d` : rtf.format(diffDay, "day");
  } else if (Math.abs(diffWeek) < 5) {
    return asShort ? `${diffWeek}w` : rtf.format(diffWeek, "week");
  } else if (Math.abs(diffMonth) < 12) {
    return asShort ? `${diffMonth}M` : rtf.format(diffMonth, "month");
  } else return asShort ? `${diffYear}y` : rtf.format(diffYear, "year");
}

/* --------------------------- Validators -------------------------- */

/**
 * Returns `true` if `input` falls on the same calendar day as `date` (with optional offsets).
 * Defaults both dates to the current date if not provided.
 * Offsets are applied to `date` before comparison.
 * @example
 * isDay("2024-01-15", { date: "2024-01-15" })              // true  - same day
 * isDay("2024-01-16", { date: "2024-01-15", addDays: 1 })  // true  - date + 1 day
 * isDay("2024-02-15", { date: "2024-01-15", addMonths: 1}) // true  - date + 1 month
 * isDay("2025-01-15", { date: "2024-01-15", addYears: 1 }) // true  - date + 1 year
 * isDay("2024-01-15", { date: "2024-01-16" })              // false - different days
 * isDay()                                                  // true  - both default to now
 */
export function isDay(
  input?: DateType,
  option: {
    date?: DateType;
    addYears?: number;
    addMonths?: number;
    addDays?: number;
  } = {},
): boolean {
  const {
    date,
    addYears: years = 0,
    addMonths: months = 0,
    addDays: days = 0,
  } = option;
  const dateA = resolve(input);
  const dateB = resolve(date);
  return (
    dateA.getFullYear() === dateB.getFullYear() + years &&
    dateA.getMonth() === dateB.getMonth() + months &&
    dateA.getDate() === dateB.getDate() + days
  );
}

/**
 * Returns `true` if `input1` is before `input2`.
 * Defaults both dates to the current date if not provided.
 * @example
 * isPast("2024-01-01", "2024-06-01")  // true  - January is before June
 * isPast("2024-06-01", "2024-01-01")  // false
 * isPast("2024-01-01", "2024-01-01")  // false - same date
 * isPast("2024-01-01")                // true/false - compares to now
 */
export function isPast(input1?: DateType, input2?: DateType): boolean {
  return resolve(input1) < resolve(input2);
}

/**
 * Returns `true` if `input1` and `input2` represent the exact same point in time.
 * Defaults both dates to the current date if not provided.
 * @example
 * isPresent("2024-01-01", "2024-01-01")  // true  - same date
 * isPresent("2024-01-01", "2024-06-01")  // false - different dates
 * isPresent()                            // true  - both default to now
 */
export function isPresent(input1?: DateType, input2?: DateType): boolean {
  return resolve(input1).getTime() === resolve(input2).getTime();
}

/**
 * Returns `true` if `input1` is after `input2`.
 * Defaults both dates to the current date if not provided.
 * @example
 * isFuture("2024-06-01", "2024-01-01")  // true  - June is after January
 * isFuture("2024-01-01", "2024-06-01")  // false
 * isFuture("2024-01-01", "2024-01-01")  // false - same date
 * isFuture("2024-12-31")                // true/false - compares to now
 */
export function isFuture(input1?: DateType, input2?: DateType): boolean {
  return resolve(input1) > resolve(input2);
}

/**
 * Returns `true` if the day of `input1` is before the day of `input2`.
 * Takes year and month into account — an earlier month or year is always considered a past day.
 * Defaults both dates to the current date if not provided.
 * @example
 * isDayPast("2024-01-01", "2024-01-15")  // true  - 1st is before 15th
 * isDayPast("2024-01-01", "2024-06-01")  // true  - earlier month
 * isDayPast("2023-12-31", "2024-01-01")  // true  - earlier year
 * isDayPast("2024-01-15", "2024-01-15")  // false - same day
 * isDayPast("2024-01-15", "2024-01-01")  // false - 15th is after 1st
 */
export function isDayPast(input1?: DateType, input2?: DateType): boolean {
  const d1 = resolve(input1);
  const d2 = resolve(input2);
  return (
    isMonthPast(d1, d2) ||
    (isMonthPresent(d1, d2) && d1.getDate() < d2.getDate())
  );
}

/**
 * Returns `true` if the day of `input1` is the same as the day of `input2`.
 * Year, month, and day must all match.
 * Defaults both dates to the current date if not provided.
 * @example
 * isDayPresent("2024-01-15", "2024-01-15")  // true  - same day
 * isDayPresent("2024-01-15", "2024-01-01")  // false - different days
 * isDayPresent("2024-01-15", "2024-06-15")  // false - different months
 * isDayPresent("2024-01-15")                // true/false - compares to today
 */
export function isDayPresent(input1?: DateType, input2?: DateType): boolean {
  const d1 = resolve(input1);
  const d2 = resolve(input2);
  return isMonthPresent(d1, d2) && d1.getDate() === d2.getDate();
}

/**
 * Returns `true` if the day of `input1` is after the day of `input2`.
 * Takes year and month into account — a later month or year is always considered a future day.
 * Defaults both dates to the current date if not provided.
 * @example
 * isDayFuture("2024-01-15", "2024-01-01")  // true  - 15th is after 1st
 * isDayFuture("2024-06-01", "2024-01-15")  // true  - later month
 * isDayFuture("2025-01-01", "2024-12-31")  // true  - later year
 * isDayFuture("2024-01-15", "2024-01-15")  // false - same day
 * isDayFuture("2024-01-01", "2024-01-15")  // false - 1st is before 15th
 */
export function isDayFuture(input1?: DateType, input2?: DateType): boolean {
  const d1 = resolve(input1);
  const d2 = resolve(input2);
  return (
    isMonthFuture(d1, d2) ||
    (isMonthPresent(d1, d2) && d1.getDate() > d2.getDate())
  );
}

/**
 * Returns `true` if the month of `input1` is before the month of `input2`.
 * Takes year into account — an earlier year is always considered a past month.
 * Defaults both dates to the current date if not provided.
 * @example
 * isMonthPast("2024-01-01", "2024-06-01")  // true  - January is before June
 * isMonthPast("2023-06-01", "2024-01-01")  // true  - earlier year
 * isMonthPast("2024-06-01", "2024-06-15")  // false - same month
 * isMonthPast("2024-06-01", "2024-01-01")  // false - June is after January
 */
export function isMonthPast(input1?: DateType, input2?: DateType): boolean {
  const d1 = resolve(input1);
  const d2 = resolve(input2);
  return (
    isYearPast(d1, d2) ||
    (isYearPresent(d1, d2) && d1.getMonth() < d2.getMonth())
  );
}

/**
 * Returns `true` if the month of `input1` is the same as the month of `input2`.
 * Both year and month must match.
 * Defaults both dates to the current date if not provided.
 * @example
 * isMonthPresent("2024-06-01", "2024-06-15")  // true  - same month and year
 * isMonthPresent("2024-06-01", "2024-01-01")  // false - different months
 * isMonthPresent("2023-06-01", "2024-06-01")  // false - different years
 * isMonthPresent("2024-06-01")                // true/false - compares to current month
 */
export function isMonthPresent(input1?: DateType, input2?: DateType): boolean {
  const d1 = resolve(input1);
  const d2 = resolve(input2);
  return isYearPresent(d1, d2) && d1.getMonth() === d2.getMonth();
}

/**
 * Returns `true` if the month of `input1` is after the month of `input2`.
 * Takes year into account — a later year is always considered a future month.
 * Defaults both dates to the current date if not provided.
 * @example
 * isMonthFuture("2024-06-01", "2024-01-01")  // true  - June is after January
 * isMonthFuture("2025-01-01", "2024-06-01")  // true  - later year
 * isMonthFuture("2024-06-01", "2024-06-15")  // false - same month
 * isMonthFuture("2024-01-01", "2024-06-01")  // false - January is before June
 */
export function isMonthFuture(input1?: DateType, input2?: DateType): boolean {
  const d1 = resolve(input1);
  const d2 = resolve(input2);
  return (
    isYearFuture(d1, d2) ||
    (isYearPresent(d1, d2) && d1.getMonth() > d2.getMonth())
  );
}

/**
 * Returns `true` if the year of `input1` is before the year of `input2`.
 * Defaults both dates to the current date if not provided.
 * @example
 * isYearPast("2023-01-01", "2024-01-01")  // true  - 2023 is before 2024
 * isYearPast("2024-01-01", "2024-06-01")  // false - same year
 * isYearPast("2025-01-01", "2024-01-01")  // false - 2025 is after 2024
 */
export function isYearPast(input1?: DateType, input2?: DateType): boolean {
  return resolve(input1).getFullYear() < resolve(input2).getFullYear();
}

/**
 * Returns `true` if the year of `input1` is the same as the year of `input2`.
 * Defaults both dates to the current date if not provided.
 * @example
 * isYearPresent("2024-01-01", "2024-06-01")  // true       - same year
 * isYearPresent("2023-01-01", "2024-01-01")  // false      - different years
 * isYearPresent("2024-01-01")                // true/false - compares to current year
 */
export function isYearPresent(input1?: DateType, input2?: DateType): boolean {
  return resolve(input1).getFullYear() === resolve(input2).getFullYear();
}

/**
 * Returns `true` if the year of `input1` is after the year of `input2`.
 * Defaults both dates to the current date if not provided.
 * @example
 * isYearFuture("2025-01-01", "2024-01-01")  // true  - 2025 is after 2024
 * isYearFuture("2024-01-01", "2024-06-01")  // false - same year
 * isYearFuture("2023-01-01", "2024-01-01")  // false - 2023 is before 2024
 */
export function isYearFuture(input1?: DateType, input2?: DateType): boolean {
  return resolve(input1).getFullYear() > resolve(input2).getFullYear();
}

/**
 * Returns `true` if the given date falls on a weekend (Saturday or Sunday).
 * Defaults to the current date if no input is provided.
 * @example
 * isWeekend("2024-01-06")  // true  - Saturday
 * isWeekend("2024-01-07")  // true  - Sunday
 * isWeekend("2024-01-01")  // false - Monday
 * isWeekend("2024-01-05")  // false - Friday
 * isWeekend()              // true/false depending on current day
 */
export function isWeekend(input?: DateType): boolean {
  const day = resolve(input).getDay();
  return day === 0 || day === 6;
}

/**
 * Returns `true` if the given date falls on a weekday (Monday–Friday).
 * Defaults to the current date if no input is provided.
 * @example
 * isWeekday("2024-01-01")  // true  - Monday
 * isWeekday("2024-01-05")  // true  - Friday
 * isWeekday("2024-01-06")  // false - Saturday
 * isWeekday("2024-01-07")  // false - Sunday
 * isWeekday()              // true/false depending on current day
 */
export function isWeekday(input?: DateType): boolean {
  const day = resolve(input).getDay();
  return day > 0 && day < 6;
}

/**
 * Returns `true` if the input is a valid full or abbreviated weekday name for the given locale.
 * Case-insensitive.
 * @example
 * isWeekdayName("Monday")             // true  - full weekday name
 * isWeekdayName("Mon")                // true  - abbreviated weekday name
 * isWeekdayName("mon")                // true  - case-insensitive
 * isWeekdayName("lundi", "fr-FR")     // true  - French weekday name
 * isWeekdayName("invalid")            // false
 * isWeekdayName("")                   // false
 * isWeekdayName(123)                  // false - not a string
 */
export function isWeekdayName(input?: unknown, locale?: string): boolean {
  if (validate.isStringNonEmpty(input)) {
    const v = input.toLowerCase();
    const long = getWeekdays(locale);
    const short = getWeekdaysShort(locale);
    for (let i = 0; i < long.length; i++)
      if (long[i].toLowerCase() === v || short[i].toLowerCase() === v)
        return true;
  }
  return false;
}

/**
 * Returns `true` if the input is a valid full or abbreviated month name for the given locale.
 * Case-insensitive.
 * @example
 * isMonthName("January")                      // true  - full month name
 * isMonthName("Jan")                          // true  - abbreviated month name
 * isMonthName("jan")                          // true  - case-insensitive
 * isMonthName("janvier", undefined, "fr-FR")  // true  - French month name
 * isMonthName("invalid")                      // false
 * isMonthName("")                             // false
 * isMonthName(123)                            // false - not a string
 */
export function isMonthName(input?: unknown, locale?: string): boolean {
  if (!validate.isStringNonEmpty(input)) return false;
  const v = input.toLowerCase();
  const long = getMonths(locale);
  const short = getMonthsShort(locale);
  for (let i = 0; i < long.length; i++) {
    if (long[i].toLowerCase() === v || short[i].toLowerCase() === v)
      return true;
  }
  return false;
}

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
