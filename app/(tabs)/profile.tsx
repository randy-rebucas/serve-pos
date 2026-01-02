import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { icon: 'person-outline', title: 'Personal Information', route: '/profile/edit' },
  { icon: 'calendar-outline', title: 'My Bookings', route: '/(tabs)/bookings' },
  { icon: 'bag-outline', title: 'My Orders', route: '/(tabs)/orders' },
  { icon: 'location-outline', title: 'Saved Addresses', route: '/profile/addresses' },
  { icon: 'card-outline', title: 'Payment Methods', route: '/profile/payment' },
  { icon: 'notifications-outline', title: 'Notifications', route: '/profile/notifications' },
  { icon: 'settings-outline', title: 'Settings', route: '/profile/settings' },
  { icon: 'help-circle-outline', title: 'Help & Support', route: '/profile/help' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => router.push('/profile/settings')}>
            <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={60} color={Colors.textSecondary} />
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@example.com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Card key={index} style={styles.menuItem}>
              <TouchableOpacity
                style={styles.menuItemContent}
                onPress={() => router.push(item.route as any)}
              >
                <Ionicons name={item.icon as any} size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Card style={styles.logoutCard}>
            <TouchableOpacity style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color={Colors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Card>
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userName: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  menuSection: {
    padding: Spacing.md,
  },
  menuItem: {
    marginBottom: Spacing.sm,
    marginHorizontal: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuItemText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  logoutSection: {
    padding: Spacing.md,
  },
  logoutCard: {
    margin: 0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoutText: {
    ...Typography.body,
    color: Colors.error,
    fontWeight: '600',
  },
});
