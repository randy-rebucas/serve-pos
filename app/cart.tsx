import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../components/ui/SafeAreaView';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Colors, Typography, Spacing } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../lib/utils/validation';

export default function CartScreen() {
  const {
    items,
    discountCode,
    discountAmount,
    subtotal,
    total,
    isEmpty,
    changeQuantity,
    removeFromCart,
    applyDiscount,
  } = useCart();

  const [discountCodeInput, setDiscountCodeInput] = useState(discountCode || '');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Estimated tax (10% - adjust as needed)
  const estimatedTax = subtotal * 0.1;

  const handleApplyDiscount = async () => {
    if (!discountCodeInput.trim()) return;

    setIsApplyingDiscount(true);
    try {
      // TODO: Call discount validation API
      // const response = await validateDiscountCode({ code: discountCodeInput, amount: subtotal });
      // applyDiscount(discountCodeInput, response.discountAmount);
      
      // Placeholder: Apply 10% discount for demo
      applyDiscount(discountCodeInput, subtotal * 0.1);
    } catch (error) {
      console.error('Failed to apply discount:', error);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  if (isEmpty) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
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
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Cart Items */}
        {items.map((item, index) => (
          <Card key={`${item.product._id}-${index}`} style={styles.cartItemCard}>
            <View style={styles.cartItemContainer}>
              <View style={styles.cartItemImage}>
                {item.product.image ? (
                  <Image source={{ uri: item.product.image }} style={styles.productImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={32} color={Colors.textSecondary} />
                  </View>
                )}
              </View>
              <View style={styles.cartItemContent}>
                <Text style={styles.cartItemName}>{item.product.name}</Text>
                <Text style={styles.cartItemPrice}>
                  {formatCurrency(item.variation?.price || item.product.price)}
                </Text>
                {item.variation && (
                  <Text style={styles.cartItemVariation}>
                    {Object.values(item.variation)
                      .filter((v) => v && typeof v !== 'number')
                      .join(', ')}
                  </Text>
                )}
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => changeQuantity(item.product._id, item.quantity - 1, item.variation)}
                  >
                    <Ionicons name="remove" size={20} color={Colors.textPrimary} />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => changeQuantity(item.product._id, item.quantity + 1, item.variation)}
                  >
                    <Ionicons name="add" size={20} color={Colors.textPrimary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.subtotal}>
                  Subtotal: {formatCurrency((item.variation?.price || item.product.price) * item.quantity)}
                </Text>
                <TouchableOpacity onPress={() => removeFromCart(item.product._id, item.variation)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        ))}

        {/* Discount Code */}
        <View style={styles.discountSection}>
          <Text style={styles.sectionTitle}>Discount Code</Text>
          <View style={styles.discountInputRow}>
            <Input
              placeholder="Enter code"
              value={discountCodeInput}
              onChangeText={setDiscountCodeInput}
              style={styles.discountInput}
            />
            <Button
              title="Apply"
              onPress={handleApplyDiscount}
              variant="primary"
              style={styles.applyButton}
              loading={isApplyingDiscount}
            />
          </View>
        </View>

        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          {discountAmount && discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount:</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -{formatCurrency(discountAmount)}
              </Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(estimatedTax)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelTotal}>Total:</Text>
            <Text style={styles.summaryValueTotal}>{formatCurrency(total(estimatedTax))}</Text>
          </View>
        </Card>

        <Button
          title="Proceed to Checkout"
          onPress={() => router.push('/checkout')}
          variant="primary"
          style={styles.checkoutButton}
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
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 24,
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
  cartItemCard: {
    marginBottom: Spacing.md,
    marginHorizontal: 0,
  },
  cartItemContainer: {
    flexDirection: 'row',
  },
  cartItemImage: {
    width: 100,
    height: 100,
    marginRight: Spacing.md,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemContent: {
    flex: 1,
  },
  cartItemName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cartItemPrice: {
    ...Typography.body,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  cartItemVariation: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...Typography.body,
    color: Colors.textPrimary,
    minWidth: 30,
    textAlign: 'center',
  },
  subtotal: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  removeText: {
    ...Typography.body,
    color: Colors.error,
  },
  discountSection: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  discountInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  discountInput: {
    flex: 1,
    marginBottom: 0,
  },
  applyButton: {
    minWidth: 80,
  },
  summaryCard: {
    margin: 0,
    marginBottom: Spacing.lg,
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
  checkoutButton: {
    marginTop: Spacing.md,
  },
});
