/**
 * Automations API Endpoints
 * Based on API_ENDPOINTS_COMPLETE.md
 */

import { apiClient } from './client';

export interface AutomationStatus {
  status: 'running' | 'idle' | 'error';
  lastRun?: string;
  nextRun?: string;
  error?: string;
}

/**
 * Booking Automations
 */

/**
 * Send booking reminders
 */
export async function sendBookingReminders(params?: { bookingIds?: string[] }): Promise<{ sent: number }> {
  return apiClient.post<{ sent: number }>('/api/automations/booking-reminders', params || {}, true);
}

/**
 * Auto-confirm bookings
 */
export async function autoConfirmBookings(params?: { bookingIds?: string[] }): Promise<{ confirmed: number }> {
  return apiClient.post<{ confirmed: number }>('/api/automations/bookings/confirm', params || {}, true);
}

/**
 * Track no-show bookings
 */
export async function trackNoShowBookings(params?: { bookingIds?: string[] }): Promise<{ tracked: number }> {
  return apiClient.post<{ tracked: number }>('/api/automations/bookings/no-show', params || {}, true);
}

/**
 * Inventory Automations
 */

/**
 * Send low stock alerts
 */
export async function sendLowStockAlerts(params?: { productIds?: string[] }): Promise<{ sent: number }> {
  return apiClient.post<{ sent: number }>('/api/automations/low-stock-alerts', params || {}, true);
}

/**
 * Predictive stock analysis
 */
export async function predictiveStockAnalysis(params?: { productIds?: string[] }): Promise<{ analyzed: number }> {
  return apiClient.post<{ analyzed: number }>('/api/automations/stock/predictive', params || {}, true);
}

/**
 * Auto stock transfers
 */
export async function autoStockTransfers(params?: { branchIds?: string[] }): Promise<{ transferred: number }> {
  return apiClient.post<{ transferred: number }>('/api/automations/stock/transfer', params || {}, true);
}

/**
 * Generate purchase orders
 */
export async function generatePurchaseOrders(params?: { productIds?: string[] }): Promise<{ generated: number }> {
  return apiClient.post<{ generated: number }>('/api/automations/purchase-orders', params || {}, true);
}

/**
 * Transaction Automations
 */

/**
 * Auto-email receipts
 */
export async function autoEmailReceipts(params?: { transactionIds?: string[] }): Promise<{ sent: number }> {
  return apiClient.post<{ sent: number }>('/api/automations/transaction-receipts', params || {}, true);
}

/**
 * Abandoned cart recovery
 */
export async function abandonedCartRecovery(params?: { customerIds?: string[] }): Promise<{ recovered: number }> {
  return apiClient.post<{ recovered: number }>('/api/automations/carts/abandoned', params || {}, true);
}

/**
 * Reporting Automations
 */

/**
 * Generate sales reports
 */
export async function generateSalesReports(params?: { startDate?: string; endDate?: string }): Promise<{ generated: number }> {
  return apiClient.post<{ generated: number }>('/api/automations/reports/sales', params || {}, true);
}

/**
 * Sales trend analysis
 */
export async function salesTrendAnalysis(params?: { startDate?: string; endDate?: string }): Promise<{ analyzed: boolean }> {
  return apiClient.post<{ analyzed: boolean }>('/api/automations/analytics/sales-trends', params || {}, true);
}

/**
 * Discount Automations
 */

/**
 * Auto-manage discounts
 */
export async function autoManageDiscounts(params?: { discountIds?: string[] }): Promise<{ managed: number }> {
  return apiClient.post<{ managed: number }>('/api/automations/discounts/manage', params || {}, true);
}

/**
 * Dynamic pricing
 */
export async function dynamicPricing(params?: { productIds?: string[] }): Promise<{ updated: number }> {
  return apiClient.post<{ updated: number }>('/api/automations/pricing/dynamic', params || {}, true);
}

/**
 * Attendance Automations
 */

