/**
 * Authentication Store (Zustand)
 * Based on MOBILE_APP_SPECS.md
 */

import { create } from 'zustand';
import { getToken, getUserData, removeToken, saveToken, saveUserData } from '../lib/storage/token';
import { Customer } from '../types';

interface AuthState {
  user: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  setUser: (user: Customer) => void;
  setToken: (token: string) => Promise<void>;
  setGuestMode: () => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,

  setUser: (user: Customer) => {
    set({ user, isAuthenticated: true, isGuest: false });
    // Save user data to secure storage
    saveUserData(JSON.stringify(user)).catch(console.error);
  },

  setToken: async (token: string) => {
    await saveToken(token);
    set({ token });
  },

  setGuestMode: () => {
    set({ isGuest: true, isAuthenticated: false, user: null, token: null });
  },

  logout: async () => {
    await removeToken();
    set({ user: null, token: null, isAuthenticated: false, isGuest: false });
  },

  initialize: async () => {
    try {
      const [storedToken, storedUserData] = await Promise.all([
        getToken(),
        getUserData(),
      ]);

      if (storedToken && storedUserData) {
        try {
          const user = JSON.parse(storedUserData) as Customer;
          set({
            user,
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isLoading: false });
    }
  },
}));
