/**
 * Generate a v4-like UUID string.
 * Uses crypto.getRandomValues if available, falls back to Math.random for mobile browsers.
 */
export function generateUUID(): string {
  // Check if crypto.getRandomValues is available (modern browsers)
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    const arr = new Uint8Array(16);
    globalThis.crypto.getRandomValues(arr);

    // Set version (4) and variant bits
    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;

    // Convert to hex string
    return Array.from(arr, (byte) => byte.toString(16).padStart(2, '0'))
      .splice(6, 0, '-')
      .splice(9, 0, '-')
      .splice(12, 0, '-')
      .splice(15, 0, '-')
      .join('');
  }

  // Fallback for older/mobile browsers: simple random UUID-like string
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
