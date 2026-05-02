"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Coffee,
  RefreshCw,
  Clock,
  CheckCircle,
  ChefHat,
  Bell,
  LogOut,
  ShoppingBag,
  TrendingUp,
  Banknote,
  CalendarDays,
  Package,
  ReceiptText,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
type RevenuePeriod = "today" | "week" | "month" | "custom";

type ApiOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  orderType: "dine-in" | "take-away";
  tableNumber?: string | null;
  status: "pending" | "preparing" | "ready" | "completed";
  subtotal: number;
  notes?: string | null;
  createdAt: string;
  items: {
    id: string;
    name: string;
    emoji: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
};

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig: Record<
  ApiOrder["status"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Menunggu",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: <Clock className="h-3 w-3" />,
  },
  preparing: {
    label: "Diproses",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: <ChefHat className="h-3 w-3" />,
  },
  ready: {
    label: "Siap",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: <Bell className="h-3 w-3" />,
  },
  completed: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-600 border-gray-300",
    icon: <CheckCircle className="h-3 w-3" />,
  },
};

const nextStatus: Record<ApiOrder["status"], ApiOrder["status"] | null> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
  completed: null,
};
const nextStatusLabel: Record<ApiOrder["status"], string | null> = {
  pending: "Mulai Proses",
  preparing: "Tandai Siap",
  ready: "Selesaikan",
  completed: null,
};

const periodLabels: Record<RevenuePeriod, string> = {
  today: "Hari Ini",
  week: "Minggu Ini",
  month: "Bulan Ini",
  custom: "Tanggal Tertentu",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
  return `${Math.floor(diff / 3600)} jam lalu`;
}

function sameDay(a: string, b: Date): boolean {
  const da = new Date(a);
  return (
    da.getFullYear() === b.getFullYear() &&
    da.getMonth() === b.getMonth() &&
    da.getDate() === b.getDate()
  );
}
function getWeekStart(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
  date.setHours(0, 0, 0, 0);
  return date;
}
function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function filterByPeriod(
  orders: ApiOrder[],
  period: RevenuePeriod,
  customDate: string,
): ApiOrder[] {
  const now = new Date();
  return orders.filter((o) => {
    const d = new Date(o.createdAt);
    if (period === "today") return sameDay(o.createdAt, now);
    if (period === "week") {
      const ws = getWeekStart(now);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 7);
      return d >= ws && d < we;
    }
    if (period === "month")
      return (
        d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      );
    if (period === "custom")
      return customDate
        ? sameDay(o.createdAt, new Date(customDate + "T12:00:00"))
        : sameDay(o.createdAt, now);
    return false;
  });
}

