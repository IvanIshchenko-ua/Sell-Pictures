import  { createContext, useContext, useState,type ReactNode } from "react";
import type { CartItem, Painting } from "../types";

interface CartContextValue {
  items: CartItem[];
  addToCart: (painting: Painting) => void;
  removeFromCart: (paintingId: number) => void;
  updateQuantity: (paintingId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (painting: Painting) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.painting.id === painting.id);
      if (existing) {
        return prev.map((i) =>
          i.painting.id === painting.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { painting, quantity: 1 }];
    });
  };

  const removeFromCart = (paintingId: number) => {
    setItems((prev) => prev.filter((i) => i.painting.id !== paintingId));
  };

  const updateQuantity = (paintingId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(paintingId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.painting.id === paintingId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, i) => sum + i.painting.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
