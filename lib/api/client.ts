/**
 * API Client
 * HTTP client for making API requests
 * Based on MOBILE_APP_SPECS.md
 */

import { API_CONFIG, getApiHeaders, isApiUrlConfigured, getApiConfigInfo } from './config';
import { getToken } from '../storage/token';
import { ApiError, ApiErrorClass } from '../../types';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, requireAuth: boolean = true): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, requireAuth);
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: unknown, requireAuth: boolean = true): Promise<T> {
    return this.request<T>('POST', endpoint, data, requireAuth);
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: unknown, requireAuth: boolean = true): Promise<T> {
    return this.request<T>('PUT', endpoint, data, requireAuth);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, requireAuth: boolean = true): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, requireAuth);
  }

  /**
   * Make an API request
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    requireAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = { ...getApiHeaders() };

    // Add authentication token if required
    if (requireAuth) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Create abort controller with timeout (polyfill for AbortSignal.timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, API_CONFIG.TIMEOUT);

    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      clearTimeout(timeoutId); // Clear timeout if request completes
      
      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      let responseData;
      
      if (isJson) {
        try {
          responseData = await response.json();
        } catch (parseError) {
          throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } else {
        // If not JSON, try to get text to see what we got
        const text = await response.text();
        console.error('Non-JSON response received:', {
          url,
          status: response.status,
          statusText: response.statusText,
          contentType,
          preview: text.substring(0, 200),
        });
        
        throw new Error(
          `Server returned ${response.status} ${response.statusText}. Expected JSON but got ${contentType || 'unknown content type'}. ` +
          `Please check your API configuration. API URL: ${this.baseURL}`
        );
      }

      if (!response.ok) {
        throw new ApiErrorClass(
          responseData.message || `Request failed with status ${response.status}`,
          response.status,
          responseData.errors
        );
      }

      // Handle different response formats
      if (responseData.data !== undefined) {
        return responseData.data as T;
      }

      return responseData as T;
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiErrorClass('Request timeout. Please try again.', 0);
      }
      
      // Check if this is already an ApiErrorClass
      if (error instanceof ApiErrorClass) {
        throw error;
      }
      
      // Check if this is already an ApiError object (for backwards compatibility)
      if ((error as ApiError).statusCode !== undefined && !(error instanceof Error)) {
        const apiError = error as ApiError;
        throw new ApiErrorClass(apiError.message, apiError.statusCode, apiError.errors);
      }
      
      // Handle network errors - catch TypeError, NetworkError, and other fetch-related errors
      const isNetworkError = 
        error instanceof TypeError ||
        (error instanceof Error && (
          error.message.includes('fetch') ||
          error.message.includes('network') ||
          error.message.includes('Network') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('ERR_INTERNET_DISCONNECTED') ||
          error.message.includes('ERR_NETWORK_CHANGED')
        ));
      
      if (isNetworkError) {
        const isConfigured = isApiUrlConfigured();
        const configWarning = !isConfigured 
          ? `\n⚠️  WARNING: API URL is not configured! Using placeholder: ${this.baseURL}\n` 
          : '';
        
        const errorMessage = 
          `Network request failed. Unable to reach the API server.${configWarning}\n\n` +
          `Current API URL: ${this.baseURL}\n` +
          `Endpoint: ${endpoint}\n` +
          `Full URL: ${this.baseURL}${endpoint}\n\n` +
          `Possible issues:\n` +
          `- API server is not running\n` +
          `- API URL is incorrect or not configured\n` +
          `- Using 'localhost' on a physical device (use your computer's IP address instead)\n` +
          `- Network connectivity issues\n` +
          `- CORS issues (if using web browser)\n\n` +
          `To fix:\n` +
          `1. Ensure your backend API is running\n` +
          `2. Create/update .env file in project root with: EXPO_PUBLIC_API_URL=http://YOUR_IP:PORT/api\n` +
          `3. For physical devices, use your computer's IP (e.g., http://192.168.1.100:3000/api)\n` +
          `4. For localhost on emulator/simulator, use: http://localhost:3000/api or http://10.0.2.2:3000/api (Android emulator)\n` +
          `5. Restart Expo dev server after changing .env\n\n` +
          `Debug info:\n${getApiConfigInfo()}`;
        
        // Log detailed error in development
        if (__DEV__) {
          console.error('API Request Failed - Network Error:', {
            url: `${this.baseURL}${endpoint}`,
            method,
            isConfigured,
            errorType: error instanceof Error ? error.constructor.name : typeof error,
            errorMessage: error instanceof Error ? error.message : String(error),
            fullError: error,
          });
        }
        
        throw new ApiErrorClass(errorMessage, 0);
      }

      // Handle other errors
      const errorMessage = error instanceof Error 
        ? error.message 
        : typeof error === 'string' 
        ? error 
        : 'Network error occurred';
      
      if (__DEV__) {
        console.error('API Request Failed - Other Error:', {
          url: `${this.baseURL}${endpoint}`,
          method,
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          errorMessage,
          fullError: error,
        });
      }
      
      throw new ApiErrorClass(errorMessage, 0);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };
