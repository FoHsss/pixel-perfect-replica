import { useState, useEffect } from 'react';
import { ShopifyProduct, fetchProducts, fetchProductByHandle } from '@/lib/shopify';

export function useShopifyProducts(first: number = 20) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await fetchProducts(first);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [first]);

  return { products, isLoading, error };
}

export function useShopifyProduct(handle: string | undefined) {
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      if (!handle) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [handle]);

  return { product, isLoading, error };
}
