type AsyncCallback<T> = (error: Error | null, result?: T) => void;

/**
 * Executes an async function safely, catching any errors.
 * Optionally invokes a Node.js-style callback with `(error, result)`.
 * Returns the result on success, or `undefined` on failure.
 * @example
 * await tryAsync(() => fetch("https://example.com"))
 * // Response | undefined
 *
 * await tryAsync(
 *   () => fetch("https://example.com"),
 *   (err, res) => err ? console.error(err) : console.log(res)
 * )
 *
 * await tryAsync(() => Promise.reject(new Error("oops")))
 * // undefined - error swallowed
 */
export async function tryAsync<T>(
  asyncFunction: () => Promise<T>,
  callback?: AsyncCallback<T>,
): Promise<T | undefined> {
  try {
    const result = await asyncFunction();

    if (callback) callback(null, result);

    return result;
  } catch (error) {
    if (callback) callback(error as Error);
  }
}
