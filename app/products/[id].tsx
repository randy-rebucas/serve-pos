import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../lib/utils/validation';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, isLoading, error, refetch } = useProduct(id || null);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<{ size?: string } | undefined>(undefined);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading product..." fullScreen />
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={error || 'Product not found'} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  const price = selectedVariation?.size
    ? product.variations?.find((v) => v.size === selectedVariation.size)?.price || product.price
    : product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariation);
    router.push('/cart');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <View style={styles.header}>
          <Button
            title="←"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={60} color={Colors.textSecondary} />
            </View>
          )}
          {product.images && product.images.length > 1 && (
            <View style={styles.imageIndicators}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[styles.indicator, index === 0 && styles.indicatorActive]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatCurrency(price)}</Text>
          <Text style={styles.stockText}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </Text>

          {/* Description */}
          {product.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.divider} />
              <Text style={styles.description}>{product.description}</Text>
            </View>
          )}

          {/* Size Selection */}
          {product.hasVariations && product.variations && product.variations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.sizeOptions}>
                {product.variations.map((variation, index) => (
                  <Button
                    key={index}
                    title={variation.size || variation.type || 'Default'}
                    onPress={() => setSelectedVariation({ size: variation.size })}
                    variant={
                      selectedVariation?.size === variation.size ? 'primary' : 'secondary'
                    }
                    style={styles.sizeButton}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <Button
                title="-"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                variant="secondary"
                style={styles.quantityButton}
              />
              <Text style={styles.quantityText}>{quantity}</Text>
              <Button
                title="+"
                onPress={() => setQuantity(quantity + 1)}
                variant="secondary"
                style={styles.quantityButton}
              />
            </View>
          </View>

          <Button
            title={product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            onPress={handleAddToCart}
            variant="primary"
            style={styles.addToCartButton}
            disabled={product.stock === 0}
          />

          {/* Reviews Section Placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Card style={styles.reviewCard}>
              <Text style={styles.reviewPlaceholder}>[Review cards...]</Text>
            </Card>
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
    padding: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    padding: 0,
  },
  imageContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  indicatorActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  content: {
    padding: Spacing.md,
  },
  productName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  productPrice: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  stockText: {
    ...Typography.body,
    color: Colors.success,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sizeButton: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  quantityButton: {
    width: 50,
    height: 50,
    padding: 0,
  },
  quantityText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    marginBottom: Spacing.xl,
  },
  reviewCard: {
    margin: 0,
  },
  reviewPlaceholder: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    padding: Spacing.lg,
  },
});
