"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface FeaturedMenuCardProps {
  item: MenuItem;
  rank: number;
}

export function FeaturedMenuCard({ item, rank }: FeaturedMenuCardProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!item.image && !imgError;

  return (
    <Link href="/menu">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer h-full">
        {/* Photo / emoji */}
        <div className="relative h-40 overflow-hidden bg-secondary">
          {showImage ? (
            <>
              <Image
                src={item.image!}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/30 to-transparent" />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-5xl select-none group-hover:scale-110 transition-transform duration-300">
              {item.emoji}
            </div>
          )}

          {/* Rank badge */}
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-bold shadow-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            #{rank}
          </div>

          {/* Emoji pill (only when photo shown) */}
          {showImage && (
            <div className="absolute bottom-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-base shadow-sm select-none">
              {item.emoji}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold leading-snug mb-1">{item.name}</h3>
          <p className="font-black text-primary text-lg">{formatPrice(item.price)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
