/**
 * Authentication Hook
 * Convenience hook for authentication operations
 * Updated for OTP-based authentication
 */

import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  logout as apiLogout,
  register as apiRegister,
  EmailPasswordLoginRequest,
  EmailPasswordRegisterRequest,
  LoginRequest,
  loginWithEmailPassword,
  RegisterRequest,
  registerWithEmailPassword,
  sendCustomerOtp,
  SendOtpRequest,
  verifyCustomerOtp,
  VerifyOtpRequest,
  verifyRegisterOtp,
} from '../lib/api/auth';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isGuest, isLoading, setUser, setToken, setGuestMode, logout: storeLogout, initialize } = useAuthStore();
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
      
      const response = await sendCustomerOtp(data);
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
      
      const response = await verifyCustomerOtp(data);
      
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
  const sendRegisterOtpCode = async (data: SendOtpRequest) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await sendCustomerOtp(data);
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

  /**
   * Login with email and password
   */
  const loginWithEmail = async (data: EmailPasswordLoginRequest) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await loginWithEmailPassword(data);
      
      await setToken(response.token);
      setUser(response.user);
      
      // Navigate to home
      router.replace('/(tabs)');
      
      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  /**
   * Register with email and password
   */
  const registerWithEmail = async (data: EmailPasswordRegisterRequest) => {
    try {
      setIsLoadingAuth(true);
      setError(null);
      
      const response = await registerWithEmailPassword(data);
      
      await setToken(response.token);
      setUser(response.user);
      
      // Navigate to home
      router.replace('/(tabs)');
      
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
   * Enter guest mode
   */
  const enterGuestMode = () => {
    setGuestMode();
    router.replace('/(tabs)');
  };

  const logout = async () => {
    try {
      setIsLoadingAuth(true);
      // Only call API logout if authenticated (not guest)
      if (isAuthenticated && token) {
        await apiLogout();
      }
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
    isGuest,
    isLoading: isLoading || isLoadingAuth,
    otpSent,
    sendLoginOtp: sendLoginOtpCode,
    verifyLoginOtp: verifyLoginOtpCode,
    sendRegisterOtp: sendRegisterOtpCode,
    register,
    verifyRegisterOtp: verifyRegisterOtpCode,
    loginWithEmail,
    registerWithEmail,
    enterGuestMode,
    logout,
    initialize,
    error,
    clearError: () => setError(null),
    resetOtpSent: () => setOtpSent(false),
  };
}