// ── OrderCard ─────────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onStatusChange,
  updating,
}: {
  order: ApiOrder;
  onStatusChange: (id: string, s: ApiOrder["status"]) => void;
  updating: boolean;
}) {
  const next = nextStatus[order.status];
  const nextLabel = nextStatusLabel[order.status];
  const cfg = statusConfig[order.status];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-black text-lg text-primary">
              {order.orderNumber}
            </p>
            <p
              className="text-xs text-muted-foreground"
              suppressHydrationWarning
            >
              {order.customerName} ·{" "}
              {order.orderType === "dine-in"
                ? `Meja ${order.tableNumber}`
                : "Take-away"}{" "}
              · {timeAgo(order.createdAt)}
            </p>
          </div>
          <Badge
            className={`${cfg.color} border flex items-center gap-1 text-xs shrink-0`}
          >
            {cfg.icon} {cfg.label}
          </Badge>
        </div>

        <Separator className="mb-3" />

        <div className="space-y-1.5 mb-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.emoji} {item.name} ×{item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {order.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 mb-3">
            📝 {order.notes}
          </div>
        )}

        <Separator className="mb-3" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total Tagihan</p>
            <p className="font-bold text-base text-primary">
              {formatPrice(order.subtotal)}
            </p>
          </div>
          {next && nextLabel && (
            <Button
              size="sm"
              onClick={() => onStatusChange(order.id, next)}
              disabled={updating}
              className="gap-1.5"
            >
              {statusConfig[next].icon} {nextLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CashierDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>("today");
  const [customDate, setCustomDate] = useState<string>("");

  // Fetch all orders from API
  const fetchOrders = useCallback(
    async (silent = false) => {
      if (!silent) setIsRefreshing(true);
      try {
        const res = await fetch("/api/orders");
        if (res.status === 401 || res.status === 403) {
          router.push("/cashier/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data: ApiOrder[] = await res.json();
        setOrders(data);
        setLastRefresh(new Date());
      } catch {
        if (!silent) toast.error("Gagal memuat data pesanan");
      } finally {
        setIsRefreshing(false);
        setIsLoading(false);
      }
    },
    [router],
  );

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    setCustomDate(getTodayString());
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 30_000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Status update
  const handleStatusChange = useCallback(
    async (id: string, status: ApiOrder["status"]) => {
      setUpdatingId(id);
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      try {
        const res = await fetch(`/api/orders/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error();
        const labels: Record<ApiOrder["status"], string> = {
          pending: "Menunggu",
          preparing: "Sedang diproses",
          ready: "Siap diambil",
          completed: "Selesai",
        };
        toast.success(`Status diperbarui → ${labels[status]}`);
      } catch {
        // Revert on error
        await fetchOrders(true);
        toast.error("Gagal memperbarui status");
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchOrders],
  );

  const handleLogout = async () => {
    await signOut({
      fetchOptions: { onSuccess: () => router.push("/cashier/login") },
    });
  };

  // Derived data
  const activeOrders = useMemo(
    () =>
      orders.filter((o) =>
        ["pending", "preparing", "ready"].includes(o.status),
      ),
    [orders],
  );
  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "completed"),
    [orders],
  );
  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === "pending").length,
    [orders],
  );

  const todayOrders = useMemo(
    () => filterByPeriod(completedOrders, "today", ""),
    [completedOrders],
  );
  const todayRevenue = useMemo(
    () => todayOrders.reduce((s, o) => s + o.subtotal, 0),
    [todayOrders],
  );

  const filteredCompleted = useMemo(
    () => filterByPeriod(completedOrders, revenuePeriod, customDate),
    [completedOrders, revenuePeriod, customDate],
  );
  const filteredRevenue = useMemo(
    () => filteredCompleted.reduce((s, o) => s + o.subtotal, 0),
    [filteredCompleted],
  );
  const avgPerOrder = useMemo(
    () =>
      filteredCompleted.length > 0
        ? Math.round(filteredRevenue / filteredCompleted.length)
        : 0,
    [filteredRevenue, filteredCompleted],
  );

  const activePeriodLabel = useMemo(() => {
    if (revenuePeriod === "custom" && customDate) {
      return new Date(customDate + "T12:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return periodLabels[revenuePeriod];
  }, [revenuePeriod, customDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary/20">
        <div className="bg-primary h-14" />
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Coffee className="h-5 w-5 shrink-0" />
            <span className="font-bold text-base truncate">
              Greeting.co — Dashboard Kasir
            </span>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400 border-yellow-400 shrink-0">
                {pendingCount} baru
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 text-sm">
            {session?.user?.name && (
              <span className="hidden md:inline text-primary-foreground/70 text-xs mr-2">
                👤 {session.user.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => fetchOrders()}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-primary-foreground hover:bg-primary-foreground/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Row */}
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2"
          suppressHydrationWarning
        >
          {[
            {
              label: "Menunggu",
              value: orders.filter((o) => o.status === "pending").length,
              icon: <Clock className="h-5 w-5" />,
              color: "text-yellow-600",
              isPrice: false,
            },
            {
              label: "Diproses",
              value: orders.filter((o) => o.status === "preparing").length,
              icon: <ChefHat className="h-5 w-5" />,
              color: "text-blue-600",
              isPrice: false,
            },
            {
              label: "Siap Ambil",
              value: orders.filter((o) => o.status === "ready").length,
              icon: <Bell className="h-5 w-5" />,
              color: "text-green-600",
              isPrice: false,
            },
            {
              label: "Selesai Hari Ini",
              value: todayOrders.length,
              icon: <CheckCircle className="h-5 w-5" />,
              color: "text-muted-foreground",
              isPrice: false,
            },
            {
              label: "Pendapatan Hari Ini",
              value: todayRevenue,
              icon: <Banknote className="h-5 w-5" />,
              color: "text-primary",
              isPrice: true,
            },
          ].map((stat) => (
            <Card key={stat.label} suppressHydrationWarning>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`${stat.color} shrink-0`}>{stat.icon}</div>
                <div className="min-w-0">
                  <p
                    className={`font-bold leading-tight ${stat.isPrice ? "text-sm" : "text-2xl"}`}
                    suppressHydrationWarning
                  >
                    {stat.isPrice ? formatPrice(stat.value) : stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {stat.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p
          className="text-xs text-muted-foreground mb-5"
          suppressHydrationWarning
        >
          Terakhir diperbarui:{" "}
          {lastRefresh ? lastRefresh.toLocaleTimeString("id-ID") : "--:--:--"} ·
          Auto-refresh setiap 30 detik
        </p>

        {/* Tabs */}
        <Tabs defaultValue="active">
          <TabsList className="mb-5">
            <TabsTrigger value="active" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Pesanan Aktif
              {activeOrders.length > 0 && (
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeOrders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="revenue" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Laporan &amp; Selesai
            </TabsTrigger>
          </TabsList>

          {/* Active Orders */}
          <TabsContent value="active">
            {activeOrders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-5xl mb-4">☕</div>
                <p className="font-medium">Tidak ada pesanan aktif saat ini</p>
                <p className="text-sm mt-1">
                  Pesanan baru akan muncul di sini secara otomatis
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {activeOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    updating={updatingId === order.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Revenue + Completed */}
          <TabsContent value="revenue">
            {/* Period filter */}
            <Card className="mb-5">
              <CardHeader className="pb-3 pt-4 px-5">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Filter Periode Pendapatan
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(
                    ["today", "week", "month", "custom"] as RevenuePeriod[]
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setRevenuePeriod(p)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                        revenuePeriod === p
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                      }`}
                    >
                      {periodLabels[p]}
                    </button>
                  ))}
                </div>
                {revenuePeriod === "custom" && (
                  <div className="flex items-center gap-2 pt-1">
                    <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      type="date"
                      value={customDate}
                      max={getTodayString()}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="max-w-xs h-9 text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Revenue summary */}
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
              suppressHydrationWarning
            >
              <Card className="sm:col-span-1 border-2 border-primary/25 bg-primary/5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <Banknote className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Total Pendapatan
                    </p>
                    <p
                      className="text-xl font-black text-primary leading-tight"
                      suppressHydrationWarning
                    >
                      {formatPrice(filteredRevenue)}
                    </p>
                    <p
                      className="text-xs text-muted-foreground mt-0.5"
                      suppressHydrationWarning
                    >
                      {activePeriodLabel}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Pesanan Selesai
                    </p>
                    <p
                      className="text-xl font-black leading-tight"
                      suppressHydrationWarning
                    >
                      {filteredCompleted.length}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        pesanan
                      </span>
                    </p>
                    <p
                      className="text-xs text-muted-foreground mt-0.5"
                      suppressHydrationWarning
                    >
                      {activePeriodLabel}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <ReceiptText className="h-6 w-6 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Rata-rata / Pesanan
                    </p>
                    <p
                      className="text-xl font-black leading-tight"
                      suppressHydrationWarning
                    >
                      {filteredCompleted.length > 0
                        ? formatPrice(avgPerOrder)
                        : "—"}
                    </p>
                    <p
                      className="text-xs text-muted-foreground mt-0.5"
                      suppressHydrationWarning
                    >
                      {activePeriodLabel}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <Separator className="flex-1" />
              <span
                className="text-xs text-muted-foreground font-medium shrink-0"
                suppressHydrationWarning
              >
                Riwayat Pesanan · {activePeriodLabel}
              </span>
              <Separator className="flex-1" />
            </div>

            {filteredCompleted.length === 0 ? (
              <div className="text-center py-14 text-muted-foreground">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-medium">Tidak ada pesanan selesai</p>
                <p className="text-sm mt-1" suppressHydrationWarning>
                  untuk periode{" "}
                  <span className="font-semibold">{activePeriodLabel}</span>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCompleted.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    updating={updatingId === order.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
