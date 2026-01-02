/**
 * Reports API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface SalesReportParams {
  startDate: string;
  endDate: string;
  branchId?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface SalesReport {
  period: string;
  totalSales: number;
  totalTransactions: number;
  averageTransactionValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  paymentMethods: Record<string, number>;
}

export interface ProductPerformanceReportParams {
  startDate: string;
  endDate: string;
  categoryId?: string;
  branchId?: string;
}

export interface ProductPerformanceReport {
  products: Array<{
    productId: string;
    productName: string;
    category?: string;
    quantitySold: number;
    revenue: number;
    profit: number;
    averagePrice: number;
  }>;
  summary: {
    totalProducts: number;
    totalRevenue: number;
    totalProfit: number;
  };
}

export interface ProfitLossReportParams {
  startDate: string;
  endDate: string;
  branchId?: string;
}

export interface ProfitLossReport {
  revenue: {
    sales: number;
    services: number;
    other: number;
    total: number;
  };
  expenses: {
    costOfGoods: number;
    operating: number;
    other: number;
    total: number;
  };
  profit: {
    gross: number;
    net: number;
    margin: number; // Percentage
  };
}

export interface CashDrawerReportParams {
  startDate: string;
  endDate: string;
  branchId?: string;
  userId?: string;
}

export interface CashDrawerReport {
  sessions: number;
  totalCash: number;
  totalExpected: number;
  totalDifference: number;
  discrepancies: Array<{
    sessionId: string;
    date: string;
    expected: number;
    actual: number;
    difference: number;
  }>;
}

export interface VatReportParams {
  startDate: string;
  endDate: string;
  branchId?: string;
}

export interface VatReport {
  period: string;
  totalSales: number;
  totalVat: number;
  vatByRate: Record<string, {
    rate: number;
    sales: number;
    vat: number;
  }>;
  transactions: Array<{
    transactionId: string;
    date: string;
    amount: number;
    vat: number;
  }>;
}

/**
 * Get sales report
 */
export async function getSalesReport(params: SalesReportParams): Promise<SalesReport> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  
  if (params.branchId) queryParams.append('branchId', params.branchId);
  if (params.groupBy) queryParams.append('groupBy', params.groupBy);

  return apiClient.get<SalesReport>(`/api/reports/sales?${queryParams.toString()}`, true);
}

/**
 * Get product performance report
 */
export async function getProductPerformanceReport(params: ProductPerformanceReportParams): Promise<ProductPerformanceReport> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  
  if (params.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params.branchId) queryParams.append('branchId', params.branchId);

  return apiClient.get<ProductPerformanceReport>(`/api/reports/products?${queryParams.toString()}`, true);
}

/**
 * Get profit & loss report
 */
export async function getProfitLossReport(params: ProfitLossReportParams): Promise<ProfitLossReport> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  
  if (params.branchId) queryParams.append('branchId', params.branchId);

  return apiClient.get<ProfitLossReport>(`/api/reports/profit-loss?${queryParams.toString()}`, true);
}

/**
 * Get cash drawer report
 */
export async function getCashDrawerReport(params: CashDrawerReportParams): Promise<CashDrawerReport> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  
  if (params.branchId) queryParams.append('branchId', params.branchId);
  if (params.userId) queryParams.append('userId', params.userId);

  return apiClient.get<CashDrawerReport>(`/api/reports/cash-drawer?${queryParams.toString()}`, true);
}

/**
 * Get VAT/Tax report
 */
export async function getVatReport(params: VatReportParams): Promise<VatReport> {
  const queryParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  
  if (params.branchId) queryParams.append('branchId', params.branchId);

  return apiClient.get<VatReport>(`/api/reports/vat?${queryParams.toString()}`, true);
}
