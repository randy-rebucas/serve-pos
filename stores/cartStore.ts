/**
 * Cart Store (Zustand)
 * Shopping cart state management
 * Based on MOBILE_APP_SPECS.md
 */

import { create } from 'zustand';
import { Product, ProductVariation } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
  variation?: ProductVariation;
}

interface CartState {
  items: CartItem[];
  discountCode?: string;
  discountAmount?: number;
  addItem: (product: Product, quantity: number, variation?: ProductVariation) => void;
  removeItem: (productId: string, variation?: ProductVariation) => void;
  updateQuantity: (productId: string, quantity: number, variation?: ProductVariation) => void;
  clearCart: () => void;
  setDiscountCode: (code: string, amount?: number) => void;
  clearDiscount: () => void;
  getSubtotal: () => number;
  getTotal: (tax?: number) => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discountCode: undefined,
  discountAmount: undefined,

  addItem: (product: Product, quantity: number, variation?: ProductVariation) => {
    const items = [...get().items];
    const itemKey = variation
      ? `${product._id}_${JSON.stringify(variation)}`
      : product._id;

    const existingItemIndex = items.findIndex((item) => {
      const existingKey = item.variation
        ? `${item.product._id}_${JSON.stringify(item.variation)}`
        : item.product._id;
      return existingKey === itemKey;
    });

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      items.push({ product, quantity, variation });
    }

    set({ items });
  },

  removeItem: (productId: string, variation?: ProductVariation) => {
    const items = get().items.filter((item) => {
      if (item.product._id !== productId) return true;
      if (variation && item.variation) {
        return JSON.stringify(item.variation) !== JSON.stringify(variation);
      }
      return !!item.variation !== !!variation;
    });
    set({ items });
  },

  updateQuantity: (productId: string, quantity: number, variation?: ProductVariation) => {
    if (quantity <= 0) {
      get().removeItem(productId, variation);
      return;
    }

    const items = get().items.map((item) => {
      if (item.product._id !== productId) return item;
      if (variation && item.variation) {
        if (JSON.stringify(item.variation) === JSON.stringify(variation)) {
          return { ...item, quantity };
        }
      } else if (!item.variation && !variation) {
        return { ...item, quantity };
      }
      return item;
    });

    set({ items });
  },

  clearCart: () => {
    set({ items: [], discountCode: undefined, discountAmount: undefined });
  },

  setDiscountCode: (code: string, amount?: number) => {
    set({ discountCode: code, discountAmount: amount });
  },

  clearDiscount: () => {
    set({ discountCode: undefined, discountAmount: undefined });
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      const price = item.variation?.price ?? item.product.price;
      return total + price * item.quantity;
    }, 0);
  },

  getTotal: (tax: number = 0) => {
    const subtotal = get().getSubtotal();
    const discount = get().discountAmount ?? 0;
    return subtotal - discount + tax;
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
