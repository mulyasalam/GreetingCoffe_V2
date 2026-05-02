"use client";

import Image from "next/image";
import { useState } from "react";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";
import { useCartStore } from "@/lib/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface MenuCardProps {
  item: MenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const cartItem = items.find((ci) => ci.item.id === item.id);
  const quantity = cartItem?.quantity ?? 0;
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    addItem(item);
    toast.success(`${item.name} ditambahkan ke keranjang`, { duration: 1500 });
  };

  const handleDecrease = () => {
    if (quantity === 1) removeItem(item.id);
    else updateQuantity(item.id, quantity - 1);
  };

  const showImage = !!item.image && !imgError;

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group">
      {/* ── Photo / Emoji banner ── */}
      <div className="relative h-44 overflow-hidden bg-secondary shrink-0">
        {showImage ? (
          <>
            <Image
              src={item.image!}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImgError(true)}
            />
            {/* dark gradient at bottom for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          /* Emoji fallback */
          <div className="h-full flex items-center justify-center text-6xl select-none group-hover:scale-110 transition-transform duration-300">
            {item.emoji}
          </div>
        )}

        {/* Emoji badge — top-left (only when photo is shown) */}
        {showImage && (
          <div className="absolute top-2.5 left-2.5 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-lg shadow-md select-none z-10">
            {item.emoji}
          </div>
        )}

        {/* Popular badge — top-right */}
        {item.isPopular && (
          <div className="absolute top-2.5 right-2.5 z-10">
            <Badge className="bg-accent text-accent-foreground text-xs px-2 py-0.5 shadow-md border-0">
              ⭐ Populer
            </Badge>
          </div>
        )}

        {/* Cart count pill — bottom-right (when in cart) */}
        {quantity > 0 && (
          <div className="absolute bottom-2 right-2 z-10 bg-primary text-primary-foreground text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-md">
            {quantity}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <CardContent className="flex-1 p-4 pb-2">
        <h3 className="font-bold leading-snug mb-1">{item.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {item.description}
        </p>
        <p className="font-black text-primary text-lg">
          {formatPrice(item.price)}
        </p>
      </CardContent>

      {/* ── Cart controls ── */}
      <CardFooter className="px-4 pb-4 pt-2">
        {quantity === 0 ? (
          <Button onClick={handleAdd} className="w-full gap-2" size="sm">
            <ShoppingCart className="h-4 w-4" />
            Tambah ke Keranjang
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              onClick={handleDecrease}
              variant="outline"
              size="icon"
              className="h-9 w-9"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="font-black text-base min-w-[2.5rem] text-center tabular-nums">
              {quantity}
            </span>
            <Button onClick={handleAdd} size="icon" className="h-9 w-9">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
