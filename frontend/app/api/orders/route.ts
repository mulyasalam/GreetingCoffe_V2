import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { orders, orderItems, menuItems as menuItemsTable } from "@/lib/db/schema";
import { menuItems as fallbackMenuItems } from "@/lib/mock-data";
import { auth } from "@/lib/auth";
import { desc, inArray } from "drizzle-orm";

function generateOrderNumber(): string {
  const ts = Date.now().toString().slice(-4);
  const rnd = Math.floor(Math.random() * 100).toString().padStart(2, "0");
  return `GC-${ts}-${rnd}`;
}

type ResolvedMenuItem = {
  id: string;
  name: string;
  emoji: string;
  price: number;
  isAvailable: boolean;
};

function mapOrderError(err: unknown): { status: number; error: string } {
  const directCode =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as { code?: unknown }).code)
      : "";
  const causeCode =
    typeof err === "object" && err !== null && "cause" in err
      ? String(
          ((err as { cause?: { code?: unknown } }).cause?.code as unknown) ?? "",
        )
      : "";
  const code = directCode || causeCode;
  const message = err instanceof Error ? err.message : String(err);

  if (code === "42P01") {
    return {
      status: 503,
      error: "Database schema belum siap. Jalankan `npm run db:push` terlebih dahulu.",
    };
  }

  if (
    code === "ECONNREFUSED" ||
    message.includes("ECONNREFUSED") ||
    message.includes("connect")
  ) {
    return {
      status: 503,
      error: "Database belum bisa diakses. Pastikan PostgreSQL sudah berjalan.",
    };
  }

  return { status: 500, error: "Internal server error" };
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
    const menuItemIds = [...new Set(cartItems.map((i) => i.menuItemId))];
    let dbItems: typeof menuItemsTable.$inferSelect[] = [];
    try {
      dbItems = await db
        .select()
        .from(menuItemsTable)
        .where(inArray(menuItemsTable.id, menuItemIds));
    } catch (err) {
      console.warn("[POST /api/orders] menu lookup failed, using fallback catalog", err);
    }

    const dbItemMap = new Map<string, ResolvedMenuItem>(
      dbItems.map((item) => [
        item.id,
        {
          id: item.id,
          name: item.name,
          emoji: item.emoji,
          price: item.price,
          isAvailable: item.isAvailable,
        },
      ]),
    );
    const fallbackItemMap = new Map<string, ResolvedMenuItem>(
      fallbackMenuItems.map((item) => [
        item.id,
        {
          id: item.id,
          name: item.name,
          emoji: item.emoji,
          price: item.price,
          isAvailable: true,
        },
      ]),
    );
    const resolvedItemMap = new Map<string, ResolvedMenuItem>();

    // Validate all items exist and are available
    for (const ci of cartItems) {
      const dbItem = dbItemMap.get(ci.menuItemId);
      const item = dbItem ?? fallbackItemMap.get(ci.menuItemId);
      if (!item) {
        return NextResponse.json(
          { error: `Menu item ${ci.menuItemId} not found` },
          { status: 400 }
        );
      }
      if (dbItem && !dbItem.isAvailable) {
        return NextResponse.json(
          { error: `${dbItem.name} is currently unavailable` },
          { status: 400 }
        );
      }
      resolvedItemMap.set(ci.menuItemId, item);
    }

    const subtotal = cartItems.reduce((sum, ci) => {
      const item = resolvedItemMap.get(ci.menuItemId)!;
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
          const item = resolvedItemMap.get(ci.menuItemId)!;
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
    const mapped = mapOrderError(err);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
