/**
 * Products Hook
 * Fetch and manage products
 */

import { useState, useEffect } from 'react';
import { getProducts, getProductById, ProductsQueryParams } from '../lib/api/products';
import { Product, ApiErrorClass } from '../types';

export function useProducts(params?: ProductsQueryParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [params?.categoryId, params?.search]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      // Handle ApiErrorClass, Error, and plain ApiError objects
      let message = 'Failed to load products';
      
      if (err instanceof ApiErrorClass || err instanceof Error) {
        message = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        message = typeof err.message === 'string' ? err.message : 'Failed to load products';
      }
      
      setError(message);
      
      // Log full error details for debugging
      if (__DEV__) {
        console.error('Error loading products:', {
          error: err,
          message: message,
          errorType: err instanceof Error ? err.constructor.name : typeof err,
          isApiError: err instanceof ApiErrorClass,
          statusCode: err instanceof ApiErrorClass ? err.statusCode : (err as any)?.statusCode,
          stack: err instanceof Error ? err.stack : undefined,
        });
      } else {
        console.error('Error loading products:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products,
    isLoading,
    error,
    refetch: loadProducts,
  };
}

export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      // Handle ApiErrorClass, Error, and plain ApiError objects
      let message = 'Failed to load product';
      
      if (err instanceof ApiErrorClass || err instanceof Error) {
        message = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        message = typeof err.message === 'string' ? err.message : 'Failed to load product';
      }
      
      setError(message);
      
      if (__DEV__) {
        console.error('Error loading product:', {
          error: err,
          message: message,
          errorType: err instanceof Error ? err.constructor.name : typeof err,
          isApiError: err instanceof ApiErrorClass,
          statusCode: err instanceof ApiErrorClass ? err.statusCode : (err as any)?.statusCode,
        });
      } else {
        console.error('Error loading product:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    product,
    isLoading,
    error,
    refetch: loadProduct,
  };
}
