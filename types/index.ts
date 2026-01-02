/**
 * TypeScript Types & Interfaces
 * Based on MOBILE_APP_SPECS.md data models
 */

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses?: Address[];
  dateOfBirth?: string;
  totalSpent?: number;
  lastPurchaseDate?: string;
  isActive: boolean;
}

export interface Booking {
  _id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceName: string;
  serviceDescription?: string;
  startTime: string; // ISO date
  endTime: string; // ISO date
  duration: number; // minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  staffId?: string;
  staffName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariation {
  size?: string;
  color?: string;
  type?: string;
  sku?: string;
  price?: number;
  stock?: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  category?: string;
  categoryId?: string;
  image?: string;
  images?: string[];
  productType: 'regular' | 'bundle' | 'service';
  hasVariations: boolean;
  variations?: ProductVariation[];
  isActive: boolean;
}

export interface OrderItem {
  product: string; // product ID
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  variation?: ProductVariation;
}

export interface Order {
  _id: string;
  receiptNumber: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountCode?: string;
  tax?: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'cancelled' | 'refunded' | 'pending';
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: Address;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // minutes
  category?: string;
  categoryId?: string;
  image?: string;
  images?: string[];
  isActive: boolean;
}

export interface TimeSlot {
  time: string; // ISO date or time string
  available: boolean;
  staffId?: string;
  staffName?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Custom ApiError class for better error handling
 */
export class ApiErrorClass extends Error implements ApiError {
  statusCode?: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiErrorClass);
    }
  }
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
