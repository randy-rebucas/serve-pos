/**
 * Design System Theme
 * Based on MOBILE_APP_LAYOUTS.md specifications
 */

export const Colors = {
  primary: '#007AFF', // iOS Blue
  secondary: '#5856D6', // Purple
  success: '#34C759', // Green
  warning: '#FF9500', // Orange
  error: '#FF3B30', // Red
  background: '#F2F2F7', // Light Gray
  surface: '#FFFFFF', // White
  textPrimary: '#000000', // Black
  textSecondary: '#8E8E93', // Gray
  border: '#C6C6C8', // Light Gray
} as const;

export const Typography = {
  h1: {
    fontSize: 34,
    fontWeight: '700' as const, // Bold
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const, // Bold
    lineHeight: 34,
  },
  h3: {
    fontSize: 22,
    fontWeight: '700' as const, // Bold
    lineHeight: 28,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const, // SemiBold
    lineHeight: 24,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const, // Regular
    lineHeight: 22,
  },
  caption: {
    fontSize: 15,
    fontWeight: '400' as const, // Regular
    lineHeight: 20,
  },
  small: {
    fontSize: 13,
    fontWeight: '400' as const, // Regular
    lineHeight: 18,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const Shadows = {
  elevation1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  elevation2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  elevation3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;
