/**
 * Error View Component
 * Displays error messages to users
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/Theme';
import { getApiBaseUrl, isApiUrlConfigured } from '../../lib/api/config';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorView({ message, onRetry, retryLabel = 'Try Again' }: ErrorViewProps) {
  // Check if this is a network/API configuration error
  const isNetworkError = message.includes('Network request failed') || message.includes('Unable to reach');
  const isApiNotConfigured = !isApiUrlConfigured();
  
  // Extract a user-friendly message (first line or simplified version)
  const getDisplayMessage = () => {
    if (isNetworkError && isApiNotConfigured) {
      return 'API server not configured. Please set EXPO_PUBLIC_API_URL in your .env file.';
    }
    if (isNetworkError) {
      // Return first meaningful line
      const lines = message.split('\n').filter(line => line.trim() && !line.startsWith('Current API URL'));
      return lines[0] || 'Unable to connect to the server. Please check your connection.';
    }
    return message;
  };

  const displayMessage = getDisplayMessage();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
      <Text style={styles.message}>{displayMessage}</Text>
      
      {isNetworkError && __DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          <Text style={styles.debugText}>API URL: {getApiBaseUrl()}</Text>
          <Text style={styles.debugText}>Configured: {isApiUrlConfigured() ? 'Yes' : 'No'}</Text>
          {!isApiUrlConfigured() && (
            <Text style={styles.debugHelp}>
              Create a .env file with: EXPO_PUBLIC_API_URL=http://localhost:3000
            </Text>
          )}
        </View>
      )}
      
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  debugContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  debugTitle: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  debugText: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontFamily: 'monospace',
  },
  debugHelp: {
    ...Typography.small,
    color: Colors.primary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    ...Typography.body,
    color: Colors.surface,
    fontWeight: '600',
  },
});
