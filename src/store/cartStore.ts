import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product ID
  nameFr: string;
  nameEn: string;
  price: number;
  image: string;
  sku: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(item => item.id === product.id);
          
          if (existingItemIndex >= 0) {
            // Update quantity if already in cart
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems, isOpen: true }; // Open cart when item is added
          }
          
          // Add new item to cart
          return {
            items: [...state.items, {
              id: product.id,
              nameFr: product.nameFr,
              nameEn: product.nameEn,
              price: product.price,
              image: product.image,
              sku: product.sku,
              quantity: quantity
            }],
            isOpen: true // Open cart when item is added
          };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'vegan-delights-cart', // name of the item in the storage (must be unique)
      partialize: (state) => ({ items: state.items }) as CartState, // Do not persist isOpen
    }
  )
);
