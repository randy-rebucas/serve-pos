/**
 * API Configuration
 * Based on MOBILE_APP_SPECS.md
 */

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Get API base URL
 */
export function getApiBaseUrl(): string {
  return API_CONFIG.BASE_URL;
}

/**
 * Check if API URL is configured (not using placeholder)
 */
export function isApiUrlConfigured(): boolean {
  const url = API_CONFIG.BASE_URL;
  return url !== 'https://your-domain.com/api' && url.trim() !== '';
}

/**
 * Get API headers
 */
export function getApiHeaders(token?: string): Record<string, string> {
  const headers = { ...API_CONFIG.HEADERS };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Get API configuration info for debugging
 */
export function getApiConfigInfo(): string {
  const isConfigured = isApiUrlConfigured();
  return `
API Configuration:
- Base URL: ${API_CONFIG.BASE_URL}
- Configured: ${isConfigured ? 'Yes' : 'No (using placeholder)'}
- Timeout: ${API_CONFIG.TIMEOUT}ms

${!isConfigured ? `
⚠️  API URL not configured!

To fix:
1. Create a .env file in the project root
2. Add: EXPO_PUBLIC_API_URL=http://YOUR_IP:PORT/api
3. For local development on physical device, use your computer's IP address
   Example: EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
4. Restart Expo dev server after creating/updating .env
` : ''}
  `.trim();
}
