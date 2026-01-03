/**
 * API Configuration
 * Based on MOBILE_APP_SPECS.md
 */

import Constants from 'expo-constants';

/**
 * Get environment variable value
 * Works in both development (process.env) and production (Constants.expoConfig.extra)
 */
function getEnvVar(key: string, fallback: string = ''): string {
  // In development, use process.env
  if (__DEV__ && process.env[key]) {
    return process.env[key] || fallback;
  }
  
  // In production builds, use Constants.expoConfig.extra
  // EAS will inject these values during build
  const extra = Constants.expoConfig?.extra;
  if (extra) {
    // Map EXPO_PUBLIC_* to camelCase keys in extra
    const camelKey = key.replace('EXPO_PUBLIC_', '').toLowerCase()
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Try camelCase first (apiUrl, tenantSlug)
    if (extra[camelKey]) {
      return extra[camelKey] as string;
    }
    
    // Fallback to original key
    if (extra[key]) {
      return extra[key] as string;
    }
  }
  
  return fallback;
}

export const API_CONFIG = {
  BASE_URL: getEnvVar('EXPO_PUBLIC_API_URL', 'http://localhost:3000'),
  TENANT_SLUG: getEnvVar('EXPO_PUBLIC_TENANT_SLUG', 'default'),
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
 * Get tenant slug
 */
export function getTenantSlug(): string {
  return API_CONFIG.TENANT_SLUG;
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
