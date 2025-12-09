/**
 * Format a number to a more readable format
 * e.g. 100 -> 100+, 200 -> 200+, 1000 -> 1k+, 2000 -> 2k+, 10000 -> 10k+
 * @param num The number to format
 * @returns Formatted string representation
 */
export function formatNumber(num: number | undefined | null): string {
  // Handle undefined or null values
  if (num === undefined || num === null) {
    return "0";
  }
  
  if (num >= 10000) {
    return `${Math.floor(num / 1000)}k+`;
  }
  if (num >= 2000) {
    return "2k+";
  }
  if (num >= 1000) {
    return "1k+";
  }
  if (num >= 200) {
    return "200+";
  }
  if (num >= 100) {
    return "100+";
  }
  return num.toString();
}