/**
 * Auto clock-out
 */
export async function autoClockOut(params?: { userIds?: string[] }): Promise<{ clockedOut: number }> {
  return apiClient.post<{ clockedOut: number }>('/api/automations/attendance/auto-clockout', params || {}, true);
}

/**
 * Break detection
 */
export async function breakDetection(params?: { userIds?: string[] }): Promise<{ detected: number }> {
  return apiClient.post<{ detected: number }>('/api/automations/attendance/break-detection', params || {}, true);
}

/**
 * Track violations
 */
export async function trackViolations(params?: { userIds?: string[] }): Promise<{ tracked: number }> {
  return apiClient.post<{ tracked: number }>('/api/automations/attendance/violations', params || {}, true);
}

/**
 * Cash Management Automations
 */

/**
 * Auto-close drawers
 */
export async function autoCloseDrawers(params?: { branchIds?: string[] }): Promise<{ closed: number }> {
  return apiClient.post<{ closed: number }>('/api/automations/cash-drawer/auto-close', params || {}, true);
}

/**
 * Cash count reminders
 */
export async function cashCountReminders(params?: { userIds?: string[] }): Promise<{ sent: number }> {
  return apiClient.post<{ sent: number }>('/api/automations/cash-drawer/reminders', params || {}, true);
}

/**
 * Customer Automations
 */

/**
 * Calculate lifetime value
 */
export async function calculateLifetimeValue(params?: { customerIds?: string[] }): Promise<{ calculated: number }> {
  return apiClient.post<{ calculated: number }>('/api/automations/customers/lifetime-value', params || {}, true);
}

/**
 * Product Automations
 */

/**
 * Product performance analysis
 */
export async function productPerformanceAnalysis(params?: { productIds?: string[] }): Promise<{ analyzed: number }> {
  return apiClient.post<{ analyzed: number }>('/api/automations/products/performance', params || {}, true);
}

/**
 * System Automations
 */

/**
 * Create database backup (admin only)
 */
export async function createDatabaseBackup(): Promise<{ backupId: string; message: string }> {
  return apiClient.post<{ backupId: string; message: string }>('/api/automations/backups/create', {}, true);
}

/**
 * Cleanup audit logs (admin only)
 */
export async function cleanupAuditLogs(params?: { olderThan?: string }): Promise<{ deleted: number }> {
  return apiClient.post<{ deleted: number }>('/api/automations/audit-logs/cleanup', params || {}, true);
}

/**
 * Archive old data (admin only)
 */
export async function archiveOldData(params?: { olderThan?: string }): Promise<{ archived: number }> {
  return apiClient.post<{ archived: number }>('/api/automations/data/archive', params || {}, true);
}

/**
 * Expire sessions (admin only)
 */
export async function expireSessions(params?: { olderThan?: string }): Promise<{ expired: number }> {
  return apiClient.post<{ expired: number }>('/api/automations/sessions/expire', params || {}, true);
}

/**
 * Detect suspicious activity (admin only)
 */
export async function detectSuspiciousActivity(): Promise<{ detected: number; activities: any[] }> {
  return apiClient.post<{ detected: number; activities: any[] }>('/api/automations/security/suspicious-activity', {}, true);
}

/**
 * Multi-branch sync
 */
export async function multiBranchSync(params?: { branchIds?: string[] }): Promise<{ synced: number }> {
  return apiClient.post<{ synced: number }>('/api/automations/sync/multi-branch', params || {}, true);
}

/**
 * Offline sync
 */
export async function offlineSync(params?: { lastSync?: string }): Promise<{ synced: number }> {
  return apiClient.post<{ synced: number }>('/api/automations/sync/offline', params || {}, true);
}

/**
 * Get automation status
 */
export async function getAutomationStatus(): Promise<Record<string, AutomationStatus>> {
  return apiClient.get<Record<string, AutomationStatus>>('/api/automations/status', true);
}
