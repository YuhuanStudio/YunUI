/** Optional label fields use their fallback when explicitly undefined.
 * Visit only known keys; caller objects cannot add prototype keys to the copy.
 * Empty strings, zero and null remain deliberate host-provided values.
 */
export function mergeLabels<T extends object>(fallbacks: T, overrides?: Partial<T>): T {
  const result = { ...fallbacks };
  for (const key of Object.keys(fallbacks) as Array<keyof T>) {
    if (!overrides || !Object.prototype.hasOwnProperty.call(overrides, key)) continue;
    const value = overrides[key];
    if (value !== undefined) result[key] = value as T[typeof key];
  }
  return result;
}
