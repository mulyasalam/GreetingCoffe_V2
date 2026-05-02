"use client";

import { use, useEffect, useState } from "react";
import { formatPrice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Coffee, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

type ApiOrder = {
  id: string;
  orderNumber: string;
  status: "pending" | "preparing" | "ready" | "completed";
  orderType: "dine-in" | "take-away";
  tableNumber?: string | null;
  customerName: string;
  subtotal: number;
  notes?: string | null;
  createdAt: string;
  items: {
    id: string;
    name: string;
    emoji: string;
    price: number;
    quantity: number;
    subtotal: number;
  }[];
};

const statusLabels: Record<ApiOrder["status"], string> = {
  pending: "Menunggu Konfirmasi",
  preparing: "Sedang Diproses",
  ready: "Siap Diambil",
  completed: "Selesai",
};
const statusColors: Record<ApiOrder["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) {
          setNotFound(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setOrder(data);
          setLoading(false);
        }
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-lg space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">❓</div>
        <h2 className="text-xl font-bold mb-2">Pesanan tidak ditemukan</h2>
        <p className="text-muted-foreground mb-6">
          Nomor pesanan tidak valid atau sudah kadaluarsa.
        </p>
        <Link href="/menu">
          <Button>Kembali ke Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Pesanan Terkirim! 🎉</h1>
        <p className="text-muted-foreground text-sm">
          Pesananmu sudah masuk ke kasir. Segera datang dan tunjukkan nomor
          pesanan di bawah.
        </p>
      </div>

      {/* Order Number */}
      <Card className="mb-4 border-2 border-primary/30 bg-primary/5">
        <CardContent className="py-6 text-center">
          <p className="text-xs font-bold tracking-widest text-muted-foreground mb-2">
            NOMOR PESANAN
          </p>
          <p className="text-4xl font-black text-primary tracking-wider mb-2">
            {order.orderNumber}
          </p>
          <Badge className={`${statusColors[order.status]} border text-xs`}>
            {statusLabels[order.status]}
          </Badge>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Coffee className="h-4 w-4" />
            Detail Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tipe</span>
            <span className="font-medium">
              {order.orderType === "dine-in"
                ? `🍽️ Dine-in — Meja ${order.tableNumber}`
                : "🥡 Take-away"}
            </span>
          </div>
          {order.customerName && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nama</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
          )}
          <Separator />
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.emoji} {item.name} ×{item.quantity}
              </span>
              <span className="font-medium">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
          {order.notes && (
            <>
              <Separator />
              <div className="text-sm">
                <span className="text-muted-foreground">Catatan: </span>
                <span>{order.notes}</span>
              </div>
            </>
          )}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total Pembayaran</span>
            <span className="text-primary">{formatPrice(order.subtotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm">
        <p className="font-semibold text-amber-800 mb-1">
          📋 Langkah Selanjutnya
        </p>
        <ol className="list-decimal list-inside space-y-1 text-amber-700">
          <li>
            Tunjukkan nomor pesanan <strong>{order.orderNumber}</strong> ke
            kasir.
          </li>
          <li>Lakukan pembayaran di kasir (Cash / Debit / Transfer).</li>
          <li>Minumanmu akan segera diproses — tunggu dipanggil!</li>
        </ol>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/menu">
          <Button className="w-full gap-2">
            Pesan Lagi
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full gap-2">
            <Home className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}
