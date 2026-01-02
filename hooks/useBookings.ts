/**
 * Bookings Hook
 * Fetch and manage bookings
 */

import { useState, useEffect } from 'react';
import { getCustomerBookings, getBookingById, getTimeSlots, TimeSlotsQueryParams } from '../lib/api/bookings';
import { Booking, TimeSlot } from '../types';
import { useAuthStore } from '../stores/authStore';

export function useBookings(status?: Booking['status']) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.email) {
      loadBookings();
    } else {
      setIsLoading(false);
    }
  }, [user?.email, status]);

  const loadBookings = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCustomerBookings(user.email, status);
      setBookings(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load bookings';
      setError(message);
      console.error('Error loading bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookings,
    isLoading,
    error,
    refetch: loadBookings,
  };
}

export function useBooking(id: string | null) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getBookingById(id);
      setBooking(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load booking';
      setError(message);
      console.error('Error loading booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    booking,
    isLoading,
    error,
    refetch: loadBooking,
  };
}

export function useTimeSlots(params: TimeSlotsQueryParams | null) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTimeSlots = async (queryParams: TimeSlotsQueryParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTimeSlots(queryParams);
      setTimeSlots(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load time slots';
      setError(message);
      console.error('Error loading time slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params) {
      loadTimeSlots(params);
    }
  }, [params?.date, params?.duration, params?.staffId]);

  return {
    timeSlots,
    isLoading,
    error,
    refetch: loadTimeSlots,
  };
}
