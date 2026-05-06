import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

// ── PATCH /api/reservations/[id] — cashier only (update reservation status) ──
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { status } = (await request.json()) as { status: string };

    const allowed = ["pending", "confirmed", "cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(reservations)
      .set({ status, updatedAt: new Date() })
      .where(eq(reservations.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/reservations/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
