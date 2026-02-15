import { useLocalStorageState } from './useLocalStorageState';
import type { Product } from '../backend';

interface WishlistState {
  items: Product[];
}

export function useWishlist() {
  const [wishlist, setWishlist] = useLocalStorageState<WishlistState>('wishlist', { items: [] });

  const toggleItem = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.items.some((item) => item.id === product.id);
      
      if (exists) {
        // Remove from wishlist
        return {
          items: prev.items.filter((item) => item.id !== product.id),
        };
      } else {
        // Add to wishlist
        return {
          items: [...prev.items, product],
        };
      }
    });
  };

  const removeItem = (productId: bigint) => {
    setWishlist((prev) => ({
      items: prev.items.filter((item) => item.id !== productId),
    }));
  };

  const isInWishlist = (productId: bigint) => {
    return wishlist.items.some((item) => item.id === productId);
  };

  const getCount = () => {
    return wishlist.items.length;
  };

  return {
    items: wishlist.items,
    toggleItem,
    removeItem,
    isInWishlist,
    getCount,
  };
}
