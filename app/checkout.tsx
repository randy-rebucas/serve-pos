import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../components/ui/SafeAreaView';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Colors, Typography, Spacing } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../hooks/useCart';
import { useAuthStore } from '../stores/authStore';
import { createOrder } from '../lib/api/orders';
import { formatCurrency } from '../lib/utils/validation';

export default function CheckoutScreen() {
  const {
    items,
    discountCode,
    discountAmount,
    subtotal,
    total,
    isEmpty,
  } = useCart();
  const { user } = useAuthStore();
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Estimated tax (10% - adjust as needed)
  const estimatedTax = subtotal * 0.1;
  const deliveryFee = deliveryMethod === 'delivery' ? 5.0 : 0;
  const finalTotal = total(estimatedTax) + deliveryFee;

  const handlePlaceOrder = async () => {
    if (isEmpty) return;

    setIsPlacingOrder(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        price: item.variation?.price || item.product.price,
        quantity: item.quantity,
        subtotal: (item.variation?.price || item.product.price) * item.quantity,
      }));

      const orderData = {
        items: orderItems,
        subtotal,
        discountCode,
        discountAmount,
        tax: estimatedTax,
        total: finalTotal,
        paymentMethod,
        customerEmail: user?.email,
        customerPhone: user?.phone,
        deliveryAddress: deliveryMethod === 'delivery' ? user?.addresses?.[0] : undefined,
      };

      const order = await createOrder(orderData);
      router.push(`/orders/${order._id}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      // TODO: Show error message to user
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button
            title="←"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button
            title="Browse Products"
            onPress={() => router.push('/(tabs)/products')}
            variant="primary"
            style={styles.browseButton}
          />
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <Card style={styles.methodCard}>
            <TouchableOpacity
              style={styles.methodOption}
              onPress={() => setDeliveryMethod('pickup')}
            >
              <View style={[styles.radio, deliveryMethod === 'pickup' && styles.radioChecked]}>
                {deliveryMethod === 'pickup' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.methodText}>Pickup in Store</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.methodOption}
              onPress={() => setDeliveryMethod('delivery')}
            >
              <View style={[styles.radio, deliveryMethod === 'delivery' && styles.radioChecked]}>
                {deliveryMethod === 'delivery' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.methodText}>Delivery</Text>
            </TouchableOpacity>
          </Card>

          {deliveryMethod === 'delivery' && user?.addresses && user.addresses.length > 0 && (
            <Card style={styles.addressCard}>
              <Text style={styles.addressLabel}>Address</Text>
              <Text style={styles.addressText}>
                {user.addresses[0].street || ''}
                {user.addresses[0].city && `, ${user.addresses[0].city}`}
                {user.addresses[0].state && `, ${user.addresses[0].state}`}
                {user.addresses[0].zipCode && ` ${user.addresses[0].zipCode}`}
              </Text>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Card style={styles.methodCard}>
            {(['cash', 'card', 'online'] as const).map((method) => (
              <TouchableOpacity
                key={method}
                style={styles.methodOption}
                onPress={() => setPaymentMethod(method)}
              >
                <View style={[styles.radio, paymentMethod === method && styles.radioChecked]}>
                  {paymentMethod === method && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.methodText}>
                  {method === 'cash'
                    ? 'Cash on Delivery'
                    : method === 'card'
                    ? 'Credit Card'
                    : 'PayPal'}
                </Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({items.length})</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          {discountAmount && discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{formatCurrency(discountAmount)}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>{formatCurrency(estimatedTax)}</Text>
          </View>
          {deliveryFee > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>{formatCurrency(deliveryFee)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelTotal}>Total</Text>
            <Text style={styles.summaryValueTotal}>{formatCurrency(finalTotal)}</Text>
          </View>
        </Card>

        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          variant="primary"
          style={styles.placeOrderButton}
          loading={isPlacingOrder}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
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
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  methodCard: {
    margin: 0,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioChecked: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  methodText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  addressCard: {
    margin: 0,
    marginTop: Spacing.md,
  },
  addressLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  addressText: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  changeText: {
    ...Typography.body,
    color: Colors.primary,
    marginTop: Spacing.sm,
  },
  summaryCard: {
    margin: 0,
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
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  placeOrderButton: {
    marginTop: Spacing.md,
  },
});
