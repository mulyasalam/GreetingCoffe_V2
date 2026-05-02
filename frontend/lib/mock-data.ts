import { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
  // ── Kopi Susu ────────────────────────────────────────────────────────────
  {
    id: "ks-1",
    name: "Kopi Susu Original",
    description:
      "Espresso segar dipadukan dengan susu segar pilihan, menghasilkan cita rasa kopi yang lembut dan creamy.",
    price: 25000,
    category: "kopi-susu",
    emoji: "☕",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
    isPopular: true,
  },
  {
    id: "ks-2",
    name: "Kopi Susu Aren",
    description:
      "Paduan espresso dan susu segar dengan gula aren asli yang memberikan rasa manis alami khas.",
    price: 28000,
    category: "kopi-susu",
    emoji: "🍯",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    isPopular: true,
  },
  {
    id: "ks-3",
    name: "Kopi Susu Vanilla",
    description:
      "Espresso lembut dengan susu segar dan sirup vanilla premium untuk nuansa rasa yang elegan.",
    price: 27000,
    category: "kopi-susu",
    emoji: "☕",
    image:
      "https://images.unsplash.com/photo-1579888944880-d98341245702?w=600&q=80",
  },
  {
    id: "ks-4",
    name: "Kopi Susu Hazelnut",
    description:
      "Kombinasi espresso dan susu segar dengan sentuhan hazelnut yang kaya dan menggugah selera.",
    price: 28000,
    category: "kopi-susu",
    emoji: "🌰",
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80",
  },
  // ── Rock Coffee ──────────────────────────────────────────────────────────
  {
    id: "rc-1",
    name: "Rock Coffee Original",
    description:
      "Cold brew kopi robusta pilihan yang diseduh 12 jam, menghasilkan cita rasa bold dan segar.",
    price: 22000,
    category: "rock-coffee",
    emoji: "🧊",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=80",
    isPopular: true,
  },
  {
    id: "rc-2",
    name: "Rock Coffee Brown Sugar",
    description:
      "Cold brew kopi kuat dengan caramel brown sugar yang menciptakan keseimbangan rasa sempurna.",
    price: 25000,
    category: "rock-coffee",
    emoji: "🧊",
    image:
      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&q=80",
    isPopular: true,
  },
  {
    id: "rc-3",
    name: "Rock Coffee Oat",
    description:
      "Cold brew kopi disajikan dengan oat milk yang creamy, pilihan sehat tanpa kompromi rasa.",
    price: 27000,
    category: "rock-coffee",
    emoji: "🌾",
    image:
      "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&q=80",
  },
  {
    id: "rc-4",
    name: "Rock Coffee Salted Caramel",
    description:
      "Cold brew kopi dengan salted caramel sauce yang menggugah, perpaduan manis dan gurih yang unik.",
    price: 28000,
    category: "rock-coffee",
    emoji: "🧂",
    image:
      "https://images.unsplash.com/photo-1591522811280-a8759970b03f?w=600&q=80",
  },
  // ── Non-Kopi ─────────────────────────────────────────────────────────────
  {
    id: "nk-1",
    name: "Matcha Latte",
    description:
      "Matcha premium dari Jepang dipadukan dengan susu segar yang creamy dan sedikit manis.",
    price: 28000,
    category: "non-kopi",
    emoji: "🍵",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
    isPopular: true,
  },
  {
    id: "nk-2",
    name: "Taro Latte",
    description:
      "Minuman taro ungu yang lembut dan creamy, favorit semua kalangan dengan rasa unik yang khas.",
    price: 28000,
    category: "non-kopi",
    emoji: "🟣",
    image:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&q=80",
  },
  {
    id: "nk-3",
    name: "Chocolate Latte",
    description:
      "Dark chocolate premium dicampur dengan susu hangat, tersedia panas atau dingin sesuai selera.",
    price: 22000,
    category: "non-kopi",
    emoji: "🍫",
    image:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",
  },
  {
    id: "nk-4",
    name: "Strawberry Milk",
    description:
      "Susu segar dengan puree strawberry asli, menyegarkan dengan aroma buah yang natural.",
    price: 25000,
    category: "non-kopi",
    emoji: "🍓",
    image:
      "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80",
  },
  // ── Snack ────────────────────────────────────────────────────────────────
  {
    id: "sn-1",
    name: "Croissant Butter",
    description:
      "Croissant premium dengan mentega pilihan, renyah di luar dan lembut di dalam.",
    price: 18000,
    category: "snack",
    emoji: "🥐",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
    isPopular: true,
  },
  {
    id: "sn-2",
    name: "Banana Bread",
    description:
      "Banana bread homemade dengan pisang matang pilihan, lembab dan harum sempurna.",
    price: 15000,
    category: "snack",
    emoji: "🍞",
    image:
      "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80",
  },
  {
    id: "sn-3",
    name: "Cookies & Cream",
    description:
      "Kukis dengan lapis cream vanilla, renyah dengan isian yang creamy dan manis.",
    price: 12000,
    category: "snack",
    emoji: "🍪",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80",
  },
  {
    id: "sn-4",
    name: "Cheese Toast",
    description:
      "Roti panggang dengan keju pilihan yang meleleh, cocok sebagai teman ngopi.",
    price: 20000,
    category: "snack",
    emoji: "🧀",
    image:
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=600&q=80",
  },
];

