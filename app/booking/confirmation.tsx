import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { getBookingById } from '../../lib/api/bookings';
import { Booking } from '../../types';
import { format } from 'date-fns';
import { scheduleBookingConfirmation, scheduleBookingReminder } from '../../lib/utils/notifications';

export default function BookingConfirmationScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    } else {
      setError('No booking ID provided');
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (booking) {
      // Schedule notifications when booking is loaded
      scheduleNotifications();
    }
  }, [booking]);

  const loadBooking = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const bookingData = await getBookingById(bookingId!);
      setBooking(bookingData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load booking details';
      setError(message);
      console.error('Error loading booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleNotifications = async () => {
    if (!booking) return;

    try {
      const bookingDate = new Date(booking.startTime);

      // Schedule immediate confirmation notification
      await scheduleBookingConfirmation(bookingDate, booking.serviceName);

      // Schedule reminder 24 hours before booking
      await scheduleBookingReminder(bookingDate, booking.serviceName, 24);
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      // Don't show error to user, notifications are optional
    }
  };

  const formatBookingDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatBookingTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.errorIcon}>
              <Ionicons name="close-circle" size={60} color={Colors.error} />
            </View>
          </View>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.subtitle}>{error || 'Booking not found'}</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Back to Home"
              onPress={() => router.push('/(tabs)')}
              variant="primary"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={60} color={Colors.success} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your appointment has been successfully booked.
        </Text>

        {/* Booking Details */}
        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service:</Text>
            <Text style={styles.detailValue}>{booking.serviceName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatBookingDate(booking.startTime)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{formatBookingTime(booking.startTime)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{booking.duration} minutes</Text>
          </View>
          {booking.staffName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Staff:</Text>
              <Text style={styles.detailValue}>{booking.staffName}</Text>
            </View>
          )}
        </Card>

        {/* Email Notice */}
        <Text style={styles.emailNotice}>
          You will receive a confirmation email and reminder notification shortly.
        </Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="View My Bookings"
            onPress={() => router.push('/(tabs)/bookings')}
            variant="primary"
            style={styles.button}
          />
          <Button
            title="Back to Home"
            onPress={() => router.push('/(tabs)')}
            variant="secondary"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  detailsCard: {
    width: '100%',
    margin: 0,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  detailValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  emailNotice: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  button: {
    marginBottom: 0,
  },
});
