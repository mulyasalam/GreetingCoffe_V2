"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, MenuItem, Order, OrderType } from "./types";
import { generateOrderNumber, mockOrders } from "./mock-data";

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: MenuItem) => {
        const existing = get().items.find((ci) => ci.item.id === item.id);
        if (existing) {
          set({
            items: get().items.map((ci) =>
              ci.item.id === item.id
                ? { ...ci, quantity: ci.quantity + 1 }
                : ci
            ),
          });
        } else {
          set({ items: [...get().items, { item, quantity: 1 }] });
        }
      },
      removeItem: (itemId: string) => {
        set({ items: get().items.filter((ci) => ci.item.id !== itemId) });
      },
      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map((ci) =>
            ci.item.id === itemId ? { ...ci, quantity } : ci
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, ci) => acc + ci.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0),
    }),
    {
      name: "greeting-coffee-cart",
    }
  )
);

interface OrderStore {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    orderType: OrderType,
    tableNumber?: string,
    customerName?: string,
    notes?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getActiveOrders: () => Order[];
  getCompletedOrders: () => Order[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: mockOrders as Order[],
      placeOrder: (items, orderType, tableNumber, customerName, notes) => {
        const subtotal = items.reduce(
          (acc, ci) => acc + ci.item.price * ci.quantity,
          0
        );
        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          orderNumber: generateOrderNumber(),
          items,
          subtotal,
          orderType,
          tableNumber,
          customerName,
          status: "pending",
          createdAt: new Date(),
          notes,
        };
        set({ orders: [newOrder, ...get().orders] });
        return newOrder;
      },
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        });
      },
      getActiveOrders: () =>
        get().orders.filter((o) =>
          ["pending", "preparing", "ready"].includes(o.status)
        ),
      getCompletedOrders: () =>
        get().orders.filter((o) => o.status === "completed"),
    }),
    {
      name: "greeting-coffee-orders",
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
