"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/mock-data";
import { OrderType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } =
    useCartStore();

  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast.error("Nama pelanggan wajib diisi");
      return;
    }
    if (orderType === "dine-in" && !tableNumber.trim()) {
      toast.error("Nomor meja wajib diisi untuk dine-in");
      return;
    }
    if (items.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((ci) => ({
            menuItemId: ci.item.id,
            quantity: ci.quantity,
          })),
          customerName: customerName.trim(),
          orderType,
          tableNumber: orderType === "dine-in" ? tableNumber.trim() : undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Gagal mengirim pesanan");
        return;
      }

      const { id, orderNumber } = await res.json();
      clearCart();
      toast.success("Pesanan berhasil dikirim!", {
        description: `No. Pesanan: ${orderNumber}`,
      });
      router.push(`/order/${id}`);
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Keranjang Kosong</h2>
        <p className="text-muted-foreground mb-6">
          Belum ada item di keranjangmu. Yuk, pilih menu dulu!
        </p>
        <Link href="/menu">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Lihat Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/menu"
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Menu
        </Link>
        <h1 className="text-3xl font-bold">Keranjang Pesanan</h1>
        <p className="text-muted-foreground">
          {items.length} jenis item dalam keranjang
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ item, quantity }) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl w-12 h-12 flex items-center justify-center bg-secondary rounded-lg shrink-0 select-none">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold text-sm mt-0.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-semibold text-sm w-5 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive ml-1"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-right text-xs text-muted-foreground">
                  Subtotal:{" "}
                  <span className="font-semibold text-foreground">
                    {formatPrice(item.price * quantity)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Details + Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Detail Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Pelanggan *</Label>
                <Input
                  id="name"
                  placeholder="Masukkan namamu"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tipe Pesanan *</Label>
                <Select
                  value={orderType}
                  onValueChange={(v) => setOrderType(v as OrderType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dine-in">
                      🍽️ Dine-in (Makan di sini)
                    </SelectItem>
                    <SelectItem value="take-away">
                      🥡 Take-away (Dibawa pulang)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {orderType === "dine-in" && (
                <div className="space-y-1.5">
                  <Label htmlFor="table">Nomor Meja *</Label>
                  <Input
                    id="table"
                    placeholder="Contoh: 5"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="notes">Catatan (opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Contoh: Kurangi gula, es pisah..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.name} ×{quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatPrice(item.price * quantity)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2.5">
                💳 Pembayaran dilakukan langsung di kasir setelah menerima nomor
                pesanan.
              </p>
              <Button
                className="w-full gap-2 h-11 text-base"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Mengirim Pesanan..."
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Kirim Pesanan
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
