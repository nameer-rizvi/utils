/**
 * Returns a promise that resolves after a given number of milliseconds.
 * Optionally calls a callback when the delay completes.
 * @example
 * await delay(1000)                    // waits 1 second
 * await delay(500, () => log("done"))  // waits 500ms then calls callback
 * await delay()                        // waits 1 second (default)
 */
export function delay(ms = 1000, onDelay?: () => void): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms)).then(onDelay);
}
