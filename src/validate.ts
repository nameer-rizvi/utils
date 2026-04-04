/*
 * Array Validations
 */

export const isArray = Array.isArray;

export function isArrayNonEmpty(test: unknown): test is unknown[] {
  return isArray(test) && test.length > 0;
}

// todo
// export function isArrayOrString(test: unknown): test is unknown[] | string {
//   return isArray(test) || isString(test);
// }
