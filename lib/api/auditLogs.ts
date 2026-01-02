/**
 * Audit Logs API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface AuditLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId?: string;
  userName?: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogsQueryParams {
  action?: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Get audit logs (admin only)
 */
export async function getAuditLogs(params?: AuditLogsQueryParams): Promise<AuditLog[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.action) queryParams.append('action', params.action);
  if (params?.entityType) queryParams.append('entityType', params.entityType);
  if (params?.entityId) queryParams.append('entityId', params.entityId);
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/audit-logs${query ? `?${query}` : ''}`;
  
  return apiClient.get<AuditLog[]>(endpoint, true);
}