export const categoryLabels: Record<string, string> = {
  all: "Semua Menu",
  "kopi-susu": "Kopi Susu",
  "rock-coffee": "Rock Coffee",
  "non-kopi": "Non-Kopi",
  snack: "Snack",
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export const generateOrderNumber = (): string => {
  const prefix = "GC";
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  return `${prefix}-${timestamp}-${random}`;
};

// Helper to generate a date relative to now
const dAgo = (days: number, hours = 0): Date =>
  new Date(Date.now() - days * 86_400_000 - hours * 3_600_000);

// Mock orders for cashier dashboard
export const mockOrders = [
  {
    id: "ord-1",
    orderNumber: "GC-5421-07",
    items: [
      { item: menuItems[0], quantity: 2 },
      { item: menuItems[12], quantity: 1 },
    ],
    subtotal: 68000,
    orderType: "dine-in" as const,
    tableNumber: "5",
    customerName: "Budi Santoso",
    status: "pending" as const,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    notes: "Kurangi gula untuk salah satu kopi susunya",
  },
  {
    id: "ord-2",
    orderNumber: "GC-5420-03",
    items: [
      { item: menuItems[4], quantity: 1 },
      { item: menuItems[8], quantity: 1 },
    ],
    subtotal: 50000,
    orderType: "take-away" as const,
    customerName: "Siti Rahayu",
    status: "preparing" as const,
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: "ord-3",
    orderNumber: "GC-5419-11",
    items: [
      { item: menuItems[1], quantity: 3 },
      { item: menuItems[13], quantity: 2 },
    ],
    subtotal: 114000,
    orderType: "dine-in" as const,
    tableNumber: "3",
    customerName: "Rizki Pratama",
    status: "ready" as const,
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
  },
  // ── Today: completed ─────────────────────────────────────────────
  {
    id: "ord-4",
    orderNumber: "GC-5418-09",
    items: [{ item: menuItems[2], quantity: 1 }],
    subtotal: 27000,
    orderType: "take-away" as const,
    customerName: "Dewi Kusuma",
    status: "completed" as const,
    createdAt: dAgo(0, 0.6), // 35 min ago
  },
  {
    id: "ord-5",
    orderNumber: "GC-5417-02",
    items: [
      { item: menuItems[5], quantity: 2 },
      { item: menuItems[9], quantity: 1 },
      { item: menuItems[15], quantity: 2 },
    ],
    subtotal: 98000,
    orderType: "dine-in" as const,
    tableNumber: "8",
    customerName: "Andi Wijaya",
    status: "completed" as const,
    createdAt: dAgo(0, 1),
  },
  {
    id: "ord-6",
    orderNumber: "GC-5416-14",
    items: [
      { item: menuItems[0], quantity: 2 },
      { item: menuItems[8], quantity: 1 },
    ],
    subtotal: 78000,
    orderType: "dine-in" as const,
    tableNumber: "2",
    customerName: "Maya Sari",
    status: "completed" as const,
    createdAt: dAgo(0, 2),
  },
  {
    id: "ord-7",
    orderNumber: "GC-5415-05",
    items: [
      { item: menuItems[5], quantity: 1 },
      { item: menuItems[12], quantity: 2 },
    ],
    subtotal: 61000,
    orderType: "take-away" as const,
    customerName: "Farhan Ilyas",
    status: "completed" as const,
    createdAt: dAgo(0, 3.5),
  },
  {
    id: "ord-8",
    orderNumber: "GC-5414-11",
    items: [
      { item: menuItems[1], quantity: 2 },
      { item: menuItems[9], quantity: 1 },
      { item: menuItems[15], quantity: 1 },
    ],
    subtotal: 104000,
    orderType: "dine-in" as const,
    tableNumber: "6",
    customerName: "Laila Putri",
    status: "completed" as const,
    createdAt: dAgo(0, 5),
  },
  // ── Yesterday ────────────────────────────────────────────────────
  {
    id: "ord-9",
    orderNumber: "GC-5413-08",
    items: [
      { item: menuItems[6], quantity: 2 },
      { item: menuItems[13], quantity: 1 },
    ],
    subtotal: 69000,
    orderType: "take-away" as const,
    customerName: "Hendra Gunawan",
    status: "completed" as const,
    createdAt: dAgo(1, 2),
  },
  {
    id: "ord-10",
    orderNumber: "GC-5412-03",
    items: [{ item: menuItems[2], quantity: 3 }],
    subtotal: 81000,
    orderType: "dine-in" as const,
    tableNumber: "4",
    customerName: "Rina Wahyuni",
    status: "completed" as const,
    createdAt: dAgo(1, 4),
  },
  {
    id: "ord-11",
    orderNumber: "GC-5411-17",
    items: [
      { item: menuItems[8], quantity: 1 },
      { item: menuItems[10], quantity: 1 },
      { item: menuItems[14], quantity: 2 },
    ],
    subtotal: 74000,
    orderType: "dine-in" as const,
    tableNumber: "9",
    customerName: "Dian Permata",
    status: "completed" as const,
    createdAt: dAgo(1, 7),
  },
  // ── 2 days ago ───────────────────────────────────────────────────
  {
    id: "ord-12",
    orderNumber: "GC-5410-06",
    items: [
      { item: menuItems[3], quantity: 2 },
      { item: menuItems[11], quantity: 1 },
    ],
    subtotal: 81000,
    orderType: "take-away" as const,
    customerName: "Bagas Nugroho",
    status: "completed" as const,
    createdAt: dAgo(2, 1),
  },
  {
    id: "ord-13",
    orderNumber: "GC-5409-12",
    items: [
      { item: menuItems[5], quantity: 2 },
      { item: menuItems[15], quantity: 2 },
    ],
    subtotal: 90000,
    orderType: "dine-in" as const,
    tableNumber: "7",
    customerName: "Citra Dewi",
    status: "completed" as const,
    createdAt: dAgo(2, 5),
  },
  // ── 4 days ago ───────────────────────────────────────────────────
  {
    id: "ord-14",
    orderNumber: "GC-5408-09",
    items: [
      { item: menuItems[9], quantity: 2 },
      { item: menuItems[7], quantity: 1 },
    ],
    subtotal: 84000,
    orderType: "dine-in" as const,
    tableNumber: "1",
    customerName: "Wahyu Saputra",
    status: "completed" as const,
    createdAt: dAgo(4, 3),
  },
  {
    id: "ord-15",
    orderNumber: "GC-5407-04",
    items: [{ item: menuItems[0], quantity: 4 }],
    subtotal: 100000,
    orderType: "take-away" as const,
    customerName: "Nadia Rahma",
    status: "completed" as const,
    createdAt: dAgo(4, 6),
  },
  // ── 6 days ago ───────────────────────────────────────────────────
  {
    id: "ord-16",
    orderNumber: "GC-5406-15",
    items: [
      { item: menuItems[6], quantity: 1 },
      { item: menuItems[1], quantity: 1 },
      { item: menuItems[12], quantity: 2 },
    ],
    subtotal: 91000,
    orderType: "dine-in" as const,
    tableNumber: "3",
    customerName: "Kevin Santoso",
    status: "completed" as const,
    createdAt: dAgo(6, 2),
  },
  // ── 8 days ago (last week, this month) ───────────────────────────
  {
    id: "ord-17",
    orderNumber: "GC-5405-07",
    items: [
      { item: menuItems[8], quantity: 2 },
      { item: menuItems[4], quantity: 1 },
    ],
    subtotal: 78000,
    orderType: "take-away" as const,
    customerName: "Sari Indah",
    status: "completed" as const,
    createdAt: dAgo(8, 1),
  },
  {
    id: "ord-18",
    orderNumber: "GC-5404-10",
    items: [
      { item: menuItems[2], quantity: 2 },
      { item: menuItems[10], quantity: 1 },
    ],
    subtotal: 76000,
    orderType: "dine-in" as const,
    tableNumber: "5",
    customerName: "Agus Hermawan",
    status: "completed" as const,
    createdAt: dAgo(8, 4),
  },
  // ── 12 days ago (this month) ─────────────────────────────────────
  {
    id: "ord-19",
    orderNumber: "GC-5403-02",
    items: [
      { item: menuItems[3], quantity: 3 },
      { item: menuItems[13], quantity: 2 },
    ],
    subtotal: 114000,
    orderType: "dine-in" as const,
    tableNumber: "10",
    customerName: "Fitri Handayani",
    status: "completed" as const,
    createdAt: dAgo(12, 3),
  },
  // ── 18 days ago (this month) ─────────────────────────────────────
  {
    id: "ord-20",
    orderNumber: "GC-5402-13",
    items: [
      { item: menuItems[5], quantity: 2 },
      { item: menuItems[9], quantity: 2 },
    ],
    subtotal: 106000,
    orderType: "take-away" as const,
    customerName: "Rizal Fauzi",
    status: "completed" as const,
    createdAt: dAgo(18, 2),
  },
  // ── 22 days ago (this month) ─────────────────────────────────────
  {
    id: "ord-21",
    orderNumber: "GC-5401-08",
    items: [
      { item: menuItems[0], quantity: 2 },
      { item: menuItems[4], quantity: 2 },
      { item: menuItems[14], quantity: 3 },
    ],
    subtotal: 130000,
    orderType: "dine-in" as const,
    tableNumber: "2",
    customerName: "Yuni Astuti",
    status: "completed" as const,
    createdAt: dAgo(22, 5),
  },
];
