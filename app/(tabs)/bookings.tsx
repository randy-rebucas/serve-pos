import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useBookings } from '../../hooks/useBookings';
import { Booking } from '../../types';
import { format } from 'date-fns';

const filters: (Booking['status'] | 'All')[] = ['All', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function BookingsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<Booking['status'] | 'All'>('All');
  const { bookings, isLoading, error, refetch } = useBookings(
    selectedFilter !== 'All' ? selectedFilter : undefined
  );

  const getStatusColor = (status: Booking['status']) => {
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

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
      case 'no-show':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatBookingDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const bookingDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      if (bookingDate.getTime() === today.getTime()) {
        return `Today, ${format(date, 'h:mm a')}`;
      }

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (bookingDate.getTime() === tomorrow.getTime()) {
        return `Tomorrow, ${format(date, 'h:mm a')}`;
      }

      return format(date, 'MMM d, yyyy h:mm a');
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <ErrorView message={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bookings List */}
      {isLoading ? (
        <LoadingSpinner message="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>No bookings found</Text>
          <Button
            title="Book a Service"
            onPress={() => router.push('/services')}
            variant="primary"
            style={styles.bookButton}
          />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const statusColor = getStatusColor(item.status);
            const statusIcon = getStatusIcon(item.status);

            return (
              <Card style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                  <Text style={styles.bookingDate}>{formatBookingDate(item.startTime)}</Text>
                </View>
                <Text style={styles.bookingService}>{item.serviceName}</Text>
                {item.staffName && <Text style={styles.bookingStaff}>Staff: {item.staffName}</Text>}
                <View style={styles.bookingFooter}>
                  <View style={styles.statusBadge}>
                    <Ionicons name={statusIcon as any} size={16} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push(`/bookings/${item._id}`)}>
                    <Text style={styles.viewDetailsText}>View Details →</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  filtersContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  filterTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.md,
  },
  bookingCard: {
    marginBottom: Spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bookingDate: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  bookingService: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  bookingStaff: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
  },
  viewDetailsText: {
    ...Typography.body,
    color: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    ...Typography.h4,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  bookButton: {
    marginTop: Spacing.md,
  },
});
