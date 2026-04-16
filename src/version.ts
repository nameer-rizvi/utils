import * as validate from "./validate.js";

type VersionTuple = readonly [number, number, number];

interface VersionOptions {
  min?: string;
  max?: string;
}

interface VersionResult {
  isSupported: boolean;
  string?: string;
  major?: number;
  minor?: number;
  patch?: number;
}

interface VersionAPI {
  SUPPORTED_VERSIONS: string[];
  SUPPORTED_VERSION_LATEST: string | undefined;
  parse: (v: string, options?: VersionOptions) => VersionResult;
  isMinVersion: (v: string, min: string) => boolean;
  isMaxVersion: (v: string, max: string) => boolean;
}

/**
 * Creates a version management API for a set of supported semantic version strings.
 * Versions are normalized to `major.minor.patch` format and deduplicated.
 * @example
 * const v = version(["1.0.0", "1.1.0", "2.0.0"]);
 *
 * v.SUPPORTED_VERSIONS        // ["1.0.0", "1.1.0", "2.0.0"]
 * v.SUPPORTED_VERSION_LATEST  // "2.0.0"
 *
 * v.parse("1.1.0")            // { isSupported: true, string: "1.1.0", major: 1, minor: 1, patch: 0 }
 * v.parse("3.0.0")            // { isSupported: false }
 * v.parse("1.1.0", { min: "1.0.0", max: "1.9.9" }) // { isSupported: true, ... }
 *
 * v.isMinVersion("1.1.0", "1.0.0")  // true  - 1.1.0 >= 1.0.0
 * v.isMaxVersion("1.1.0", "2.0.0")  // true  - 1.1.0 <= 2.0.0
 */
export function version(input: string[] = []): VersionAPI {
  const normalized = new Map<string, VersionTuple>();

  for (const v of input) {
    const tuple = normalize(v);
    if (tuple) normalized.set(toString(tuple), tuple);
  }

  const SUPPORTED_VERSIONS = [...normalized.values()]
    .sort(compare)
    .map(toString);

  const SUPPORTED_VERSION_LATEST =
    SUPPORTED_VERSIONS[SUPPORTED_VERSIONS.length - 1];

  const versionSet = new Set(SUPPORTED_VERSIONS);

  function parse(v: string, options: VersionOptions = {}): VersionResult {
    const tuple = normalize(v);
    if (!tuple) return { isSupported: false };
    const min = options.min ? normalize(options.min) : undefined;
    const max = options.max ? normalize(options.max) : undefined;
    const string = toString(tuple);
    const isSupported = versionSet.has(string) && inRange(tuple, min, max);
    return {
      isSupported,
      string,
      major: tuple[0],
      minor: tuple[1],
      patch: tuple[2],
    };
  }

  function isMinVersion(v: string, min: string): boolean {
    return parse(v, { min }).isSupported;
  }

  function isMaxVersion(v: string, max: string): boolean {
    return parse(v, { max }).isSupported;
  }

  return {
    SUPPORTED_VERSIONS,
    SUPPORTED_VERSION_LATEST,
    parse,
    isMinVersion,
    isMaxVersion,
  };
}

/** Parses a version string into a normalized [major, minor, patch] tuple. */
function normalize(version: string): VersionTuple | undefined {
  if (!validate.isString(version)) return;
  const parts = version.split(".").map(Number).filter(validate.isNumberValid);
  if (!parts.length) return;
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
}

/** Converts a version tuple to a `major.minor.patch` string. */
function toString([a, b, c]: VersionTuple): string {
  return `${a}.${b}.${c}`;
}

/** Compares two version tuples. Returns negative, zero, or positive. */
function compare(a: VersionTuple, b: VersionTuple): number {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

/** Returns `true` if `v` falls within the optional min/max range. */
function inRange(
  v: VersionTuple,
  min?: VersionTuple,
  max?: VersionTuple,
): boolean {
  if (min && compare(v, min) < 0) return false;
  if (max && compare(v, max) > 0) return false;
  return true;
}
