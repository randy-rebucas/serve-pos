/**
 * Notifications Utility
 * Handles local notifications for booking reminders and other app events
 * Based on MOBILE_APP_QUICK_REFERENCE.md
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule a booking reminder notification
 * @param bookingDate - The date/time of the booking
 * @param serviceName - Name of the service
 * @param hoursBefore - Hours before booking to send reminder (default: 24)
 */
export async function scheduleBookingReminder(
  bookingDate: Date,
  serviceName: string,
  hoursBefore: number = 24
): Promise<string | null> {
  try {
    // Request permissions first
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn('Cannot schedule notification: permissions not granted');
      return null;
    }

    // Calculate reminder time (hoursBefore hours before booking)
    const reminderDate = new Date(bookingDate.getTime() - hoursBefore * 60 * 60 * 1000);
    const now = new Date();

    // Don't schedule if reminder time is in the past
    if (reminderDate <= now) {
      console.warn('Reminder time is in the past, scheduling for 1 hour before booking instead');
      const oneHourBefore = new Date(bookingDate.getTime() - 60 * 60 * 1000);
      if (oneHourBefore <= now) {
        console.warn('Booking is too soon, cannot schedule reminder');
        return null;
      }
      reminderDate.setTime(oneHourBefore.getTime());
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Booking Reminder',
        body: `Your ${serviceName} appointment is ${hoursBefore} hour${hoursBefore !== 1 ? 's' : ''} away!`,
        data: {
          type: 'booking-reminder',
          serviceName,
          bookingDate: bookingDate.toISOString(),
        },
        sound: true,
      },
      trigger: {
        date: reminderDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling booking reminder:', error);
    return null;
  }
}

/**
 * Schedule a booking confirmation notification
 * @param bookingDate - The date/time of the booking
 * @param serviceName - Name of the service
 */
export async function scheduleBookingConfirmation(
  bookingDate: Date,
  serviceName: string
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Booking Confirmed!',
        body: `Your ${serviceName} appointment has been confirmed.`,
        data: {
          type: 'booking-confirmation',
          serviceName,
          bookingDate: bookingDate.toISOString(),
        },
        sound: true,
      },
      trigger: null, // Show immediately
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling booking confirmation:', error);
    return null;
  }
}

/**
 * Cancel a scheduled notification
 * @param notificationId - The ID of the notification to cancel
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
}

/**
 * Get all scheduled notifications
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}

/**
 * Format booking date for notification
 */
export function formatBookingDateForNotification(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}
