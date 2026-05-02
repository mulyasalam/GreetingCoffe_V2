import { NextRequest, NextResponse } from "next/server";

interface SessionUser {
  id: string;
  role: string;
  email: string;
  name: string;
}
interface Session {
  user: SessionUser;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect cashier routes (not login page)
  if (pathname === "/cashier/login") return NextResponse.next();

  try {
    const res = await fetch(
      new URL("/api/auth/get-session", request.nextUrl.origin),
      {
        headers: { cookie: request.headers.get("cookie") ?? "" },
      },
    );

    if (!res.ok) {
      return NextResponse.redirect(new URL("/cashier/login", request.url));
    }

    const session: Session | null = await res.json().catch(() => null);

    if (!session || session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/cashier/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/cashier/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cashier", "/cashier/:path+"],
};
