import * as math from "./math.js";

function logProgressDecorator(total: number, withDatetime = true) {
  let current = 0;

  const totalString = total.toLocaleString();

  const isTTY = process.stdout.isTTY;

  return function logProgress(): void {
    if (++current > total) return;

    const isLast = current === total;

    const datetime = withDatetime
      ? `${new Date().toLocaleString().replace(",", "")} - `
      : "";

    const status = isLast ? "⌛ Completed" : "⏳ Progress";

    const percent = math.percent(current, total) ?? 0;

    const suffix = isLast ? ".\n" : "...";

    const line = `${datetime}${status} ${current.toLocaleString()}/${totalString} (${percent}%)${suffix}`;

    if (isTTY) {
      process.stdout.clearLine(0);

      process.stdout.cursorTo(0);
    }

    process.stdout.write(line);
  };
}

/**
 * Returns a progress logging function that tracks and displays incremental progress.
 * Overwrites the current line in TTY environments for a cleaner output experience.
 * Calls beyond `total` are ignored.
 * @example
 * const log = logProgress.init(100);
 * for (let i = 0; i < 100; i++) {
 *   await doWork();
 *   log(); // "1/1,000 (1%)... " → "⌛ Completed 100/100 (100%).\n"
 * }
 *
 * const log = logProgress.init(1000, false); // no datetime prefix
 */
export const logProgress = { init: logProgressDecorator };
