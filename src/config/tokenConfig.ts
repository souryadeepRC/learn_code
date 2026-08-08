export const TOKEN_CONFIG = {
  // Access Token
  ACCESS_TOKEN_EXPIRY_SECONDS: 1 * 60, // 1 minute (for testing, usually 15 * 60)
  ACCESS_TOKEN_EXPIRY_JWT: '1m', // String equivalent for jsonwebtoken
  
  // Refresh Token
  REFRESH_TOKEN_EXPIRY_SECONDS: 7 * 24 * 60 * 60, // 7 days
  REFRESH_TOKEN_EXPIRY_JWT: '7d', // String equivalent for jsonwebtoken

  // Proactive Refresh Threshold (milliseconds)
  PROACTIVE_REFRESH_THRESHOLD_MS: 40000, // Refresh if < 40 seconds left
};
