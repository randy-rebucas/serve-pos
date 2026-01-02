import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../../../components/ui/SafeAreaView';
import Button from '../../../components/ui/Button';
import { Colors, Typography, Spacing } from '../../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function FeaturesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={120} color={Colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>Easy Booking</Text>
          <Text style={styles.description}>
            Book your appointments in just a few taps. Choose your preferred time and staff member.
          </Text>
        </View>

        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Next"
            onPress={() => router.push('/(tabs)')}
            variant="primary"
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
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  buttonContainer: {
    width: '100%',
  },
});
