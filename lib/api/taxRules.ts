/**
 * Tax Rules API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface TaxRule {
  _id: string;
  name: string;
  description?: string;
  rate: number; // Percentage (e.g., 20 for 20%)
  type: 'percentage' | 'fixed';
  appliesTo: 'all' | 'products' | 'services' | 'categories';
  categoryIds?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaxRulesQueryParams {
  search?: string;
  isActive?: boolean;
  type?: TaxRule['type'];
}

export interface CreateTaxRuleRequest {
  name: string;
  description?: string;
  rate: number;
  type: TaxRule['type'];
  appliesTo: TaxRule['appliesTo'];
  categoryIds?: string[];
  isActive?: boolean;
}

export interface UpdateTaxRuleRequest {
  name?: string;
  description?: string;
  rate?: number;
  type?: TaxRule['type'];
  appliesTo?: TaxRule['appliesTo'];
  categoryIds?: string[];
  isActive?: boolean;
}

/**
 * Get all tax rules
 */
export async function getTaxRules(params?: TaxRulesQueryParams): Promise<TaxRule[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) queryParams.append('search', params.search);
  if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
  if (params?.type) queryParams.append('type', params.type);

  const query = queryParams.toString();
  const endpoint = `/api/tax-rules${query ? `?${query}` : ''}`;
  
  return apiClient.get<TaxRule[]>(endpoint, true);
}

/**
 * Get tax rule by ID
 */
export async function getTaxRuleById(id: string): Promise<TaxRule> {
  return apiClient.get<TaxRule>(`/api/tax-rules/${id}`, true);
}

/**
 * Create tax rule
 */
export async function createTaxRule(data: CreateTaxRuleRequest): Promise<TaxRule> {
  return apiClient.post<TaxRule>('/api/tax-rules', data, true);
}

/**
 * Update tax rule
 */
export async function updateTaxRule(id: string, data: UpdateTaxRuleRequest): Promise<TaxRule> {
  return apiClient.put<TaxRule>(`/api/tax-rules/${id}`, data, true);
}

/**
 * Delete tax rule
 */
export async function deleteTaxRule(id: string): Promise<void> {
  return apiClient.delete<void>(`/api/tax-rules/${id}`, true);
}
