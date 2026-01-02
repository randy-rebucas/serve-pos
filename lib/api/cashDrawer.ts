/**
 * Cash Drawer API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface CashDrawerSession {
  _id: string;
  userId: string;
  userName: string;
  branchId?: string;
  openingAmount: number;
  closingAmount?: number;
  expectedAmount?: number;
  difference?: number;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
  notes?: string;
  transactions?: Array<{
    transactionId: string;
    amount: number;
    type: 'sale' | 'refund' | 'deposit' | 'withdrawal';
  }>;
}

export interface CashDrawerSessionsQueryParams {
  userId?: string;
  branchId?: string;
  status?: CashDrawerSession['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface OpenCashDrawerRequest {
  openingAmount: number;
  branchId?: string;
  notes?: string;
}

export interface CloseCashDrawerRequest {
  closingAmount: number;
  notes?: string;
}

/**
 * Get cash drawer sessions
 */
export async function getCashDrawerSessions(params?: CashDrawerSessionsQueryParams): Promise<CashDrawerSession[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.userId) queryParams.append('userId', params.userId);
  if (params?.branchId) queryParams.append('branchId', params.branchId);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/cash-drawer/sessions${query ? `?${query}` : ''}`;
  
  return apiClient.get<CashDrawerSession[]>(endpoint, true);
}

/**
 * Open cash drawer session
 */
export async function openCashDrawer(data: OpenCashDrawerRequest): Promise<CashDrawerSession> {
  return apiClient.post<CashDrawerSession>('/api/cash-drawer/sessions', { ...data, action: 'open' }, true);
}

/**
 * Close cash drawer session
 */
export async function closeCashDrawer(sessionId: string, data: CloseCashDrawerRequest): Promise<CashDrawerSession> {
  return apiClient.post<CashDrawerSession>(`/api/cash-drawer/sessions/${sessionId}/close`, data, true);
}
