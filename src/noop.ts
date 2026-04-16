/**
 * A no-operation function that does nothing and returns nothing.
 * Useful as a default callback or placeholder function.
 * @example
 * const onClick = noop;           // safe default handler
 * setTimeout(noop, 1000);         // no-op after delay
 * [1, 2, 3].forEach(noop);        // iterate without doing anything
 */
export const noop = (): void => {};
