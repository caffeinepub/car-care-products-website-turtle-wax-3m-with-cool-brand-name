import { useLocalStorageState } from './useLocalStorageState';
import type { Product } from '../backend';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

export function useCart() {
  const [cart, setCart] = useLocalStorageState<CartState>('cart', { items: [] });

  const addItem = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingItemIndex = prev.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const newItems = [...prev.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
        return { items: newItems };
      } else {
        // Add new item
        return {
          items: [...prev.items, { product, quantity }],
        };
      }
    });
  };

  const updateQuantity = (productId: bigint, quantity: number) => {
    if (quantity < 1) return;
    
    setCart((prev) => ({
      items: prev.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  };

  const removeItem = (productId: bigint) => {
    setCart((prev) => ({
      items: prev.items.filter((item) => item.product.id !== productId),
    }));
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const getTotal = () => {
    return cart.items.reduce(
      (total, item) => total + Number(item.product.discountedPrice) * item.quantity,
      0
    );
  };

  const getItemCount = () => {
    return cart.items.length;
  };

  const getTotalQuantity = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    items: cart.items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
    getItemCount,
    getTotalQuantity,
  };
}
