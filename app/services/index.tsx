import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const categories = ['All', 'Hair', 'Nails', 'Massage', 'Facial'];
const services = [
  {
    id: '1',
    name: 'Haircut & Styling',
    price: '$25.00',
    duration: '30 minutes',
    description: 'Professional haircut and styling service...',
    category: 'Hair',
  },
  {
    id: '2',
    name: 'Manicure',
    price: '$35.00',
    duration: '45 minutes',
    description: 'Full nail care service...',
    category: 'Nails',
  },
  {
    id: '3',
    name: 'Facial Treatment',
    price: '$60.00',
    duration: '60 minutes',
    description: 'Relaxing facial...',
    category: 'Facial',
  },
];

export default function ServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.serviceCard}>
            <View style={styles.serviceImagePlaceholder}>
              <Text style={styles.placeholderText}>[Service Image]</Text>
            </View>
            <Text style={styles.serviceName}>{item.name}</Text>
            <Text style={styles.servicePrice}>{item.price}</Text>
            <View style={styles.serviceMeta}>
              <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.serviceDuration}>{item.duration}</Text>
            </View>
            <Text style={styles.serviceDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <Button
              title="Book Now"
              onPress={() => router.push(`/services/${item.id}`)}
              variant="primary"
              style={styles.bookButton}
            />
          </Card>
        )}
      />
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
  categoriesContainer: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  categoryTextActive: {
    color: Colors.surface,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.md,
  },
  serviceCard: {
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
  servicePrice: {
    ...Typography.h4,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  serviceDuration: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  serviceDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  bookButton: {
    marginTop: Spacing.xs,
  },
});
