import Link from "next/link";
import Image from "next/image";
import { FeaturedMenuCard } from "@/components/menu/FeaturedMenuCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { menuItems } from "@/lib/mock-data";
import {
  ArrowRight,
  Clock,
  CreditCard,
  MapPin,
  Wifi,
  Armchair,
  Users,
} from "lucide-react";

const featuredItems = menuItems.filter((item) => item.isPopular).slice(0, 4);

const steps = [
  {
    step: "01",
    icon: "📱",
    title: "Pilih Menu",
    desc: "Jelajahi menu kami dan tambahkan item favorit ke keranjang.",
  },
  {
    step: "02",
    icon: "✅",
    title: "Kirim Pesanan",
    desc: "Konfirmasi pesananmu — sistem langsung mengirim ke kasir.",
  },
  {
    step: "03",
    icon: "💳",
    title: "Bayar di Kasir",
    desc: "Tunjukkan nomor pesanan dan bayar langsung di kasir. Cepat, mudah!",
  },
];

const perks = [
  { icon: <Wifi className="h-5 w-5" />, label: "Free Wi-Fi Kencang" },
  { icon: <Armchair className="h-5 w-5" />, label: "Tempat Duduk Nyaman" },
  { icon: <Users className="h-5 w-5" />, label: "Cocok untuk Nongkrong" },
  { icon: <Clock className="h-5 w-5" />, label: "Buka 07.00 – 22.00" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background photo */}
        <Image
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=85"
          alt="Suasana Greeting.co Coffee"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark gradient overlay — left-heavy for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-6 md:px-10 py-24">
          <div className="max-w-2xl">
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
              </span>
              <span className="text-white/80 text-sm font-medium tracking-wide">
                Buka Sekarang · 07.00 – 22.00 WIB
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-5 tracking-tight">
              Di Sini,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                Kopi
              </span>
              <br />
              Adalah Bahasa
              <br />
              Kami.
            </h1>

            {/* Tagline */}
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Pesan tanpa antre, pilih tempat dudukmu, dan biarkan kami yang
              menyeduh kesempurnaan dalam setiap cangkir.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/menu">
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 h-13 shadow-lg shadow-primary/30"
                >
                  Pesan Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/reservation">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-base px-8 h-13 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur"
                >
                  <MapPin className="h-5 w-5" />
                  Reservasi Meja
                </Button>
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                {["🧑", "👩", "🧔", "👧"].map((e, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-amber-800/60 border-2 border-white/30 flex items-center justify-center text-base select-none"
                  >
                    {e}
                  </div>
                ))}
              </div>
              <div className="text-white/80 text-sm leading-tight">
                <span className="font-bold text-white">200+</span> pelanggan
                puas hari ini
              </div>
              <div className="flex items-center gap-1 text-amber-300 text-sm">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
                <span className="text-white/70 ml-1">4.9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating perks card — bottom right on desktop */}
        <div className="absolute bottom-16 right-8 hidden lg:block z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white space-y-2.5 min-w-[210px]">
            {perks.map((p) => (
              <div key={p.label} className="flex items-center gap-2.5 text-sm">
                <span className="text-amber-300">{p.icon}</span>
                <span className="text-white/85">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATMOSPHERE SPLIT ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image side */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=85"
                alt="Latte art Greeting.co"
                fill
                className="object-cover"
              />
              {/* Badge overlay */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-foreground font-semibold text-sm px-3 py-1.5 shadow-md">
                  ☕ Freshly Brewed
                </Badge>
              </div>
            </div>

            {/* Text side */}
            <div>
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Tentang Kami
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                Lebih dari Sekadar
                <span className="text-primary"> Secangkir Kopi</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Greeting.co lahir dari cinta akan kopi dan keinginan untuk
                menciptakan ruang di mana setiap orang bisa menikmati momen
                terbaiknya — entah itu kerja, belajar, atau sekadar bersantai.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  {
                    emoji: "🌱",
                    title: "Bahan Segar Pilihan",
                    desc: "Biji kopi lokal pilihan petani Nusantara.",
                  },
                  {
                    emoji: "👨‍🍳",
                    title: "Barista Berpengalaman",
                    desc: "Diseduh dengan teknik dan hati oleh barista kami.",
                  },
                  {
                    emoji: "🪑",
                    title: "Suasana Cozy",
                    desc: "Desain hangat yang bikin betah berjam-jam.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span className="text-2xl mt-0.5">{item.emoji}</span>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link href="/menu">
                <Button className="gap-2">
                  Lihat Menu Lengkap
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-sm px-3 py-1">
              Cara Memesan
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              Semudah 1 – 2 – 3
            </h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Dari pilih menu hingga minuman di tanganmu, dalam hitungan menit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-border" />
            {steps.map((s) => (
              <div
                key={s.step}
                className="flex flex-col items-center text-center p-8 bg-background rounded-3xl border border-border shadow-sm relative"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-4 relative z-10">
                  {s.icon}
                </div>
                <span className="text-xs font-black text-primary/50 tracking-[0.2em] mb-1">
                  LANGKAH {s.step}
                </span>
                <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED MENU ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="secondary" className="mb-3 text-sm px-3 py-1">
                Menu Terlaris
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black">
                Yang Paling Banyak
                <br />
                Dipesan Hari Ini
              </h2>
            </div>
            <Link href="/menu" className="hidden sm:block">
              <Button variant="outline" className="gap-2">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredItems.map((item, idx) => (
              <FeaturedMenuCard key={item.id} item={item} rank={idx + 1} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/menu">
              <Button variant="outline" className="gap-2">
                Lihat Semua Menu
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FULL-WIDTH BANNER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24">
        <Image
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=80"
          alt="Suasana kafe"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="relative z-10 container mx-auto px-6 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            Mau Nongkrong dengan Nyaman?
          </h2>
          <p className="text-primary-foreground/75 text-lg mb-8 max-w-lg mx-auto">
            Reservasi meja sekarang dan pastikan tempat duduk terbaikmu sudah
            menunggu.
          </p>
          <Link href="/reservation">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 text-base px-10 h-13"
            >
              <MapPin className="h-5 w-5" />
              Reservasi Sekarang
            </Button>
          </Link>
        </div>
      </section>

      {/* ── INFO STRIP ───────────────────────────────────────────────────── */}
      <section className="py-12 bg-secondary/40 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              <p className="font-bold text-lg">Buka Setiap Hari</p>
              <p className="text-muted-foreground">07.00 – 22.00 WIB</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CreditCard className="h-8 w-8 text-primary" />
              <p className="font-bold text-lg">Bayar di Kasir</p>
              <p className="text-muted-foreground">Cash, Debit, Transfer</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <p className="font-bold text-lg">Lokasi Strategis</p>
              <p className="text-muted-foreground">Pusat Kota Bandung</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
