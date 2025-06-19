import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  phoneNumber: string;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setPhoneNumber: (phone: string) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      phoneNumber: "",

      addToCart: (product: Product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { id: product.id, quantity: 1, product }],
          });
        }
      },

      removeFromCart: (productId: number) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId: number, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          set({
            items: items.filter((item) => item.id !== productId),
          });
        } else {
          set({
            items: items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      setPhoneNumber: (phone: string) => set({ phoneNumber: phone }),

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + (item.product?.price || 0) * item.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
