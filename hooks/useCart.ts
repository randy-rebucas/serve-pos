/**
 * Cart Hook
 * Convenience hook for cart operations
 */

import { useCartStore } from '../stores/cartStore';
import { Product, ProductVariation } from '../types';

export function useCart() {
  const {
    items,
    discountCode,
    discountAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setDiscountCode,
    clearDiscount,
    getSubtotal,
    getTotal,
    getItemCount,
  } = useCartStore();

  const addToCart = (product: Product, quantity: number = 1, variation?: ProductVariation) => {
    addItem(product, quantity, variation);
  };

  const removeFromCart = (productId: string, variation?: ProductVariation) => {
    removeItem(productId, variation);
  };

  const changeQuantity = (productId: string, quantity: number, variation?: ProductVariation) => {
    updateQuantity(productId, quantity, variation);
  };

  const applyDiscount = (code: string, amount?: number) => {
    setDiscountCode(code, amount);
  };

  const removeDiscount = () => {
    clearDiscount();
  };

  const isEmpty = items.length === 0;

  return {
    items,
    discountCode,
    discountAmount,
    isEmpty,
    itemCount: getItemCount(),
    subtotal: getSubtotal(),
    total: (tax: number = 0) => getTotal(tax),
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    applyDiscount,
    removeDiscount,
  };
}
