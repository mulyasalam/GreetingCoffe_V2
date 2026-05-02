import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { menuItems } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.isAvailable, true))
      .orderBy(asc(menuItems.category), asc(menuItems.name));

    return NextResponse.json(items);
  } catch (err) {
    console.error("[GET /api/menu]", err);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}
