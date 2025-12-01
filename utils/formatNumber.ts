/**
 * Format a number to a more readable format
 * e.g. 1000 -> 1k, 1500 -> 1.5k, 1000000 -> 1m
 * @param num The number to format
 * @returns Formatted string representation
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
  }
  return num.toString();
}