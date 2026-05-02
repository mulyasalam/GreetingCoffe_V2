import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { orders, orderItems, menuItems } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc, inArray } from "drizzle-orm";

function generateOrderNumber(): string {
  const ts = Date.now().toString().slice(-4);
  const rnd = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `GC-${ts}-${rnd}`;
}

// ── GET /api/orders — cashier only ──────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status"); // "active" | "completed" | null

    const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));

    // Filter by status group
    const filtered =
      statusFilter === "active"
        ? rows.filter((o) => ["pending", "preparing", "ready"].includes(o.status))
        : statusFilter === "completed"
        ? rows.filter((o) => o.status === "completed")
        : rows;

    // Attach order items
    if (filtered.length === 0) return NextResponse.json([]);

    const orderIds = filtered.map((o) => o.id);
    const items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));

    const itemsByOrder = items.reduce<Record<string, typeof items>>(
      (acc, item) => {
        if (!acc[item.orderId]) acc[item.orderId] = [];
        acc[item.orderId].push(item);
        return acc;
      },
      {}
    );

    const result = filtered.map((o) => ({
      ...o,
      items: itemsByOrder[o.id] ?? [],
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/orders]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/orders — public (place a new order) ──────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    const body = await request.json() as {
      items: { menuItemId: string; quantity: number }[];
      customerName: string;
      orderType: "dine-in" | "take-away";
      tableNumber?: string;
      notes?: string;
    };

    const { items: cartItems, customerName, orderType, tableNumber, notes } = body;

    // Validate required fields
    if (!cartItems?.length || !customerName?.trim() || !orderType) {
      return NextResponse.json(
        { error: "items, customerName, and orderType are required" },
        { status: 400 }
      );
    }
    if (orderType === "dine-in" && !tableNumber?.trim()) {
      return NextResponse.json(
        { error: "tableNumber is required for dine-in orders" },
        { status: 400 }
      );
    }

    // Fetch menu items to snapshot prices
    const menuItemIds = cartItems.map((i) => i.menuItemId);
    const dbItems = await db
      .select()
      .from(menuItems)
      .where(inArray(menuItems.id, menuItemIds));

    const dbItemMap = new Map(dbItems.map((i) => [i.id, i]));

    // Validate all items exist and are available
    for (const ci of cartItems) {
      const dbItem = dbItemMap.get(ci.menuItemId);
      if (!dbItem) {
        return NextResponse.json(
          { error: `Menu item ${ci.menuItemId} not found` },
          { status: 400 }
        );
      }
      if (!dbItem.isAvailable) {
        return NextResponse.json(
          { error: `${dbItem.name} is currently unavailable` },
          { status: 400 }
        );
      }
    }

    const subtotal = cartItems.reduce((sum, ci) => {
      const item = dbItemMap.get(ci.menuItemId)!;
      return sum + item.price * ci.quantity;
    }, 0);

    const orderId = crypto.randomUUID();
    const orderNumber = generateOrderNumber();

    // Insert order + order items in a transaction
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: orderId,
        orderNumber,
        userId: session?.user.id ?? null,
        customerName: customerName.trim(),
        orderType,
        tableNumber: tableNumber?.trim() ?? null,
        status: "pending",
        notes: notes?.trim() ?? null,
        subtotal,
      });

      await tx.insert(orderItems).values(
        cartItems.map((ci) => {
          const item = dbItemMap.get(ci.menuItemId)!;
          return {
            id: crypto.randomUUID(),
            orderId,
            menuItemId: ci.menuItemId,
            name: item.name,
            emoji: item.emoji,
            price: item.price,
            quantity: ci.quantity,
            subtotal: item.price * ci.quantity,
          };
        })
      );
    });

    return NextResponse.json(
      { id: orderId, orderNumber, subtotal },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
