/**
 * Concatenates multiple class names into a single space-separated string.
 * @param classes - The class names to be concatenated.
 * @returns {string} - The space-separated string of class names.
 */
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
