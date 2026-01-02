import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useBooking } from '../../hooks/useBookings';
import { cancelBooking } from '../../lib/api/bookings';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils/validation';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { booking, isLoading, error, refetch } = useBooking(id || null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelBooking = async () => {
    if (!booking || !id) return;

    setIsCancelling(true);
    try {
      await cancelBooking(id);
      // Refresh booking data
      await refetch();
      // TODO: Show success message
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      // TODO: Show error message
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading booking details..." fullScreen />
      </SafeAreaView>
    );
  }

  if (error || !booking) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={error || 'Booking not found'} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'cancelled':
      case 'no-show':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const start = new Date(dateString);
      const end = new Date(booking.endTime);
      return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    } catch {
      return dateString;
    }
  };

  const statusColor = getStatusColor(booking.status);
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            title="←"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <Card style={styles.statusCard}>
            <View style={styles.statusBadge}>
              <Ionicons
                name={
                  booking.status === 'confirmed' || booking.status === 'completed'
                    ? 'checkmark-circle'
                    : booking.status === 'pending'
                    ? 'time'
                    : 'close-circle'
                }
                size={20}
                color={statusColor}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Text>
            </View>
          </Card>
        </View>

        {/* Service Details */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service:</Text>
            <Text style={styles.detailValue}>{booking.serviceName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formatDate(booking.startTime)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{formatTime(booking.startTime)}</Text>
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

          {/* Your Information */}
          <Text style={styles.sectionTitle}>Your Information</Text>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{booking.customerName}</Text>
          </View>
          {booking.customerEmail && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{booking.customerEmail}</Text>
            </View>
          )}
          {booking.customerPhone && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{booking.customerPhone}</Text>
            </View>
          )}

          {/* Special Requests */}
          {booking.notes && (
            <>
              <Text style={styles.sectionTitle}>Special Requests</Text>
              <View style={styles.divider} />
              <Text style={styles.detailValue}>{booking.notes}</Text>
            </>
          )}

          {/* Action Buttons */}
          {canCancel && (
            <View style={styles.actionButtons}>
              <Button
                title="Cancel Booking"
                onPress={handleCancelBooking}
                variant="secondary"
                style={styles.actionButton}
                loading={isCancelling}
              />
              <Button
                title="Reschedule"
                onPress={() => router.push(`/booking/select-date?service=${encodeURIComponent(booking.serviceName)}`)}
                variant="primary"
                style={styles.actionButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    padding: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    padding: 0,
  },
  statusContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusCard: {
    margin: 0,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusText: {
    ...Typography.body,
    fontWeight: '600',
  },
  content: {
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
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
  actionButtons: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});
