import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useOrder } from '../../hooks/useOrders';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils/validation';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { order, isLoading, error, refetch } = useOrder(id || null);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading order details..." fullScreen />
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={error || 'Order not found'} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const formatOrderDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
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

  const statusColor = getStatusColor(order.status);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button
            title="←"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.orderNumber}>Order #{order.receiptNumber}</Text>
          <Text style={styles.orderDate}>Placed on {formatOrderDate(order.createdAt)}</Text>
          <View style={styles.statusBadge}>
            <Ionicons
              name={
                order.status === 'completed'
                  ? 'checkmark-circle'
                  : order.status === 'pending'
                  ? 'time'
                  : 'close-circle'
              }
              size={20}
              color={statusColor}
            />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.divider} />
          {order.items.map((item, index) => (
            <Card key={index} style={styles.itemCard}>
              <View style={styles.itemContainer}>
                <View style={styles.itemImage}>
                  <Ionicons name="cube-outline" size={40} color={Colors.textSecondary} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>
                    Qty: {item.quantity} • {formatCurrency(item.subtotal)}
                  </Text>
                </View>
              </View>
            </Card>
          ))}

          {/* Delivery Information */}
          {order.deliveryAddress && (
            <>
              <Text style={styles.sectionTitle}>Delivery Information</Text>
              <View style={styles.divider} />
              <Text style={styles.detailText}>
                {order.deliveryAddress.street || ''}
                {order.deliveryAddress.city && `, ${order.deliveryAddress.city}`}
                {order.deliveryAddress.state && `, ${order.deliveryAddress.state}`}
                {order.deliveryAddress.zipCode && ` ${order.deliveryAddress.zipCode}`}
              </Text>
            </>
          )}

          {/* Payment */}
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.divider} />
          <Text style={styles.detailText}>Method: {order.paymentMethod}</Text>

          {/* Order Summary */}
          <Card style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>{formatCurrency(order.subtotal)}</Text>
            </View>
            {order.discountAmount && order.discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount:</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -{formatCurrency(order.discountAmount)}
                </Text>
              </View>
            )}
            {order.tax && order.tax > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.tax)}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelTotal}>Total:</Text>
              <Text style={styles.summaryValueTotal}>{formatCurrency(order.total)}</Text>
            </View>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Download Receipt"
              onPress={() => {
                // TODO: Implement receipt download
                console.log('Download receipt');
              }}
              variant="secondary"
              style={styles.actionButton}
            />
            <Button
              title="Reorder"
              onPress={() => router.push('/(tabs)/products')}
              variant="primary"
              style={styles.actionButton}
            />
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    padding: 0,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: Spacing.md,
  },
  orderNumber: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statusText: {
    ...Typography.body,
    fontWeight: '600',
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
  itemCard: {
    marginBottom: Spacing.md,
    marginHorizontal: 0,
  },
  itemContainer: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 80,
    height: 80,
    backgroundColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  itemQty: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  detailText: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  summaryCard: {
    margin: 0,
    marginTop: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryLabelTotal: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  discountValue: {
    color: Colors.success,
  },
  summaryValueTotal: {
    ...Typography.h3,
    color: Colors.primary,
  },
  actionButtons: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    width: '100%',
  },
});
