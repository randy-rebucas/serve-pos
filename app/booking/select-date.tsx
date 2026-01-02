import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import SafeAreaView from '../../components/ui/SafeAreaView';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorView from '../../components/ui/ErrorView';
import { Colors, Typography, Spacing } from '../../constants/Theme';
import { useTimeSlots } from '../../hooks/useBookings';
import { format, addDays, isToday, isTomorrow } from 'date-fns';

interface SelectDateScreenParams {
  serviceName?: string;
  serviceId?: string;
  duration?: string;
  servicePrice?: string;
}

export default function SelectDateScreen() {
  const params = useLocalSearchParams<SelectDateScreenParams>();
  const serviceName = params.serviceName || 'Service';
  const duration = parseInt(params.duration || '30', 10);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(undefined);

  // Fetch time slots for selected date
  const { timeSlots, isLoading, error, refetch } = useTimeSlots(
    selectedDate ? {
      date: selectedDate.toISOString().split('T')[0],
      duration,
      staffId: selectedStaffId,
    } : null
  );

  // Get unique staff from time slots
  const staffOptions = React.useMemo(() => {
    const staffSet = new Set<string>();
    timeSlots.forEach(slot => {
      if (slot.staffId && slot.staffName) {
        staffSet.add(JSON.stringify({ id: slot.staffId, name: slot.staffName }));
      }
    });
    return Array.from(staffSet).map(s => JSON.parse(s));
  }, [timeSlots]);

  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  const handleDateSelect = (daysFromToday: number) => {
    const newDate = addDays(new Date(), daysFromToday);
    setSelectedDate(newDate);
    setSelectedTimeSlot(null);
  };

  const handleContinue = () => {
    if (!selectedTimeSlot) {
      // TODO: Show error toast
      return;
    }

    // Find the selected slot to get full details
    const slot = timeSlots.find(s => s.startTime === selectedTimeSlot);
    if (!slot) return;

    router.push({
      pathname: '/booking/confirm',
      params: {
        serviceName,
        duration: duration.toString(),
        startTime: slot.startTime,
        staffId: slot.staffId || '',
        staffName: slot.staffName || '',
        price: params.servicePrice || '0',
      },
    });
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={error} onRetry={refetch} />
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>Book Service</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.infoLabel}>Service: {serviceName}</Text>
          <Text style={styles.infoLabel}>Duration: {duration} minutes</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((days) => {
              const date = addDays(new Date(), days);
              const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
              
              return (
                <TouchableOpacity
                  key={days}
                  style={[styles.dateOption, isSelected && styles.dateOptionSelected]}
                  onPress={() => handleDateSelect(days)}
                >
                  <Text style={[styles.dateDayText, isSelected && styles.dateDayTextSelected]}>
                    {format(date, 'EEE')}
                  </Text>
                  <Text style={[styles.dateNumberText, isSelected && styles.dateNumberTextSelected]}>
                    {format(date, 'd')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Available Times */}
        <View style={styles.timesSection}>
          <Text style={styles.sectionTitle}>Available Times</Text>
          {isLoading ? (
            <LoadingSpinner message="Loading available times..." />
          ) : timeSlots.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No available time slots for this date</Text>
            </Card>
          ) : (
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((slot, index) => {
                const timeStr = format(new Date(slot.startTime), 'h:mm a');
                const isSelected = selectedTimeSlot === slot.startTime;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
                    onPress={() => setSelectedTimeSlot(slot.startTime)}
                  >
                    <Text
                      style={[
                        styles.timeSlotText,
                        isSelected && styles.timeSlotTextSelected,
                      ]}
                    >
                      {timeStr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Staff Selection (Optional) */}
        {staffOptions.length > 0 && (
          <View style={styles.staffSection}>
            <Text style={styles.sectionTitle}>Select Staff (Optional)</Text>
            <Card style={styles.staffCard}>
              <TouchableOpacity
                style={styles.staffOption}
                onPress={() => setSelectedStaffId(undefined)}
              >
                <View style={styles.radioButton}>
                  {!selectedStaffId && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.staffOptionText}>Any Available</Text>
              </TouchableOpacity>
              {staffOptions.map((staff) => (
                <TouchableOpacity
                  key={staff.id}
                  style={styles.staffOption}
                  onPress={() => setSelectedStaffId(staff.id)}
                >
                  <View style={styles.radioButton}>
                    {selectedStaffId === staff.id && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.staffOptionText}>{staff.name}</Text>
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        )}

        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
          disabled={!selectedTimeSlot}
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
  serviceInfo: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  calendarSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  dateScroll: {
    marginHorizontal: -Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  dateOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minWidth: 60,
  },
  dateOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateDayText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dateDayTextSelected: {
    color: Colors.surface,
  },
  dateNumberText: {
    ...Typography.h4,
    color: Colors.textPrimary,
  },
  dateNumberTextSelected: {
    color: Colors.surface,
  },
  timesSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  emptyCard: {
    margin: 0,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minWidth: 100,
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    ...Typography.body,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  timeSlotTextSelected: {
    color: Colors.surface,
    fontWeight: '600',
  },
  staffSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  staffCard: {
    margin: 0,
  },
  staffOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  staffOptionText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  continueButton: {
    marginHorizontal: Spacing.md,
  },
});
