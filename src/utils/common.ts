/**
 * Formats a numeric value into a compact human-readable string with K, M, B, or T suffixes.
 *
 * Examples:
 *   0 -> "0"
 *   100 -> "100"
 *   1023 -> "1.02K"
 *   100000 -> "100K"
 *   10000000 -> "10M"
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return '0';
  if (num === 0) return '0';

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum < 1000) {
    return `${sign}${absNum}`;
  }

  const suffixes = [
    { value: 1e12, suffix: 'T' },
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' },
  ];

  for (const { value, suffix } of suffixes) {
    if (absNum >= value) {
      const formatted = (absNum / value).toFixed(2);
      const cleaned = parseFloat(formatted).toString();
      return `${sign}${cleaned}${suffix}`;
    }
  }

  return `${sign}${absNum}`;
};
