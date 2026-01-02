/**
 * Orders/Transactions API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';
import { Order, OrderItem } from '../../types';

export interface CreateOrderRequest {
  items: OrderItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount?: number;
  tax?: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'online';
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  deliveryAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface TransactionsQueryParams {
  customerEmail?: string;
  customerId?: string;
  status?: Order['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface RefundTransactionRequest {
  reason?: string;
  refundAmount?: number; // If not provided, full refund
}

export interface TransactionStats {
  totalSales: number;
  totalTransactions: number;
  averageTransactionValue: number;
  totalRefunds: number;
  refundAmount: number;
  byPaymentMethod: Record<string, number>;
  byStatus: Record<string, number>;
}

/**
 * Get all transactions
 */
export async function getTransactions(params?: TransactionsQueryParams): Promise<Order[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.customerEmail) queryParams.append('customerEmail', params.customerEmail);
  if (params?.customerId) queryParams.append('customerId', params.customerId);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/transactions${query ? `?${query}` : ''}`;
  
  return apiClient.get<Order[]>(endpoint, true);
}

/**
 * Create order/transaction
 */
export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  return apiClient.post<Order>('/api/transactions', data, true);
}

/**
 * Get transaction by ID
 */
export async function getOrderById(id: string): Promise<Order> {
  return apiClient.get<Order>(`/api/transactions/${id}`, true);
}

/**
 * Get customer orders
 */
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  return apiClient.get<Order[]>(`/api/transactions/customer/${customerId}`, true);
}

/**
 * Refund transaction
 */
export async function refundTransaction(id: string, data?: RefundTransactionRequest): Promise<Order> {
  return apiClient.post<Order>(`/api/transactions/${id}/refund`, data || {}, true);
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats(params?: { startDate?: string; endDate?: string; branchId?: string }): Promise<TransactionStats> {
  const queryParams = new URLSearchParams();
  
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.branchId) queryParams.append('branchId', params.branchId);

  const query = queryParams.toString();
  const endpoint = `/api/transactions/stats${query ? `?${query}` : ''}`;
  
  return apiClient.get<TransactionStats>(endpoint, true);
}
