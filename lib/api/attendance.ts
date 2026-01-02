/**
 * Attendance API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface AttendanceRecord {
  _id: string;
  userId: string;
  userName: string;
  branchId?: string;
  clockIn: string; // ISO date
  clockOut?: string; // ISO date
  breakStart?: string; // ISO date
  breakEnd?: string; // ISO date
  totalHours?: number;
  status: 'active' | 'completed' | 'missed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceQueryParams {
  userId?: string;
  branchId?: string;
  status?: AttendanceRecord['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface ClockInRequest {
  branchId?: string;
  notes?: string;
}

export interface ClockOutRequest {
  notes?: string;
}

/**
 * Get attendance records
 */
export async function getAttendanceRecords(params?: AttendanceQueryParams): Promise<AttendanceRecord[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.branchId) queryParams.append('branchId', params.branchId);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/attendance${query ? `?${query}` : ''}`;
  
  return apiClient.get<AttendanceRecord[]>(endpoint, true);
}

/**
 * Get current attendance session
 */
export async function getCurrentAttendance(): Promise<AttendanceRecord | null> {
  return apiClient.get<AttendanceRecord | null>('/api/attendance/current', true);
}

/**
 * Clock in
 */
export async function clockIn(data?: ClockInRequest): Promise<AttendanceRecord> {
  return apiClient.post<AttendanceRecord>('/api/attendance', { action: 'clock-in', ...data }, true);
}

/**
 * Clock out
 */
export async function clockOut(data?: ClockOutRequest): Promise<AttendanceRecord> {
  return apiClient.post<AttendanceRecord>('/api/attendance', { action: 'clock-out', ...data }, true);
}

/**
 * Send attendance notifications
 */
export async function sendAttendanceNotifications(params?: { userIds?: string[] }): Promise<{ sent: number }> {
  return apiClient.post<{ sent: number }>('/api/attendance/notifications', params || {}, true);
}
