"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
};

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];
const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const getTodayString = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

export default function ReservationPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reservationId, setReservationId] = useState("");

  const setField = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.date ||
      !form.time ||
      !form.guests
    ) {
      toast.error("Harap lengkapi semua field yang wajib diisi.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, guests: Number(form.guests) }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Gagal mengirim reservasi");
        return;
      }
      const data = await res.json();
      setReservationId(data.id);
      setSubmitted(true);
      toast.success("Reservasi berhasil dikirim!", {
        description: `ID: ${data.id}`,
      });
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Reservasi Dikonfirmasi! 🎉</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Terima kasih, {form.name}! Reservasimu telah kami terima.
        </p>
        <Card className="mb-6 border-2 border-primary/30 bg-primary/5 text-left">
          <CardContent className="py-5 space-y-3">
            <div className="text-center mb-3">
              <p className="text-xs font-bold tracking-widest text-muted-foreground mb-1">
                ID RESERVASI
              </p>
              <p className="text-2xl font-black text-primary">
                {reservationId}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Nama</p>
                <p className="font-semibold">{form.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tamu</p>
                <p className="font-semibold">{form.guests} orang</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Tanggal</p>
                <p className="font-semibold">
                  {new Date(form.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Jam</p>
                <p className="font-semibold">{form.time} WIB</p>
              </div>
            </div>
            {form.notes && (
              <div className="text-sm pt-1 border-t border-border">
                <p className="text-muted-foreground text-xs mb-1">Catatan</p>
                <p>{form.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-left">
          <p className="font-semibold text-amber-800 mb-1">📌 Penting</p>
          <ul className="list-disc list-inside space-y-1 text-amber-700">
            <li>Harap datang 5-10 menit sebelum waktu reservasi.</li>
            <li>Meja akan ditahan maksimal 15 menit setelah jam reservasi.</li>
            <li>
              Simpan ID reservasi: <strong>{reservationId}</strong>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                email: "",
                phone: "",
                date: "",
                time: "",
                guests: "",
                notes: "",
              });
            }}
            variant="outline"
            className="w-full"
          >
            Buat Reservasi Baru
          </Button>
          <Link href="/">
            <Button className="w-full">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
        <h1 className="text-3xl font-bold mb-1">Reservasi Meja</h1>
        <p className="text-muted-foreground">
          Pastikan tempat nongkrongmu sudah tersedia sebelum kamu datang ✨
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="secondary" className="gap-1.5">
          <Users className="h-3 w-3" /> Maks. 10 orang
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <Clock className="h-3 w-3" /> 07.00 – 21.00 WIB
        </Badge>
        <Badge variant="secondary" className="gap-1.5">
          <CalendarDays className="h-3 w-3" /> Buka setiap hari
        </Badge>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Data Diri</CardTitle>
            <CardDescription>
              Isi informasi di bawah untuk konfirmasi reservasi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  placeholder="Nama kamu"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">No. HP / WhatsApp *</Label>
                <Input
                  id="phone"
                  placeholder="+62 812 ..."
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@contoh.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Jadwal Reservasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="date">Tanggal *</Label>
                <Input
                  id="date"
                  type="date"
                  min={getTodayString()}
                  value={form.date}
                  onChange={(e) => setField("date", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Jam Kedatangan *</Label>
                <Select
                  value={form.time}
                  onValueChange={(v) => v !== null && setField("time", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jam" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t} WIB
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Jumlah Tamu *</Label>
              <Select
                value={form.guests}
                onValueChange={(v) => v !== null && setField("guests", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jumlah tamu" />
                </SelectTrigger>
                <SelectContent>
                  {guestOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g} orang
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-notes">Catatan (opsional)</Label>
              <Textarea
                id="res-notes"
                placeholder="Contoh: Ulang tahun, butuh area non-smoking, dll."
                value={form.notes}
                onChange={(e) => setField("notes", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-3 bg-secondary/50 rounded-lg p-2.5">
            ℹ️ Reservasi akan dikonfirmasi oleh tim kami. Tidak ada deposit yang
            diperlukan.
          </p>
          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Mengirim Reservasi..." : "Konfirmasi Reservasi →"}
          </Button>
        </div>
      </form>
    </div>
  );
}
