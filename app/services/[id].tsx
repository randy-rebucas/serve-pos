import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceDetailsScreen() {
  useLocalSearchParams();

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

        {/* Service Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>[Service Image]</Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.content}>
          <Text style={styles.serviceName}>Haircut & Styling</Text>
          <Text style={styles.servicePrice}>$25.00</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.metaText}>Duration: 30 minutes</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.metaText}>Available at all locations</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>
              Professional haircut and styling service. Includes wash, cut, and style.
            </Text>
          </View>

          {/* What&apos;s Included: */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What&apos;s Included:</Text>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Hair wash</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Professional cut</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>Styling</Text>
            </View>
          </View>

          <Button
            title="Book This Service"
            onPress={() => router.push('/booking/select-date')}
            variant="primary"
            style={styles.bookButton}
          />

          {/* Reviews */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Reviews (4.5 <Ionicons name="star" size={16} color={Colors.warning} />)
            </Text>
            <Card style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>John D.</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star" size={16} color={Colors.warning} />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>Great service! Very professional.</Text>
            </Card>
            <Card style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>Sarah M.</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4].map((i) => (
                    <Ionicons key={i} name="star" size={16} color={Colors.warning} />
                  ))}
                  <Ionicons name="star-outline" size={16} color={Colors.warning} />
                </View>
              </View>
              <Text style={styles.reviewText}>Loved it!</Text>
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
    width: '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.border,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  content: {
    padding: Spacing.md,
  },
  serviceName: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  servicePrice: {
    ...Typography.h3,
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  metaRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    ...Typography.body,
    color: Colors.textSecondary,
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
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  bullet: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  listText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  bookButton: {
    marginBottom: Spacing.xl,
  },
  reviewCard: {
    marginBottom: Spacing.md,
    marginHorizontal: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reviewAuthor: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
});
