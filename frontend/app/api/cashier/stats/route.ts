import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

function startOf(period: string, customDate?: string | null): Date {
  const now = new Date();
  if (period === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === "week") {
    const day = now.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(now);
    mon.setDate(now.getDate() + diff);
    mon.setHours(0, 0, 0, 0);
    return mon;
  }
  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (period === "custom" && customDate) {
    return new Date(customDate + "T00:00:00");
  }
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function endOf(period: string, customDate?: string | null): Date {
  if (period === "custom" && customDate) {
    const d = new Date(customDate + "T23:59:59.999");
    return d;
  }
  return new Date(Date.now() + 1000); // effectively "now"
}

// ── GET /api/cashier/stats — cashier only ───────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "today"; // today | week | month | custom
    const customDate = searchParams.get("date");

    const from = startOf(period, customDate);
    const to = endOf(period, customDate);

    const completedOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.status, "completed"));

    const filtered = completedOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= from && d <= to;
    });

    const totalRevenue = filtered.reduce((sum, o) => sum + o.subtotal, 0);
    const orderCount = filtered.length;
    const avgPerOrder = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

    // Count active orders for quick stats
    const allOrders = await db.select().from(orders);
    const pendingCount = allOrders.filter((o) => o.status === "pending").length;
    const preparingCount = allOrders.filter((o) => o.status === "preparing").length;
    const readyCount = allOrders.filter((o) => o.status === "ready").length;

    return NextResponse.json({
      period,
      from: from.toISOString(),
      to: to.toISOString(),
      totalRevenue,
      orderCount,
      avgPerOrder,
      pendingCount,
      preparingCount,
      readyCount,
    });
  } catch (err) {
    console.error("[GET /api/cashier/stats]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
