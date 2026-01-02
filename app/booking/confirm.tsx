import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { createBooking } from '../../lib/api/bookings';
import { useAuthStore } from '../../stores/authStore';
import { format } from 'date-fns';
import { formatCurrency } from '../../lib/utils/validation';

interface ConfirmBookingParams {
  serviceName: string;
  duration: string;
  startTime: string;
  staffId?: string;
  staffName?: string;
  price?: string;
}

export default function ConfirmBookingScreen() {
  const params = useLocalSearchParams<ConfirmBookingParams>();
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState(
    user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const serviceName = params.serviceName || 'Service';
  const duration = parseInt(params.duration || '30', 10);
  const startTime = params.startTime;
  const staffId = params.staffId;
  const staffName = params.staffName;
  const price = parseFloat(params.price || '0');

  const formatBookingDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatBookingTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'h:mm a');
    } catch {
      return dateString;
    }
  };

  const handleConfirmBooking = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the Terms & Conditions');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const booking = await createBooking({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        serviceName,
        startTime,
        duration,
        staffId: staffId || undefined,
        notes: specialRequests.trim() || undefined,
      });

      // Navigate to confirmation screen with booking ID
      router.replace({
        pathname: '/booking/confirmation',
        params: { bookingId: booking._id },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
      console.error('Booking creation error:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            title="←"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backButton}
          />
          <Text style={styles.headerTitle}>Confirm Booking</Text>
          <View style={styles.headerSpacer} />
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Booking Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{serviceName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{formatBookingDate(startTime)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{formatBookingTime(startTime)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{duration} minutes</Text>
            </View>
            {staffName && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Staff:</Text>
                <Text style={styles.summaryValue}>{staffName}</Text>
              </View>
            )}
            {price > 0 && (
              <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                <Text style={styles.summaryLabel}>Price:</Text>
                <Text style={styles.summaryValueTotal}>{formatCurrency(price)}</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Your Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Information</Text>
          <Input
            label="Full Name *"
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
          />
          <Input
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Phone *"
            value={phone}
            onChangeText={setPhone}
            placeholder="(555) 123-4567"
            keyboardType="phone-pad"
          />
        </View>

        {/* Special Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
          <View style={styles.textAreaContainer}>
            <Input
              value={specialRequests}
              onChangeText={setSpecialRequests}
              placeholder="Enter any special requests..."
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>
        </View>

        {/* Terms Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
              {agreeToTerms && <Ionicons name="checkmark" size={16} color={Colors.surface} />}
            </View>
            <Text style={styles.checkboxLabel}>I agree to the Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          variant="primary"
          style={styles.confirmButton}
          loading={isCreating}
          disabled={isCreating}
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
  errorContainer: {
    backgroundColor: Colors.error + '20',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    margin: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryRowTotal: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  summaryValueTotal: {
    ...Typography.h4,
    color: Colors.primary,
  },
  textAreaContainer: {
    marginTop: Spacing.sm,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    marginBottom: Spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 4,
    marginRight: Spacing.sm,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  confirmButton: {
    marginTop: Spacing.md,
  },
});
