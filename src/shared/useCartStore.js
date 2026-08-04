import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product, qty = 1) => set((state) => {
    const existingIndex = state.cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      const updatedCart = [...state.cart];
      updatedCart[existingIndex].quantity += qty;
      return { cart: updatedCart };
    }
    return { cart: [...state.cart, { ...product, quantity: qty }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => {
    if (quantity <= 0) {
      return { cart: state.cart.filter((item) => item.id !== productId) };
    }
    return {
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    };
  }),
  clearCart: () => set({ cart: [] }),
}));
