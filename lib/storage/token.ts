/**
 * Token Management
 * Secure storage for authentication tokens
 * Based on MOBILE_APP_SPECS.md
 */

import * as SecureStore from 'expo-secure-store';

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';
export const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Save authentication token to secure storage
 */
export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
}

/**
 * Get authentication token from secure storage
 */
export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

/**
 * Remove authentication token from secure storage
 */
export async function removeToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
}

/**
 * Save user data to secure storage
 */
export async function saveUserData(userData: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_KEY, userData);
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

/**
 * Get user data from secure storage
 */
export async function getUserData(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(USER_KEY);
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

/**
 * Save refresh token to secure storage
 */
export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
}

/**
 * Get refresh token from secure storage
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
}
