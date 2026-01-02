import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SafeAreaView from '../../components/ui/SafeAreaView';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Colors, Spacing, Typography } from '../../constants/Theme';
import { useBookings } from '../../hooks/useBookings';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils/validation';

export default function HomeScreen() {
  const { user } = useAuthStore();
  
  // Fetch upcoming bookings (pending/confirmed)
  const { bookings: upcomingBookings, isLoading: bookingsLoading } = useBookings('confirmed');
  
  // Fetch recent orders
  const { orders: recentOrders, isLoading: ordersLoading } = useOrders();
  
  // Fetch featured products (limit to 3)
  const { products: featuredProducts, isLoading: productsLoading } = useProducts({ isActive: true });

  const isLoading = bookingsLoading || ordersLoading || productsLoading;
  
  // Get next upcoming booking
  const nextBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : null;
  
  // Get most recent order
  const recentOrder = recentOrders.length > 0 ? recentOrders[0] : null;
  
  // Get first featured product (or first product if no featured)
  const featuredProduct = featuredProducts.length > 0 ? featuredProducts[0] : null;

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

      return format(date, 'MMM d, h:mm a');
    } catch {
      return dateString;
    }
  };

  const formatOrderDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message="Loading dashboard..." fullScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>[Logo]</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
              <Ionicons name="person-outline" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Info - Placeholder (would come from API in future) */}
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>[Business Name]</Text>
          <View style={styles.businessDetail}>
            <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.businessDetailText}>123 Main St, City</Text>
          </View>
          <View style={styles.businessDetail}>
            <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.businessDetailText}>(555) 123-4567</Text>
          </View>
          <View style={styles.businessDetail}>
            <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.businessDetailText}>Open: 9:00 AM - 6:00 PM</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search services...</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/services')}
            >
              <Ionicons name="calendar-outline" size={32} color={Colors.primary} />
              <Text style={styles.quickActionText}>Book</Text>
              <Text style={styles.quickActionSubtext}>Service</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/products')}
            >
              <Ionicons name="bag-outline" size={32} color={Colors.primary} />
              <Text style={styles.quickActionText}>Shop</Text>
              <Text style={styles.quickActionSubtext}>Products</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Product */}
        {featuredProduct && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Product</Text>
            <Card style={styles.serviceCard}>
              {featuredProduct.image ? (
                <Image source={{ uri: featuredProduct.image }} style={styles.serviceImage} />
              ) : (
                <View style={styles.serviceImagePlaceholder}>
                  <Ionicons name="cube-outline" size={60} color={Colors.textSecondary} />
                </View>
              )}
              <Text style={styles.serviceName}>{featuredProduct.name}</Text>
              <View style={styles.serviceMeta}>
                <Text style={styles.servicePrice}>{formatCurrency(featuredProduct.price)}</Text>
                <View style={styles.serviceDuration}>
                  <Text style={styles.serviceDurationText}>
                    {featuredProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              </View>
              <Button
                title="View Product"
                onPress={() => router.push(`/products/${featuredProduct._id}`)}
                variant="primary"
                style={styles.bookButton}
              />
            </Card>
          </View>
        )}

        {/* Upcoming Bookings */}
        {nextBooking && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Upcoming Bookings</Text>
            <Card style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                <Text style={styles.bookingDate}>{formatBookingDate(nextBooking.startTime)}</Text>
              </View>
              <Text style={styles.bookingService}>{nextBooking.serviceName}</Text>
              {nextBooking.staffName && (
                <Text style={styles.bookingStaff}>Staff: {nextBooking.staffName}</Text>
              )}
              <View style={styles.bookingFooter}>
                <View style={styles.statusBadge}>
                  <Ionicons
                    name={nextBooking.status === 'confirmed' ? 'checkmark-circle' : 'time'}
                    size={16}
                    color={nextBooking.status === 'confirmed' ? Colors.success : Colors.warning}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          nextBooking.status === 'confirmed' ? Colors.success : Colors.warning,
                      },
                    ]}
                  >
                    {nextBooking.status.charAt(0).toUpperCase() + nextBooking.status.slice(1)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/bookings/${nextBooking._id}`)}>
                  <Text style={styles.viewDetailsText}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Recent Orders */}
        {recentOrder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Ionicons name="bag-outline" size={20} color={Colors.primary} />
                <Text style={styles.orderNumber}>Order #{recentOrder.receiptNumber}</Text>
              </View>
              <Text style={styles.orderTotal}>{formatCurrency(recentOrder.total)}</Text>
              <Text style={styles.orderDate}>{formatOrderDate(recentOrder.createdAt)}</Text>
              <View style={styles.orderFooter}>
                <View style={styles.statusBadge}>
                  <Ionicons
                    name={recentOrder.status === 'completed' ? 'checkmark-circle' : 'time'}
                    size={16}
                    color={recentOrder.status === 'completed' ? Colors.success : Colors.warning}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          recentOrder.status === 'completed' ? Colors.success : Colors.warning,
                      },
                    ]}
                  >
                    {recentOrder.status.charAt(0).toUpperCase() + recentOrder.status.slice(1)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push(`/orders/${recentOrder._id}`)}>
                  <Text style={styles.viewDetailsText}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}

        {/* Empty States */}
        {!nextBooking && !recentOrder && !featuredProduct && (
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={80} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Welcome!</Text>
            <Text style={styles.emptySubtext}>Get started by booking a service or browsing products</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logoPlaceholder: {
    width: 80,
    height: 30,
    backgroundColor: Colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...Typography.small,
    color: Colors.textSecondary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  businessInfo: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
  },
  businessName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  businessDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  businessDetailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: Spacing.md,
    margin: Spacing.md,
    marginTop: 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionText: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  quickActionSubtext: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  serviceCard: {
    margin: 0,
  },
  serviceImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  serviceImagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  serviceName: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  servicePrice: {
    ...Typography.h4,
    color: Colors.primary,
  },
  serviceDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  serviceDurationText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  bookButton: {
    marginTop: Spacing.sm,
  },
  bookingCard: {
    margin: 0,
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
  orderCard: {
    margin: 0,
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
  orderTotal: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.xl,
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
