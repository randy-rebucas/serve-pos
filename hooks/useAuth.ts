/**
 * Authentication Hook
 * Convenience hook for authentication operations
 * Updated for OTP-based authentication
 */

import { useAuthStore } from '../stores/authStore';
import {
  sendLoginOtp,
  sendRegisterOtp,
  verifyLoginOtp,
  verifyRegisterOtp,
  register as apiRegister,
  logout as apiLogout,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
} from '../lib/api/auth';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, setUser, setToken, logout: storeLogout, initialize } = useAuthStore();
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  /**
   * Send OTP for login
   */
  const sendLoginOtpCode = async (data: LoginRequest) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await sendLoginOtp(data);
      setOtpSent(true);
      
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /**
   * Verify OTP and complete login
   */
  const verifyLoginOtpCode = async (data: VerifyOtpRequest) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await verifyLoginOtp(data);
      
      await setToken(response.token);
      setUser(response.user);
      setOtpSent(false);
      
      // Navigate to home
      router.replace('/(tabs)');
      
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /**
   * Send OTP for registration
   */
  const sendRegisterOtpCode = async (data: { phone: string; tenantSlug: string }) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await sendRegisterOtp(data);
      setOtpSent(true);
      
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /**
   * Register new user (sends OTP)
   */
  const register = async (data: RegisterRequest) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await apiRegister(data);
      
      // If registration requires OTP verification, we'll handle it in the UI
      if (response.requiresOtpVerification) {
        setOtpSent(true);
      }
      
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /**
   * Verify OTP and complete registration
   */
  const verifyRegisterOtpCode = async (data: VerifyOtpRequest & { firstName?: string; lastName?: string; email?: string }) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await verifyRegisterOtp(data);
      
      await setToken(response.token);
      setUser(response.user);
      setOtpSent(false);
      
      // Navigate to home
      router.replace('/(tabs)');
      
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid OTP. Please try again.';
      setError(message);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoadingAuth(true);
      await apiLogout();
    } catch (err) {
      console.error('Logout API error:', err);
      // Continue with local logout even if API fails
    } finally {
      await storeLogout();
      setOtpSent(false);
      setIsLoadingAuth(false);
      router.replace('/(auth)/login');
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isLoadingAuth,
    otpSent,
    sendLoginOtp: sendLoginOtpCode,
    verifyLoginOtp: verifyLoginOtpCode,
    sendRegisterOtp: sendRegisterOtpCode,
    register,
    verifyRegisterOtp: verifyRegisterOtpCode,
    logout,
    initialize,
    error,
    clearError: () => setError(null),
    resetOtpSent: () => setOtpSent(false),
  };
}
