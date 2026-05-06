import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { menuItems as menuItemsTable } from "@/lib/db/schema";
import { menuItems as fallbackMenuItems } from "@/lib/mock-data";
import { eq, asc } from "drizzle-orm";

const imageById = new Map(
  fallbackMenuItems.map((item) => [item.id, item.image ?? null]),
);

const fallbackMenuResponse = fallbackMenuItems.map((item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: item.category,
  emoji: item.emoji,
  image: item.image,
  isPopular: item.isPopular ?? false,
  isAvailable: true,
}));

export async function GET() {
  try {
    const items = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.isAvailable, true))
      .orderBy(asc(menuItemsTable.category), asc(menuItemsTable.name));

    if (items.length === 0) {
      return NextResponse.json(fallbackMenuResponse, {
        headers: { "x-menu-source": "fallback" },
      });
    }

    return NextResponse.json(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        emoji: item.emoji,
        image: imageById.get(item.id) ?? undefined,
        isPopular: item.isPopular,
        isAvailable: item.isAvailable,
      })),
    );
  } catch (err) {
    console.error("[GET /api/menu]", err);
    return NextResponse.json(fallbackMenuResponse, {
      headers: { "x-menu-source": "fallback" },
    });
  }
}
