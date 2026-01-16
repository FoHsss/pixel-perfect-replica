import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  CartItem,
  ShopifyProduct,
  createShopifyCart,
  addLineToShopifyCart,
  updateShopifyCartLine,
  removeLineFromShopifyCart,
  storefrontApiRequest,
  CART_QUERY
} from '@/lib/shopify';

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);

        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }]
              });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) {
              console.error('Cannot update quantity for item without lineId:', existingItem);
              return;
            }
            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              const currentItems = get().items;
              set({ items: currentItems.map(i => i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i) });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              const currentItems = get().items;
              set({ items: [...currentItems, { ...item, lineId: result.lineId ?? null }] });
            } else if (result.cartNotFound) {
              clearCart();
            }
          }
        } catch (error) {
          console.error('Failed to add item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }

        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            const currentItems = get().items;
            set({ items: currentItems.map(i => i.variantId === variantId ? { ...i, quantity } : i) });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to update quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const currentItems = get().items;
            const newItems = currentItems.filter(i => i.variantId !== variantId);
            newItems.length === 0 ? clearCart() : set({ items: newItems });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to remove item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      syncCart: async () => {
        const { cartId, clearCart } = get();
        if (!cartId) return;

        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest<{
            cart: {
              id: string;
              checkoutUrl: string;
              lines: {
                edges: Array<{
                  node: {
                    id: string;
                    quantity: number;
                    merchandise: {
                      id: string;
                      title: string;
                      price: { amount: string; currencyCode: string };
                      selectedOptions: Array<{ name: string; value: string }>;
                      product: {
                        id: string;
                        handle: string;
                        title: string;
                        images: { edges: Array<{ node: { url: string; altText: string | null } }> };
                      };
                    };
                  };
                }>;
              };
            } | null;
          }>(CART_QUERY, { cartId });

          if (!data.cart) {
            clearCart();
            return;
          }

          const syncedItems: CartItem[] = data.cart.lines.edges.map(edge => ({
            variantId: edge.node.merchandise.id,
            quantity: edge.node.quantity,
            lineId: edge.node.id,
            price: edge.node.merchandise.price,
            selectedOptions: edge.node.merchandise.selectedOptions,
            product: {
              node: {
                id: edge.node.merchandise.product.id,
                handle: edge.node.merchandise.product.handle,
                title: edge.node.merchandise.product.title,
                description: '',
                descriptionHtml: '',
                options: [],
                priceRange: { minVariantPrice: edge.node.merchandise.price },
                images: edge.node.merchandise.product.images,
                variants: { edges: [] },
              },
            },
          }));

          set({ items: syncedItems, checkoutUrl: data.cart.checkoutUrl });
        } catch (error) {
          console.error('Failed to sync cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      getCheckoutUrl: () => get().checkoutUrl,

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'eluro-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
      }),
    }
  )
);
