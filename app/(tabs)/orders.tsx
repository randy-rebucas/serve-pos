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
import { useOrders } from '../../hooks/useOrders';
import { Order } from '../../types';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils/validation';

const filters: (Order['status'] | 'All')[] = ['All', 'pending', 'completed', 'cancelled', 'refunded'];

export default function OrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState<Order['status'] | 'All'>('All');
  const { orders, isLoading, error, refetch } = useOrders();

  const filteredOrders = selectedFilter === 'All'
    ? orders
    : orders.filter(order => order.status === selectedFilter);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.warning;
      case 'cancelled':
      case 'refunded':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
      case 'refunded':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatOrderDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const getItemCount = (order: Order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
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
        <Text style={styles.headerTitle}>My Orders</Text>
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

      {/* Orders List */}
      {isLoading ? (
        <LoadingSpinner message="Loading orders..." />
      ) : filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={80} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>No orders found</Text>
          <Button
            title="Browse Products"
            onPress={() => router.push('/(tabs)/products')}
            variant="primary"
            style={styles.browseButton}
          />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const statusColor = getStatusColor(item.status);
            const statusIcon = getStatusIcon(item.status);
            const itemCount = getItemCount(item);

            return (
              <Card style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Ionicons name="bag-outline" size={20} color={Colors.primary} />
                  <Text style={styles.orderNumber}>Order #{item.receiptNumber}</Text>
                </View>
                <Text style={styles.orderDate}>{formatOrderDate(item.createdAt)}</Text>
                <Text style={styles.orderItems}>
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} • {formatCurrency(item.total)}
                </Text>
                <View style={styles.orderFooter}>
                  <View style={styles.statusBadge}>
                    <Ionicons name={statusIcon as any} size={16} color={statusColor} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push(`/orders/${item._id}`)}>
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
  orderCard: {
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  orderNumber: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  orderDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  orderItems: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  orderFooter: {
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
  browseButton: {
    marginTop: Spacing.md,
  },
});
