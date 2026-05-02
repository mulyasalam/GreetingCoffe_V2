import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { desc } from "drizzle-orm";

// ── GET /api/reservations — cashier only ────────────────────────────────────
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const rows = await db
      .select()
      .from(reservations)
      .orderBy(desc(reservations.createdAt));

    return NextResponse.json(rows);
  } catch (err) {
    console.error("[GET /api/reservations]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── POST /api/reservations — public ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    const body = (await request.json()) as {
      name: string;
      email: string;
      phone: string;
      date: string;
      time: string;
      guests: number;
      notes?: string;
    };

    const { name, email, phone, date, time, guests, notes } = body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: "name, email, phone, date, time, and guests are required" },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const reservationDate = new Date(date + "T" + time + ":00");
    if (reservationDate < new Date()) {
      return NextResponse.json(
        { error: "Reservation date/time cannot be in the past" },
        { status: 400 }
      );
    }

    const id = `RSV-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 100).toString().padStart(2, "0")}`;

    const [row] = await db
      .insert(reservations)
      .values({
        id,
        userId: session?.user.id ?? null,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        date,
        time,
        guests: Number(guests),
        notes: notes?.trim() ?? null,
        status: "pending",
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    console.error("[POST /api/reservations]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
