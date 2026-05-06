"use client";

import { useState, useMemo, useEffect } from "react";
import { Category } from "@/lib/types";
import MenuCard from "@/components/menu/MenuCard";
import CategoryFilter from "@/components/menu/CategoryFilter";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

type ApiMenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, "all">;
  emoji: string;
  image?: string;
  isPopular?: boolean;
  isAvailable?: boolean;
};

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [menu, setMenu] = useState<ApiMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { getTotalItems, getSubtotal } = useCartStore();
  const totalItems = getTotalItems();
  const subtotal = getSubtotal();

  useEffect(() => {
    let isCancelled = false;

    const loadMenu = async () => {
      try {
        setLoadError(false);
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error("Failed to fetch menu");
        const data = (await res.json()) as ApiMenuItem[];
        if (!isCancelled) {
          setMenu(
            data.filter(
              (item) => item.isAvailable === undefined || item.isAvailable,
            ),
          );
        }
      } catch {
        if (!isCancelled) setLoadError(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadMenu();

    return () => {
      isCancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return menu;
    return menu.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, menu]);

  return (
    <div className="container mx-auto px-4 py-8 pb-28 md:pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-1">Menu Kami</h1>
        <p className="text-muted-foreground">
          Pilih minuman dan makanan favoritmu, kami siapkan dengan cinta ☕
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
      </div>

      {isLoading && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">⏳</p>
          <p>Memuat menu...</p>
        </div>
      )}

      {loadError && !isLoading && (
        <div className="text-center py-16 text-destructive">
          <p className="text-4xl mb-3">⚠️</p>
          <p>Gagal memuat menu. Silakan refresh halaman.</p>
        </div>
      )}

      {/* Menu Grid */}
      {!isLoading && !loadError && filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : !isLoading && !loadError ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-5xl mb-4">🔍</p>
          <p>Tidak ada menu untuk kategori ini.</p>
        </div>
      ) : null}

      {/* Floating Cart Bar (mobile + desktop) */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border md:hidden z-40">
          <Link href="/cart">
            <Button className="w-full gap-3 h-12 text-base">
              <ShoppingCart className="h-5 w-5" />
              <span>Lihat Keranjang</span>
              <Badge variant="secondary" className="ml-auto">
                {totalItems} item · {formatPrice(subtotal)}
              </Badge>
            </Button>
          </Link>
        </div>
      )}

      {/* Desktop Cart CTA */}
      {totalItems > 0 && (
        <div className="hidden md:block mt-8 p-4 bg-secondary rounded-xl border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{totalItems} item di keranjang</p>
              <p className="text-muted-foreground text-sm">
                Subtotal: <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </p>
            </div>
            <Link href="/cart">
              <Button className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Lihat Keranjang
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
