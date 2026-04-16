type Callback<T> = (error: Error | null, result?: T) => void;

/**
 * Executes a synchronous function safely, catching any errors.
 * Optionally invokes a Node.js-style callback with `(error, result)`.
 * Returns the result on success, or `undefined` on failure.
 * @example
 * tryCallback(() => JSON.parse('{"a":1}'))
 * // { a: 1 }
 *
 * tryCallback(
 *   () => JSON.parse("invalid"),
 *   (err, res) => err ? console.error(err) : console.log(res)
 * )
 * // undefined - error passed to callback
 *
 * tryCallback(() => { throw new Error("oops") })
 * // undefined - error swallowed
 */
export function tryCallback<T>(
  syncFunction: () => T,
  callback?: Callback<T>,
): T | undefined {
  try {
    const result = syncFunction();

    if (callback) callback(null, result);

    return result;
  } catch (error) {
    if (callback) callback(error as Error);
  }
}
