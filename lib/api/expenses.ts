/**
 * Expenses API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface Expense {
  _id: string;
  description: string;
  amount: number;
  category?: string;
  date: string; // ISO date
  branchId?: string;
  userId?: string;
  userName?: string;
  receipt?: string; // URL or file path
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensesQueryParams {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}

export interface CreateExpenseRequest {
  description: string;
  amount: number;
  category?: string;
  date: string; // ISO date
  branchId?: string;
  receipt?: string;
  notes?: string;
}

export interface UpdateExpenseRequest {
  description?: string;
  amount?: number;
  category?: string;
  date?: string;
  branchId?: string;
  receipt?: string;
  notes?: string;
}

/**
 * Get all expenses
 */
export async function getExpenses(params?: ExpensesQueryParams): Promise<Expense[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.branchId) queryParams.append('branchId', params.branchId);
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));

  const query = queryParams.toString();
  const endpoint = `/api/expenses${query ? `?${query}` : ''}`;
  
  return apiClient.get<Expense[]>(endpoint, true);
}

/**
 * Get expense by ID
 */
export async function getExpenseById(id: string): Promise<Expense> {
  return apiClient.get<Expense>(`/api/expenses/${id}`, true);
}

/**
 * Create expense
 */
export async function createExpense(data: CreateExpenseRequest): Promise<Expense> {
  return apiClient.post<Expense>('/api/expenses', data, true);
}

/**
 * Update expense
 */
export async function updateExpense(id: string, data: UpdateExpenseRequest): Promise<Expense> {
  return apiClient.put<Expense>(`/api/expenses/${id}`, data, true);
}

/**
 * Delete expense
 */
export async function deleteExpense(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/expenses/${id}`, true);
}
