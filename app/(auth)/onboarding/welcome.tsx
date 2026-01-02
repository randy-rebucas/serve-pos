import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../../../components/ui/SafeAreaView';
import Button from '../../../components/ui/Button';
import { Colors, Typography, Spacing } from '../../../constants/Theme';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {/* Placeholder for business logo/illustration */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>[Logo]</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to [Business]</Text>
          <Text style={styles.subtitle}>
            Book services, order products, and manage your appointments easily
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={() => router.push('/(auth)/onboarding/features')}
            variant="primary"
          />
          <Button
            title="Skip"
            onPress={() => router.push('/(tabs)')}
            variant="secondary"
            style={styles.skipButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.border,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  skipButton: {
    marginTop: Spacing.sm,
  },
});
