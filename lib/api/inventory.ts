/**
 * Inventory & Stock API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface StockMovement {
  _id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  userId?: string;
  userName?: string;
  branchId?: string;
  createdAt: string;
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  category?: string;
}

export interface StockMovementsQueryParams {
  productId?: string;
  type?: StockMovement['type'];
  startDate?: string;
  endDate?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}

/**
 * Get stock movements
 */
export async function getStockMovements(params?: StockMovementsQueryParams): Promise<StockMovement[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.productId) queryParams.append('productId', params.productId);
  if (params?.type) queryParams.append('type', params.type);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.branchId) queryParams.append('branchId', params.branchId);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/stock-movements${query ? `?${query}` : ''}`;
  
  return apiClient.get<StockMovement[]>(endpoint, true);
}

/**
 * Get low stock alerts
 */
export async function getLowStockAlerts(params?: { branchId?: string }): Promise<LowStockAlert[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.branchId) queryParams.append('branchId', params.branchId);

  const query = queryParams.toString();
  const endpoint = `/api/inventory/low-stock${query ? `?${query}` : ''}`;
  
  return apiClient.get<LowStockAlert[]>(endpoint, true);
}

/**
 * Get real-time stock updates (SSE)
 * Note: This would typically use Server-Sent Events or WebSocket
 * For now, this is a placeholder for polling-based implementation
 */
export async function getRealtimeStock(params?: { productIds?: string[] }): Promise<Record<string, number>> {
  const queryParams = new URLSearchParams();
  
  if (params?.productIds) {
    params.productIds.forEach(id => queryParams.append('productIds', id));
  }

  const query = queryParams.toString();
  const endpoint = `/api/inventory/realtime${query ? `?${query}` : ''}`;
  
  return apiClient.get<Record<string, number>>(endpoint, true);
}
