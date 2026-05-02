export type Category =
  | "all"
  | "kopi-susu"
  | "rock-coffee"
  | "non-kopi"
  | "snack";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "all">;
  emoji: string;
  image?: string; // Unsplash photo URL
  isPopular?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";
export type OrderType = "dine-in" | "take-away";

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  status: OrderStatus;
  createdAt: Date;
  notes?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: Date;
}
