import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

/**
 * POST /api/setup
 * Headers: { "x-setup-secret": process.env.SETUP_SECRET }
 *
 * Creates kasir@greeting.co with password Kasir123! and promotes to admin role.
 * Only works once (idempotent).
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-setup-secret");
  if (!secret || secret !== process.env.SETUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, "kasir@greeting.co"))
      .limit(1);

    if (existing.length === 0) {
      // Register via Better Auth
      await auth.api.signUpEmail({
        body: {
          email: "kasir@greeting.co",
          password: "Kasir123!",
          name: "Kasir Greeting.co",
        },
      });
    }

    // Promote to admin role
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.email, "kasir@greeting.co"));

    return NextResponse.json({
      message: "Admin account ready",
      email: "kasir@greeting.co",
      password: "Kasir123!",
    });
  } catch (err) {
    console.error("[POST /api/setup]", err);
    return NextResponse.json({ error: "Setup failed", detail: String(err) }, { status: 500 });
  }
}
