/**
 * Business Types API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface BusinessType {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

/**
 * Get all business types (public)
 */
export async function getBusinessTypes(): Promise<BusinessType[]> {
  return apiClient.get<BusinessType[]>('/api/business-types', false);
}
