/**
 * Orders Hook
 * Fetch and manage orders
 */

import { useState, useEffect } from 'react';
import { getCustomerOrders, getOrderById } from '../lib/api/orders';
import { Order } from '../types';
import { useAuthStore } from '../stores/authStore';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.email) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [user?.email]);

  const loadOrders = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getCustomerOrders(user.email);
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load orders';
      setError(message);
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    isLoading,
    error,
    refetch: loadOrders,
  };
}

export function useOrder(id: string | null) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load order';
      setError(message);
      console.error('Error loading order:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    order,
    isLoading,
    error,
    refetch: loadOrder,
  };
}
