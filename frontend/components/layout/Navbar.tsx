"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Coffee, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/reservation", label: "Reservasi" },
];

export default function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCashierRoute = pathname.startsWith("/cashier");

  if (isCashierRoute) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary"
        >
          <Coffee className="h-6 w-6" />
          <span>Greeting.co</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Keranjang</span>
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-bold text-xl text-primary mb-4"
                >
                  <Coffee className="h-6 w-6" />
                  <span>Greeting.co</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-base font-medium py-2 border-b border-border transition-colors hover:text-primary",
                      pathname === link.href
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/cart" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full mt-2 gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Keranjang
                    {totalItems > 0 && (
                      <Badge variant="secondary">{totalItems}</Badge>
                    )}
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
