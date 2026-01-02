/**
 * Bookings API Endpoints
 * Based on MOBILE_APP_SPECS.md
 */

import { apiClient } from './client';
import { Booking, TimeSlot } from '../../types';

export interface TimeSlotsQueryParams {
  date: string; // ISO date
  duration: number; // minutes
  staffId?: string;
}

export interface CreateBookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  startTime: string; // ISO date
  duration: number; // minutes
  staffId?: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  status?: Booking['status'];
  startTime?: string;
  notes?: string;
}

/**
 * Get available time slots
 */
export async function getTimeSlots(params: TimeSlotsQueryParams): Promise<TimeSlot[]> {
  const queryParams = new URLSearchParams({
    date: params.date,
    duration: String(params.duration),
  });
  
  if (params.staffId) {
    queryParams.append('staffId', params.staffId);
  }

  return apiClient.get<TimeSlot[]>(`/api/bookings/time-slots?${queryParams.toString()}`, false);
}

/**
 * Create booking
 */
export async function createBooking(data: CreateBookingRequest): Promise<Booking> {
  return apiClient.post<Booking>('/api/bookings', data, true);
}

/**
 * Get customer bookings
 */
export async function getCustomerBookings(
  customerEmail: string,
  status?: Booking['status']
): Promise<Booking[]> {
  const queryParams = new URLSearchParams({ customerEmail });
  if (status) {
    queryParams.append('status', status);
  }
  
  return apiClient.get<Booking[]>(`/api/bookings?${queryParams.toString()}`, true);
}

/**
 * Get booking by ID
 */
export async function getBookingById(id: string): Promise<Booking> {
  return apiClient.get<Booking>(`/api/bookings/${id}`, true);
}

/**
 * Update booking (cancel, reschedule, etc.)
 */
export async function updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking> {
  return apiClient.put<Booking>(`/api/bookings/${id}`, data, true);
}

/**
 * Cancel booking
 */
export async function cancelBooking(id: string): Promise<Booking> {
  return updateBooking(id, { status: 'cancelled' });
}

/**
 * Get bookings with query params
 */
export async function getBookings(params?: {
  status?: Booking['status'];
  customerEmail?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}): Promise<Booking[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.status) queryParams.append('status', params.status);
  if (params?.customerEmail) queryParams.append('customerEmail', params.customerEmail);
  if (params?.customerId) queryParams.append('customerId', params.customerId);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/bookings${query ? `?${query}` : ''}`;
  
  return apiClient.get<Booking[]>(endpoint, true);
}

/**
 * Delete booking
 */
export async function deleteBooking(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/bookings/${id}`, true);
}

/**
 * Send booking reminder
 */
export async function sendBookingReminder(id: string): Promise<{ sent: boolean; message: string }> {
  return apiClient.post<{ sent: boolean; message: string }>(`/api/bookings/${id}/reminder`, {}, true);
}

/**
 * Send reminders for upcoming bookings
 */
export async function sendBookingReminders(params?: { hoursBefore?: number }): Promise<{ sent: number }> {
  return apiClient.post<{ sent: number }>('/api/bookings/reminders/send', params || {}, true);
}

/**
 * Get customer bookings by customer ID
 */
export async function getCustomerBookingsById(customerId: string, status?: Booking['status']): Promise<Booking[]> {
  const queryParams = new URLSearchParams();
  if (status) {
    queryParams.append('status', status);
  }
  
  const query = queryParams.toString();
  const endpoint = `/api/bookings/customer/${customerId}${query ? `?${query}` : ''}`;
  
  return apiClient.get<Booking[]>(endpoint, true);
}
